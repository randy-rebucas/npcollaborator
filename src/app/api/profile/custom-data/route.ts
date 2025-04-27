import { getUser } from "@/app/actions/user";
import { updateUserCustomData } from "@/app/actions/user";
import { logtoConfig } from "@/app/logto";
import { getLogtoContext } from "@logto/next/server-actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
        
        if (!isAuthenticated || !claims?.sub) {
            return NextResponse.json(
                { error: "Unauthorized" }, 
                { status: 401 }
            );
        }

        const data = await request.json();
        
        if (!data || typeof data !== 'object') {
            return NextResponse.json(
                { error: "Invalid request body" },
                { status: 400 }
            );
        }

        await updateUserCustomData(claims.sub, data);
        const updatedUser = await getUser(claims.sub);

        return NextResponse.json({
            message: "Custom data updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error('Error updating custom data:', error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
