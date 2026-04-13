import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createUser, getUserByEmail } from "@/lib/db";
import { User } from "@/lib/types";
import { UserSchema } from "@/lib/schemas";
import { sanitizeObject } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();
    
    // 1. Validate the structure
    const validation = UserSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data format", details: validation.error.format() },
        { status: 400 }
      );
    }

    // 2. Sanitize to prevent XSS/Injection
    const { name, email, password, phone } = sanitizeObject(validation.data);

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID(); // Generate a valid UUID

    const newUser: User = {
      id: userId,
      name,
      email,
      phone,
      password: hashedPassword,
      role: "user",
      createdAt: new Date().toISOString(),
    };

    const user = await createUser(newUser);
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
