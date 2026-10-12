import test from "node:test";
import assert from "node:assert/strict";
import { internships, filterInternships, validateApplication } from "../lib/jobs.mjs";

test("search matches title, company and skills", () => {
  assert.ok(filterInternships(internships, { q: "react" }).length >= 1);
  assert.ok(filterInternships(internships, { q: "nimbus" }).length >= 2);
});
test("type filter works", () => {
  assert.ok(filterInternships(internships, { type: "Remote" }).every((i) => i.type === "Remote"));
});
test("no match returns empty list", () => {
  assert.equal(filterInternships(internships, { q: "zzzz" }).length, 0);
});
test("valid application passes", () => {
  assert.equal(validateApplication({ internshipId: 1, name: "Asha Rao", email: "asha@mail.com", message: "I love building UIs." }).ok, true);
});
test("invalid application reports each field", () => {
  const r = validateApplication({ internshipId: 99, name: "", email: "bad", message: "short" });
  assert.deepEqual(Object.keys(r.errors).sort(), ["email", "internshipId", "message", "name"]);
});
