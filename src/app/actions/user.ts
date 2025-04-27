"use server";

import { IUser, IUserCustomData, IUserProfile } from "@/models/User";
import { NotFoundError, ValidationError } from "../../lib/errors";
import { logtoFetch } from "../../utils/logto-fetch";

interface GetUsersParams {
  page: number;
  page_size?: number;
}

export interface GetUsersResponse {
  id: string;
  username: string;
  primaryEmail: string;
  primaryPhone: string;
  name: string;
  avatar: string | null;
  customData: { role: string, onboardingStatus: string, submissionStatus: string };
  identities: object;
  lastSignInAt: number;
  createdAt: number;
  updatedAt: number;
  profile: {
    familyName: string;
    givenName: string;
  };
  applicationId: string;
  isSuspended: boolean;
  hasPassword: boolean;
}

interface ApiResponse {
  success: boolean;
  message?: string;
}

export async function getUser(id: string): Promise<IUser> {
  if (!id) {
    throw new ValidationError("User ID is required");
  }

  const data = await logtoFetch(`users/${id}`);

  if (!data) {
    throw new NotFoundError(`User with ID ${id} not found`);
  }

  return data;
}

/**
 * Deletes a user by ID
 * @param userId The ID of the user to delete
 * @returns API response indicating success/failure
 * @throws {ValidationError} If userId is not provided
 */
export async function deleteUser(userId: string): Promise<ApiResponse> {
  if (!userId) {
    throw new ValidationError("User ID is required");
  }

  const data = await logtoFetch<ApiResponse>(`users/${userId}`, { method: 'DELETE' });
  return data;
}

/**
 * Updates a user's information
 * @param userId The ID of the user to update
 * @param userData Partial user data to update
 * @returns Updated user data
 * @throws {ValidationError} If userId or userData is not provided
 */
