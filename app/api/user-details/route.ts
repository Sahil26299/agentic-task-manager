import dbConnect from "@/lib/db";
import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";

const updateUserSchema = z.object({
  phone: z.string().optional(),
  countryCode: z.string().optional(),
  oldPassword: z.string().optional(),
  newPassword: z.string().optional(),
});

export async function PATCH(
  request: Request,
) {
  try {
    await dbConnect();

    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded || typeof decoded !== "object" || !decoded.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);
    
    const user = await User.findOneAndUpdate(
      { _id: decoded.userId },
      validatedData,
      { new: true }
    );
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found or unauthorized" },
        { status: 404 }
      );
    }
    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: (error as any).errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update user details" },
      { status: 500 }
    );
  }
}