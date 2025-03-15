import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, Popup } from "react-leaflet";
import Typography from '@mui/material/Typography';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import flameIcon from '../assets/fire-icon-png-25.jpg';

// Define the type for coordinates
type Coordinates = [number, number];

const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const LocationFinder: React.FC<{ setUserLocation: (coords: Coordinates) => void }> = ({ setUserLocation }: { setUserLocation: (coords: Coordinates) => void }) => {
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

const sensorIcon = new L.Icon({
  iconUrl: "https://vectorified.com/images/sensor-icon-png-21.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const fireIcon = new L.Icon({
  iconUrl: "https://icon-library.com/images/fire-icon-png/fire-icon-png-25.jpg",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const FireMarker: React.FC<{ data: any }> = ({ data }: { data: any }) => {
  return <Marker position={[data.latitude,data.longitude]} icon={fireIcon} >
        <Popup>
            <Typography variant="h6">Fire Details:</Typography>
            <Typography variant="body1">Latitude: {data.latitude}</Typography>
            <Typography variant="body1">Longitude: {data.longitude}</Typography>
            <Typography variant="body1">Brightness: {data.brightness}</Typography>
            <Typography variant="body1">Fire Radiative Power: {data.frp}</Typography>
            <Typography variant="body1">Brightness temperature I-5: {data.bright_ti5}</Typography>
        </Popup>
    </Marker>;
};

const SensorMarker: React.FC<{ data: any }> = ({ data }: { data: any }) => {
  return <Marker position={[data.lat,data.long]} icon={sensorIcon}>
        <Popup>
            <Typography variant="h6">Sensor Details:</Typography>
            <Typography variant="body1">Latitude: {data.lat}</Typography>
            <Typography variant="body1">Longitude: {data.long}</Typography>
            <Typography variant="body1">id: {data.id}</Typography>
            <Typography variant="body1">Avg pm25: {data.avg}</Typography>
          </Popup>
    </Marker>;
};

const Globe: React.FC<{ 
  onCenterChange: (coords: Coordinates) => void,
  sensorMarkers: any[],
  fireMarkers: any[],
  loading: boolean
}> = ({ onCenterChange, sensorMarkers, fireMarkers, loading }: { 
  onCenterChange: (coords: Coordinates) => void,
  sensorMarkers: any[],
  fireMarkers: any[],
  loading: boolean
}) => {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [centerCoords, setCenterCoords] = useState<Coordinates | null>(null);

  return (
    <MapContainer center={userLocation || [34.052235, -118.243683]} zoom={5} style={{ height: "50vh", width: "100vh" }}>
      <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEventHandler onCenterChange={onCenterChange} setCenterCoords={setCenterCoords} />
      {userLocation && (
      <Marker position={userLocation} icon={customIcon}>
        <Popup>You are here!</Popup>
      </Marker>
      )}
      <LocationFinder setUserLocation={setUserLocation} />
      {!loading && 
      <>
        {sensorMarkers.map((data, index) => (
        <SensorMarker key={index} data={data} />
        ))}
        {fireMarkers.map((data, index) => (
        <FireMarker key={index} data={data} />
        ))}
      </>
      }
    </MapContainer>
  );
};

export default Globe;
