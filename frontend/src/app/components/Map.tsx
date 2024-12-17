'use client'; // Utilise le client-side rendering pour Leaflet

import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/styles';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { IoLocationSharp } from "react-icons/io5";
import { renderToString } from 'react-dom/server';
import { useSearchParams } from 'next/navigation';
import MarkerClusterGroup from 'react-leaflet-markercluster';

const LocationIconComponent = () => {
    return (
        <div className='h-full flex justify-center items-center'>
            <IoLocationSharp size={30} color='red' />
        </div>
    );
};

// Composant pour zoomer sur le marker
const ZoomToMarker: React.FC<{ position: L.LatLngExpression }> = ({ position }) => {
    const map = useMap(); // Utilise le contexte de la carte

    const zoomToPosition = () => {
        map.setView(position, 20, { animate: true });
    };

    const locationIcon = renderToString(<LocationIconComponent />);

    const icon = L.divIcon({
        html: locationIcon,
        className: '',
        iconSize: [50, 50],
        iconAnchor: [25, 25],
        popupAnchor: [0, -25],
    });

    return (
        <Marker position={position} icon={icon} eventHandlers={{ click: () => zoomToPosition() }}>
            <Popup>Je suis un marker !</Popup>
        </Marker>
    );
};

export default function MapComponent() {
    const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.006]); // NYC par défaut
    const [mapMarkers, setMapMarkers] = useState<[number, number][]>([]);

    const mapRef = useRef(null);

    useEffect(() => {
        console.log(mapRef)
    }, [mapRef]);

    const query = useSearchParams();

    useEffect(() => {
        fetch(`/api/postgres/route${query ? `?${query}` : ''}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.data) {
                    const markers = data.data.map((point: any) => [point.latitude, point.longitude]);
                    setMapMarkers(markers);
                }
            });
    }, [query]);

    return (
        // MapContainer est le parent de tous les composants de la carte
        <MapContainer ref={mapRef} center={mapCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                url={`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}`}
                id="mapbox/streets-v11"
                accessToken="pk.eyJ1IjoiaHVnb2xobGQiLCJhIjoiY2x2NTA2bHphMGJ4cjJxbzlyNjN6ZTF5YyJ9.zeBXs_6aXxSALqh5O768eg"
            />

            <MarkerClusterGroup chunkedLoading>
                {/* Ajoute les marqueurs dans MarkerClusterGroup */}
                {
                    mapMarkers.length > 0 && mapMarkers.map((marker, index) => (
                        <ZoomToMarker key={index} position={marker} />
                    ))
                }
            </MarkerClusterGroup>
        </MapContainer>
    );
}
