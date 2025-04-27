import connect from "@/lib/db";
import Offer, { IPosition } from "@/models/Offer"; 
import { revalidateTag } from "next/cache";
import { IUser } from "@/models/User";
import { handleAsync } from '@/lib/errorHandler';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/errors';

interface GetOffersParams {
  page: number;
  search?: string;
  limit?: number;
  status?: string;
}

interface OfferQuery {
  $or?: {
    username?: { $regex: string; $options: string } | string;
    email?: { $regex: string; $options: string } | string;
    "profile.firstName"?: { $regex: string; $options: string } | string;
    "profile.lastName"?: { $regex: string; $options: string } | string;
  }[];
  status?: string;
}

export interface OfferDocument {
  _id: string; // We'll cast this to string anyway
  physicianUser: IUser;
  nursePractitionerUser: IUser;
  offerDate: Date;
  expirationDate: Date;
  position: IPosition;
  compensationType: string;
  baseSalary: number;
  createdAt: Date;
  updatedAt: Date;
  status: string;
}

interface GetOffersResponse {
  offers: OfferDocument[];
  total: number;
}

export async function getOffers({
  page = 1,
  search = "",
  limit = 10,
  status = "all",
}: GetOffersParams): Promise<GetOffersResponse> {
  if (page < 1 || limit < 1) {
    throw new ValidationError('Invalid pagination parameters');
  }

  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      const query: OfferQuery = {};

      if (search) {
        query.$or = [
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { "profile.firstName": { $regex: search, $options: "i" } },
          { "profile.lastName": { $regex: search, $options: "i" } },
        ];
      }

      if (status !== "all") {
        query.status = status;
      }

      const skip = (page - 1) * limit;

      const [offers, total] = await Promise.all([
        Offer.find(query)
          .populate("physicianUser")
          .populate("nursePractitionerUser")
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean(),
        Offer.countDocuments(query),
      ]);

      return {
        offers: (offers as unknown as OfferDocument[]).map((offer) => ({
          _id: offer._id.toString(),
          physicianUser: offer.physicianUser,
          nursePractitionerUser: offer.nursePractitionerUser,
          baseSalary: offer.baseSalary,
          offerDate: offer.offerDate,
          expirationDate: offer.expirationDate,
          position: offer.position,
          compensationType: offer.compensationType,
          createdAt: offer.createdAt,
          updatedAt: offer.updatedAt,
          status: offer.status,
        })),
        total,
      };
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to fetch offers: ${error.message}`);
  }

  if (!result) {
    throw new NotFoundError('No offers found');
  }

  return result;
}

export async function deleteOffer(id: string) {
  if (!id) {
    throw new ValidationError('Offer ID is required');
  }

  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      const offer = await Offer.findByIdAndDelete(id);
      if (!offer) {
        throw new ValidationError(`Offer with ID ${id} not found`);
      }
      revalidateTag("offers");
      return { success: true };
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to delete offer: ${error.message}`);
  }

  return result;
}

export async function getOffer(id: string) {
  if (!id) {
    throw new ValidationError('Offer ID is required');
  }

  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      const offer = await Offer.findById(id);
      if (!offer) {
        throw new ValidationError(`Offer with ID ${id} not found`);
      }
      return offer;
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to fetch offer: ${error.message}`);
  }

  return result;
}
