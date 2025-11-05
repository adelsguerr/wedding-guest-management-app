import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import { GlobalLoadingOverlay } from "@/components/global-loading-overlay";
import { GlobalConfirmDialog } from "@/components/global-confirm-dialog";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gestión de Boda - Wedding Guest Management",
  description: "Sistema completo para gestionar invitados de boda",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster 
            position="top-center" 
            richColors 
            closeButton
            toastOptions={{
              style: {
                background: 'white',
                border: '1px solid #e5e7eb',
              },
            }}
          />
          <GlobalLoadingOverlay />
          <GlobalConfirmDialog />
        </Providers>
      </body>
    </html>
  );
}
