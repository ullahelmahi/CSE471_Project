import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* FIX LEAFLET ICON */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* =========================
   MAP CLICK HANDLER
========================= */
const LocationPicker = ({ onSelect, onAddressSelect, position, setPosition }) => {
  useMapEvents({
    async click(e) {
      const coords = e.latlng;
      setPosition(coords);
      onSelect(coords);

      // 🌍 Reverse Geocoding
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`
        );
        const data = await res.json();
        if (data?.display_name) {
          onAddressSelect(data.display_name);
        }
      } catch (err) {
        console.error("Reverse geocoding failed");
      }
    },
  });

  return position ? <Marker position={position} /> : null;
};

/* =========================
   MAIN MAP PICKER
========================= */
const MapPicker = ({ onSelect, onAddressSelect }) => {
  const [position, setPosition] = useState(null);
  const [map, setMap] = useState(null);

  /* AUTO LOCATE */
  const handleAutoLocate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setPosition(coords);
        onSelect(coords);
        map.setView(coords, 16);

        // 🌍 Reverse Geocoding (Auto location)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`
          );
          const data = await res.json();
          if (data?.display_name) {
            onAddressSelect(data.display_name);
          }
        } catch (err) {
          console.error("Reverse geocoding failed");
        }
      },
      () => alert("Location permission denied")
    );
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleAutoLocate}
        className="btn btn-outline btn-sm"
      >
        📍 Use My Location
      </button>

      <div className="h-64 w-full rounded overflow-hidden border">
        <MapContainer
          center={[23.8103, 90.4125]} // Dhaka
          zoom={13}
          className="h-full w-full"
          whenCreated={setMap}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <LocationPicker
            onSelect={onSelect}
            onAddressSelect={onAddressSelect}
            position={position}
            setPosition={setPosition}
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPicker;