import { query } from "@/lib/database";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    const result = await query({
      query: "DELETE FROM users WHERE id = ?",
      values: [id],
    });

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "An error occurred", error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  const { name, email, role, department } = await request.json();

  if (!name || !email || !role) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  try {
    const result = await query({
      query: "UPDATE users SET name = ?, email = ?, role = ?, department = ? WHERE id = ?",
      values: [name, email, role, department, id],
    });

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User updated successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "An error occurred", error: error.message }, { status: 500 });
  }
}
