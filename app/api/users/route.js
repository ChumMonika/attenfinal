import { query } from "@/lib/database";
import { NextResponse } from "next/server";

// This function handles GET requests to /api/users
export async function GET(request) {
  try {
    // Fetch all users but exclude their passwords for security
    const users = await query({
      query: "SELECT id, uniqueId, name, email, role, department, status FROM users",
      values: [],
    });

    return NextResponse.json({ users: users }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "An error occurred", error: error.message }, { status: 500 });
  }
}