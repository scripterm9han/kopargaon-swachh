/**
 * LeafletMapTemplate.tsx
 * Reference implementation for this app's map screens.
 * Covers: glass-card container, custom pin icons per marker type,
 * flyTo panning, and a pin-drop handler for user-reported locations.
 *
 * Assumes: react-leaflet, leaflet already installed.
 */

import { useRef, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";

// ---- Coordinate shape used everywhere in app state (object, not tuple) ----
export interface LatLng {
  lat: number;
  lng: number;
}

export type PinType = "bin" | "recyclingCenter" | "userReport";

export interface MapPin {
  id: string;
  type: PinType;
  position: LatLng;
  label: string;
  fillLevel?: number; // 0-100, only relevant for "bin"
}

// ---- Custom icons per pin type (never use default Leaflet blue marker) ----
const pinIcon = (type: PinType) => {
  const colorByType: Record<PinType, string> = {
    bin: "#22C55E",
    recyclingCenter: "#8B5CF6",
    userReport: "#F59E0B",
  };

  return L.divIcon({
    className: "custom-pin",
    html: `
      <div style="
        width: 28px; height: 28px; border-radius: 50%;
        background: ${colorByType[type]};
        border: 2px solid rgba(255,255,255,0.85);
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      "></div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

// ---- Panning: flyTo for user-triggered navigation, not instant setView ----
export function FlyToPin({ target }: { target: LatLng | null }) {
  const map = useMap();
  if (target) {
    map.flyTo([target.lat, target.lng], 15, { duration: 1.0 });
  }
  return null;
}

// ---- Pin-drop handler for "report a location" flows ----
function PinDropHandler({ onDrop }: { onDrop: (pos: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onDrop({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

interface AppMapProps {
  pins: MapPin[];
  center: LatLng;
  flyToTarget?: LatLng | null;
  allowPinDrop?: boolean;
  onPinDrop?: (pos: LatLng) => void;
}

export default function AppMap({
  pins,
  center,
  flyToTarget = null,
  allowPinDrop = false,
  onPinDrop,
}: AppMapProps) {
  const mapRef = useRef<L.Map | null>(null);

  const handleDrop = useCallback(
    (pos: LatLng) => {
      onPinDrop?.(pos);
    },
    [onPinDrop]
  );

  return (
    // Map always lives inside a glass-card frame — see design_system_tokens.json
    // for the exact radius/border values this class maps to.
    <div className="glass-card overflow-hidden h-[420px] w-full">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          // Swap for the app's chosen tile provider; keep a dark-matching style
          // (e.g. CartoDB dark_all) so the map doesn't clash with the dark theme.
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap contributors &copy; CARTO"
        />

        {pins.map((pin) => (
          <Marker
            key={pin.id}
            position={[pin.position.lat, pin.position.lng]}
            icon={pinIcon(pin.type)}
          >
            <Popup>
              <div>
                <strong>{pin.label}</strong>
                {pin.type === "bin" && pin.fillLevel !== undefined && (
                  <div>Fill level: {pin.fillLevel}%</div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {allowPinDrop && <PinDropHandler onDrop={handleDrop} />}
        <FlyToPin target={flyToTarget} />
      </MapContainer>
    </div>
  );
}
