import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

exports.handler = async () => {
  try {
    const { data, error } = await supabase
      .from("emails")
      .select("*");

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        count: data?.length || 0,
        data,
        error,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        error: err instanceof Error ? err.message : "Unknown error",
      }),
    };
  }
};