export async function updateUser(userId: string, userData: Partial<IUser>): Promise<IUser> {
  if (!userId || !userData || Object.keys(userData).length === 0) {
    throw new ValidationError("User ID and valid update data are required");
  }
  const data = await logtoFetch(`users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(userData),
  });
  return data;
}

/**
 * Retrieves custom data for a user
 * @param userId The ID of the user
 * @returns User's custom data
 * @throws {ValidationError} If userId is not provided
 * @throws {NotFoundError} If custom data is not found
 */
export async function getUserCustomData(userId: string): Promise<IUserCustomData> {
  if (!userId) {
    throw new ValidationError("User ID is required");
  }

  const data = await logtoFetch<IUserCustomData>(`users/${userId}/custom-data`); 
  
  if (!data) {
    throw new NotFoundError(`Custom data for user ${userId} not found`);
  }

  return data;
}

/**
 * Updates a user's custom data
 * @param userId The ID of the user
 * @param customData Partial custom data to update
 * @returns Updated custom data
 * @throws {ValidationError} If userId or customData is not provided
 */
export async function updateUserCustomData(userId: string, customData: Partial<IUserCustomData>) {
  if (!userId || !customData) {
    throw new ValidationError("User ID and custom data are required");
  }
  
  const data = await logtoFetch(`users/${userId}/custom-data`, {
    method: 'PATCH',
    body: JSON.stringify(customData),
  });
  
  return data;
}

/**
 * Updates a user's profile information
 * @param userId The ID of the user
 * @param userData Partial profile data to update
 * @returns Updated profile data
 * @throws {ValidationError} If userId or userData is not provided
 */
export async function updateUserProfile(userId: string, userData: Partial<IUserProfile>) {
  if (!userId || !userData) {
    throw new ValidationError("User ID and update data are required");
  }

  return await logtoFetch(`users/${userId}/profile`, {
    method: 'PATCH',
    body: JSON.stringify(userData),
  });
}

/**
 * Retrieves a paginated list of users
 * @param params Object containing pagination parameters
 * @param params.page Page number (default: 1)
 * @param params.page_size Number of items per page (default: 10)
 * @returns Array of user objects
 * @throws {Error} If fetching users fails
 */
export async function getUsers({
  page = 1,
  page_size = 10,
}: GetUsersParams): Promise<GetUsersResponse[]> {
  try {
    const data = await logtoFetch<GetUsersResponse[]>(`users?page=${page}&page_size=${page_size}`);
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}

/**
 * Creates a new user
 * @param userData User data for creation
 * @returns Created user data
 * @throws {ValidationError} If userData is not provided
 */
export async function createUser(userData: Partial<IUser>) {
  if (!userData) {
    throw new ValidationError("User data is required");
  }

  const data = await logtoFetch(`users`, {
    method: 'POST',
    body: JSON.stringify(userData),
  });

  return data;
}

/**
 * Updates a user's password
 * @param id The ID of the user
 * @param password New password
 * @returns API response indicating success/failure
 * @throws {ValidationError} If id or password is not provided
 */
export async function updateUserPassword(id: string, password: string): Promise<ApiResponse> {
  if (!id || !password?.trim()) {
    throw new ValidationError("User ID and valid password are required");
  }

  const data = await logtoFetch<ApiResponse>(`users/${id}/password`, {
    method: 'PATCH',
    body: JSON.stringify({ password }),
  });

  return data;
}

/**
 * Verifies a user's password
 * @param id The ID of the user
 * @param password Password to verify
 * @returns Object indicating if password is valid
 * @throws {ValidationError} If id or password is not provided
 */
export async function verifyUserPassword(id: string, password: string): Promise<{ isValid: boolean }> {
  if (!id || !password?.trim()) {
    throw new ValidationError("User ID and password are required");
  }

  const data = await logtoFetch<{ isValid: boolean }>(`users/${id}/password/verify`, {
    method: 'POST',
    body: JSON.stringify({ password }),
  });

  return data;
}

/**
 * Checks if a user has a password set
 * @param id The ID of the user
 * @returns Object indicating if user has password
 * @throws {ValidationError} If id is not provided
 */
export async function checkUserHasPassword(id: string): Promise<{ hasPassword: boolean }> {
  if (!id) {
    throw new ValidationError("User ID is required");
  }

  const data = await logtoFetch<{ hasPassword: boolean }>(`users/${id}/has-password`);
  return data;
}

/**
 * Updates a user's suspension status
 * @param id The ID of the user
 * @param suspensionStatus New suspension status
 * @returns API response indicating success/failure
 * @throws {ValidationError} If id is not provided or suspensionStatus is not boolean
 */
export async function updateUserSuspensionStatus(id: string, suspensionStatus: boolean): Promise<ApiResponse> {
  if (!id || typeof suspensionStatus !== 'boolean') {
    throw new ValidationError("User ID and valid suspension status are required");
  }

  const data = await logtoFetch<ApiResponse>(`users/${id}/is-suspended`, {
    method: 'PATCH',
    body: JSON.stringify({ isSuspended: suspensionStatus }),
  });

  return data;
}

/**
 * Gets the onboarding status for a user
 * @param id The ID of the user
 * @returns User's onboarding status
 * @throws {ValidationError} If id is not provided
 * @throws {NotFoundError} If user is not found
 */
export async function getOnboardingStatus(id: string) {
  if (!id) {
    throw new ValidationError("User ID is required");
  }

  const data = await getUserCustomData(id);

  if (!data) {
    throw new NotFoundError(`User with ID ${id} not found`);
  }

  return data?.onboardingStatus;
}

/**
 * Gets the submission status for a user
 * @param id The ID of the user
 * @returns User's submission status
 * @throws {ValidationError} If id is not provided
 * @throws {NotFoundError} If user is not found
 */
export async function getSubmissionStatus(id: string) {
  if (!id) {
    throw new ValidationError("User ID is required");
  }

  const data = await getUserCustomData(id);

  if (!data) {
    throw new NotFoundError(`User with ID ${id} not found`);
  }

  return data?.submissionStatus;
}

/**
 * Gets the role for a user
 * @param id The ID of the user
 * @returns User's role
 * @throws {ValidationError} If id is not provided
 * @throws {NotFoundError} If user is not found
 */
export async function getUserRole(id: string) {
  if (!id) {
    throw new ValidationError("User ID is required");
  }

  const data = await getUserCustomData(id);

  if (!data) {
    throw new NotFoundError(`User with ID ${id} not found`);
  }

  return data?.role;
}

export type UserDocument = {
    username: string;
    profile?: {
        profilePhotoPath?: string;
    };
    // ... other user fields ...
};