import './App.css';
import axios from "axios";
import { useState } from "react";
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';

function App() {

  const apiKey = import.meta.env.VITE_API_KEY;
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  // google maps states
  const [zoom, setZoom] = useState(10);

  type GoogleGeocodingResponse = {
    results: {
      geometry: {
        location: { lat: number; lng: number };
      };
      types: string[];
    }[];
    status: "OK" | "ZERO_RESULTS";
  };

  function searchAddressHandler(event: React.FormEvent) {
    event.preventDefault();

    if (!address.trim()) return;

    axios
      .get<GoogleGeocodingResponse>(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`)
      .then((response) => {
        if (response.data.status !== "OK") {
          throw new Error("Could not fetch location!");
        }

        const coords = response.data.results[0].geometry.location;
        const types = response.data.results[0].types;
        console.log('Location types:', types);

        let zoomLevel = 10; // default

        if (types.includes("street_address") || types.includes("premise")) {
          zoomLevel = 17;
        } else if (types.includes("route")) {
          zoomLevel = 15;
        } else if (types.includes("locality")) {
          zoomLevel = 12;
        } else if (types.includes("administrative_area_level_1")) {
          zoomLevel = 8;
        } else if (types.includes("country")) {
          zoomLevel = 5;
        }

        setCoordinates(coords);
        setZoom(zoomLevel);
      })
      .catch((error) => {
        alert(error.message);
        console.error(error);
      });
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="map-container">
        <form onSubmit={searchAddressHandler}>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address"
          />
          <button type="submit">Search address</button>
        </form>

        {coordinates && (
          <div className="mapbox">
            <Map
              center={coordinates}
              zoom={zoom}
              onCameraChanged={(ev) => {
                setCoordinates(ev.detail.center);
                setZoom(ev.detail.zoom);
              }}
              zoomControl={true}
            >
              <Marker position={coordinates} />
            </Map>
          </div>
        )}

        {!coordinates && (
          <div>
            <p>Please enter an address!</p>
          </div>
        )}
      </div>
    </APIProvider>
  );
}

export default App;
