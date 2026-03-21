import Image from "next/image";

export function AgentCard({
  logo,
  alt,
  icon,
  href,
}: {
  logo: string | null;
  alt: string;
  icon: string;
  href: string;
}) {
  return (
    <a
      href={href}
      title={alt}
      aria-label={alt}
      className="group relative flex h-[120px] w-full items-center justify-center rounded-[12px] border border-stroke-neutral bg-background-neutral-weaker no-underline outline-offset-4 transition-[border-color,background-color] hover:border-stroke-ppg/60 hover:bg-background-neutral focus-visible:ring-2 focus-visible:ring-stroke-ppg"
    >
      {logo ? (
        <Image
          src={logo}
          alt=""
          width={48}
          height={48}
          className="size-12 object-contain opacity-55 grayscale transition-opacity group-hover:opacity-80 dark:brightness-0 dark:invert"
          unoptimized
        />
      ) : (
        <span className="font-mono text-lg text-foreground-neutral-weak">Any AI agent</span>
      )}
      <span
        className="absolute right-[7px] top-[7px] text-sm text-foreground-neutral-weaker opacity-60 transition-opacity group-hover:opacity-100"
        aria-hidden
      >
        <i className={icon} />
      </span>
    </a>
  );
}
