import axios from "axios";
import type {GoogleGeocodingResponse} from "../types/Api.ts";

export function createSearchAddressHandler(
  apiKey: string,
  address: string,
  setCoordinates: React.Dispatch<React.SetStateAction<{ lat: number; lng: number } | null>>,
  setZoom: React.Dispatch<React.SetStateAction<number>>
) {

  return async function searchAddressHandler(event: React.FormEvent) {
    event.preventDefault();

    if (!address.trim()) return;

    axios
      .get<GoogleGeocodingResponse>(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
      )
      .then((response) => {
        if (response.data.status !== "OK") {
          throw new Error("Could not fetch location!");
        }

        const coords = response.data.results[0].geometry.location;
        const types = response.data.results[0].types;

        let zoomLevel = 10;
        if (types.includes("street_address") || types.includes("premise")) {
          zoomLevel = 17;
        } else if (types.includes("route")) {
          zoomLevel = 15;
        } else if (types.includes("locality")) {
          zoomLevel = 12;
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
}