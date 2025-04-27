import connect from "@/lib/db";
import { revalidateTag } from "next/cache";
import Template from "@/models/Template";
import { handleAsync } from '@/lib/errorHandler';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/errors';

interface GetTemplatesParams {
  page: number;
  search?: string;
  limit?: number;
}

interface TemplateQuery {
  $or?: {
    name?: { $regex: string; $options: string } | string;
  }[];
}

export interface TemplateDocument {
  _id: string; // We'll cast this to string anyway
  name: string;
  content: string;
  type: string;
  isDefault: boolean;
}

interface GetTemplatesResponse {
  templates: TemplateDocument[];
  total: number;
}

export async function getTemplates({
  page = 1,
  search = "",
  limit = 10,
}: GetTemplatesParams): Promise<GetTemplatesResponse> {
  if (page < 1 || limit < 1) {
    throw new ValidationError('Invalid pagination parameters');
  }

  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      const query: TemplateQuery = {};

      if (search) {
        query.$or = [{ name: { $regex: search, $options: "i" } }];
      }

      const skip = (page - 1) * limit;

      const [templates, total] = await Promise.all([
        Template.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
        Template.countDocuments(query),
      ]);

      return {
        templates: (templates as unknown as TemplateDocument[]).map((template) => ({
          _id: template._id.toString(),
          name: template.name,
          content: template.content,
          type: template.type,
          isDefault: template.isDefault,
        })),
        total,
      };
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to fetch templates: ${error.message}`);
  }

  if (!result) {
    throw new NotFoundError('No templates found');
  }

  return result;
}

export async function deleteTemplate(id: string) {
  if (!id) {
    throw new ValidationError('Template ID is required');
  }

  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      const template = await Template.findByIdAndDelete(id);
      if (!template) {
        throw new ValidationError(`Template with ID ${id} not found`);
      }
      revalidateTag('templates');
      return { success: true };
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to delete template: ${error.message}`);
  }

  return result;
}
