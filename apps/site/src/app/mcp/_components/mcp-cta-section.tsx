import { buttonVariants } from "@prisma/eclipse";

export function McpCtaSection({ docsHref }: { docsHref: string }) {
  return (
    <section className="px-4 py-12 md:px-0">
      <div className="relative mx-auto flex min-h-[308px] max-w-[1440px] items-center justify-center overflow-hidden py-12 ">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            WebkitMaskImage:
              "radial-gradient(ellipse 85% 75% at 50% 50%, #000 20%, #000 50%, transparent 82%)",
            maskImage:
              "radial-gradient(ellipse 85% 75% at 50% 50%, #000 20%, #000 50%, transparent 82%)",
          }}
          aria-hidden
        />
        <div className="relative z-1 flex w-full max-w-[495px] flex-col items-center gap-8 rounded-[12px] px-4 py-4 text-center">
          <div className="flex flex-col items-center gap-4">
            <h3 className="font-sans-display text-3xl font-black text-foreground-neutral">
              Start Building with AI
            </h3>
            <p className="max-w-[463px] text-base leading-6 text-foreground-neutral-weak">
              Join thousands of developers, and agents, already using Prisma MCP for faster, more
              intuitive database workflows.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <a
                href={docsHref}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({
                  variant: "ppg",
                  className: "h-9 w-full gap-2 px-3 text-sm sm:w-auto",
                })}
              >
                Add MCP server
                <i className="fa-regular fa-arrow-up-right shrink-0 text-[14px]" aria-hidden />
              </a>
              <a
                href={docsHref}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({
                  variant: "default-stronger",
                  className: "h-9 w-full gap-2 px-3 text-sm sm:w-auto",
                })}
              >
                Read Docs
                <i className="fa-regular fa-book-open shrink-0 text-[14px]" aria-hidden />
              </a>
            </div>

            <p className="text-xs text-foreground-neutral-weaker">
              2-minute setup &bull; Works with all MCP tools
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
