import { Skeleton } from "@/components/ui/skeleton";

export const ProfileSkeleton = () => {
    return (
        <div className="p-6 max-w-2xl mx-auto">
            {/* Header skeleton */}
            <div className="mb-6">
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-4 w-2/3" />
            </div>

            {/* Form skeleton */}
            <div className="space-y-6">
                {/* Name fields */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <Skeleton className="h-4 w-1/4 mb-2" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex-1">
                        <Skeleton className="h-4 w-1/4 mb-2" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>

                {/* Phone field */}
                <div>
                    <Skeleton className="h-4 w-1/4 mb-2" />
                    <Skeleton className="h-3 w-2/5 mb-2" />
                    <Skeleton className="h-10 w-full" />
                </div>

                {/* Address field */}
                <div>
                    <Skeleton className="h-4 w-1/4 mb-2" />
                    <Skeleton className="h-10 w-full" />
                </div>

                {/* City/State/ZIP fields */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex-1">
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex-1">
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>

                {/* Email field */}
                <div>
                    <Skeleton className="h-4 w-1/4 mb-2" />
                    <div className="flex gap-4">
                        <Skeleton className="h-10 flex-1" />
                        <Skeleton className="h-10 w-40" />
                    </div>
                </div>

                {/* Save button */}
                <div className="flex justify-end">
                    <Skeleton className="h-10 w-20" />
                </div>
            </div>
        </div>
    );
}

export const BioSkeleton = () => {
    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-7 w-16" />
                    <Skeleton className="h-4 w-3/4" />
                </div>

                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-[100px]" />
                </div>

                <div className="space-y-2">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-12" />
                </div>

                <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-12" />
                </div>

                <div className="flex justify-end">
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
        </div>
    );
}

export const PhotoSkeleton = () => {
    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="space-y-6">
                {/* Title and subtitle skeleton */}
                <div className="space-y-2">
                    <Skeleton className="h-7 w-32" />
                    <Skeleton className="h-4 w-64" />
                </div>

                {/* Profile picture skeleton */}
                <div className="flex flex-col items-center gap-6">
                    <Skeleton className="w-32 h-32 rounded-full" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
        </div>
    );
}

export const RatesSkeleton = () => {
    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="mb-6">
                <Skeleton className="h-7 w-48 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
            </div>

            <div className="space-y-8">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-4 w-4" />
                        </div>
                        <Skeleton className="h-10" />
                    </div>
                ))}
            </div>

            <div className="flex justify-end mt-8">
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    );
}

export const CredentialsSkeleton = () => {
    return (
        <div className="p-6 max-w-2xl mx-auto">
            {/* Header skeleton */}
            <div className="mb-6">
                <Skeleton className="h-7 w-48 mb-4" />
                <Skeleton className="h-5 w-full max-w-md mb-2" />
                <Skeleton className="h-5 w-3/4" />
            </div>

            {/* Medical Licenses Section */}
            <div className="mb-8">
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-60 mb-6" />

                {/* License entry skeletons */}
                {[1, 2].map((_, index) => (
                    <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50">
                        <div className="flex gap-4">
                            <Skeleton className="h-10 flex-1" />
                            <Skeleton className="h-10 flex-1" />
                            <Skeleton className="h-10 flex-1" />
                        </div>
                    </div>
                ))}
            </div>

            <Skeleton className="h-px w-full my-8" />

            {/* DEA Licenses Section */}
            <div className="mb-8">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-72 mb-6" />

                {/* DEA License entry skeletons */}
                {[1, 2].map((_, index) => (
                    <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50">
                        <div className="flex gap-4">
                            <Skeleton className="h-10 flex-1" />
                            <Skeleton className="h-10 flex-1" />
                            <Skeleton className="h-10 flex-1" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Submit button skeleton */}
            <div className="flex justify-end">
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    );
}

export const EducationSkeleton = () => {
    return (
        <div className="p-6 max-w-2xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Clinical Degree Section */}
            <div className="space-y-2 mb-6">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
            </div>

            {/* Practice Types Section */}
            <div className="space-y-4 mb-8">
                <Skeleton className="h-6 w-40" />
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-32" />
                </div>
                <Skeleton className="h-10 w-full" />
            </div>

            <hr className="my-8 border-gray-200" />

            {/* Education Section */}
            <div className="space-y-6">
                <Skeleton className="h-6 w-28 bg-gray-200 rounded" />
                {[1, 2, 3].map((index) => (
                    <div key={index} className="space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ))}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    );
}

export const CertificationSkeleton = () => {
    return (
        <div className="p-6 max-w-2xl mx-auto">
            {/* Header Skeleton */}
            <div className="p-6 border-b border-gray-200">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-96" />
            </div>

            <div className="p-6 space-y-8">
                {/* Primary Information Skeleton */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>

                {/* Additional Certifications Skeleton */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-9 w-36" />
                    </div>

                    {/* Certification Cards Skeleton */}
                    {[1, 2].map((_, index) => (
                        <div key={index} className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="space-y-4">
                                <div className="h-10 w-full" />

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Submit Button Skeleton */}
                <div className="flex justify-end pt-6">
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
        </div>
    );
}

export const GovidSkeleton = () => {
    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="mb-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-72 mt-1" />
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-10 w-full" />
                </div>

                <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-10 w-28" />
                </div>

                <Skeleton className="h-4 w-96" />
            </div>
        </div>
    );
}

export const ResultsSkeleton = () => {
    return (Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex gap-4 border rounded-lg p-4 animate-pulse">
            {/* Image skeleton */}
            <Skeleton className="w-40 h-40 bg-gray-200 rounded-md" />

            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    {/* Title skeleton */}
                    <Skeleton className="h-7 bg-gray-200 rounded w-48 mb-2" />
                    {/* Heart button skeleton */}
                    <Skeleton className="w-10 h-10 bg-gray-200 rounded" />
                </div>
                {/* Price skeleton */}
                <Skeleton className="h-6 bg-gray-200 rounded w-32 mb-2" />
                {/* Specialties skeleton */}
                <Skeleton className="h-5 bg-gray-200 rounded w-64 mb-2" />
                {/* Description skeleton */}
                <Skeleton className="h-10 bg-gray-200 rounded w-full" />
            </div>
        </div>
    )));
}

export const CollaborationSkeleton = () => {
    return (Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="bg-white shadow rounded-lg p-6 animate-pulse">
            <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 bg-gray-200 rounded w-3/4" />
                    <Skeleton className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
            </div>
            <div className="mt-4">
                <Skeleton className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
            <div className="mt-4 flex space-x-3">
                <Skeleton className="flex-1 h-8 bg-gray-200 rounded" />
                <Skeleton className="flex-1 h-8 bg-gray-200 rounded" />
            </div>
        </div>
    )));
}

export const MembersTableSkeleton = () => {
    return (Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex gap-4 border rounded-lg p-4 animate-pulse">
            <Skeleton className="w-40 h-40 bg-gray-200 rounded-md" />
        </div>
    )));
}