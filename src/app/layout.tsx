import type { Metadata } from "next";
import localFont from "next/font/local";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const salmont = localFont({
  src: "./fonts/Salmont.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-salmont",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tromagnon Records",
  description: "Tromagnon Records — Independent Record Label & Audio Archive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${salmont.variable} ${plusJakartaSans.variable}`}>
      <body className="min-h-screen bg-[#F1F2EE] text-[#111111] font-sans antialiased selection:bg-[#31605A] selection:text-[#F1F2EE]">
        {children}
      </body>
    </html>
  );
}
