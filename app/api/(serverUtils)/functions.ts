import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { config } from "./config";
import twilio from "twilio";
import User from "@/models/User";
import { Resend } from "resend";

const extractionSchema = z.object({
  title: z.string().describe("Title of the task"),
  body: z.string().describe("Body/Description of the task"),
  reminder: z
    .string()
    .nullable()
    .describe("ISO string for reminder date/time, or null if not provided"),
  tags: z
    .array(z.string())
    .nullable()
    .describe("List of tags, or null if none"),
  isCompleted: z
    .boolean()
    .nullable()
    .describe("Whether the task is completed, default false"),
  userId: z.string().describe("User ID"),
});

/**
 * Extract tasks payload from the given user message
 * @param message Message that might contain task details.
 * @returns Payload to be sent to create task API.
 */
export const extractTaskDetails = async (message: string, from: string) => {
  try {
    const model = new ChatOpenAI({
      modelName: "gpt-4o-mini", // Using a cost-effective model
      temperature: 0,
      openAIApiKey: config.openaiApiKey,
    });
    console.log(message, "message");

    const structuredLlm = model.withStructuredOutput(extractionSchema);

    // const prompt = `You are an assistant that extracts 2 mandatory fields from the message: title and body and 3 optional fields from the message: reminder / due date, tags and isCompleted. If in reminder user only provides date but not time, then consider default time to be 09:00 AM for that day. If you get a single sentence as a message, then use that message as a body, its summary as a title and if due date/time or reminder is provided by the user then add it in the response. Consider Current Time Stamp: ${new Date()}.
    // Extract these details from the following message:
    // "${message}"
    // `;
    const prompt = `Process the given message, understand and Return ONLY a JSON object with: title: as it is provided by user explicitly or generate 3–6 word summary based on a message provided; body: extract actual task from the message as it is (ignore the other part of the message. For eg. Create me a task to go and buy groceries tomorrow -> body: Go and buy groceries tomorrow with proper grammar), reminder: if provided by user, extract day / date / timestamp from the message (if only date → set 09:00; resolve “tomorrow/next …” using CURRENT_TIMESTAMP=${new Date()}), if not provided null; tags: if provided by user then array, else null, isCompleted: false. Do not explain. Only output JSON. Message: "${message}"`;
    console.log(prompt, "prompt");

    const result = await structuredLlm.invoke(prompt);
    const user = await User.findOne({
      phone: from?.replace("whatsapp:+91", ""),
    });
    if(user){
      return { ...result, userId: user?._id };
    }else{
      throw new Error("Please register yourself (or add your what's app number) in the application to create tasks. https://agentic-task-manager.vercel.app/dashboard.");
    }
  } catch (error) {
    console.error("Error extracting artist details:", error);
    throw error;
  }
};

const client = twilio(config.twilio.accountSid, config.twilio.authToken);

/**
 * Send WhatsApp message to the given number
 * @param to Number to send message to
 * @param body Message body
 * @returns Message object
 */
export const sendWhatsAppMessage = async (to: string, body: string) => {
  try {
    const fromNumber = config?.twilio?.phoneNumber?.startsWith("whatsapp:")
      ? config?.twilio?.phoneNumber
      : `whatsapp:${config?.twilio?.phoneNumber}`;
    const toNumber = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;

    const message = await client.messages.create({
      body: body,
      from: fromNumber,
      to: toNumber,
    });
    console.log(`Message sent to ${to}: ${message.sid}`);
    return message;
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    throw error;
  }
};


const resend = new Resend(config.resendApiKey);

export async function sendEmail(to: string, subject: string, text: string) {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject,
    text,
  });
}
