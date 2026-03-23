import "./global.css";
import Script from "next/script";
import { FontAwesomeScript as EclipseFA } from "@prisma/eclipse";
import { Provider } from "@/components/provider";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
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
