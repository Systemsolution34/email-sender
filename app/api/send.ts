import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async () => {
  const { data, error } = await supabase
    .from("emails")
    .select("*");

  return {
    statusCode: 200,
    body: JSON.stringify({
      debug: true,
      count: data?.length || 0,
      data,
      error,
      url: process.env.SUPABASE_URL,
    }),
  };
};