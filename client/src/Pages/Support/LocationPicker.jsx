import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const ClickHandler = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });
  return null;
};

const LocationPicker = ({ position, setPosition }) => {
  const detectLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setPosition({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });
  };

  return (
    <div className="w-full h-full space-y-2">
      <button
        type="button"
        onClick={detectLocation}
        className="btn btn-sm btn-outline btn-primary"
      >
        📍 Use My Location
      </button>

      <div className="w-full h-full">
        <MapContainer
          center={position || [23.8103, 90.4125]}
          zoom={13}
          className="w-full h-full"
          style={{ minHeight: "100%" }}
        >
          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ClickHandler setPosition={setPosition} />
          {position && <Marker position={position} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default LocationPicker;