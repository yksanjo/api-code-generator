import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "API Code Generator - Generate Client Code",
  description: "Generate client code snippets in multiple languages from API endpoints",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
