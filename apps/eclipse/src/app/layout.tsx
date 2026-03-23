import "./global.css";
import Script from "next/script";
import { FontAwesomeScript as EclipseFA } from "@prisma/eclipse";
import { Provider } from "@/components/provider";
import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Eclipse Design System",
    template: "%s | Eclipse Design System",
  },
  description: "Eclipse — Prisma's design system",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src={EclipseFA}
          crossOrigin="anonymous"
          async
          data-auto-add-css="false"
        />
      </head>
      <body className="bg-background-neutral font-sans font-sans-settings text-foreground-neutral antialiased">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
