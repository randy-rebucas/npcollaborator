import { NextResponse } from "next/server";
import User from "@/models/User";
import connect from "@/lib/db";
import mongoose from "mongoose";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    
    try {
        // Validate that the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid user ID format" },
                { status: 400 }
            );
        }

        await connect();
        const user = await User.findOne({ _id: new mongoose.Types.ObjectId(id) });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ submissionStatus: user.submissionStatus });
    } catch (error) {
        console.error("Error in user:", error);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
}