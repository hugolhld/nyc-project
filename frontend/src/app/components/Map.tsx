'use client'; // Utilise le client-side rendering pour Leaflet

import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { IoLocationSharp } from "react-icons/io5";
import { renderToString } from 'react-dom/server';
import { useSearchParams } from 'next/navigation';

const LocationIconComponent = () => {
    return (
        <div className=' h-full flex justify-center items-center'>
            <IoLocationSharp color='red' />
        </div>
    );
}

const ZoomToMarker: React.FC<{ position: L.LatLngExpression }> = ({ position }) => {
    const map = useMap();

    const zoomToPosition = () => {
        map.setView(position, 20, { animate: true });
    };

    const locationIcon = renderToString(<LocationIconComponent />);

    const icon = L.divIcon({
        html: locationIcon,
        className: '',
        iconSize: [100, 100],
        iconAnchor: [50, 50],
        popupAnchor: [0, -25],
    });

    return (
        <Marker
            position={position}
            icon={icon}
            eventHandlers={{
                click: () => {
                    zoomToPosition();
                },
            }}
        >
            <Popup>Je suis un marker !</Popup>
        </Marker>
    );
};


export default function MapComponent() {
    const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.006]); // NYC par défaut
    const [mapMarkers, setMapMarkers] = useState<[number, number][]>([]);

    const locationIcon = renderToString(<LocationIconComponent />);

    const query = useSearchParams();

    console.log(query)

    const DefaultIcon = L.divIcon({
        html: locationIcon,
        className: '',
        iconSize: [50, 50],
        iconAnchor: [25, 25],
        popupAnchor: [0, -25],
    });

    L.Marker.prototype.options.icon = DefaultIcon;

    console.log(query)

    useEffect(() => {
        fetch(`/api/postgres/route${query ? `?${query}` : ''}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data.data.length)
                if (data.data) {
                    const markers = data.data.map((arrest: any) => {
                        // console.log(arrest)
                        return [arrest.latitude, arrest.longitude];
                    });
                    setMapMarkers(markers);
                }
            });
    }, [query]);

    return (
        <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%' }}>

            <TileLayer
                url={`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}`}
                // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                id='mapbox/streets-v11'
                accessToken='pk.eyJ1IjoiaHVnb2xobGQiLCJhIjoiY2x2NTA2bHphMGJ4cjJxbzlyNjN6ZTF5YyJ9.zeBXs_6aXxSALqh5O768eg'
            />

            <Marker position={mapCenter}>
                <Popup>Bienvenue à New York !</Popup>
            </Marker>

            {
                mapMarkers.length > 0 && mapMarkers.map((marker, index) => {
                    return <ZoomToMarker key={index} position={marker} />
                })
            }

        </MapContainer>
    );
}
