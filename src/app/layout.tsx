import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Catch&Shoot Platform",
  description: "Next.js migration workspace for the NBADraft project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className="min-h-screen bg-base-100 text-base-content font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
