import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, FeatureGroup, Polygon, useMap } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { FeatureGroup as LeafletFeatureGroup } from 'leaflet';
import { Search } from 'lucide-react';
import L from 'leaflet';
import * as turf from "@turf/turf";
import type { DrawEvents } from "leaflet";
import { useTranslation } from 'react-i18next';



; (window as any).L = L;

import type { Shape, LatLngTuple } from '@/types/map';

import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-geometryutil';

import 'leaflet-fullscreen';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';

/* ================= Helper Components ================= */

const isPointInsideBoundary = (
    point: L.LatLng,
    boundaryCoords?: L.LatLng[]
) => {
    if (!boundaryCoords || boundaryCoords.length < 3) return true;

    const pt = turf.point([point.lng, point.lat]);

    const ring = boundaryCoords.map(c => [c.lng, c.lat]);

    const first = ring[0];
    const last = ring[ring.length - 1];

    const closedRing =
        first[0] === last[0] && first[1] === last[1]
            ? ring
            : [...ring, first];

    const poly = turf.polygon([closedRing]);

    return turf.booleanPointInPolygon(pt, poly);
};

function FullscreenControl() {
    const map = useMap();

    useEffect(() => {
        if (!(L as any).control?.fullscreen) return;

        const control = (L as any).control.fullscreen({
            position: 'topright',
        });

        map.addControl(control);

        return () => {
            map.removeControl(control);
        };
    }, [map]);

    return null;
}

interface FlyToLocationProps {
    position: LatLngTuple | null;
}

function FlyToLocation({ position }: FlyToLocationProps) {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.flyTo(position, 8, { duration: 2 });
        }
    }, [position, map]);

    return null;
}

interface FlyToPolygonProps {
    shapes: Shape[];
}

