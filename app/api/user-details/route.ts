import dbConnect from "@/lib/db";
import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { comparePassword, hashPassword, verifyToken } from "@/lib/auth";
import User from "@/models/User";

const updateUserSchema = z.object({
  phone: z.string().optional(),
  countryCode: z.string().optional(),
  oldPassword: z.string().optional(),
  password: z.string().optional(),
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
    const userData = await User.findOne({ _id: decoded.userId });
    const body = await request.json();
    let validatedData = updateUserSchema.parse(body);
    let isOldPasswordValid = false;
    let isNewPasswordSimilar = true;
    if(validatedData.password && validatedData.oldPassword){
      // if both new and old passwords are present then only check for passwords
       isOldPasswordValid = await comparePassword(validatedData.oldPassword, userData?.password);
       if (!isOldPasswordValid) {
        // if isOldPasswordValid => false, then return an error => invalid password
         return NextResponse.json({ error: "Invalid password" }, { status: 401 });
       }
       isNewPasswordSimilar = await comparePassword(validatedData.password, userData?.password);
       if (isNewPasswordSimilar) {
        // if isNewPasswordSimilar => true, then return an error => new password cannot be same as old password
         return NextResponse.json({ error: "New password cannot be similar to old password" }, { status: 401 });
       }
       // if both the above edge cases are failed, ie. password is ready to be updated in the db, delete the old password
       const newPasswordHashed = await hashPassword(validatedData.password);
       delete validatedData.oldPassword;
       validatedData = {...validatedData, password: newPasswordHashed}
    }else{
      // else delete both the keys of passwords and donot submmit password
      delete validatedData.oldPassword;
      delete validatedData.password;
    }

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