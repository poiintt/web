import { Button } from "@prisma/eclipse";

import { McpBubble } from "./mcp-bubble";

export type McpHeroFeature = {
  icon: string;
  line1: string;
  line2: string;
  mobileText?: string;
};

const heroFeatureIconClass = "text-[24px] text-foreground-ppg";

export function McpHeroSection({
  docsHref,
  features,
}: {
  docsHref: string;
  features: readonly McpHeroFeature[];
}) {
  return (
    <section className="relative overflow-hidden px-4 pb-12 pt-12 md:pb-16 md:pt-10">
      <div className="relative mx-auto flex w-full max-w-[1024px] flex-col items-center gap-10 md:gap-16">
        <div className="flex w-full flex-col items-center gap-8 md:gap-[60px]">
          <div className="flex w-full flex-col items-center gap-8 md:gap-10">
            <p className="flex items-center justify-center gap-2 font-sans-display text-base font-black uppercase tracking-[1.6px] text-foreground-ppg">
              <i className="fa-solid fa-message-code text-[16px]" aria-hidden />
              Prisma MCP Server
            </p>
            <div className="flex w-full max-w-[910px] flex-col items-center gap-4 sm:gap-5 md:gap-6">
              <div className="w-full max-w-[872px]">
                <McpBubble variant="hero-desktop-title">
                  <h1 className="relative z-10 w-full text-balance text-center font-sans-display stretch-display text-3xl font-black text-foreground-ppg-reverse">
                    <span className="sm:hidden">
                      Your Database Workflow,
                      <br />
                      Powered by AI
                    </span>
                    <span className="hidden sm:inline">Your Database Workflow, Powered by AI</span>
                    <span className="text-foreground-neutral-weak">_</span>
                  </h1>
                </McpBubble>
              </div>
              <div className="w-full max-w-[872px]">
                <McpBubble variant="hero-desktop-description">
                  <p className="relative z-10 w-full text-pretty text-left font-mono text-[clamp(0.9375rem,2vw,1rem)] font-medium leading-normal text-foreground-ppg-reverse-weak">
                    <span className="sm:hidden">
                      Manage your databases with natural language via MCP using your AI tool of
                      choice. Works great with Prisma Postgres_
                    </span>
                    <span className="hidden sm:inline">
                      Manage your databases with natural language via MCP in Claude, Codex, Cursor,
                      Warp, ChatGPT, and other AI agents. Works great with Prisma Postgres_
                    </span>
                  </p>
                </McpBubble>
              </div>
            </div>
          </div>

          <Button
            href={docsHref}
            variant={"ppg"}
            className="flex h-10 w-full max-w-[368px] items-center gap-3 px-4 text-base sm:w-auto sm:max-w-none"
          >
            Add MCP Server
            <i className="fa-regular fa-arrow-up-right shrink-0 text-[16px]" aria-hidden />
          </Button>
        </div>

        <div className="grid w-full max-w-[1024px] grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4 lg:px-[30px]">
          {features.map(({ icon, line1, line2, mobileText }) => (
            <div key={line1} className="flex items-center gap-4 text-left">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-[6px] bg-background-ppg">
                <i className={`${icon} ${heroFeatureIconClass}`} aria-hidden />
              </div>
              <p className="font-mono text-sm font-medium leading-5 text-foreground-neutral-weak dark:text-white/70">
                <span className="sm:hidden">{mobileText ?? `${line1} ${line2}`}</span>
                <span className="hidden sm:inline">
                  {line1}
                  <br />
                  {line2}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
