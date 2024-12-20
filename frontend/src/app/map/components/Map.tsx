'use client';

import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/styles';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { renderToString } from 'react-dom/server';
import { useSearchParams } from 'next/navigation';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import io from 'socket.io-client';
import { useSnackbar } from 'notistack';
import { MdLocalPolice, MdOutlinePedalBike } from 'react-icons/md';

type MapMarker = {
    arrest_key: number;
    age_group: string;
    arrest_date: Date;
    position: [number, number];
    perp_sex: string;
    ofns_desc: string;
};

interface BikeMarker {
    station_id: number;
    name: string;
    position: [number, number];
    capacity: number;
    lat?: number;
    lon?: number;
}

const LocationIconComponent = () => {
    return (
        <div className='h-full flex justify-center items-center'>
            <MdLocalPolice size={30} color='#112255' />
        </div>
    );
};

const BikeIconComponent = () => {
    return (
        <div className='h-full flex justify-center items-center'>
            <MdOutlinePedalBike size={30} color='#c77e7e' />
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

export default function MapComponent({ dataToDisplay }: { dataToDisplay: string }) {
    const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);
    const [bikesMarkers, setBikesMarkers] = useState<BikeMarker[]>([]);
    const { enqueueSnackbar } = useSnackbar();
    const query = useSearchParams();

    useEffect(() => {
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

        fetch(`/api/markers/getArrests${query ? `?${query}` : ''}`)
            .then((response) => response.json())
            .then(({ data }) => {
                if (data) {
                    const markers = data.map(({ arrest_key, age_group, arrest_date, latitude, longitude, perp_sex, ofns_desc }: MarkerData) => {
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
            })
            .catch((error) => {
                enqueueSnackbar('Erreur lors de la récupération des marqueurs', { variant: 'error' });
                console.error('Error fetching markers:', error);
            });

        fetch(`/api/bikes/getBikes`)
            .then((response) => response.json())
            .then(({ data }) => {
                if (data) {
                    const markers = data.map(({ station_id, name, lat, lon, capacity }: BikeMarker) => {
                        return {
                            station_id,
                            position: [lat, lon],
                            name,
                            capacity
                        }
                    });
                    setBikesMarkers(markers);
                }
            })
            .catch((error) => {
                enqueueSnackbar('Erreur lors de la récupération des marqueurs des vélos', { variant: 'error' });
                console.error('Error fetching markers:', error);
            });
    }, [query, enqueueSnackbar]);

    useEffect(() => {
        const socket = io(`${process.env.NEXT_PUBLIC_HOSTNAME}:${process.env.NEXT_PUBLIC_PORT}`);

        socket.on('connect', () => {
            enqueueSnackbar('Connecté au serveur Socket.IO', { variant: 'success' });
        });

        socket.on('new_arrest', (data: MapMarker) => {
            enqueueSnackbar('Nouvelle arrestation !', { variant: 'success' });

            if (query?.get('ofns_desc') && query.get('ofns_desc') !== data.ofns_desc) return;
            setMapMarkers((prevMarkers) => [...prevMarkers, { arrest_key: data.arrest_key, age_group: data.age_group, arrest_date: new Date(data.arrest_date), position: [data.latitude, data.longitude], perp_sex: data.perp_sex, ofns_desc: data.ofns_desc }]);
        });

        return () => {
            socket.disconnect();
        };
    }, [enqueueSnackbar, query]);

    

    return (
        <MapContainer
            center={[40.7128, -74.006]}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
                id="mapbox/light-v11"
                accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
            />
            <MarkerClusterGroup>
                {dataToDisplay !== 'bikes' && mapMarkers.map(({ arrest_key, age_group, arrest_date, position, perp_sex, ofns_desc }, index) => (
                    <Marker
                        key={index}
                        position={position}
                        icon={createCustomIcon(true)}
                    >
                        <Popup>
                            <div>
                                <h2 className='text-md font-semibold text-center'>Offense #{arrest_key}</h2>
                                <p>Offense type: {ofns_desc}</p>
                                <p>Date: {arrest_date.toUTCString()}</p>
                                <p>Age: {age_group}</p>
                                <p>Gender: {perp_sex}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
                {dataToDisplay !== 'offenses' && bikesMarkers.map(({ station_id, name, position, capacity }: BikeMarker) => (
                    <Marker
                        key={station_id}
                        position={position}
                        icon={createCustomIcon(false)}
                    >
                        <Popup>
                            <div>
                                <h2 className='text-md font-semibold text-center'>Station #{station_id}</h2>
                                <p>Street name: {name}</p>
                                <p>Bike capacity: {capacity}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MarkerClusterGroup>
        </MapContainer>
    );
}
