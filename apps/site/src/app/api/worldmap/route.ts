import { NextResponse } from "next/server";
import { airports } from "@/data/airports-code";

const ACCELERATE_ANALYTICS =
  "https://accelerate-analytics-exporter.prisma-data.net/livemap-data";

function transformCoordinates(coordinates: { lat: number; lon: number }) {
  let temp_lon = coordinates.lon;
  if (coordinates.lon > 0 || coordinates.lon < 0) {
    temp_lon = temp_lon + 180;
  } else temp_lon = 180;
  temp_lon = (temp_lon * 100) / 360;

  let temp_lat = coordinates.lat;
  if (coordinates.lat > 0 || coordinates.lat < 0) {
    temp_lat = temp_lat * -1 + 90;
  } else temp_lat = 90;
  temp_lat = (temp_lat * 100) / 180;

  return {
    lon: Number(temp_lon.toFixed(2)),
    lat: Number(temp_lat.toFixed(2)),
  };
}

export async function GET() {
  try {
    const response = await fetch(ACCELERATE_ANALYTICS);

    if (!response.ok) {
      return NextResponse.json(
        { message: "Error fetching analytics" },
        { status: response.status },
      );
    }

    const data: Array<{ pop: string; ratio: number }> = await response.json();

    const cured_data = data
      .filter((pop) => !!pop.pop)
      .map((pop) => {
        const airport = airports.find((a) => a.pop === pop.pop);
        if (!airport) return null;
        return {
          ...pop,
          cured_coord: transformCoordinates(airport.coordinates),
        };
      })
      .filter(Boolean);

    const cured_airport_data = airports.map((airport) => {
      const active = cured_data.find((d) => d?.pop === airport.pop);
      return {
        pop: airport.pop,
        cured_coord: transformCoordinates(airport.coordinates),
        ...(active && { ratio: active.ratio }),
      };
    });

    return NextResponse.json(cured_airport_data, {
      headers: {
        "Cache-Control": "s-maxage=86400, stale-while-revalidate=59",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
