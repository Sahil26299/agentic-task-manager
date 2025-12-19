import { NextResponse } from "next/server";
import {
  extractTaskDetails,
  sendWhatsAppMessage,
} from "../(serverUtils)/functions";
import dbConnect from "@/lib/db";
import Task, { ITask } from "@/models/Task";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const incomingMessage = formData.get("Body");
    const from = formData.get("From");

    console.log(`Received message from ${from}: ${incomingMessage}`);

    // 1. Extract Fields using AI
    let extractedData;
    try {
      extractedData = await extractTaskDetails(
        incomingMessage as string,
        from as string
      );
      console.log("Extracted Data:", extractedData);
    } catch (error: any) {
      console.error("Extraction failed:", error?.message);
      await sendWhatsAppMessage(
        from as string,
        error?.message ||
          "Sorry, I couldn't understand the task details. Please provide title and body to start creating your tasks."
      );
      return NextResponse.json(
        "Sorry, I couldn't understand the details provided.",
        { status: 200 }
      );
    }

    // 2. Validate Fields (Basic check, Zod already ensures structure but maybe check for empty strings)
    if (!extractedData.title || !extractedData.body) {
      await sendWhatsAppMessage(
        from as string,
        "Missing information. Please provide title and body to start creating your tasks."
      );
      return NextResponse.json(
        "Missing information. Please provide title and body to start creating your tasks.",
        { status: 200 }
      );
    }

    // 3. Call API to Create Artist
    let taskResponse;
    try {
      await dbConnect();
      if (extractedData.title && extractedData.body) {
        const taskData = {
          title: extractedData.title,
          body: extractedData.body,
          reminder: extractedData.reminder
            ? new Date(extractedData.reminder)
            : undefined,
          tags: extractedData?.tags || [],
          isCompleted: extractedData.isCompleted ?? false,
          userId: extractedData?.userId,
        };
        taskResponse = await Task.create(taskData);
        console.log(taskResponse, "taskResponse");
      }
    } catch (error) {
      await sendWhatsAppMessage(
        from as string,
        "Failed to create task. Please try again later."
      );
      return NextResponse.json(
        "Failed to create task. Please try again later.",
        { status: 200 }
      );
    }

    const successMessage = `Task created successfully.`;
    await sendWhatsAppMessage(from as string, successMessage);

    return NextResponse.json(taskResponse, { status: 201 });
  } catch (error) {
    console.log(error, "error");

    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
