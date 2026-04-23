const { createClient } = require("@supabase/supabase-js");

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
      ok: true,
      count: data?.length,
      data,
      error,
    }),
  };
};