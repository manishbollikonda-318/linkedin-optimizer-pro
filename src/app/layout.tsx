import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Navbar, Footer } from "@/components/layout";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' });
const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif' 
});

export const metadata: Metadata = {
  title: "LinkOptimizer | Editorial LinkedIn AI Analysis",
  description: "Advanced structural extraction and psychological tone audits for LinkedIn. Optimize your professional footprint with LLM-engineered narratives.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${cormorant.variable} font-sans bg-[#F2EFED] text-[#000000] antialiased selection:bg-[#1A1A1A] selection:text-[#F2EFED]`}>
        <Navbar />
        <div className="pt-28 md:pt-40 min-h-screen">
          {children}
        </div>
        <Footer />
        <Toaster position="bottom-right" theme="light" richColors />
      </body>
    </html>
  );
}
