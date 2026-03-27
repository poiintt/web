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
      <div className="max-w-[1056px] mx-auto px-2.5 pt-10 w-full md:mb-30">
        {/* Hero */}
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold font-sans-display text-foreground-neutral mt-10 mb-0 mx-auto">
            Live Activity
          </h1>
          <p className="text-lg text-foreground-neutral-weak max-w-[780px] mx-auto mt-4 mb-6 text-balance">
            Track real-time global traffic as developers build and scale with
            our commercial products.
          </p>
          <div className="flex items-center justify-center gap-3 flex-col sm:flex-row [&>*]:w-full [&>*]:max-w-[300px] sm:[&>*]:w-auto">
            <Button variant="ppg" size="xl" href="/accelerate">
              Try Accelerate
            </Button>
            <Button variant="default-stronger" size="xl" href="/postgres">
              Try Prisma Postgres
            </Button>
          </div>
        </div>

        {/* Map */}
        <WorldMap />

        {/* Footnote */}
        <p className="text-center text-sm text-foreground-neutral-weak mt-20 md:mt-0 md:mb-20">
          We pull our live usage data every 60 seconds to keep this map fresh.
          Curious? Take a look at the Network tab.
        </p>

        {/* Share */}
        <div className="text-center py-10">
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
      </div>
    </main>
  );
}
