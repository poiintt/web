"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type DataPoint = {
  pop: string;
  ratio?: number;
  cured_coord: { lon: number; lat: number };
};

function Marker({ data }: { data: DataPoint }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const isActive = Boolean(data.ratio);

  return (
    <>
      <span
        className={cn(
          "absolute rounded-full",
          isActive
            ? "bg-[#71E8DF99] border border-[#B7F4EE] shadow-[0_0_28px_0_#71E8DF99] opacity-0 animate-[pulsate_2s_ease-in-out_infinite] z-2"
            : "size-2 bg-[rgba(113,128,150,1)] border border-stroke-neutral opacity-100 z-1",
        )}
        style={{
          ...(isActive && {
            width: `${20 * (1 + (data.ratio || 0))}px`,
            height: `${20 * (1 + (data.ratio || 0))}px`,
            animationDuration: `${2 / (1 + (data.ratio || 0))}s`,
            animationDelay: `${(data.ratio || 0) * 1000}ms`,
          }),
          ...(data.cured_coord && {
            left: `${data.cured_coord.lon}%`,
            top: `${data.cured_coord.lat}%`,
          }),
          transformOrigin: "center",
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      />
      {showTooltip && isActive && data.pop && (
        <span
          className="absolute z-10 px-2 py-1 text-xs font-semibold bg-background-neutral-strong text-foreground-neutral rounded pointer-events-none whitespace-nowrap"
          style={{
            left: `${data.cured_coord.lon}%`,
            top: `${data.cured_coord.lat}%`,
            transform: "translate(-50%, -150%)",
          }}
        >
          {data.pop}
        </span>
      )}
    </>
  );
}

export function WorldMap() {
  const dataPoints = useRef<DataPoint[]>([]);
  const [points, setPoints] = useState<DataPoint[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/worldmap");
        if (!response.ok) return;
        const data: DataPoint[] = await response.json();
        dataPoints.current = data;
        setPoints(data);
      } catch {
        // silently fail
      }
    };

    fetchData();
    const timer = setInterval(fetchData, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-[1056px] mx-auto">
      {/* Map container */}
      <div className="relative mt-12 px-[5px] pb-[6%] pt-[2%] md:pb-[90px] md:pt-[25px]">
        {points.map((data, idx) => (
          <Marker key={idx} data={data} />
        ))}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/illustrations/world-map/map.svg"
          width={1036}
          height={609}
          alt="World map"
          className="w-full h-auto translate-x-[5px]"
        />

        {/* Legend */}
        <div className="absolute grid grid-cols-[repeat(4,auto)] gap-4 text-[10px] text-foreground-neutral-weak border border-stroke-neutral rounded-lg px-2.5 py-1.5 w-max -bottom-11 left-1/2 -translate-x-1/2 md:grid-cols-[auto_1fr] md:row-gap-0.5 md:col-gap-1.5 md:mb-[5%] md:bottom-0 md:left-0 md:translate-x-0 lg:mb-[84px]">
          <span className="size-2.5 rounded-full bg-[#71E8DF99] border border-[#B7F4EE] shadow-[0_0_10px_0_#71E8DF99] self-center" />
          <span className="self-center">Active Point of Presence</span>
          <span className="size-2.5 rounded-full bg-[rgba(113,128,150,1)] border border-stroke-neutral self-center" />
          <span className="self-center">Inactive Point of Presence</span>
        </div>
      </div>
    </div>
  );
}
