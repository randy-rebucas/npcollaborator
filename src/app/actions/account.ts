import { ValidationError } from "@/lib/errors";
import { IUser } from "@/models/User";
import { logtoFetch } from "@/utils/logto-fetch";
import { cookies } from "next/headers";

export async function myAccount(): Promise<IUser> {
  const cookieStore = await cookies();
  const logtoToken = cookieStore.get("logtoToken");

  if (!logtoToken?.value) {
    throw new Error("Authentication token not found");
  }

  const response = await fetch(`${process.env.LOGTO_ENDPOINT}api/my-account`, {
    headers: {
      Authorization: `Bearer ${logtoToken.value}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  return data;
}

/**
 * Updates the user's profile information
 * @param userData Partial user data to update
 * @returns Updated user data
 * @throws {ValidationError} If userData is not provided
 */
export async function updateProfile(userData: Partial<IUser>): Promise<IUser> {
  if (!userData || Object.keys(userData).length === 0) {
    throw new ValidationError("Profile data is required");
  }

  const data = await logtoFetch<IUser>(`my-account`, {
    method: "PATCH",
    body: JSON.stringify(userData),
  });

  return data;
}

/**
 * Updates the user's password
 * @param password New password
 * @returns Success response
 * @throws {ValidationError} If password is not provided
 */
export async function updatePassword(
  password: string
): Promise<{ success: boolean }> {
  if (!password?.trim()) {
    throw new ValidationError("Password is required");
  }

  const response = await logtoFetch<{ success: boolean }>(`my-account/password`, {
    method: "POST",
    body: JSON.stringify({ password }),
  });

  if (typeof response?.success !== 'boolean') {
    throw new Error('Invalid response format');
  }

  return response;
}

/**
 * Updates the user's email address
 * @param email New email address
 * @returns Success response
 * @throws {ValidationError} If email is not provided
 */
export async function updateEmail(
  email: string
): Promise<{ success: boolean }> {
  if (!email?.trim()) {
    throw new ValidationError("Email address is required");
  }

  const data = await logtoFetch<{ success: boolean }>(`my-account/primary-email`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });

  if (typeof data?.success !== 'boolean') {
    throw new Error('Invalid response format');
  }

  return data;
}

/**
 * Deletes the user's email address
 * @returns Success response
 */
export async function deleteEmail(): Promise<{ success: boolean }> {
  const data = await logtoFetch<{ success: boolean }>(`my-account/primary-email`, {
    method: "DELETE",
  });

  if (typeof data?.success !== 'boolean') {
    throw new Error('Invalid response format');
  }

  return data;
}

/**
 * Updates the user's phone number
 * @param phone New phone number
 * @returns Success response
 * @throws {ValidationError} If phone is not provided
 */
export async function updatePhone(phone: string): Promise<{ success: boolean }> {
  if (!phone?.trim()) {
    throw new ValidationError("Phone number is required");
  }

  const data = await logtoFetch<{ success: boolean }>(`my-account/primary-phone`, {
    method: "POST",
    body: JSON.stringify({ phone }),
  });

  if (typeof data?.success !== 'boolean') {
    throw new Error('Invalid response format');
  }

  return data;
}

/**
 * Deletes the user's phone number
 * @returns Success response
 */
export async function deletePhone(): Promise<{ success: boolean }> {
  const data = await logtoFetch<{ success: boolean }>(`my-account/primary-phone`, {
    method: "DELETE",
  });

  if (typeof data?.success !== 'boolean') {
    throw new Error('Invalid response format');
  }

  return data;
}

/**
 * Deletes the user's account
 * @returns Success response
 */
export async function deleteAccount(): Promise<{ success: boolean }> {
  const data = await logtoFetch<{ success: boolean }>(`my-account`, {
    method: "DELETE",
  });

  if (typeof data?.success !== 'boolean') {
    throw new Error('Invalid response format');
  }

  return data;
}
