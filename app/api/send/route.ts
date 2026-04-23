import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("emails")
    .select("*");

  return Response.json({
    debug: true,
    count: data?.length || 0,
    data,
    error,
  });
}