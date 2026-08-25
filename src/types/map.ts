import type L from 'leaflet';

export type LatLngTuple = [number, number];

export interface Shape {
  id: number;
  type: 'polygon' | 'rectangle' | 'polyline' | 'marker';
  coords: L.LatLng[] | LatLngTuple[];
}
