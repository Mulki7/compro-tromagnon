import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tromagnon Records",
  description: "Tromagnon Records website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-black antialiased">
        {children}
      </body>
    </html>
  );
}
