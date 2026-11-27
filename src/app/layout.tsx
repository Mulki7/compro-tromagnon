import type { Metadata } from "next";
import { Archivo, Archivo_Narrow } from "next/font/google";
import "./globals.css";

const archivoNarrow = Archivo_Narrow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-archivo-narrow",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-archivo",
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
    <html lang="en" className={`${archivoNarrow.variable} ${archivo.variable}`}>
      <body className="min-h-screen bg-[#F1F2EE] text-[#111111] font-sans antialiased selection:bg-[#31605A] selection:text-[#F1F2EE]">
        {children}
      </body>
    </html>
  );
}
