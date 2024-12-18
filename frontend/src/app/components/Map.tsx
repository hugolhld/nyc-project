'use client';

import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/styles';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

const ZoomToMarker: React.FC<{ position: L.LatLngExpression }> = ({ position }) => {
  const map = useMap();

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
    <Marker position={position} icon={icon} eventHandlers={{ click: zoomToPosition }}>
      <Popup>Je suis un marker !</Popup>
    </Marker>
  );
};

export default function MapComponent() {
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.006]); // NYC par défaut
  const [mapMarkers, setMapMarkers] = useState<[number, number][]>([]);

  const { enqueueSnackbar } = useSnackbar();
  const [isRequestInProgress, setIsRequestInProgress] = useState(false);

  const mapRef = useRef(null);
  const query = useSearchParams();

  useEffect(() => {
    // Fonction pour gérer la requête périodique
    const fetchRouteData = () => {
      if (isRequestInProgress) return; // Eviter les requêtes simultanées
      setIsRequestInProgress(true);

      fetch('/api/postgres/route?random=true', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
        .then((response) => response.json())
        .then(() => {
          console.log('New data added');
        })
        .catch((error) => console.error('Error during request:', error))
        .finally(() => setIsRequestInProgress(false));
    };

    const intervalId = setInterval(fetchRouteData, 10_000); // Exécuter toutes les 10 secondes

    // Nettoyage lors du démontage
    return () => clearInterval(intervalId);
  }, [isRequestInProgress]);

  useEffect(() => {
    // Effectuer la requête pour obtenir les données de la carte
    const fetchMarkers = () => {
      fetch(`/api/postgres/route${query ? `?${query}` : ''}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.data) {
            const markers = data.data.map((point: any) => [point.latitude, point.longitude]);
            setMapMarkers(markers);
          }
        })
        .catch((error) => console.error('Error fetching markers:', error));
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

    socket.on('message', (message: string) => {
      console.log(message);
    });

    socket.on('new_arrest', (data: any) => {
      console.log('Nouvelle arrestation:', data);
      setMapMarkers((prevMarkers) => [...prevMarkers, [data.latitude, data.longitude]]);
      enqueueSnackbar('Nouvelle arrestation !', { variant: 'success' });
    });

    socket.on('disconnect', () => {
      console.log('Déconnecté du serveur Socket.IO');
    });

    // Nettoyage des événements Socket.IO
    return () => {
      socket.off('connect');
      socket.off('message');
      socket.off('new_arrest');
      socket.off('disconnect');
    };
  }, [enqueueSnackbar]);

  return (
    <>
      <button onClick={() => enqueueSnackbar('click', { variant: 'success' })}>click</button>
      <MapContainer ref={mapRef} center={mapCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}`}
          id="mapbox/streets-v11"
          accessToken="pk.eyJ1IjoiaHVnb2xobGQiLCJhIjoiY2x2NTA2bHphMGJ4cjJxbzlyNjN6ZTF5YyJ9.zeBXs_6aXxSALqh5O768eg"
        />

        <MarkerClusterGroup>
          {mapMarkers.length > 0 &&
            mapMarkers.map((marker, index) => <ZoomToMarker key={index} position={marker} />)}
        </MarkerClusterGroup>
      </MapContainer>
    </>
  );
}
