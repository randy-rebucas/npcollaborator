import { NextResponse } from 'next/server';
import Attestation from '@/models/Attestation';
import connect from "@/lib/db";

export async function GET() {
    try {
        await connect();
        const attestations = await Attestation.find({});
        console.log(attestations);
        const formattedAttestations = attestations.map((attestation) => ({
            ...attestation,
            createdAt: attestation.createdAt.toISOString()
        }));
        console.log(formattedAttestations);
        return NextResponse.json(formattedAttestations);
    } catch (error) {
        console.error('Error fetching attestations:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}