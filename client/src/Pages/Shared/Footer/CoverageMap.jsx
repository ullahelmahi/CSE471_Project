import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const dhaka = [23.8103, 90.4125];
const chattogram = [22.3569, 91.7832];

const CoverageMap = () => {
  return (
    <div className="w-full h-[250px] rounded-lg overflow-hidden mt-4">
      <MapContainer
        center={[23.685, 90.3563]} // Bangladesh center
        zoom={6}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        zoomControl={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={dhaka}>
          <Popup>
            <strong>Dhaka</strong>
            <br />
            ✔ We have coverage here!
          </Popup>
        </Marker>

        <Marker position={chattogram}>
          <Popup>
            <strong>Chattogram</strong>
            <br />
            ✔ We have coverage here!
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default CoverageMap;