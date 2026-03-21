import { McpBubble } from "./mcp-bubble";

export function MobileCapabilityCard({
  icon,
  title,
  description,
  prompt,
  mobileTall,
}: {
  icon: string;
  title: string;
  description: string;
  prompt: string;
  mobileTall: boolean;
}) {
  return (
    <div
      className={`flex w-full flex-col overflow-hidden rounded-[12px] border border-stroke-neutral/40 bg-background-default shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-white/8 dark:bg-[radial-gradient(circle_at_top_left,rgba(10,112,100,0.10),transparent_28%),linear-gradient(180deg,#08111c_0%,#060d18_100%)] ${
        mobileTall ? "min-h-[227px]" : "min-h-[203px]"
      }`}
    >
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-[6px] bg-background-ppg">
            <i className={`${icon} text-2xl text-foreground-ppg`} aria-hidden />
          </div>
          <h4 className="font-sans-display text-[20px] leading-7 font-extrabold text-foreground-neutral">
            {title}
          </h4>
        </div>
        <p className="max-w-full text-[16px] leading-6 text-foreground-neutral-weak">
          {description}
        </p>
      </div>
      <div className="mt-auto px-3.5 pb-3.5">
        <McpBubble variant={mobileTall ? "prompt-mobile-tall" : "prompt-mobile"}>
          {prompt}
        </McpBubble>
      </div>
    </div>
  );
}

export function CapabilityCard({
  icon,
  title,
  description,
  prompt,
  size,
}: {
  icon: string;
  title: string;
  description: string;
  prompt: string;
  size: "wide" | "compact";
}) {
  const isWide = size === "wide";

  return (
    <div
      className={`flex w-full flex-col overflow-hidden rounded-[12px] border border-stroke-neutral/40 bg-background-default shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-white/8 dark:bg-[radial-gradient(circle_at_top_left,rgba(10,112,100,0.10),transparent_28%),linear-gradient(180deg,#08111c_0%,#060d18_100%)] ${
        isWide ? "md:min-h-[179px] md:w-[590px]" : "md:min-h-[203px] md:w-[389px]"
      }`}
    >
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-[6px] bg-background-ppg">
            <i className={`${icon} text-2xl text-foreground-ppg`} aria-hidden />
          </div>
          <h4 className="font-sans-display text-[20px] leading-7 font-extrabold text-foreground-neutral">
            {title}
          </h4>
        </div>
        <p className="max-w-full text-[16px] leading-6 text-foreground-neutral-weak">
          {description}
        </p>
      </div>
      <div className="mt-auto px-4 pb-4">
        <McpBubble variant={isWide ? "prompt-wide" : "prompt-compact"}>{prompt}</McpBubble>
      </div>
    </div>
  );
}
