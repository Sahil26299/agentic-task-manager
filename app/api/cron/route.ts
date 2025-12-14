import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Task, { ITask } from "@/models/Task";
import dayjs from "dayjs";
import { sendWhatsAppMessage } from "../whatsapp-incoming/functions";
import User from "@/models/User";
import { generateUrlSlug } from "@/src/utilities";

export async function GET() {
  try {
    await dbConnect();

    // extract all tasks that haven't been sent
    const tasks = await Task.find({
      reminderSent: false,
    });

    if (tasks?.length > 0) {
      // extract all today's tasks (ignoring time)
      const todaysReminders = tasks?.filter((task: ITask) => {
        return (
          !task.reminderSent && dayjs(task.reminder).isSame(new Date(), "day")
        );
      });
      if (todaysReminders?.length > 0) {
        await Promise.all(
          todaysReminders.map(async (task: ITask) => {
            try {
              // now based on each of the today's task, extract user details (for what's app number)
              // send what's app based reminder to their what's app number
              const user = await User.findById(task.userId);
              if (user && user.phone) {
                const message = `*Reminder*:\nYour task *${task.title?.trim()}* is due today.\nYou can access it on https://agentic-task-manager.vercel.app/dashboard/${generateUrlSlug(
                  task.title
                )}/${task._id}`;
                const countryCode = user.countryCode || "+91";
                const phoneNumber = `${countryCode}${user.phone}`;

                await sendWhatsAppMessage(phoneNumber, message);

                // Mark as sent in db for that task
                await Task.findByIdAndUpdate(
                  task._id,
                  { reminderSent: true },
                  { new: true, strict: false }
                );
              }
            } catch (err) {
              console.error("Error processing task:", task._id, err);
            }
          })
        );
      }
    }
    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
