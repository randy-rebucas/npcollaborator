import connect from "@/lib/db";
import PracticeType, { IPracticeType } from "@/models/PracticeType"; 
import { revalidateTag } from "next/cache";
import { handleAsync } from '@/lib/errorHandler';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/errors';

export async function getPracticeTypes() {
  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      const practiceTypes = await PracticeType.find({}).exec();
      return practiceTypes.filter((type) => type.enabled === true).map((type) => type.type);
    })()
  );

  if (error) {
    throw new DatabaseError('Failed to fetch practice types');
  }

  return result;
}

interface GetPracticeTypesParams {
  page: number;
  search?: string;
  limit?: number;
  enabled?: string;
}

interface PracticeTypeQuery {
  $or?: {
    type?: { $regex: string; $options: string } | string;
  }[];
  enabled?: boolean;
}

interface GetPracticeTypesResponse {
  practiceTypes: IPracticeType[]; 
  total: number;
}

export async function getPracticeTypesPaginated({
  page = 1,
  search = "",
  limit = 10,
  enabled = "all",
}: GetPracticeTypesParams): Promise<GetPracticeTypesResponse> {
  if (page < 1 || limit < 1) {
    throw new ValidationError('Invalid pagination parameters');
  }

  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      const query: PracticeTypeQuery = {};

      if (search) {
        query.$or = [{ type: { $regex: search, $options: "i" } }];
      }

      if (enabled !== "all") {
        query.enabled = enabled === "true";
      }

      const skip = (page - 1) * limit;

      const [practiceTypes, total] = await Promise.all([
        PracticeType.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
        PracticeType.countDocuments(query),
      ]);

      return {
        practiceTypes: (practiceTypes as unknown as IPracticeType[]).map((practiceType) => ({
          _id: practiceType._id.toString(),
          type: practiceType.type,
          enabled: practiceType.enabled,
        })),
        total,
      };
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to fetch practice types: ${error.message}`);
  }

  if (!result) {
    throw new NotFoundError('No practice types found');
  }

  return result;
}

export async function deletePracticeType(id: string) {
  if (!id) {
    throw new ValidationError('Practice Type ID is required');
  }

  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      const practiceType = await PracticeType.findByIdAndDelete(id);
      if (!practiceType) {
        throw new ValidationError(`Practice Type with ID ${id} not found`);
      }
      revalidateTag('practice-types');
      return { success: true };
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to delete practice type: ${error.message}`);
  }

  return result;
}
