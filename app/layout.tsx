import type { Metadata } from "next";
import { Great_Vibes, Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";

const display = Playfair_Display({
  variable: "--f-display",
  subsets: ["latin"],
});

const sans = Montserrat({
  variable: "--f-sans",
  subsets: ["latin"],
});

const script = Great_Vibes({
  variable: "--f-script",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "XV Años de Joseymar Billianny",
  description:
    "Familia Lugo y Familia Tovar te invitan a celebrar los XV años de Joseymar Billianny. Sábado 7 de noviembre de 2026, 8:00 pm.",
  openGraph: {
    title: "XV Años de Joseymar Billianny",
    description: "Sábado 7 de noviembre de 2026 · 8:00 pm · Santa Lucía",
    images: ["/portada.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${sans.variable} ${script.variable} scroll-smooth`}
    >
      <body>{children}</body>
    </html>
  );
}
