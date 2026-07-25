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
  title: {
    default: "BaleBelajar - Platform Belajar Berbasis Cita-cita",
    template: "%s | BaleBelajar",
  },
  description:
    "BaleBelajar membantu sekolah mengubah asesmen dan kurikulum menjadi perjalanan belajar berbasis cita-cita dengan materi, studi kasus, tes, dan rekomendasi remedial.",
  keywords: [
    "BaleBelajar",
    "platform asesmen siswa",
    "rekomendasi belajar AI",
    "kurikulum berbasis cita-cita",
    "edtech sekolah Indonesia",
  ],
  metadataBase: new URL("https://app.balebelajar.com"),
  openGraph: {
    title: "BaleBelajar - Platform Belajar Berbasis Cita-cita",
    description:
      "Materi, studi kasus, tes, dan rekomendasi remedial untuk membantu guru memahami kebutuhan belajar siswa.",
    locale: "id_ID",
    siteName: "BaleBelajar",
    type: "website",
  },
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
