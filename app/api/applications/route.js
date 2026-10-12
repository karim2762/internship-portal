import { validateApplication } from "../../../lib/jobs.mjs";
import { log } from "../../../lib/log.mjs";
export const dynamic = "force-dynamic";
// NOTE: in-memory storage resets on serverless cold starts. Swap for a database in production.
const store = [];
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((x) => now - x < 60000);
  recent.push(now); hits.set(ip, recent);
  return recent.length > 5;
}
export async function POST(req) {
  const ip = (req.headers.get("x-forwarded-for") || "local").split(",")[0];
  if (limited(ip)) { log("warn", "rate_limited", { ip }); return Response.json({ error: "Too many requests. Try again in a minute." }, { status: 429 }); }
  let body;
  try { body = await req.json(); } catch { return Response.json({ error: "Invalid JSON." }, { status: 400 }); }
  const { ok, errors } = validateApplication(body);
  if (!ok) { log("warn", "application_invalid", { fields: Object.keys(errors) }); return Response.json({ errors }, { status: 400 }); }
  const app = { id: store.length + 1, internshipId: body.internshipId, name: body.name.trim(), email: body.email.trim(), createdAt: new Date().toISOString() };
  store.push(app);
  log("info", "application_created", { id: app.id, internshipId: app.internshipId });
  return Response.json({ id: app.id }, { status: 201 });
}
