import type { Metadata } from "next";
import { Afacad_Flux, Geist_Mono, Raleway } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Toaster } from "sonner";

const raleway = Raleway({ subsets: ["latin"], variable: "--font-sans" });

const afacadFlux = Afacad_Flux({
  variable: "--font-serif",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Haruna Portfolio",
  description: "Portfolio website of Haruna",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("font-sans", raleway.variable)}
      suppressHydrationWarning
    >
      <body className={`${afacadFlux.variable} ${geistMono.variable} antialiased`}>
        <Navbar />
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster  />
        <Footer />
      </body>
    </html>
  );
}
