import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Best Boarding School in Gaur, Rautahat | Janak English Boarding School",
  description:
    "Janak English Boarding School Pvt. Ltd. - the best, top, and most trusted boarding school in Gaur, Rautahat. Affordable, quality English-medium education from Nursery to Grade 8.",
  keywords:
    "best school in Gaur, top school Gaur Rautahat, best boarding school Gaur, top boarding school Rautahat, cheap boarding school Gaur, affordable school Gaur Rautahat, quality education Gaur, English medium school Gaur, Janak English Boarding School, boarding school near me Gaur, Nursery to Grade 8 Gaur, private school Gaur Rautahat, school in Rautahat district",
  alternates: {
    canonical: "https://janak-english-boarding-school.vercel.app/",
  },
  openGraph: {
    title: "Best Boarding School in Gaur, Rautahat - Janak English Boarding School",
    description:
      "Shaping Young Minds for a Brighter Tomorrow. The best and top English-medium boarding school in Gaur, Rautahat.",
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  themeColor: "#14301e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
