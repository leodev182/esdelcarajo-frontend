import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/src/lib/providers/QueryProvider";
import { AuthProvider } from "@/src/context/AuthContext";
import { ConditionalLayout } from "@/src/components/layout/ConditionalLayout";
import { GlobalBackground } from "@/src/components/layout/GlobalBackground";
import { zuumeRough } from "@/src/lib/fonts/fonts";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Del Carajo - Devotos del Arte",
  description: "Ropa urbana venezolana con actitud",
  verification: {
    google: "google98cf2832a423adf1",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={zuumeRough.variable}>
      <body className="antialiased">
        <GlobalBackground />
        <AuthProvider>
          <QueryProvider>
            <ConditionalLayout>{children}</ConditionalLayout>
          </QueryProvider>
        </AuthProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
