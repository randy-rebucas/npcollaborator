import { getPracticeTypesPaginated } from "@/app/actions/practicetypes";
import { getMedicalLicenseStatesPaginated } from "@/app/actions/medicallicensestates"; 

import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Admin Miscellaneous Dashboard',
};

export default async function MiscellaneousPage() {
    const { total: medicalLicenseStates } = await getMedicalLicenseStatesPaginated({ page: 1, search: '', limit: 10000, enabled: 'true' });
    const { total: practiceTypes } = await getPracticeTypesPaginated({ page: 1, search: '', limit: 10000, enabled: 'true' });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-background p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-semibold">Active License States</h2>
                <p className="text-3xl font-bold mt-2">{medicalLicenseStates}</p>
                <p className="text-sm text-muted-foreground mt-1">Total active license states</p>
            </div>

            <div className="bg-background p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-semibold">Active Practice Types</h2>
                <p className="text-3xl font-bold mt-2">{practiceTypes}</p>
                <p className="text-sm text-muted-foreground mt-1">Total active practice types</p>
            </div>
        </div>
    );
}