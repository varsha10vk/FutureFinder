import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import ToastProvider from "@/providers/toast-provider";

const poppins = Poppins({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "job-portal",
  description: "Get your job easily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={poppins.className}>
          {children}
          <ToastProvider />
        </body>
      </html>
    </ClerkProvider>

  );
}
