import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { data: emails, error } = await supabase
      .from("emails")
      .select("*")
      .eq("sent", false)
      .limit(5);

    if (error) {
      return res.status(500).json({ success: false, error });
    }

    if (!emails || emails.length === 0) {
      return res.json({
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
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: row.email,
        subject: "Automated Email System",
        text: "This is a scheduled batch email 🚀",
      });

      await supabase
        .from("emails")
        .update({ sent: true })
        .eq("id", row.id);

      sentCount++;
    }

    return res.json({
      success: true,
      sent: sentCount,
    });

  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error";

    return res.status(500).json({
      success: false,
      error: message,
    });
  }
}