import "./globals.css";
export const metadata = { title: "InternPath – Find your first internship", description: "Browse and apply to internships." };
export const viewport = { width: "device-width", initialScale: 1 };
export default function RootLayout({ children }) {
  return (<html lang="en"><body><a className="skip" href="#main">Skip to content</a>{children}</body></html>);
}
