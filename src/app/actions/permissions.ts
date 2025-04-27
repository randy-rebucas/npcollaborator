import connect from "@/lib/db";
import { revalidateTag } from "next/cache";
import Permission from "@/models/Permission"; 
import { handleAsync } from '@/lib/errorHandler';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/errors';

interface GetPermissionsParams {
  page: number;
  search?: string;
  limit?: number;
}

interface PermissionQuery {
  $or?: {
    name?: { $regex: string; $options: string } | string;
  }[];
}

export interface PermissionDocument {
  _id: string; // We'll cast this to string anyway
  name: string;
  description: string;
  resource: string;
}

interface GetPermissionsResponse {
  permissions: PermissionDocument[];
  total: number;
}

export async function getPermissions({
  page = 1,
  search = "",
  limit = 10,
}: GetPermissionsParams): Promise<GetPermissionsResponse> { 
  if (page < 1 || limit < 1) {
    throw new ValidationError('Invalid pagination parameters');
  }

  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      const query: PermissionQuery = {};

      if (search) {
        query.$or = [{ name: { $regex: search, $options: "i" } }];
      }

      const skip = (page - 1) * limit;

      const [permissions, total] = await Promise.all([
        Permission.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
        Permission.countDocuments(query),
      ]);

      return {
        permissions: (permissions as unknown as PermissionDocument[]).map((permission) => ({
          _id: permission._id.toString(),
          name: permission.name,
          description: permission.description,
          resource: permission.resource,
        })),
        total,
      };
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to fetch permissions: ${error.message}`);
  }

  if (!result) {
    throw new NotFoundError('No permissions found');
  }

  return result;
}

export async function deletePermission(id: string) {
  if (!id) {
    throw new ValidationError('Permission ID is required');
  }

  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      const permission = await Permission.findByIdAndDelete(id);
      if (!permission) {
        throw new ValidationError(`Permission with ID ${id} not found`);
      }
      revalidateTag('permissions');
      return { success: true };
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to delete permission: ${error.message}`);
  }

  return result;
}

export async function createPermission(permission: PermissionDocument) {
  if (!permission) {
    throw new ValidationError('Permission data is required');
  }

  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      await Permission.create(permission);
      revalidateTag('permissions');
      return { success: true };
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to create permission: ${error.message}`);
  }

  return result;
}

export async function updatePermission(id: string, permission: PermissionDocument) {
  if (!id || !permission) {
    throw new ValidationError('Permission ID and data are required');
  }

  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      const updated = await Permission.findByIdAndUpdate(id, permission);
      if (!updated) {
        throw new ValidationError(`Permission with ID ${id} not found`);
      }
      revalidateTag('permissions');
      return { success: true };
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to update permission: ${error.message}`);
  }

  return result;
}

export async function getPermissionById(id: string) {
  if (!id) {
    throw new ValidationError('Permission ID is required');
  }

  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      const permission = await Permission.findById(id);
      if (!permission) {
        throw new ValidationError(`Permission with ID ${id} not found`);
      }
      return permission;
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to fetch permission: ${error.message}`);
  }

  return result;
}

export async function getPermissionsByResource(resource: string) {
  if (!resource) {
    throw new ValidationError('Resource is required');
  }

  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      return await Permission.find({ resource });
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to fetch permissions by resource: ${error.message}`);
  }

  return result;
}

export async function getAllPermissions() {
  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      const permissions = await Permission.find({});
      return permissions.map((permission) => ({
        _id: permission._id.toString(),
        name: permission.name,
        description: permission.description,
        resource: permission.resource,
      }));
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to fetch all permissions: ${error.message}`);
  }

  return result;
}









