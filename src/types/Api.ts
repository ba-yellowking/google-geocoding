export type GoogleGeocodingResponse = {
  results: {
    geometry: {
      location: { lat: number; lng: number };
    };
    types: string[];
  }[];
  status: "OK" | "ZERO_RESULTS";
};