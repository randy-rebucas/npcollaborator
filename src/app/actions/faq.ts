import connect from "@/lib/db";
import Faq from "@/models/Faq";
import { revalidateTag } from "next/cache";
import { handleAsync } from '@/lib/errorHandler';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/errors';

interface GetFaqsParams {
  page: number;
  search?: string;
  limit?: number;
}

interface FaqQuery {
  $or?: {
    question?: { $regex: string; $options: string } | string;
  }[];
}

export interface FaqDocument {
  _id: string; // We'll cast this to string anyway
  question: string;
  answer: string;
}

interface GetFaqsResponse {
  faqs: FaqDocument[];
  total: number;
}

export async function getFaqs({
  page = 1,
  search = "",
  limit = 10,
}: GetFaqsParams): Promise<GetFaqsResponse> {
  if (page < 1 || limit < 1) {
    throw new ValidationError('Invalid pagination parameters');
  }

  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      const query: FaqQuery = {};

      if (search) {
        query.$or = [{ question: { $regex: search, $options: "i" } }];
      }

      const skip = (page - 1) * limit;

      const [faqs, total] = await Promise.all([
        Faq.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
        Faq.countDocuments(query),
      ]);

      return {
        faqs: (faqs as unknown as FaqDocument[]).map((faq) => ({
          _id: faq._id.toString(),
          question: faq.question,
          answer: faq.answer,
        })),
        total,
      };
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to fetch FAQs: ${error.message}`);
  }

  if (!result) {
    throw new NotFoundError('No FAQs found');
  }

  return result;
}

export async function deleteFaq(id: string) {
  if (!id) {
    throw new ValidationError('FAQ ID is required');
  }

  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      const faq = await Faq.findByIdAndDelete(id);
      if (!faq) {
        throw new ValidationError(`FAQ with ID ${id} not found`);
      }
      revalidateTag('faqs');
      return { success: true };
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to delete FAQ: ${error.message}`);
  }

  return result;
}
