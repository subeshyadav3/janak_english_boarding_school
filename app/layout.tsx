import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_URL, GEO_TAGS } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DEFAULT_DESCRIPTION =
  "Janak English Boarding School Pvt. Ltd. is the best, most trusted English-medium boarding school in Gaur, Rautahat, Nepal. Quality education from Nursery to Grade 8 with strong discipline and caring environment. Enroll today.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Janak English Boarding School Pvt. Ltd. Gaur Rautahat",
    template: "%s | Janak English Boarding School",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "best school in Gaur",
    "top school Gaur Rautahat",
    "best boarding school Gaur",
    "top boarding school Rautahat",
    "cheap boarding school Gaur",
    "affordable school Gaur Rautahat",
    "quality education Gaur",
    "English medium school Gaur",
    "Janak English Boarding School",
    "boarding school near me Gaur",
    "Nursery to Grade 8 Gaur",
    "private school Gaur Rautahat",
    "school in Rautahat district",
    "best English medium school in Gaur",
    "admission open school Gaur",
    "school in Gaur Nepal",
    "Madhesh Province school",
    "boarding school in Rautahat",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "c7S4yXfJocR_vy9oH0lCsIc10gvrNTlxKpON4VeT8H8",
  },
  openGraph: {
    title: "Best Boarding School in Gaur, Rautahat - Janak English Boarding School",
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: "Janak English Boarding School",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/assets/cover1.png",
        width: 1200,
        height: 630,
        alt: "Janak English Boarding School - Gaur, Rautahat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Boarding School in Gaur, Rautahat - Janak English Boarding School",
    description: DEFAULT_DESCRIPTION,
    images: ["/assets/cover1.png"],
  },
  other: {
    ...GEO_TAGS,
    "og:region": "NP-2",
    "og:locality": "Gaur, Rautahat",
    "og:country-name": "Nepal",
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
