// Structured JSON logs. Never pass passwords, tokens, or full message bodies.
export function log(level, msg, meta = {}) {
  console.log(JSON.stringify({ time: new Date().toISOString(), level, msg, ...meta }));
}
