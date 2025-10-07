import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Catch&Shoot Platform",
  description: "NBA Draft Social Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          data-nscript="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;
                var root = document.documentElement;
                var prefersDark = typeof window.matchMedia === 'function'
                  ? window.matchMedia('(prefers-color-scheme: dark)').matches
                  : false;
                var theme = prefersDark ? 'dark' : 'light';
                root.setAttribute('data-theme', theme);
                root.style.colorScheme = theme;
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-base-100 text-base-content font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
