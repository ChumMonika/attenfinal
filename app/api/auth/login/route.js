import { query } from "@/lib/database";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const users = await query({
      query: "SELECT * FROM users WHERE email = ?",
      values: [email],
    });

    if (users.length === 0) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const user = users[0];

    if (user.password !== password) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }
    
    // === THIS IS THE CORRECTED PART ===
    // Manually create the user object to send back, ensuring nulls are handled
    const userWithoutPassword = {
      id: user.id,
      uniqueId: user.uniqueId,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department, // This will now correctly be null for the mazer
      photo_url: user.photo_url,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return NextResponse.json({ user: userWithoutPassword }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "An error occurred", error: error.message }, { status: 500 });
  }
}