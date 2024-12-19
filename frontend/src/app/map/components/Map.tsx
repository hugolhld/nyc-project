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
import { MdOutlinePedalBike } from 'react-icons/md';

const LocationIconComponent = () => {
    return (
        <div className='h-full flex justify-center items-center'>
            <IoLocationSharp size={30} color='red' />
        </div>
    );
};

const BikeIconComponent = () => {
    return (
        <div className='h-full flex justify-center items-center'>
            <MdOutlinePedalBike size={30} color='blue' />
        </div>
    );
}

const createCustomIcon = (isLocation: boolean) => {
    const icon = renderToString(isLocation ? <LocationIconComponent /> : <BikeIconComponent />);
    return L.divIcon({
        html: icon,
        className: '',
        iconSize: [50, 50],
        iconAnchor: [25, 25],
        popupAnchor: [0, -25],
    });
};

export default function MapComponent() {
    const [mapMarkers, setMapMarkers] = useState<[number, number][]>([]);
    const [bikesMarkers, setBikesMarkers] = useState<[number, number][]>([]);
    const { enqueueSnackbar } = useSnackbar();
    const query = useSearchParams();

    useEffect(() => {
        // Fetch périodique
        const fetchRouteData = async () => {
            try {
                await fetch('/api/markers/addRandomArrests', {
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

        type MarkerData = {
            arrest_key: number;
            age_group: string;
            arrest_date: Date;
            latitude: number;
            longitude: number;
            perp_sex: string;
            ofns_desc: string;
        };

        const fetchMarkers = async () => {
            try {
                const response = await fetch(`/api/markers/getArrests${query ? `?${query}` : ''}`);
                const { data } = await response.json();
                if (data) {
                    console.log(data)
                    const markers = data.map(({ arrest_key, age_group, arrest_date, latitude, longitude, perp_sex, ofns_desc }: MarkerData) => {
                        console.log(new Date(arrest_date))
                        return {
                            arrest_key,
                            position: [latitude, longitude],
                            age_group,
                            arrest_date: new Date(arrest_date),
                            perp_sex,
                            ofns_desc,
                        }
                    });
                    setMapMarkers(markers);
                }
            } catch (error) {
                enqueueSnackbar('Erreur lors de la récupération des marqueurs', { variant: 'error' });
                console.error('Error fetching markers:', error);
            }
        };

        const fetchBikes = async () => {
            try {
                const response = await fetch(`/api/bikes/getBikes`);
                const { data } = await response.json();
                if (data) {
                    console.log(data)
                    const markers = data.map(({ id, name, lat, lon }: { id: number, name: string, lat: number, lon: number }) => {
                        return {
                            id,
                            position: [lat, lon],
                            name,
                        }
                    });
                    setBikesMarkers(markers);
                }
            } catch (error) {
                enqueueSnackbar('Erreur lors de la récupération des marqueurs des vélos', { variant: 'error' });
                console.error('Error fetching markers:', error);
            }
        }

        fetchMarkers();
        fetchBikes();
    }, [query, enqueueSnackbar]);

    useEffect(() => {
        // Connexion Socket.IO
        const socket = io('http://localhost:3000');

        socket.on('connect', () => {
            console.log('Connecté au serveur Socket.IO');
            socket.emit('message', 'Hello from the client!');
            enqueueSnackbar('Connecté au serveur Socket.IO', { variant: 'success' });
        });

        socket.on('new_arrest', (data: object) => {
            setMapMarkers((prevMarkers) => [...prevMarkers, { arrest_key: data.arrest_key, age_group: data.age_group, arrest_date: new Date(data.arrest_date), position: [data.latitude, data.longitude], perp_sex: data.perp_sex, ofns_desc: data.ofns_desc }]);
            enqueueSnackbar('Nouvelle arrestation !', { variant: 'success' });
        });

        return () => {
            socket.disconnect();
        };
    }, [enqueueSnackbar]);

    type MapMarker = {
        arrest_key: number;
        age_group: string;
        arrest_date: Date;
        position: [number, number];
        perp_sex: string;
        ofns_desc: string;
    };

    return (
        <MapContainer
            center={[40.7128, -74.006]}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
                id="mapbox/streets-v11"
                accessToken="pk.eyJ1IjoiaHVnb2xobGQiLCJhIjoiY2x2NTA2bHphMGJ4cjJxbzlyNjN6ZTF5YyJ9.zeBXs_6aXxSALqh5O768eg"
            />
            <MarkerClusterGroup>
                {mapMarkers.map(({ arrest_key, age_group, arrest_date, position, perp_sex, ofns_desc }, index) => (
                    <Marker
                        key={index}
                        position={position}
                        icon={createCustomIcon(true)}
                    >
                        <Popup>
                            <div>
                                <h2 className='text-md font-semibold text-center'>Arrestation #{arrest_key}</h2>
                                <p>Offenses: {ofns_desc}</p>
                                <p>Date: {arrest_date.toUTCString()}</p>
                                <p>Age: {age_group}</p>
                                <p>Sex: {perp_sex}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
               {bikesMarkers.map(({ id, name, position }, index) => (
                    <Marker
                        key={index}
                        position={position}
                        icon={createCustomIcon(false)}
                    >
                        <Popup>
                            <div>
                                <h2 className='text-md font-semibold text-center'>Vélo #{id}</h2>
                                <p>Nom: {name}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MarkerClusterGroup>
        </MapContainer>
    );
}
