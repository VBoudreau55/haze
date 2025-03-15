import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { Typography } from '@mui/material';
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Define the type for coordinates
type Coordinates = [number, number];

const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const customRedDot = new L.DivIcon({
  iconSize: [30, 30], // Size of the red dot
  iconAnchor: [15, 15], // Anchor point of the icon (centered)
  popupAnchor: [0, -15], // Popup position relative to the icon
});

const LocationFinder: React.FC<{ setUserLocation: (coords: Coordinates) => void }> = ({ setUserLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coords: Coordinates = [latitude, longitude];

        // Move map to user's location
        map.setView(coords, 13);
        setUserLocation(coords); // Set user's initial location
      },
      (error) => console.error("Error fetching location:", error),
      { enableHighAccuracy: true }
    );
  }, [map, setUserLocation]);

  return null;
};

const MapEventHandler: React.FC<{ onCenterChange: (coords: Coordinates) => void, setCenterCoords: (coords: Coordinates) => void }> = ({ onCenterChange, setCenterCoords }: { onCenterChange: (coords: Coordinates) => void, setCenterCoords: (coords: Coordinates) => void }) => {
  const map = useMap();

  useEffect(() => {
    const handleMove = () => {
      const newCenter: Coordinates = [map.getCenter().lat, map.getCenter().lng];
      setCenterCoords(newCenter);
      onCenterChange(newCenter); // Pass the updated center coordinates to the parent
    };

    map.on("move", handleMove);
    return () => {
      map.off("move", handleMove);
    };
  }, [map, onCenterChange, setCenterCoords]);

  return null;
};

const Globe: React.FC<{ onCenterChange: (coords: Coordinates) => void }> = ({ onCenterChange }: { onCenterChange: (coords: Coordinates) => void }) => {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [centerCoords, setCenterCoords] = useState<Coordinates | null>(null);
  return (
    <MapContainer center={userLocation || [34.052235, -118.243683]} zoom={5} style={{ height: "50vh", width: "100vh" }}>
      <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEventHandler onCenterChange={onCenterChange} setCenterCoords={setCenterCoords} />
      {userLocation && <Marker position={userLocation} icon={customIcon} />}
      {centerCoords && <Marker position={centerCoords} icon={customRedDot} />}
      <LocationFinder setUserLocation={setUserLocation} />
    </MapContainer>
  );
};

export default Globe;
