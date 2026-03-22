import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Sidebar } from "@/components/layout/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "MaxCanvas — School Dashboard",
  description:
    "Track your kids' grades, assignments, and school activities with AI-powered insights",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <NuqsAdapter>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">{children}</main>
          </div>
        </NuqsAdapter>
      </body>
    </html>
  );
}
