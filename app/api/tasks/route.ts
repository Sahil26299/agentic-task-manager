import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Task from "@/models/Task";
import { z, ZodError } from "zod";

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
  reminder: z.string().optional().nullable(), // Expecting ISO string or null
  tags: z.array(z.string()).optional(),
  isCompleted: z.boolean().optional(),
});

export async function GET() {
  try {
    await dbConnect();
    const tasks = await Task.find({}).sort({ createdAt: -1 });
    return NextResponse.json(tasks);
  } catch (error) {
    console.log(error,'error');
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const validatedData = createTaskSchema.parse(body);

    const taskData = {
      ...validatedData,
      reminder: validatedData.reminder
        ? new Date(validatedData.reminder)
        : undefined,
    };

    const task = await Task.create(taskData);
    return NextResponse.json(task, { status: 201 });
  } catch (error) {    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: (error as any).errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
