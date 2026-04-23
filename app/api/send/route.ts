import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

// Supabase client (server-side)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // 1. Fetch 5 unsent emails
    const { data: emails, error } = await supabase
      .from("emails")
      .select("*")
      .eq("sent", false)
      .limit(5);

    if (error) {
      return Response.json({
        success: false,
        error: error.message,
      });
    }

    if (!emails || emails.length === 0) {
      return Response.json({
        success: true,
        sent: 0,
        message: "No unsent emails found",
      });
    }

    // 2. Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let sentCount = 0;

    // 3. Send emails one by one
    for (const row of emails) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: row.email,
        subject: "Automated Email System",
        text: "This is a scheduled batch email 🚀",
      });

      // 4. Mark as sent in DB
      await supabase
        .from("emails")
        .update({ sent: true })
        .eq("id", row.id);

      sentCount++;

      // delay to avoid spam detection
      await new Promise((r) => setTimeout(r, 2000));
    }

    return Response.json({
      success: true,
      sent: sentCount,
    });

  } catch (error: any) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}