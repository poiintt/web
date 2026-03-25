import { Button } from "@prisma/eclipse";

export function McpCtaSection({ docsHref }: { docsHref: string }) {
  return (
    <section className="relative isolate overflow-hidden px-4 py-12 md:px-0 [--mcp-cta-glow-outer-start:color-mix(in_srgb,var(--color-foreground-ppg-strong)_14%,transparent)] [--mcp-cta-glow-outer-mid:color-mix(in_srgb,var(--color-foreground-ppg)_10%,transparent)] [--mcp-cta-glow-inner-start:color-mix(in_srgb,var(--color-foreground-ppg)_10%,transparent)] [--mcp-cta-glow-inner-mid:color-mix(in_srgb,var(--color-foreground-ppg)_5%,transparent)] [--mcp-grid-line:color-mix(in_srgb,var(--color-foreground-ppg-strong)_22%,transparent)] dark:[--mcp-cta-glow-outer-start:color-mix(in_srgb,var(--color-foreground-ppg-strong)_16%,transparent)] dark:[--mcp-cta-glow-outer-mid:color-mix(in_srgb,var(--color-background-ppg)_18%,transparent)] dark:[--mcp-grid-line:color-mix(in_srgb,var(--color-foreground-neutral-reverse)_14%,transparent)]">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[min(100%,760px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial-[at_50%_50%] from-(--mcp-cta-glow-outer-start) from-0% via-(--mcp-cta-glow-outer-mid) via-24% to-transparent to-54% dark:from-[var(--mcp-cta-glow-outer-start)] dark:from-0% dark:via-[var(--mcp-cta-glow-outer-mid)] dark:via-30% dark:to-transparent dark:to-58%"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[170px] w-[min(100%,480px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial-[at_50%_50%] from-(--mcp-cta-glow-inner-start) from-0% via-(--mcp-cta-glow-inner-mid) via-24% to-transparent to-52% dark:hidden"
      />
      <div className="relative mx-auto flex min-h-77 max-w-360 items-center justify-center overflow-hidden py-12">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-60 w-[min(100%,720px)] -translate-x-1/2 -translate-y-1/2 bg-[linear-gradient(var(--mcp-grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--mcp-grid-line)_1px,transparent_1px)] bg-position-[20px_20px] bg-size-[40px_40px] mask-[radial-gradient(ellipse_72%_74%_at_50%_50%,#000_16%,rgba(0,0,0,0.95)_46%,rgba(0,0,0,0.4)_76%,transparent_100%)] opacity-100"
          aria-hidden
        />
        <div className="relative z-1 flex w-full max-w-[495px] flex-col items-center gap-8 rounded-[12px] px-4 py-4 text-center">
          <div className="flex flex-col items-center gap-4">
            <h3 className="stretch-display font-sans-display text-[30px] leading-10 font-black text-foreground-neutral">
              Start Building with AI
            </h3>
            <p className="max-w-[463px] text-base leading-6 text-foreground-neutral-weak">
              Join thousands of developers, and agents, already using Prisma MCP
              for faster, more intuitive database workflows.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex w-full flex-col items-center justify-center gap-4 min-[720px]:flex-row min-[720px]:gap-6">
              <Button
                href={docsHref}
                variant={"ppg"}
                size={"3xl"}
                className="gap-3"
              >
                Add MCP Server
                <i
                  className="fa-regular fa-arrow-right shrink-0 text-[16px]"
                  aria-hidden
                />
              </Button>
              <Button
                href={docsHref}
                variant={"default-stronger"}
                size={"3xl"}
                className="gap-3"
              >
                Read Docs
                <i
                  className="fa-regular fa-book-open shrink-0 text-[16px]"
                  aria-hidden
                />
              </Button>
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
