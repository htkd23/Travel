import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix lỗi marker không hiện icon
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const HotelMap = ({ hotels }) => {
    if (!hotels || hotels.length === 0) {
        return <p className="text-gray-500">Không có khách sạn nào tìm thấy.</p>;
    }

    const center = [hotels[0].lat, hotels[0].lon];

    return (
        <MapContainer
            center={center}
            zoom={14}
            style={{ height: "300px", width: "100%", borderRadius: "10px" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {hotels.map((hotel) => (
                <Marker key={hotel.hotelId} position={[hotel.lat, hotel.lon]}>
                    <Popup>
                        <strong>{hotel.hotelName}</strong>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default HotelMap;
