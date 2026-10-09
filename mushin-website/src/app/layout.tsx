import type { Metadata, Viewport } from "next";
import { Crimson_Pro, Manrope, Outfit } from "next/font/google";
import "./globals.css";

const display = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const logo = Crimson_Pro({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: ["500"],
});

export const metadata: Metadata = {
  title: "Mushin — Reputation Management & Social Intelligence",
  description:
    "Mushin guides brands out of the Red Ocean to conquer Blue Oceans through reputation management, social intelligence, marketing mix modeling and training. Offices in Erbil and Abu Dhabi.",
  metadataBase: new URL("https://mushin.agency"),
  openGraph: {
    title: "Mushin — Clarity is Mushin",
    description:
      "Strategic reputation management and social intelligence for the MENA region and beyond.",
    url: "https://mushin.agency",
    siteName: "Mushin",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#070b11",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${logo.variable} antialiased`}
    >
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
