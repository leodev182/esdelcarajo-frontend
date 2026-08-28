import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/src/lib/providers/QueryProvider";
import { AuthProvider } from "@/src/context/AuthContext";
import { ConditionalLayout } from "@/src/components/layout/ConditionalLayout";
import { GlobalBackground } from "@/src/components/layout/GlobalBackground";
import {
  zuumeRough,
  westernBangBang,
  specialElite,
  lifeIsSoWonderful,
  cutTheCrap,
} from "@/src/lib/fonts/fonts";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "Del Carajo - Devotos del Arte",
    template: "%s | Del Carajo",
  },
  description: "Ropa urbana venezolana con actitud. Diseños exclusivos para los que se atreven a vestirse diferente. Envíos a toda Venezuela.",
  keywords: ["ropa urbana", "Venezuela", "Del Carajo", "franelas", "ropa urbana venezolana", "streetwear Venezuela"],
  authors: [{ name: "Del Carajo" }],
  creator: "Del Carajo",
  metadataBase: new URL("https://esdelcarajo.com"),
  openGraph: {
    type: "website",
    locale: "es_VE",
    url: "https://esdelcarajo.com",
    siteName: "Del Carajo",
    title: "Del Carajo - Devotos del Arte",
    description: "Ropa urbana venezolana con actitud. Diseños exclusivos para los que se atreven a vestirse diferente.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Del Carajo - Devotos del Arte",
    description: "Ropa urbana venezolana con actitud.",
  },
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
    <html lang="es" className={`${zuumeRough.variable} ${westernBangBang.variable} ${specialElite.variable} ${lifeIsSoWonderful.variable} ${cutTheCrap.variable}`}>
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
