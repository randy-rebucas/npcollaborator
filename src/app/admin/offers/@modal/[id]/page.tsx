import NextModal from "@/components/NextModal"; 
import { Card } from "@/components/ui/card";
import { getOffer } from "@/app/actions/offer";
import { format } from "date-fns";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default async function OfferDetailModal({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    return (
        <NextModal>
            <Card className="p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <Suspense fallback={<LoadingSpinner />}>
                    <OfferDetails id={id} />
                </Suspense>
            </Card>
        </NextModal>
    );
}

async function OfferDetails({ id }: { id: string }) {
    const offer = await getOffer(id);

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="border-b pb-6">
                <h2 className="text-3xl font-bold text-gray-900">Offer Details</h2>
                <div className="flex justify-between items-center mt-4">
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold capitalize
                        ${offer.status.toLowerCase() === 'active' ? 'bg-green-100 text-green-800' :
                            offer.status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'}`}>
                        {offer.status.toLowerCase()}
                    </span>
                    <p className="text-gray-600 font-medium">
                        Offer Date: {format(new Date(offer.offerDate), 'MMMM dd, yyyy')}
                    </p>
                </div>
            </div>

            {/* Position Details */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Position Information</h3>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="text-gray-600">Title</p>
                        <p className="font-medium">{offer.position.title}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Type</p>
                        <p className="font-medium">{offer.position.type}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Location</p>
                        <p className="font-medium">
                            {offer.position.location.facility}<br />
                            {offer.position.location.address}<br />
                            {offer.position.location.city}, {offer.position.location.state} {offer.position.location.zip}
                        </p>
                    </div>
                </div>
            </div>

            {/* Compensation */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Compensation & Benefits</h3>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="text-gray-600 mb-1">Base Salary</p>
                        <p className="font-semibold text-lg text-gray-900">${offer.baseSalary.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Type</p>
                        <p className="font-medium">{offer.compensationType}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Benefits</p>
                        <ul className="list-disc list-inside">
                            {offer.benefits.healthInsurance && <li>Health Insurance</li>}
                            {offer.benefits.dentalInsurance && <li>Dental Insurance</li>}
                            {offer.benefits.visionInsurance && <li>Vision Insurance</li>}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Schedule */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Schedule</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-600">Hours per Week</p>
                        <p className="font-medium">{offer.position.schedule.hoursPerWeek}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Shifts per Week</p>
                        <p className="font-medium">{offer.position.schedule.shiftsPerWeek}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Call Requirements</p>
                        <p className="font-medium">{offer.position.schedule.callRequirements}</p>
                    </div>
                </div>
            </div>

            {/* Contract Details */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Contract Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-600">Contract Length</p>
                        <p className="font-medium">{offer.contractLength} months</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Probationary Period</p>
                        <p className="font-medium">{offer.probationaryPeriod} months</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Start Date</p>
                        <p className="font-medium">{format(new Date(offer.startDate), 'MMM dd, yyyy')}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">End Date</p>
                        <p className="font-medium">{format(new Date(offer.endDate), 'MMM dd, yyyy')}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Offer Expires</p>
                        <p className="font-medium">{format(new Date(offer.expirationDate), 'MMM dd, yyyy')}</p>
                    </div>
                </div>
            </div>

            {/* Duties & Requirements */}
            <div className="grid grid-cols-2 gap-8">
                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">Duties</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        {offer.duties.map((duty: string, index: number) => (
                            <li key={index} className="pl-2">{duty}</li>
                        ))}
                    </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">Requirements</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        {offer.requirements.map((requirement: string, index: number) => (
                            <li key={index} className="pl-2">{requirement}</li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Additional Notes */}
            {offer.additionalNotes && (
                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">Additional Notes</h3>
                    <p className="text-gray-700 leading-relaxed">{offer.additionalNotes}</p>
                </div>
            )}
        </div>
    );
}