import type { Metadata } from "next";
import { Nunito, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const heading = Nunito({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const body = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BaleBelajar - Ruang Belajar Siswa",
  description:
    "Pengalaman asesmen diagnostik yang ramah, animatif, dan mudah digunakan untuk siswa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${heading.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