function FlyToPolygon({ shapes }: FlyToPolygonProps) {
    const map = useMap();

    useEffect(() => {
        if (shapes?.length > 0) {
            const firstShape = shapes[0];
            if (firstShape.type === 'polygon' && firstShape.coords?.length > 0) {
                const bounds = L.latLngBounds(firstShape.coords as L.LatLng[]);
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, [map, shapes]);

    return null;
}

interface FlyToBoundaryProps {
    coords: L.LatLng[];
}

function FlyToBoundary({ coords }: FlyToBoundaryProps) {
    const map = useMap();

    useEffect(() => {
        if (!coords || coords.length < 3) return;

        const bounds = L.latLngBounds(coords);

        // 👇 يظبط الزوم والمكان
        map.fitBounds(bounds, {
            padding: [40, 40],
            animate: true,
        });

        // 👇 يمنع الخروج برا المنطقة
        map.setMaxBounds(bounds);
        map.setMinZoom(map.getBoundsZoom(bounds));

    }, [coords, map]);

    return null;
}


/* ================= Search Box ================= */

interface SearchBoxProps {
    onSelect: (position: LatLngTuple) => void;
}

interface NominatimResult {
    place_id: number;
    lat: string;
    lon: string;
    display_name: string;
}

function SearchBox({ onSelect }: SearchBoxProps) {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<NominatimResult[]>([]);

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length < 2) {
            setResults([]);
            return;
        }

        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    query
                )}&addressdetails=1&limit=5`
            );
            const data: NominatimResult[] = await res.json();
            setResults(data);
        } catch (err) {
            console.error('Search error:', err);
        }
    };

    const handleSelect = (lat: string, lon: string, name: string) => {
        onSelect([parseFloat(lat), parseFloat(lon)]);
        setSearchQuery(name);
        setResults([]);
    };

    return (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[1000] w-[320px] bg-white rounded-xl shadow-lg p-2">
            <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 px-3 py-2">
                <Search size={18} className="text-gray-500" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder={t("map.searchPlaceholder")}
                    className="flex-1 ml-2 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                />
            </div>

            {results.length > 0 && (
                <ul className="mt-2 border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                    {results.map((place) => (
                        <li
                            key={place.place_id}
                            onClick={() =>
                                handleSelect(place.lat, place.lon, place.display_name)
                            }
                            className="px-3 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 border-b last:border-b-0"
                        >
                            {place.display_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

/* ================= Map Editor ================= */

interface MapEditorProps {
    shapes: Shape[];
    setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
    selectedCoords?: L.LatLng[];

}


export function MapEditor({
    shapes = [],
    setShapes,
    selectedCoords,
}: MapEditorProps) {
    const { t } = useTranslation();
    const [flyTo, setFlyTo] = useState<LatLngTuple | null>(null);
    const [, setArea] = useState<number>(0);
    const [, setPerimeter] = useState<number>(0);

    const featureGroupRef = useRef<LeafletFeatureGroup | null>(null);


    /* 🧮 Calculate Area & Perimeter */
    const calculateMetrics = (latLngs: L.LatLng[]) => {
        if (!latLngs || latLngs.length < 3) return;

        const areaValue = (L as any).GeometryUtil.geodesicArea(latLngs);
        const perimeterValue = (L as any).GeometryUtil.length(L.polyline(latLngs));

        setArea(areaValue);
        setPerimeter(perimeterValue);
    };

    /* 🟢 Created */
    const handleCreated = (e: DrawEvents.Created) => {
        const { layerType, layer }: any = e;
        if (layerType !== 'polygon') return;

        const coords = layer?.getLatLngs()[0] as L.LatLng[];

        const isValid = coords.every(coord =>
            isPointInsideBoundary(coord, selectedCoords)
        );

        if (!isValid) {
            alert(t("map.polygonBoundaryError"));
            layer.remove(); // 🔥 يمنع الرسم فورًا
            return;
        }

        const fg = featureGroupRef.current;
        fg?.clearLayers();

        const shapeData: Shape = {
            id: Date.now(),
            type: layerType,
            coords,
        };

        layer.addTo(fg!);
        setShapes([shapeData]);
        calculateMetrics(coords);
    };

    /* 🟡 Edited */
    const handleEdited = () => {
        const fg = featureGroupRef.current;
        const layers = fg ? (fg.getLayers() as any[]) : [];

        const updatedShapes: Shape[] = [];

        for (const layer of layers) {
            const coords = layer.getLatLngs()[0] as L.LatLng[];

            const isValid = coords.every(coord =>
                isPointInsideBoundary(coord, selectedCoords)
            );

            if (!isValid) {
                alert(t("map.editedPolygonBoundaryError"));
                return;
            }

            updatedShapes.push({
                id: layer._leaflet_id,
                type: 'polygon',
                coords,
            });
        }

        setShapes(updatedShapes);
        calculateMetrics(updatedShapes[0].coords as L.LatLng[]);
    };


    /* 🔴 Deleted */
    const handleDeleted = () => {
        setShapes([]);
        setArea(0);
        setPerimeter(0);
    };

    useEffect(() => {
        if (shapes.length > 0 && shapes[0]?.coords?.length > 2) {
            calculateMetrics(shapes[0].coords as L.LatLng[]);
        }
    }, [shapes]);

    return (
        <div className="relative w-full h-full">
            <MapContainer
                center={[24.4539, 54.3773]}
                zoom={6}
                className="w-full h-full"
            >
                <FullscreenControl />

                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />

                <SearchBox onSelect={setFlyTo} />
                <FlyToLocation position={flyTo} />
                <FlyToPolygon shapes={shapes} />

                {selectedCoords?.length > 2 && (
                    <FlyToBoundary coords={selectedCoords} />
                )}

                {selectedCoords?.length > 2 && (
                    <Polygon
                        positions={selectedCoords}
                        pathOptions={{
                            color: 'blue',
                            weight: 2,
                            fillOpacity: 0.1,
                            dashArray: '6,4',
                        }}
                    />
                )}

                <FeatureGroup ref={featureGroupRef}>
                    {shapes.map(
                        (shape, i) =>
                            shape.type === 'polygon' && (
                                <Polygon key={i} positions={shape.coords as any} />
                            )
                    )}

                    <EditControl
                        position="topright"
                        onCreated={handleCreated}
                        onEdited={handleEdited}
                        onDeleted={handleDeleted}
                        draw={{
                            polygon: true,
                            rectangle: false,
                            circle: false,
                            circlemarker: false,
                            polyline: false,
                            marker: false,
                        }}
                    />
                </FeatureGroup>
            </MapContainer>

        </div>
    );
}
