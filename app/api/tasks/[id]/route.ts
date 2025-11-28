import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Task from "@/models/Task";
import { z, ZodError } from "zod";

const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  body: z.string().optional(),
  reminder: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  isCompleted: z.boolean().optional(),
});

import { verifyToken } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    const body = await request.json();
    const validatedData = updateTaskSchema.parse(body);

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: decoded.userId },
      validatedData,
      { new: true }
    );
    if (!task) {
      return NextResponse.json(
        { error: "Task not found or unauthorized" },
        { status: 404 }
      );
    }
    return NextResponse.json(task);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: (error as any).errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    const task = await Task.findOneAndDelete({
      _id: id,
      userId: decoded.userId,
    });
    if (!task) {
      return NextResponse.json(
        { error: "Task not found or unauthorized" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
