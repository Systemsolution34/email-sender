export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    ok: true,
    message: "API routes are deployed",
    time: new Date().toISOString()
  });
}