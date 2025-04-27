import { cookies } from "next/headers";
import { EventEmitter } from "events";

// Increase the default max listeners limit
EventEmitter.defaultMaxListeners = 25; // Adjust this number based on your application's needs

interface TokenResponse {
  access_token: string;
  expires_in?: number;
  token_type: string;
  scope?: string;
}

// Add type for cached token
interface CachedTokenData {
  value: string;
  expiresAt: number;
}

const COOKIE_TOKEN_KEY = "logtoToken";
const TOKEN_EXPIRY_BUFFER = 60 * 1000; // 1 minute buffer before actual expiry

// Cache token to avoid unnecessary token requests
let cachedToken: CachedTokenData | null = null;

/**
 * Makes authenticated requests to the Logto API
 * @param endpoint - The API endpoint path (without the base URL)
 * @param options - Fetch options (optional)
 * @returns Promise with the JSON response data
 * @throws {Error} If authentication token is missing or HTTP request fails
 */
export async function logtoFetch<T = Record<string, unknown>>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Check cached token first and ensure it's not close to expiring
  if (cachedToken && cachedToken.expiresAt > Date.now() + TOKEN_EXPIRY_BUFFER) {
    return makeAuthenticatedRequest<T>(endpoint, cachedToken.value, options);
  }

  const cookieStore = await cookies();
  let tokenValue = cookieStore.get(COOKIE_TOKEN_KEY)?.value;

  if (!tokenValue) {
    tokenValue = await getNewToken();
  }

  return makeAuthenticatedRequest<T>(endpoint, tokenValue, options);
}

async function getNewToken(): Promise<string> {
  const requiredEnvVars = {
    LOGTO_ENDPOINT: process.env.LOGTO_ENDPOINT,
    LOGTO_API_APP_ID: process.env.LOGTO_API_APP_ID,
    LOGTO_API_APP_SECRET: process.env.LOGTO_API_APP_SECRET,
    LOGTO_RESOURCE: process.env.LOGTO_RESOURCE,
    LOGTO_SCOPE: process.env.LOGTO_SCOPE,
  };

  // Check all required environment variables
  const missingVars = Object.entries(requiredEnvVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required Logto environment variables: ${missingVars.join(", ")}`
    );
  }

  const formData = new URLSearchParams({
    grant_type: "client_credentials",
    resource: process.env.LOGTO_RESOURCE ?? '',
    scope: process.env.LOGTO_SCOPE ?? '',
  });

  const tokenResponse = await fetch(`${process.env.LOGTO_ENDPOINT}oidc/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.LOGTO_API_APP_ID}:${process.env.LOGTO_API_APP_SECRET}`
      ).toString("base64")}`,
    },
    body: formData.toString(),
  });

  if (!tokenResponse.ok) {
    throw new Error(`Failed to obtain token: ${tokenResponse.status}`);
  }

  const data = (await tokenResponse.json()) as TokenResponse & {
    expires_in?: number;
  };

  // Cache the token with expiration (default to 1 hour if expires_in not provided)
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
  };

  return data.access_token;
}

async function makeAuthenticatedRequest<T>(
  endpoint: string,
  token: string,
  options: RequestInit
): Promise<T> {
  const baseUrl = process.env.LOGTO_ENDPOINT;
  if (!baseUrl) {
    throw new Error("LOGTO_ENDPOINT is not defined");
  }

  try {
    const response = await fetch(
      `${baseUrl.replace(/\/$/, '')}/api/${endpoint.replace(/^\//, '')}`,
      {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          ...options.headers,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 401) {
        cachedToken = null;
        throw new Error(
          "Unauthorized: Your session has expired. Please log in again."
        );
      }
      throw new Error(
        `HTTP error! status: ${response.status} - ${errorText || "No error details available"}`
      );
    }

    return response.json();
  } catch (error) {
    cachedToken = null;
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred during the request");
  }
}
