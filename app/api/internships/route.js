import { internships, filterInternships } from "../../../lib/jobs.mjs";
import { log } from "../../../lib/log.mjs";
export const dynamic = "force-dynamic";
export async function GET(req) {
  const t = Date.now();
  const p = new URL(req.url).searchParams;
  const data = filterInternships(internships, { q: (p.get("q") || "").slice(0, 60), type: p.get("type") || "" });
  log("info", "list_internships", { count: data.length, ms: Date.now() - t });
  return Response.json({ data });
}
