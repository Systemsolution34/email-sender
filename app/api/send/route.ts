import nodemailer from "nodemailer";
import { emailQueue } from "@/emails";

export async function GET() {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send only 5 emails per run (important for 450/day system)
    const batch = emailQueue.splice(0, 5);

    for (const email of batch) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Automated Email System",
        text: "This is a scheduled batch email 🚀",
      });

      // delay to avoid spam detection
      await new Promise((r) => setTimeout(r, 2000));
    }

    return Response.json({
      success: true,
      sent: batch.length,
    });

  } catch (error: any) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}