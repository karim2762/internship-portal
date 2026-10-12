export const internships = [
  { id: 1, title: "Frontend Developer Intern", company: "Brightwave", location: "Remote", type: "Remote", stipend: "$800/mo", skills: ["React", "CSS"] },
  { id: 2, title: "Backend Developer Intern", company: "Nimbus Labs", location: "Bengaluru", type: "Hybrid", stipend: "₹20,000/mo", skills: ["Node.js", "SQL"] },
  { id: 3, title: "Data Analyst Intern", company: "Plotline", location: "Remote", type: "Remote", stipend: "$600/mo", skills: ["Python", "Excel"] },
  { id: 4, title: "UI/UX Design Intern", company: "Pixelhouse", location: "Mumbai", type: "On-site", stipend: "₹15,000/mo", skills: ["Figma", "Research"] },
  { id: 5, title: "QA Testing Intern", company: "Checkmate Soft", location: "Pune", type: "Hybrid", stipend: "₹12,000/mo", skills: ["Testing", "Cypress"] },
  { id: 6, title: "DevOps Intern", company: "Cloudnest", location: "Remote", type: "Remote", stipend: "$700/mo", skills: ["Docker", "CI/CD"] },
  { id: 7, title: "Content Marketing Intern", company: "Brightwave", location: "Delhi", type: "On-site", stipend: "₹10,000/mo", skills: ["Writing", "SEO"] },
  { id: 8, title: "Machine Learning Intern", company: "Nimbus Labs", location: "Remote", type: "Remote", stipend: "$900/mo", skills: ["Python", "ML"] },
];

export function filterInternships(list, { q = "", type = "" } = {}) {
  const s = q.trim().toLowerCase();
  return list.filter((i) => {
    const text = `${i.title} ${i.company} ${i.skills.join(" ")}`.toLowerCase();
    return (!s || text.includes(s)) && (!type || i.type === type);
  });
}

export function validateApplication(b = {}) {
  const errors = {};
  if (!Number.isInteger(b.internshipId) || !internships.some((i) => i.id === b.internshipId)) errors.internshipId = "Choose a valid internship.";
  if (typeof b.name !== "string" || b.name.trim().length < 2 || b.name.length > 80) errors.name = "Enter your full name (2–80 characters).";
  if (typeof b.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email) || b.email.length > 120) errors.email = "Enter a valid email address.";
  if (typeof b.message !== "string" || b.message.trim().length < 10 || b.message.length > 1000) errors.message = "Write 10–1000 characters about why you fit.";
  return { ok: Object.keys(errors).length === 0, errors };
}
