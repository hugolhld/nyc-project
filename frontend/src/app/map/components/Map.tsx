'use client';

import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/styles';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { IoLocationSharp } from "react-icons/io5";
import { renderToString } from 'react-dom/server';
import { useSearchParams } from 'next/navigation';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import io from 'socket.io-client';
import { useSnackbar } from 'notistack';

const LocationIconComponent = () => {
    return (
        <div className='h-full flex justify-center items-center'>
            <IoLocationSharp size={30} color='red' />
        </div>
    );
};

const createCustomIcon = () => {
    const locationIcon = renderToString(<LocationIconComponent />);
    return L.divIcon({
        html: locationIcon,
        className: '',
        iconSize: [50, 50],
        iconAnchor: [25, 25],
        popupAnchor: [0, -25],
    });
};

export default function MapComponent() {
    const [mapMarkers, setMapMarkers] = useState<[number, number][]>([]);
    const { enqueueSnackbar } = useSnackbar();
    const query = useSearchParams();

    useEffect(() => {
        // Fetch périodique
        const fetchRouteData = async () => {
            try {
                await fetch('/api/postgres/route?random=true', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                });
                console.log('New data added');
            } catch (error) {
                console.error('Error during request:', error);
            }
        };

        const intervalId = setInterval(fetchRouteData, 10_000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        // Fetch des marqueurs
        const fetchMarkers = async () => {
            try {
                const response = await fetch(`/api/postgres/route${query ? `?${query}` : ''}`);
                const data = await response.json();
                if (data.data) {
                    const markers = data.data.map((point: [number, number][]) => [point.latitude, point.longitude]);
                    setMapMarkers(markers);
                }
            } catch (error) {
                console.error('Error fetching markers:', error);
            }
        };

        fetchMarkers();
    }, [query]);

    useEffect(() => {
        // Connexion Socket.IO
        const socket = io('http://localhost:3000');

        socket.on('connect', () => {
            console.log('Connecté au serveur Socket.IO');
            socket.emit('message', 'Hello from the client!');
        });

        socket.on('new_arrest', (data: object) => {
            console.log('Nouvelle arrestation:', data);
            setMapMarkers((prevMarkers) => [...prevMarkers, [data.latitude, data.longitude]]);
            enqueueSnackbar('Nouvelle arrestation !', { variant: 'success' });
        });

        return () => {
            socket.disconnect();
        };
    }, [enqueueSnackbar]);

    return  (
        <MapContainer
            center={[40.7128, -74.006]} // Coordonnées de départ
            zoom={12}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
                id="mapbox/streets-v11"
                accessToken="pk.eyJ1IjoiaHVnb2xobGQiLCJhIjoiY2x2NTA2bHphMGJ4cjJxbzlyNjN6ZTF5YyJ9.zeBXs_6aXxSALqh5O768eg"
            />
            <MarkerClusterGroup>
                {mapMarkers.map((position, index) => (
                    <Marker
                        key={index}
                        position={position}
                        icon={createCustomIcon()}
                    >
                        <Popup>Je suis un marker !</Popup>
                    </Marker>
                ))}
            </MarkerClusterGroup>
        </MapContainer>
    );
}
