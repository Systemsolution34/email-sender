import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // 1. Fetch emails
    const { data: emails, error } = await supabase
      .from("emails")
      .select("*");

    // DEBUG RESPONSE (temporary)
    return Response.json({
      debug: true,
      emails,
      error,
    });

  } catch (error: any) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}