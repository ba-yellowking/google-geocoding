import './App.css';
import { useEffect, useState } from "react";
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import {createSearchAddressHandler} from "./services/SearchAddress.tsx";

function App() {

  const apiKey = import.meta.env.VITE_API_KEY;
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [zoom, setZoom] = useState(10);

  useEffect(() => {
    if (!coordinates) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
          setZoom(15);
        },
        (error) => {
          console.warn("Geolocation error:", error.message);
          setCoordinates({ lat: 51.1605, lng: 71.4704 });
          setZoom(12);
        }
      );
    }
  }, []);

  const searchAddressHandler = createSearchAddressHandler(apiKey, address, setCoordinates, setZoom);

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

        {coordinates ? (
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
        ) : (
          <div>
            <p>Identifying your location</p>
          </div>
        )}
      </div>
    </APIProvider>
  );
}

export default App;
