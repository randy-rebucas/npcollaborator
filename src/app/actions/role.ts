import connect from "@/lib/db";
import { revalidateTag } from "next/cache";
import Role from "@/models/Role";
import { handleAsync } from '@/lib/errorHandler';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/errors';

interface GetRolesParams {
  page: number;
  search?: string;
  limit?: number;
}

interface RoleQuery {
  $or?: {
    name?: { $regex: string; $options: string } | string;
  }[];
}

export interface RoleDocument {
  _id: string; // We'll cast this to string anyway
  name: string;
  description: string;
  permissions: string[];
}

interface GetRolesResponse {
  roles: RoleDocument[];
  total: number;
}

export async function getRoles({
  page = 1,
  search = "",
  limit = 10,
}: GetRolesParams): Promise<GetRolesResponse> { 
  if (page < 1 || limit < 1) {
    throw new ValidationError('Invalid pagination parameters');
  }

  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      const query: RoleQuery = {};

      if (search) {
        query.$or = [{ name: { $regex: search, $options: "i" } }];
      }

      const skip = (page - 1) * limit;

      const [roles, total] = await Promise.all([
        Role.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
        Role.countDocuments(query),
      ]);

      return {
        roles: (roles as unknown as RoleDocument[]).map((role) => ({
          _id: role._id.toString(),
          name: role.name,
          description: role.description,
          permissions: role.permissions,
        })),
        total,
      };
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to fetch roles: ${error.message}`);
  }

  if (!result) {
    throw new NotFoundError('No roles found');
  }

  return result;
}

export async function deleteRole(id: string) {
  if (!id) {
    throw new ValidationError('Role ID is required');
  }

  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      const role = await Role.findByIdAndDelete(id);
      if (!role) {
        throw new ValidationError(`Role with ID ${id} not found`);
      }
      revalidateTag('roles');
      return { success: true };
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to delete role: ${error.message}`);
  }

  return result;
}
