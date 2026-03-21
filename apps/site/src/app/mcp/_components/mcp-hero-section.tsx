import { Button } from "@prisma/eclipse";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, MessageSquareCode } from "lucide-react";

import { McpBubble } from "./mcp-bubble";

export type McpHeroFeature = {
  icon: LucideIcon;
  line1: string;
  line2: string;
  mobileText?: string;
};

const heroFeatureIconClass = "size-6 text-foreground-ppg shrink-0";

export function McpHeroSection({
  docsHref,
  features,
}: {
  docsHref: string;
  features: readonly McpHeroFeature[];
}) {
  return (
    <section className="relative overflow-hidden px-4 pb-12 pt-12 md:px-0 md:pb-16 md:pt-10">
      <div className="mx-auto flex w-full max-w-[368px] flex-col items-center gap-8 md:hidden">
        <div className="flex w-full flex-col items-center gap-4">
          <p className="flex items-center justify-center gap-2 font-sans-display text-base font-black uppercase tracking-[1.6px] text-foreground-ppg">
            <MessageSquareCode className="size-3.5 shrink-0" strokeWidth={2} aria-hidden />
            Prisma MCP Server
          </p>
          <McpBubble variant="hero-mobile-title">
            <h1 className="relative z-10 text-center font-sans-display text-[30px] font-black leading-[40px] text-foreground-ppg-reverse">
              Your Database Workflow,
              <br />
              Powered by AI
              <span className="text-foreground-neutral-weak">_</span>
            </h1>
          </McpBubble>
          <McpBubble variant="hero-mobile-description">
            <p className="relative z-10 w-full font-mono text-base font-medium leading-6 text-foreground-ppg-reverse-weak">
              Manage your databases with natural language via MCP using your AI tool of choice.
              Works great with Prisma Postgres_
            </p>
          </McpBubble>
        </div>

        <Button
          href={docsHref}
          variant={"ppg"}
          className="flex h-10 w-full items-center gap-3 text-base"
        >
          Add MCP Server
          <ArrowRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />
        </Button>

        <div className="flex w-full flex-col gap-6">
          {features.map((feature) => {
            const FeatureIcon = feature.icon;
            return (
              <div key={feature.line1} className="flex items-center gap-4 text-left">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-[6px] bg-background-ppg">
                  <FeatureIcon className={heroFeatureIconClass} strokeWidth={1.75} aria-hidden />
                </div>
                <p className="font-mono text-sm font-medium leading-5 text-foreground-neutral-weak dark:text-white/70">
                  {feature.mobileText ?? `${feature.line1} ${feature.line2}`}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative mx-auto hidden w-full max-w-[1024px] flex-col items-center gap-20 md:flex">
        <div className="flex w-full flex-col items-center gap-[60px]">
          <div className="flex w-full flex-col items-center gap-10">
            <p className="flex items-center justify-center gap-2 font-sans-display text-base font-black uppercase tracking-[1.6px] text-foreground-ppg">
              <MessageSquareCode className="size-3.5 shrink-0" strokeWidth={2} aria-hidden />
              Prisma MCP Server
            </p>
            <div className="flex w-full max-w-[910px] flex-col items-center gap-6 px-2">
              <div className="w-full max-w-[872px]">
                <McpBubble variant="hero-desktop-title">
                  <h1 className="relative z-10 text-center font-sans-display text-[30px] font-black leading-10 text-foreground-ppg-reverse whitespace-nowrap">
                    Your Database Workflow, Powered by AI
                    <span className="text-foreground-neutral-weak">_</span>
                  </h1>
                </McpBubble>
              </div>
              <div className="w-full max-w-[872px]">
                <McpBubble variant="hero-desktop-description">
                  <p className="relative z-10 w-full text-left font-mono text-base font-medium leading-6 text-foreground-ppg-reverse-weak">
                    Manage your databases with natural language via MCP in Claude, Codex, Cursor,
                    Warp, ChatGPT, and other AI agents. Works great with Prisma Postgres_
                  </p>
                </McpBubble>
              </div>
            </div>
          </div>

          <Button
            href={docsHref}
            variant={"ppg"}
            className="flex h-10 items-center gap-3 px-4 text-base"
          >
            Add MCP Server
            <ArrowRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />
          </Button>
        </div>

        <div className="grid w-full max-w-[1024px] grid-cols-4 gap-12 px-[30px]">
          {features.map(({ icon: FeatureIcon, line1, line2 }) => (
            <div key={line1} className="flex items-center gap-4 text-left">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-[6px] bg-background-ppg">
                <FeatureIcon className={heroFeatureIconClass} strokeWidth={1.75} aria-hidden />
              </div>
              <p className="font-mono text-sm font-medium leading-5 text-foreground-neutral-weak dark:text-white/70">
                {line1}
                <br />
                {line2}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
