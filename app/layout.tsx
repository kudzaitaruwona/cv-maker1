import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "@/app/globals.css";
import { Navbar } from "@/components/web/navbar";
import { AuthProvider } from "@/context/AuthContext"
import { ProfileProvider } from "@/context/ProfileContext";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Construct the base URL for metadata
// VERCEL_URL is available at build and runtime (server-side only)
// It contains the domain without protocol (e.g., "my-site.vercel.app")
// For production, prefer VERCEL_PROJECT_PRODUCTION_URL if available
function getDefaultUrl(): string {
  // Production URL (if available)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  
  // Preview or development deployment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Local development
  return "http://localhost:3000";
}

const defaultUrl = getDefaultUrl();

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Resumaide - CV & Achievement Manager",
  description: "Resumaide helps you store, organize, and export your professional achievements. Build multiple CV versions and export professional PDFs instantly.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
  fallback: ["system-ui", "arial"], // Fallback fonts if Geist fails to load
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            <AuthProvider>
                <Toaster/>
                {children}
            </AuthProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
