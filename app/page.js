"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const [target, setTarget] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const ctl = new AbortController();
    setItems(null); setError("");
    const t = setTimeout(() => {
      fetch(`/api/internships?q=${encodeURIComponent(q)}&type=${encodeURIComponent(type)}`, { signal: ctl.signal })
        .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
        .then((j) => setItems(j.data))
        .catch((e) => { if (e.name !== "AbortError") setError("Couldn't load internships. Check your connection and try again."); });
    }, 250);
    return () => { clearTimeout(t); ctl.abort(); };
  }, [q, type]);

  function open(i) { setTarget(i); setDone(null); setErrors({}); setForm({ name: "", email: "", message: "" }); setTimeout(() => document.getElementById("apply")?.focus(), 50); }

  async function submit(e) {
    e.preventDefault(); setBusy(true); setErrors({});
    try {
      const r = await fetch("/api/applications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, internshipId: target.id }) });
      const j = await r.json();
      if (r.ok) setDone(j.id); else setErrors(j.errors || { form: j.error || "Something went wrong." });
    } catch { setErrors({ form: "Network error. Try again." }); }
    setBusy(false);
  }

  const field = (k, label, props = {}) => (
    <>
      <label htmlFor={k}>{label}</label>
      {props.area ? <textarea id={k} rows={4} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? k + "-e" : undefined} />
        : <input id={k} type={props.type || "text"} autoComplete={props.ac} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? k + "-e" : undefined} />}
      {errors[k] && <p className="err" id={k + "-e"} role="alert">{errors[k]}</p>}
    </>
  );

  return (
    <main id="main">
      <h1>Find your first internship</h1>
      <p className="lead">Search by role, company, or skill. Apply in under a minute.</p>

      <div className="tools" role="search">
        <div><label htmlFor="q">Search</label><input id="q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="React, Python, design…" /></div>
        <div><label htmlFor="type">Work type</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All types</option><option>Remote</option><option>Hybrid</option><option>On-site</option>
          </select></div>
      </div>

      {target && (
        <section className={"panel" + (done ? " ok" : "")} aria-labelledby="ap-h">
          <h2 id="ap-h">Apply: {target.title}</h2>
          {done ? (
            <div role="status"><p>Application #{done} sent to {target.company}. Check your email for next steps.</p><button onClick={() => setTarget(null)}>Back to internships</button></div>
          ) : (
            <form onSubmit={submit} noValidate>
              {field("name", "Full name", { ac: "name" })}
              {field("email", "Email", { type: "email", ac: "email" })}
              {field("message", "Why are you a good fit?", { area: true })}
              {errors.form && <p className="err" role="alert">{errors.form}</p>}
              <p><button id="apply" disabled={busy}>{busy ? "Sending…" : "Send application"}</button>{" "}
                <button type="button" className="ghost" onClick={() => setTarget(null)}>Cancel</button></p>
            </form>
          )}
        </section>
      )}

      <div aria-live="polite">
        {error && <div className="state" role="alert">{error}</div>}
        {!error && items === null && <div className="state">Loading internships…</div>}
        {!error && items && items.length === 0 && <div className="state">No matches. Clear the search or choose “All types”.</div>}
      </div>
      {items && items.length > 0 && (
        <ul>{items.map((i) => (
          <li key={i.id}>
            <h2>{i.title}</h2>
            <p className="meta">{i.company}, {i.location} ({i.type}), {i.stipend}</p>
            <div className="tags">{i.skills.map((s) => <span key={s}>{s}</span>)}</div>
            <button onClick={() => open(i)} aria-label={`Apply to ${i.title} at ${i.company}`}>Apply</button>
          </li>))}
        </ul>
      )}
    </main>
  );
}
