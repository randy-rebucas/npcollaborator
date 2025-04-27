import { NextResponse } from "next/server";
import User from "@/models/User";
import connect from "@/lib/db";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const { id } = await params;
    try {
        await connect();

        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ canCreateListings: user.canCreateListings }); 
    } catch (error) {
        console.error("Error in user:", error);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
}