import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from("emails")
    .select("*");

  return res.json({
    debug: true,
    count: data?.length,
    data,
    error,
    url: process.env.SUPABASE_URL,
  });
}