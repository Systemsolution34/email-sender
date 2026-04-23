export const runtime = "nodejs";

import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 👇 ADD THIS (for browser testing)
export async function GET() {
  return Response.json({
    message: "API is working. Use POST to send emails.",
  });
}

// 👇 Your existing logic
export async function POST() {
  try {
    const { data: emails, error } = await supabase
      .from("emails")
      .select("*")
      .eq("sent", false)
      .limit(5);

    if (error) throw error;

    if (!emails?.length) {
      return Response.json({
        success: true,
        sent: 0,
        message: "No unsent emails found",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let sentCount = 0;

    for (const row of emails) {
      const { data: campaign } = await supabase
        .from("campaigns")
        .select("*")
        .eq("id", row.campaign_id)
        .single();

      if (!campaign) continue;

      await transporter.sendMail({
        from: `"System" <${process.env.EMAIL_USER}>`,
        to: row.email,
        subject: campaign.subject,
        html: campaign.html,
      });

      await supabase
        .from("emails")
        .update({ sent: true })
        .eq("id", row.id);

      sentCount++;
    }

    return Response.json({
      success: true,
      sent: sentCount,
    });

  } catch (err: any) {
    return Response.json({
      success: false,
      error: err.message,
    });
  }
}