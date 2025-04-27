import { NextResponse } from "next/server";
import { updateProfile } from "@/app/actions/account";
import { getUser } from "@/app/actions/user";

export async function GET(request: Request) {
  try {
    const { id } = await request.json();
    console.log("Getting user data");
    const userData = await getUser(id);  
    console.log("User data:", userData);
    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error in user:", error);
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();

    const user = await updateProfile(data);

    return NextResponse.json(user);

  } catch (error) {
    console.error("Error in user:", error);
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
}
