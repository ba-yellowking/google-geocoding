import './App.css';
import axios from "axios";
import { useState } from "react";

function App() {
  const apiKey = import.meta.env.VITE_API_KEY;
  const [address, setAddress] = useState("");

  function searchAddressHandler(event: React.FormEvent) {
    event.preventDefault();

    if (!address.trim()) return;

    axios
      .get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <>
      <div id="map">
        <p>Please enter an address!</p>
      </div>

      <form onSubmit={searchAddressHandler}>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button type="submit">Search address</button>
      </form>
    </>
  );
}

export default App;
