import { handleAsync } from "@/lib/errorHandler";
import { DatabaseError, NotFoundError, ValidationError } from "@/lib/errors";
import { sdk } from "@/config/sharetribe";

export interface ListingDocument {
  id: string;
  userId: string;
  username: string;
  email: string;
  metaData: {
    calendlyLink: string;
  };
  createdAt: Date;
  title: string;
  description: string;
  boardCertification: string;
  practiceTypes: string[];
  stateLicenses: string[];
  specialties: string;
  monthlyBaseRate: number;
  multipleNPFee: number;
  additionalFeePerState: number;
  controlledSubstanceFee: number;
  status: string;
  profile: {
    firstName?: string;
    lastName?: string;
    profilePhotoPath?: string;
  };
}

interface GetListingResponse {
  listings: {
    id: string;
    userId: string;
    username: string;
    email: string;
    metaData: {
      calendlyLink: string;
    };
    createdAt: Date;
    title: string;
    description: string;
    boardCertification: string;
    practiceTypes: string[];
    stateLicenses: string[];
    specialties: string;
    monthlyBaseRate: number;
    multipleNPFee: number;
    additionalFeePerState: number;
    controlledSubstanceFee: number;
    status: string;
    profile: {
      firstName?: string;
      lastName?: string;
      profilePhotoPath?: string;
    };
  }[];
  total: number;
}

interface ListingFilters {
  page: number;
  search?: string;
  limit: number;
  sort: "lowest_price" | "highest_price" | "most_recent";
  status: string;
  stateLicense?: string;
  practiceType?: string;
  priceRange?: string;
}

interface SharetribeListing {
  id: { uuid: string };
  attributes: {
    title: string;
    description: string;
    createdAt: Date;
    state: string;
    price: { amount: number };
    publicData: {
      boardCertification?: string;
      practice_types?: string[];
      stateLicenses?: string[];
      Specialties?: string;
      State: string[];
      additionalNpFee?: object;
      additionalStateFee?: object;
      additional_certifications?: string;
      base_rate?: number;
      board_certifications?: string;
      categoryLevel1?: string;
      control_fee?: number;
      controlledSubstanceFee?: object;
      listingType?: string;
      multi_np_fee?: number;
      state_fee?: number;
      transactionProcessAlias?: string;
      unitType?: string;
      additionalFeePerState?: number;
    };
    metadata: {
      calendlyLink?: string;
    };
  };
  relationships: {
    author: {
      data: {
        id: { uuid: string };
        attributes: {
          username?: string;
          email?: string;
          profile?: {
            firstName?: string;
            lastName?: string;
            profileImage?: {
              url?: string;
            };
          };
        };
      };
    };
  };
}

export async function getListings(
  filters: ListingFilters
): Promise<GetListingResponse> {
  if (filters.page < 1 || filters.limit < 1) {
    throw new ValidationError("Invalid pagination parameters");
  }

  const [result, error] = await handleAsync(
    (async () => {
      // Convert filters to Sharetribe query parameters
      const queryParams = {
        page: filters.page,
        perPage: filters.limit,
        include: ["author", "author.profileImage"],
        "fields.listing": [
          "title",
          "description",
          "price",
          "publicData",
          "metadata",
          "state",
        ],
        sort:
          filters.sort === "lowest_price"
            ? "price"
            : filters.sort === "highest_price"
            ? "-price"
            : "-createdAt",
        ...(filters.search && { keywords: filters.search }),
        ...(filters.status && { state: filters.status }),
        ...(filters.stateLicense && {
          pub_stateLicenses: filters.stateLicense,
        }),
        ...(filters.practiceType && {
          pub_practice_types: filters.practiceType,
        }),
        ...(filters.priceRange && {
          "price.gte": filters.priceRange.split("-")[0],
          "price.lte": filters.priceRange.split("-")[1],
        }),
      };

      const response = await sdk.listings.query(queryParams);

      // Transform Sharetribe response to match our interface
      const listings = response.data.data.map((listing: SharetribeListing) => ({
        id: listing.id.uuid,
        userId: listing.relationships.author.data.id.uuid,
        username:
          listing.relationships.author?.data?.attributes?.username || "",
        email: listing.relationships.author?.data?.attributes?.email || "",
        metaData: {
          calendlyLink: listing.attributes.metadata?.calendlyLink || "",
        },
        createdAt: new Date(listing.attributes.createdAt),
        title: listing.attributes.title,
        description: listing.attributes.description,
        boardCertification:
          listing.attributes.publicData?.boardCertification || "",
        practiceTypes: listing.attributes.publicData?.practice_types || [],
        stateLicenses: listing.attributes.publicData?.stateLicenses || [],
        specialties: listing.attributes.publicData?.Specialties || "",
        monthlyBaseRate: listing.attributes.price?.amount || 0,
        multipleNPFee: listing.attributes.publicData?.multi_np_fee || 0,
        additionalFeePerState:
          listing.attributes.publicData?.additionalFeePerState || 0,
        controlledSubstanceFee:
          listing.attributes.publicData?.controlledSubstanceFee || 0,
        status: listing.attributes.state,
        profile: {
          firstName:
            listing.relationships.author?.data?.attributes?.profile?.firstName,
          lastName:
            listing.relationships.author?.data?.attributes?.profile?.lastName,
          profilePhotoPath:
            listing.relationships.author?.data?.attributes?.profile
              ?.profileImage?.url,
        },
      }));

      return {
        listings,
        total: response.data.meta.totalItems || 0,
      };
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to fetch listings: ${error.message}`);
  }

  if (!result) {
    throw new NotFoundError("No listings found");
  }

  return result;
}

export async function getListingById(id: string): Promise<ListingDocument> {
  if (!id) {
    throw new ValidationError("Listing ID is required");
  }

  const [result, error] = await handleAsync(
    (async () => {
      const response = await sdk.listings.show({
        id: id,
        include: ["author", "author.profileImage"],
      });

      const listing = response.data.data;

      return {
        id: listing.id.uuid,
        userId: listing.relationships.author.data.id.uuid,
        email: listing.relationships.author?.data?.attributes?.email,
        metaData: {
          calendlyLink: listing.attributes.metadata?.calendlyLink || "",
        },
        username: listing.relationships.author?.data?.attributes?.username,
        createdAt: new Date(listing.attributes.createdAt),
        title: listing.attributes.title,
        description: listing.attributes.description,
        boardCertification: listing.attributes.publicData?.boardCertification,
        practiceTypes: listing.attributes.publicData?.practice_types || [],
        stateLicenses: listing.attributes.publicData?.stateLicenses || [],
        specialties: listing.attributes.publicData?.Specialties,
        monthlyBaseRate: listing.attributes.price?.amount,
        multipleNPFee: listing.attributes.publicData?.multi_np_fee,
        additionalFeePerState:
          listing.attributes.publicData?.additionalFeePerState,
        controlledSubstanceFee:
          listing.attributes.publicData?.controlledSubstanceFee,
        status: listing.attributes.state,
        profile: listing.relationships.author?.data?.attributes?.profile || {},
      };
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to fetch listing: ${error.message}`);
  }

  if (!result) {
    throw new NotFoundError("No listing found");
  }

  return result;
}

export async function deleteListing(id: string) {
  if (!id) {
    throw new ValidationError("Listing ID is required");
  }

  const [result, error] = await handleAsync(
    (async () => {
      await sdk.listings.delete({
        id: id,
      });

      return { success: true };
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to delete listing: ${error.message}`);
  }

  return result;
}
