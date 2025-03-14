import React from "react";
import { Map, Marker, useMap, useMarkerRef } from "@vis.gl/react-google-maps";


export default function Globe(){

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '100vh', width: '100%' }}>
      <Map
        style={{ height: '100%', width: "100%" }}
        defaultCenter={{ lat: 0, lng: 0 }}
        defaultZoom={10}
        disableDefaultUI={true}
      />
    </div>
  );
}