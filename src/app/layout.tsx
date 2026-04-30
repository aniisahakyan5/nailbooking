import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Begumyan Nail Salon | Premium Beauty in Armenia",
  description: "Experience the art of luxury nail care at Begumyan Nail Salon. Book your appointment online for professional manicures, pedicures, and beauty procedures in Armenia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hy">
      <body>{children}</body>
    </html>
  );
}
