import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const ClickHandler = ({ setLocation }) => {
  useMapEvents({
    click(e) {
      setLocation({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });
  return null;
};

const LocationPicker = ({ setLocation }) => {
  const [position, setPosition] = useState(null);

  // 🔥 AUTO LOCATION
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setPosition(coords);
        setLocation(coords);
      },
      () => alert("Location access denied")
    );
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={detectLocation}
        className="btn btn-sm btn-outline btn-primary"
      >
        📍 Use My Location
      </button>

      <MapContainer
        center={position || [23.8103, 90.4125]}
        zoom={13}
        className="h-64 w-full rounded-lg"
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ClickHandler
          setLocation={(coords) => {
            setPosition(coords);
            setLocation(coords);
          }}
        />

        {position && <Marker position={position} />}
      </MapContainer>
    </div>
  );
};

export default LocationPicker;