import { log } from "../../../lib/log.mjs";
export const dynamic = "force-dynamic";
export async function GET() {
  const body = { status: "ok", uptimeSeconds: Math.round(process.uptime()), time: new Date().toISOString() };
  log("info", "health_check", { status: body.status });
  return Response.json(body);
}
