import type { Metadata } from "next";
import { Button } from "@prisma/eclipse";
import { WorldMap } from "./_components/world-map";

export const metadata: Metadata = {
  title: "Global Traffic | Prisma",
  description:
    "Track real-time global traffic as developers build and scale with Prisma's commercial products.",
};

export default function GlobalPage() {
  return (
    <main className="flex-1 w-full z-1 -mt-24 pt-24 relative legal-hero-gradient">
      {/* Hero */}
      <div className="text-center pt-16 pb-8 px-4">
        <h1 className="text-5xl md:text-6xl font-bold font-sans-display text-foreground-neutral mb-4">
          Live Activity
        </h1>
        <p className="text-lg text-foreground-neutral-weak max-w-[600px] mx-auto mb-8">
          Track real-time global traffic as developers build and scale with our
          commercial products.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Button variant="ppg" size="xl" href="/accelerate">
            Try Accelerate
          </Button>
          <Button variant="default-stronger" size="xl" href="/postgres">
            Try Prisma Postgres
          </Button>
        </div>
      </div>

      {/* Map */}
      <div className="px-4 py-12">
        <WorldMap />
        <p className="text-center text-sm text-foreground-neutral-weaker mt-6 max-w-[600px] mx-auto">
          We pull our live usage data every 60 seconds to keep this map fresh.
          Curious? Take a look at the Network tab.
        </p>
      </div>

      {/* Share */}
      <div className="text-center pb-20 px-4">
        <h3 className="text-lg font-bold text-foreground-neutral mb-4">
          Share
        </h3>
        <div className="flex items-center justify-center gap-4">
          <a
            href="https://www.linkedin.com/sharing/share-offsite/?url=https://www.prisma.io/global"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground-neutral-weak hover:text-foreground-neutral transition-colors"
            aria-label="Share on LinkedIn"
          >
            <i className="fa-brands fa-linkedin text-2xl" />
          </a>
          <a
            href="https://twitter.com/intent/tweet?url=https://www.prisma.io/global&text=See%20Prisma%20Accelerate%27s%20real-time%20global%20traffic!"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground-neutral-weak hover:text-foreground-neutral transition-colors"
            aria-label="Share on X"
          >
            <i className="fa-brands fa-x-twitter text-2xl" />
          </a>
          <a
            href="https://bsky.app/intent/compose?text=See%20Prisma%20Accelerate%27s%20real-time%20global%20traffic!%20https://www.prisma.io/global"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground-neutral-weak hover:text-foreground-neutral transition-colors"
            aria-label="Share on Bluesky"
          >
            <i className="fa-brands fa-bluesky text-2xl" />
          </a>
        </div>
      </div>
    </main>
  );
}
