import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const LocationViewer = ({ location }) => {
  if (!location) {
    return <p className="text-sm text-gray-400">No location provided</p>;
  }

  return (
    <div className="mt-2 rounded overflow-hidden border">
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={15}
        style={{ height: "200px", width: "100%" }}
        dragging={false}
        zoomControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[location.lat, location.lng]} />
      </MapContainer>
    </div>
  );
};

export default LocationViewer;