import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YouthAtlas — Opportunities for Young People",
  description:
    "Find scholarships, fellowships, internships, grants, and more. Updated daily with AI-powered matching.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
