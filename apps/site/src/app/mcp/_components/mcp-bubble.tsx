import { useId, type ReactNode } from "react";

const fillTitle = "#030712";
const fillTeal = "#042F2E";
const strokeTeal = "#2DD4BF";
const promptFill = "#0D3A38";
const promptStroke = "#16A394";
const bubbleShadow = "shadow-[0_12px_36px_rgba(0,0,0,0.2)]";

export type McpBubbleVariant =
  | "hero-desktop-title"
  | "hero-desktop-description"
  | "hero-mobile-title"
  | "hero-mobile-description";

export type McpPromptBubbleVariant = "mobile" | "mobile-tall" | "wide" | "compact";

type BubbleConfig = {
  shell: string;
  fill: string;
  stroke: string;
  monoPrompt: boolean;
  tailSide: "left" | "right";
};

const config: Record<McpBubbleVariant, BubbleConfig> = {
  "hero-desktop-title": {
    fill: fillTitle,
    stroke: strokeTeal,
    monoPrompt: false,
    tailSide: "right",
    shell: `min-h-[120px] items-center justify-center rounded-xl px-5 py-5 sm:min-h-[96px] sm:px-6 sm:py-4 lg:min-h-[72px] lg:px-6 ${bubbleShadow}`,
  },
  "hero-desktop-description": {
    fill: fillTeal,
    stroke: strokeTeal,
    monoPrompt: false,
    tailSide: "left",
    shell: `min-h-[108px] items-center rounded-xl px-4 py-4 sm:min-h-[92px] sm:px-5 sm:py-3.5 lg:min-h-[78px] lg:px-6 lg:py-3 ${bubbleShadow}`,
  },
  "hero-mobile-title": {
    fill: fillTitle,
    stroke: strokeTeal,
    monoPrompt: false,
    tailSide: "right",
    shell: `min-h-[120px] items-center justify-center rounded-xl px-5 py-5 sm:min-h-[128px] sm:px-6 ${bubbleShadow}`,
  },
  "hero-mobile-description": {
    fill: fillTeal,
    stroke: strokeTeal,
    monoPrompt: false,
    tailSide: "left",
    shell: `min-h-[108px] items-center rounded-xl px-4 py-4 sm:min-h-[112px] sm:px-5 ${bubbleShadow}`,
  },
};

const promptConfig: Record<McpPromptBubbleVariant, string> = {
  mobile: "min-h-[50px] px-4 py-[2px]",
  "mobile-tall": "min-h-[74px] px-4 py-[9px] xl:min-h-[45px] xl:py-[2px]",
  wide: "min-h-[50px] px-4 py-[2px] xl:min-h-[45px]",
  compact: "min-h-[50px] px-4 py-[2px]",
};

const promptTextClass =
  "inline-block w-full break-words text-pretty font-mono text-[14px] font-normal leading-5 text-[#99F6E4]";

function BubbleTail({
  fill,
  stroke,
  side,
}: {
  fill: string;
  stroke: string;
  side: "left" | "right";
}) {
  const positionClass =
    side === "left" ? "bottom-[-2px] left-[-10.5px]" : "bottom-[-2px] right-[-10.5px] scale-x-[-1]";
  const clipPathId = useId();

  return (
    <svg
      aria-hidden
      className={`pointer-events-none absolute ${positionClass}`}
      width="27"
      height="19"
      viewBox="0 0 27 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath={`url(#${clipPathId})`}>
        <path
          d="M26.6301 0H9.91007V0.07C9.61007 2.18 8.84007 6.95 7.40007 9.44C5.95007 11.95 2.86007 14.49 0.850074 15.98C0.220074 16.44 0.480074 17.47 1.26007 17.52C4.86007 17.75 8.44007 17.42 11.7901 16.52C12.9101 16.22 13.9901 15.84 15.0501 15.42C17.0001 16.78 19.3601 17.59 21.9201 17.59H26.6401V0H26.6301Z"
          fill={fill}
        />
        <path
          d="M9.91007 0V0.07C9.61007 2.18 8.84007 6.95 7.40007 9.44C5.95007 11.95 2.86007 14.49 0.850074 15.98C0.220074 16.44 0.480074 17.47 1.26007 17.52C4.86007 17.75 8.44007 17.42 11.7901 16.52C12.9101 16.22 13.9901 15.84 15.0501 15.42C17.0001 16.78 19.3601 17.59 21.9201 17.59H26.6401"
          stroke={stroke}
          strokeMiterlimit="10"
        />
      </g>
      <defs>
        <clipPath id={clipPathId}>
          <rect width="26.63" height="18.08" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function McpPromptBubble({
  variant,
  children,
}: {
  variant: McpPromptBubbleVariant;
  children: ReactNode;
}) {
  return (
    <div className="relative w-full">
      <div
        className={`relative z-10 flex w-full items-center rounded-[12px] border bg-[#0D3A38] transition-colors duration-300 ${promptConfig[variant]}`}
        style={{ borderColor: promptStroke }}
      >
        <code className={promptTextClass}>{children}</code>
        <BubbleTail fill={promptFill} stroke={promptStroke} side="right" />
      </div>
    </div>
  );
}

export function McpBubble({
  variant,
  children,
}: {
  variant: McpBubbleVariant;
  children: ReactNode;
}) {
  const { shell, fill, stroke, tailSide } = config[variant];

  return (
    <div className="relative w-full">
      <div
        className={`relative z-10 flex w-full border border-stroke-ppg ${shell}`}
        style={{ backgroundColor: fill }}
      >
        {children}
        <BubbleTail fill={fill} stroke={stroke} side={tailSide} />
      </div>
    </div>
  );
}
