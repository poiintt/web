import type { LucideIcon } from "lucide-react";

import { CapabilityCard, MobileCapabilityCard } from "./capability-cards";

export type McpCapability = {
  icon: LucideIcon;
  title: string;
  description: string;
  prompt: string;
  mobileTall: boolean;
};

export function McpCapabilitiesSection({
  capabilities,
}: {
  capabilities: readonly McpCapability[];
}) {
  return (
    <section className="py-element-4xl">
      <div className="mx-auto max-w-[1200px] px-4 py-12 md:px-0">
        <div className="md:hidden">
          <h2 className="text-center font-sans-display text-4xl font-black tracking-tight text-foreground-neutral">
            What can I do with MCP?
          </h2>
          <div className="mx-auto mt-8 flex w-full max-w-[368px] items-center rounded-full border border-stroke-neutral bg-background-neutral-weaker p-1">
            <div className="flex h-10 shrink-0 items-center rounded-full bg-background-ppg-reverse px-4 font-sans-display text-base font-bold text-foreground-ppg-reverse">
              Use Prisma Postgres
            </div>
            <div className="flex min-w-0 flex-1 items-center justify-center px-3 font-sans-display text-base font-bold text-foreground-neutral">
              Own database
            </div>
          </div>
          <div className="mx-auto mt-8 flex max-w-[368px] flex-col gap-4">
            {capabilities.map((cap) => (
              <MobileCapabilityCard key={cap.title} {...cap} />
            ))}
          </div>
        </div>

        <div className="hidden md:block">
          <h2 className="text-center font-sans-display text-4xl font-black tracking-tight text-foreground-neutral md:text-5xl">
            What can I do with MCP?
          </h2>

          <div className="mt-12 flex flex-col gap-4 md:flex-row md:gap-5">
            {capabilities.slice(0, 2).map(({ mobileTall: _t, ...cap }) => (
              <CapabilityCard key={cap.title} size="wide" {...cap} />
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:justify-between">
            {capabilities.slice(2).map(({ mobileTall: _t, ...cap }) => (
              <CapabilityCard key={cap.title} size="compact" {...cap} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
