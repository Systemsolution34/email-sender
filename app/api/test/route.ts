// app/api/test/route.ts
export const runtime = "nodejs";

export async function GET() {
  return new Response(
    JSON.stringify({
      message: "This is a test route!",
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}