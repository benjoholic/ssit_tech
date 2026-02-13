"use client";

import Map from "react-map-gl/mapbox";
import { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

const DEFAULT_CENTER = { longitude: 120.9842, latitude: 14.5995 };
const DEFAULT_ZOOM = 14;

type LocationMapProps = {
  /** Longitude of the infrastructure / office location */
  longitude?: number;
  /** Latitude of the infrastructure / office location */
  latitude?: number;
  /** Mapbox access token (or set NEXT_PUBLIC_MAPBOX_TOKEN in .env.local) */
  accessToken?: string;
  className?: string;
};

export function LocationMap({
  longitude = DEFAULT_CENTER.longitude,
  latitude = DEFAULT_CENTER.latitude,
  accessToken,
  className = "",
}: LocationMapProps) {
  const token =
    accessToken ??
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN ??
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  if (!token) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-600 ${className}`}
        style={{ minHeight: 320 }}
      >
        <p className="text-center text-sm">
          Add <code className="rounded bg-zinc-200 px-1.5 py-0.5">NEXT_PUBLIC_MAPBOX_TOKEN</code> or{" "}
          <code className="rounded bg-zinc-200 px-1.5 py-0.5">NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code> to{" "}
          <code className="rounded bg-zinc-200 px-1.5 py-0.5">.env.local</code> to show the map.
        </p>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-xl border border-zinc-200 ${className}`} style={{ minHeight: 320 }}>
      <Map
        mapboxAccessToken={token}
        initialViewState={{
          longitude,
          latitude,
          zoom: DEFAULT_ZOOM,
        }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        style={{ width: "100%", height: 320 }}
        attributionControl={true}
      >
        <Marker longitude={longitude} latitude={latitude} anchor="bottom">
          <div
            className="h-8 w-8 rounded-full border-2 border-white bg-zinc-800 shadow-md"
            aria-hidden
          />
        </Marker>
      </Map>
    </div>
  );
}
