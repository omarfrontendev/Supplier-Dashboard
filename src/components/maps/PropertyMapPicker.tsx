import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface PropertyMapPickerProps {
  latitude: number | null;
  longitude: number | null;
  countryCode?: string | null;
  city?: string | null;
  onLocationChange: (latitude: number, longitude: number) => void;
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  boundingbox?: [string, string, string, string];
}

const DEFAULT_POSITION: [number, number] = [24.7136, 46.6753];

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapUpdater({
  position,
  zoom,
}: {
  position: [number, number];
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, zoom);
  }, [map, position, zoom]);

  return null;
}

function MapClickHandler({
  onLocationChange,
}: {
  onLocationChange: (latitude: number, longitude: number) => void;
}) {
  useMapEvents({
    click(event) {
      onLocationChange(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

export default function PropertyMapPicker({
  latitude,
  longitude,
  countryCode,
  city,
  onLocationChange,
}: PropertyMapPickerProps) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const hasLocation = latitude != null && longitude != null;

  const [mapPosition, setMapPosition] =
    useState<[number, number]>(DEFAULT_POSITION);

  // Keep the map center separate from the hotel's saved coordinates.
  const position: [number, number] = hasLocation
    ? [latitude, longitude]
    : mapPosition;

  // Center the map when the selected city or country changes.
  useEffect(() => {
    const normalizedCity = city?.trim();
    const normalizedCountryCode = countryCode?.trim().toLowerCase();

    if (!normalizedCity && !normalizedCountryCode) {
      if (!hasLocation) {
        setMapPosition(DEFAULT_POSITION);
      }
      return;
    }

    const controller = new AbortController();

    const centerMap = async () => {
      try {
        const params = new URLSearchParams({
          format: "jsonv2",
          limit: "1",
          addressdetails: "1",
        });

        if (normalizedCity) {
          params.set(
            "q",
            [normalizedCity, countryCode?.trim()]
              .filter(Boolean)
              .join(", "),
          );
        } else {
          params.set("countrycodes", normalizedCountryCode!);
        }

        if (normalizedCountryCode) {
          params.set("countrycodes", normalizedCountryCode);
        }

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?${params.toString()}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Unable to locate the selected city or country.");
        }

        const data: SearchResult[] = await response.json();

        if (!data.length) {
          console.warn("No location found for:", {
            city: normalizedCity,
            countryCode: normalizedCountryCode,
          });
          return;
        }

        const result = data[0];
        const lat = Number(result.lat);
        const lng = Number(result.lon);

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          return;
        }

        setMapPosition([lat, lng]);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        console.error("Failed to center map:", error);
      }
    };

    void centerMap();

    return () => controller.abort();
  }, [city, countryCode, hasLocation]);

  const searchPlaces = async () => {
    const query = search.trim();

    if (!query) return;

    setIsSearching(true);
    setSearchError("");
    setResults([]);

    try {
      const params = new URLSearchParams({
        q: query,
        format: "jsonv2",
        limit: "5",
        addressdetails: "1",
      });

      if (countryCode?.trim()) {
        params.set("countrycodes", countryCode.trim().toLowerCase());
      }

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      );

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      const data: SearchResult[] = await response.json();

      setResults(data);

      if (data.length === 0) {
        setSearchError("No locations found.");
      }
    } catch {
      setSearchError("Unable to search locations. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const selectResult = (result: SearchResult) => {
    const lat = Number(result.lat);
    const lng = Number(result.lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    setMapPosition([lat, lng]);
    onLocationChange(lat, lng);
    setSearch(result.display_name);
    setResults([]);
    setSearchError("");
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setMapPosition([lat, lng]);
    onLocationChange(lat, lng);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void searchPlaces();
            }
          }}
          placeholder="Search hotel, city, or address..."
          className="w-full"
        />

        <Button
          type="button"
          onClick={() => void searchPlaces()}
          disabled={isSearching || !search.trim()}
        >
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </div>

      {searchError && (
        <p className="text-sm text-destructive">{searchError}</p>
      )}

      {results.length > 0 && (
        <ul className="max-h-48 overflow-y-auto rounded-lg border border-border-default bg-background">
          {results.map((result, index) => (
            <li key={`${result.lat}-${result.lon}-${index}`}>
              <button
                type="button"
                onClick={() => selectResult(result)}
                className="w-full border-b border-border-default px-3 py-3 text-start text-sm last:border-b-0 hover:bg-surface-subtle"
              >
                {result.display_name}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="h-80 overflow-hidden rounded-xl border border-border-default">
        <MapContainer
          center={position}
          zoom={hasLocation ? 14 : city ? 12 : 5}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapUpdater
            position={position}
            zoom={hasLocation ? 14 : city ? 12 : 5}
          />

          <MapClickHandler onLocationChange={handleLocationChange} />

          {hasLocation && (
            <Marker
              position={[latitude, longitude]}
              icon={markerIcon}
              draggable
              eventHandlers={{
                dragend(event) {
                  const marker = event.target as L.Marker;
                  const point = marker.getLatLng();

                  handleLocationChange(point.lat, point.lng);
                },
              }}
            />
          )}
        </MapContainer>
      </div>

      <p className="text-sm text-text-muted">
        Search for a place or click on the map to select the hotel location.
        You can also drag the marker to adjust the position.
      </p>
    </div>
  );
}