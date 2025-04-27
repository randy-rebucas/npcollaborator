"use server";

import connect from "@/lib/db";
import { revalidateTag } from "next/cache";
import { handleAsync } from '@/lib/errorHandler';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/errors';
import RequestedFeature from "@/models/RequestedFeature"; 

interface GetFeaturesParams {
  page: number;
  search?: string;
  status?: string;
  limit?: number;
}

interface FeatureQuery {
  $or?: {
    email?: { $regex: string; $options: string } | string;
    title?: { $regex: string; $options: string } | string;
  }[];
  status?: string;
}

export interface FeatureDocument {
  _id: string; // We'll cast this to string anyway
  email: string;
  title: string;
  description: string;
  status: "pending" | "resolved" | "closed";
  createdAt: Date;
}

interface GetFeaturesResponse {
  features: {
    id: string;
    email: string;
    title: string;
    description: string;
    status: "pending" | "resolved" | "closed";
    createdAt: Date;
  }[];
  total: number;
}

export async function getFeatures({
  page = 1,
  search = "",
  status = "all",
  limit = 10,
}: GetFeaturesParams): Promise<GetFeaturesResponse> {
  if (page < 1 || limit < 1) {
    throw new ValidationError('Invalid pagination parameters');
  }

  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      const query: FeatureQuery = {};

      if (search) {
        query.$or = [
          { email: { $regex: search, $options: "i" } },
          { title: { $regex: search, $options: "i" } },
        ];
      }

      if (status !== "all") {
        query.status = status;
      }

      const skip = (page - 1) * limit;

      const [features, total] = await Promise.all([
        RequestedFeature.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean(),
        RequestedFeature.countDocuments(query),
      ]);

      return {
        features: (features as unknown as FeatureDocument[]).map((feature) => ({
          id: feature._id.toString(),
          email: feature.email,
          title: feature.title,
          description: feature.description,
          status: feature.status,
          createdAt: feature.createdAt,
        })),
        total,
      };
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to fetch features: ${error.message}`);
  }

  if (!result) {
    throw new NotFoundError('No features found');
  }

  return result;
}

export async function deleteFeature(id: string) {
  if (!id) {
    throw new ValidationError('Feature ID is required');
  }

  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      const feature = await RequestedFeature.findByIdAndDelete(id);
      if (!feature) {
        throw new ValidationError(`Feature with ID ${id} not found`);
      }
      revalidateTag('features');
      return { success: true };
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to delete feature: ${error.message}`);
  }

  return result;
}
