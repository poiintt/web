import type { ReactNode } from "react";

const fillTitle = "#030712";
const fillTeal = "#042F2E";

export type McpBubbleVariant =
  | "hero-desktop-title"
  | "hero-desktop-description"
  | "hero-mobile-title"
  | "hero-mobile-description"
  | "prompt-mobile"
  | "prompt-mobile-tall"
  | "prompt-wide"
  | "prompt-compact";

type BubbleConfig = {
  shell: string;
  fill: string;
  monoPrompt: boolean;
};

const config: Record<McpBubbleVariant, BubbleConfig> = {
  "hero-desktop-title": {
    fill: fillTitle,
    monoPrompt: false,
    shell:
      "min-h-[67px] items-center justify-center rounded-xl border border-stroke-ppg px-6 py-3 md:min-h-[67px] md:px-8",
  },
  "hero-desktop-description": {
    fill: fillTeal,
    monoPrompt: false,
    shell:
      "min-h-[72px] items-center rounded-xl border border-stroke-ppg px-6 py-3 md:min-h-[72px] md:px-6",
  },
  "hero-mobile-title": {
    fill: fillTitle,
    monoPrompt: false,
    shell:
      "min-h-[120px] items-center justify-center rounded-xl border border-stroke-ppg px-6 py-6 sm:min-h-[128px]",
  },
  "hero-mobile-description": {
    fill: fillTeal,
    monoPrompt: false,
    shell:
      "min-h-[108px] items-center rounded-xl border border-stroke-ppg px-4 py-5 sm:min-h-[112px]",
  },
  "prompt-mobile": {
    fill: fillTeal,
    monoPrompt: true,
    shell:
      "items-center rounded-[10px] border border-stroke-ppg px-3.5 py-2 shadow-none sm:px-4 min-h-[48px]",
  },
  "prompt-mobile-tall": {
    fill: fillTeal,
    monoPrompt: true,
    shell:
      "items-center rounded-[10px] border border-stroke-ppg px-3.5 py-2.5 shadow-none sm:px-4 min-h-[64px] sm:min-h-[72px]",
  },
  "prompt-wide": {
    fill: fillTeal,
    monoPrompt: true,
    shell:
      "items-center rounded-[10px] border border-stroke-ppg px-3.5 py-2 shadow-none sm:px-4 min-h-[41px] py-2 md:min-h-[45px]",
  },
  "prompt-compact": {
    fill: fillTeal,
    monoPrompt: true,
    shell:
      "items-center rounded-[10px] border border-stroke-ppg px-3.5 py-2 shadow-none sm:px-4 min-h-[44px] py-2 md:min-h-[50px]",
  },
};

const monoPromptClass =
  "w-full font-mono text-[13px] leading-snug text-foreground-ppg-reverse-weak sm:text-sm sm:leading-5";

export function McpBubble({
  variant,
  children,
}: {
  variant: McpBubbleVariant;
  children: ReactNode;
}) {
  const { shell, fill, monoPrompt } = config[variant];

  const body = monoPrompt ? <div className={monoPromptClass}>{children}</div> : children;

  return (
    <div className="relative w-full">
      <div className={`relative z-1 flex w-full ${shell}`} style={{ backgroundColor: fill }}>
        {body}
      </div>
    </div>
  );
}
