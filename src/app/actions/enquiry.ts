"use server";

import { revalidateTag } from "next/cache";
import Enquiry from "@/models/Enquiry";
import connect from "@/lib/db";
import { handleAsync } from '@/lib/errorHandler';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/errors';

interface GetEnquiriesParams {
  page: number;
  search?: string;
  status?: string;
  limit?: number;
}

interface EnquiryQuery {
  $or?: {
    email?: { $regex: string; $options: string } | string;
    subject?: { $regex: string; $options: string } | string;
  }[];
  status?: string;
}

export interface EnquiryDocument {
  _id: string; // We'll cast this to string anyway
  email: string;
  subject: string;
  message: string;
  status: "pending" | "resolved" | "closed";
  createdAt: Date;
}

interface GetEnquiriesResponse {
  enquiries: {
    id: string;
    email: string;
    subject: string;
    message: string;
    status: "pending" | "resolved" | "closed";
    createdAt: Date;
  }[];
  total: number;
}

export async function getEnquiries({
  page = 1,
  search = "",
  status = "all",
  limit = 10,
}: GetEnquiriesParams): Promise<GetEnquiriesResponse> {
  if (page < 1 || limit < 1) {
    throw new ValidationError('Invalid pagination parameters');
  }

  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      const query: EnquiryQuery = {};

      if (search) {
        query.$or = [
          { email: { $regex: search, $options: "i" } },
          { subject: { $regex: search, $options: "i" } },
        ];
      }

      if (status !== "all") {
        query.status = status;
      }

      const skip = (page - 1) * limit;

      const [enquiries, total] = await Promise.all([
        Enquiry.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
        Enquiry.countDocuments(query),
      ]);

      return {
        enquiries: (enquiries as unknown as EnquiryDocument[]).map((enquiry) => ({
          id: enquiry._id.toString(),
          email: enquiry.email,
          subject: enquiry.subject,
          message: enquiry.message,
          status: enquiry.status,
          createdAt: enquiry.createdAt,
        })),
        total,
      };
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to fetch enquiries: ${error.message}`);
  }

  if (!result) {
    throw new NotFoundError('No enquiries found');
  }

  return result;
}

export async function deleteEnquiry(id: string) {
  if (!id) {
    throw new ValidationError('Enquiry ID is required');
  }

  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      const enquiry = await Enquiry.findByIdAndDelete(id);
      if (!enquiry) {
        throw new ValidationError(`Enquiry with ID ${id} not found`);
      }
      revalidateTag("enquiries");
      return { success: true };
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to delete enquiry: ${error.message}`);
  }

  return result;
}