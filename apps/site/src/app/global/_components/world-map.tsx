"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type DataPoint = {
  pop: string;
  ratio?: number;
  cured_coord: { lon: number; lat: number };
};

function Marker({ data }: { data: DataPoint }) {
  const markerRef = useRef<HTMLSpanElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const isActive = Boolean(data.ratio);

  return (
    <>
      <span
        ref={markerRef}
        className={cn(
          "absolute -translate-x-1/2 -translate-y-1/2 rounded-full z-1",
          isActive
            ? "bg-[#71E8DF99] border border-[#B7F4EE] animate-[pulsate_2s_ease-in-out_infinite] shadow-[0_0_28px_0_#71E8DF99]"
            : "size-[10px] bg-[rgba(113,128,150,1)] border border-[rgba(113,128,150,0.5)]",
        )}
        style={{
          ...(isActive && {
            width: `${20 * (1 + (data.ratio || 0))}px`,
            height: `${20 * (1 + (data.ratio || 0))}px`,
          }),
          ...(data.cured_coord && {
            left: `${data.cured_coord.lon}%`,
            top: `${data.cured_coord.lat}%`,
          }),
          ...(isActive && {
            animationDuration: `${2 / (1 + (data.ratio || 0))}s`,
            animationDelay: `${(data.ratio || 0) * 1000}ms`,
          }),
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      />
      {showTooltip && isActive && data.pop && markerRef.current && (
        <span
          className="absolute z-10 px-2 py-1 text-xs font-semibold bg-background-neutral-strong text-foreground-neutral rounded -translate-x-1/2 pointer-events-none"
          style={{
            left: `${data.cured_coord.lon}%`,
            top: `calc(${data.cured_coord.lat}% - 24px)`,
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
    <div className="relative w-full max-w-[1036px] mx-auto">
      <div className="relative">
        {points.map((data, idx) => (
          <Marker key={idx} data={data} />
        ))}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/illustrations/world-map/map.svg"
          width={1036}
          height={609}
          alt="World map"
          className="w-full h-auto"
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-[#71E8DF99] border border-[#B7F4EE] shadow-[0_0_10px_0_#71E8DF99]" />
          <span className="text-sm text-foreground-neutral-weak">
            Active Point of Presence
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-[rgba(113,128,150,1)] border border-[rgba(113,128,150,0.5)]" />
          <span className="text-sm text-foreground-neutral-weak">
            Inactive Point of Presence
          </span>
        </div>
      </div>
    </div>
  );
}
