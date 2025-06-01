import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./style.scss";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function MapClickHandler({ onClick }) {
  useMapEvents({ click: onClick });
  return null;
}

function FlyToLocation({ latLng }) {
  const map = useMap();
  map.flyTo([latLng.latitude, latLng.longitude], 17);
  return null;
}

function Map({
  address = "",
  coordinate,
  selectable = false,
  onSelect,
  onAddressChange,
}) {
  const defaultLatLng = {
    latitude: 21.028511,
    longitude: 105.804817,
  };

  const initialLatLng =
    selectable || !coordinate
      ? defaultLatLng
      : {
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
        };

  const [latLng, setLatLng] = useState(initialLatLng);
  const [isSatellite, setIsSatellite] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fetchAddress = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await res.json();
      if (data && data.display_name) {
        onAddressChange && onAddressChange(data.display_name);
      } else {
        onAddressChange && onAddressChange("");
      }
    } catch (error) {
      console.error("Lỗi lấy địa chỉ từ tọa độ:", error);
      onAddressChange && onAddressChange("");
    }
  };

  const handleMapClick = (e) => {
    if (!selectable) return;
    const newLatLng = {
      latitude: e.latlng.lat,
      longitude: e.latlng.lng,
    };
    setLatLng(newLatLng);
    if (onSelect) onSelect(newLatLng);
    fetchAddress(newLatLng.latitude, newLatLng.longitude);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchText) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchText
        )}`
      );
      const data = await res.json();

      if (data.length > 0) {
        const location = data[0];
        const newLatLng = {
          latitude: parseFloat(location.lat),
          longitude: parseFloat(location.lon),
        };
        setLatLng(newLatLng);
        if (onSelect) onSelect(newLatLng);
        fetchAddress(newLatLng.latitude, newLatLng.longitude);
      } else {
        alert("Không tìm thấy địa điểm.");
        onAddressChange && onAddressChange("");
      }
    } catch (error) {
      console.error("Lỗi tìm địa điểm:", error);
      alert("Có lỗi xảy ra khi tìm kiếm.");
      onAddressChange && onAddressChange("");
    }
  };

  const tileLayerUrl = isSatellite
    ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const subdomains = isSatellite ? undefined : ["a", "b", "c"];

  return (
    <div className="map-container">
      <h2 className="map-title">Địa điểm</h2>

      {selectable && (
        <form onSubmit={handleSearch} className="map-search-form">
          <input
            type="text"
            placeholder="Tìm địa điểm..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="map-search-input"
          />
          <button type="submit" className="map-search-button">
            Tìm
          </button>
        </form>
      )}

      <div className="map-mode-dropdown">
        <label htmlFor="mapModeSelect" className="dropdown-label">
          Chế độ bản đồ:
        </label>
        <select
          id="mapModeSelect"
          value={isSatellite ? "satellite" : "normal"}
          onChange={(e) => setIsSatellite(e.target.value === "satellite")}
        >
          <option value="normal">Bản đồ</option>
          <option value="satellite">Vệ tinh</option>
        </select>
      </div>

      <MapContainer
        key={isSatellite}
        center={[latLng.latitude, latLng.longitude]}
        zoom={17}
        scrollWheelZoom={true}
        className="leaflet-map"
      >
        <TileLayer
          attribution={
            isSatellite
              ? "Tiles © Esri"
              : '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          }
          url={tileLayerUrl}
          {...(subdomains ? { subdomains } : {})}
        />
        <MapClickHandler onClick={handleMapClick} />
        <FlyToLocation latLng={latLng} />
        <Marker position={[latLng.latitude, latLng.longitude]}>
          <Popup>{selectable ? "Địa điểm được chọn" : address}</Popup>
        </Marker>
      </MapContainer>

      <div className="map-footer">
        <a
          href={`https://www.openstreetmap.org/?mlat=${latLng.latitude}&mlon=${latLng.longitude}#map=18/${latLng.latitude}/${latLng.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="map-button"
        >
          Xem trên OpenStreetMap
        </a>
      </div>
    </div>
  );
}

export default Map;
