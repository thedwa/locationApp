import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';

const App = () => {
  const [location, setLocation] = useState(null);

  // Function to get location from browser
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // When the app loads, get the location
  useEffect(() => {
    getLocation();
  }, []);

  // Function to handle button click
  const handleClick = async (buttonNum) => {
    // Send a request to your backend with the selected location and buttonNum
    const response = await fetch('/api/call-openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ location, buttonNum }),
    });

    const data = await response.json();
    console.log(data);
  };

  // Function to handle marker drag event on the map
  const Markers = () => {
    const map = useMapEvents({
      dragend() {
        setLocation(map.getCenter());
      },
    })
  
    return location === null ? null : (
      <Marker position={location} draggable={true} />
    )
  }

  return (
    <div>
      <MapContainer center={location || [51.505, -0.09]} zoom={13} style={{ height: "100vh", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Markers />
      </MapContainer>
      <Button onClick={() => handleClick(1)}>Button 1</Button>
      <Button onClick={() => handleClick(2)}>Button 2</Button>
      <Button onClick={() => handleClick(3)}>Button 3</Button>
      <Button onClick={() => handleClick(4)}>Button 4</Button>
      <Button onClick={() => handleClick(5)}>Button 5</Button>
    </div>
  );
};

export default App;
