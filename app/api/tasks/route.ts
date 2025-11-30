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

import { verifyToken } from "@/lib/auth";
import User from "@/models/User";
import { sendWhatsAppMessage } from "../whatsapp-incoming/functions";
import { generateUrlSlug } from "@/src/utilities";

export async function GET(request: Request) {
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

    const tasks = await Task.find({ userId: decoded.userId }).sort({
      createdAt: -1,
    });
    return NextResponse.json(tasks);
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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
    const validatedData = createTaskSchema.parse(body);

    const taskData = {
      ...validatedData,
      reminder: validatedData.reminder
        ? new Date(validatedData.reminder)
        : undefined,
      userId: decoded.userId,
    };

    const task = await Task.create(taskData);
    const user = await User.findOne({ _id: decoded.userId });
    sendWhatsAppMessage(
      `${user?.countryCode}${user?.phone}`,
      `New task created successfully: ${
        task.title
      }.\nYou can access it on https://agentic-task-manager.vercel.app/dashboard/${generateUrlSlug(
        task.title
      )}/${task._id}`
    );
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
