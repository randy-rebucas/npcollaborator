import connect from "@/lib/db";
import MedicalLicenseState, { IMedicalLicenseState } from "@/models/MedicalLicenseState";
import { revalidateTag } from "next/cache";
import { handleAsync } from '@/lib/errorHandler';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/errors';
import { cache } from 'react';

export const getMedicalLicenseStates = cache(async () => {
    const [result, error] = await handleAsync(
        (async () => {
            await connect();
            const states = await MedicalLicenseState.find({ enabled: true })
                .select('state')
                .lean();
            const data = states.map(state => state.state);
            console.log(data);
            return data;
        })()
    );

    if (error) {
        throw new DatabaseError('Failed to fetch medical license states');
    }

    return result;
});

interface GetMedicalLicenseStatesParams {
  page: number;
  search?: string;
  limit?: number;
  enabled?: string;
}

interface MedicalLicenseStateQuery {
  $or?: {
    state?: { $regex: string; $options: string } | string;
  }[];
  enabled?: boolean;
}

interface GetMedicalLicenseStatesResponse {
  medicalLicenseStates: IMedicalLicenseState[]; 
  total: number;
}

export async function getMedicalLicenseStatesPaginated({
  page = 1,
  search = "",
  limit = 10,
  enabled = "all",
}: GetMedicalLicenseStatesParams): Promise<GetMedicalLicenseStatesResponse> {
  if (page < 1 || limit < 1) {
    throw new ValidationError('Invalid pagination parameters');
  }

  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      const query: MedicalLicenseStateQuery = {};

      if (search) {
        query.$or = [{ state: { $regex: search, $options: "i" } }];
      }

      if (enabled !== "all") {
        query.enabled = enabled === "true";
      }

      const skip = (page - 1) * limit;

      const [medicalLicenseStates, total] = await Promise.all([
        MedicalLicenseState.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
        MedicalLicenseState.countDocuments(query),
      ]);

      return {
        medicalLicenseStates: (medicalLicenseStates as unknown as IMedicalLicenseState[]).map((state) => ({
          _id: state._id.toString(),
          state: state.state,
          enabled: state.enabled,
        })),
        total,
      };
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to fetch medical license states: ${error.message}`);
  }

  if (!result) {
    throw new NotFoundError('No medical license states found');
  }

  return result;
}

export async function deleteMedicalLicenseState(id: string) {
  if (!id) {
    throw new ValidationError('Medical License State ID is required');
  }

  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      const state = await MedicalLicenseState.findByIdAndDelete(id);
      if (!state) {
        throw new ValidationError(`Medical License State with ID ${id} not found`);
      }
      revalidateTag('medical-license-states');
      return { success: true };
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to delete medical license state: ${error.message}`);
  }

  return result;
}
  
