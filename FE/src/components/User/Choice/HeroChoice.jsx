import React, { useState } from "react";
import axios from "axios";

const HeroChoice = ({ setWeatherData, setTourData, setHotelData, setTopTourNames }) => {
    const [destination, setDestination] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [priceValue, setPriceValue] = useState(1000);
    const [loading, setLoading] = useState(false);

    const API_KEY = "83c8c8bee6eb4b6c97c201931251803";

    const removeDiacritics = (str) =>
        str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

    const handleSearch = async () => {
        if (!destination.trim()) {
            alert("Vui lòng nhập địa điểm!");
            return;
        }

        const formattedDestination = removeDiacritics(destination);
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Bạn chưa đăng nhập hoặc token không hợp lệ!");
            return;
        }

        setLoading(true);

        try {
            // 🔹 Gọi API thời tiết
            const weatherResponse = await axios.get(
                `https://api.weatherapi.com/v1/forecast.json`,
                {
                    params: {
                        key: API_KEY,
                        q: encodeURIComponent(formattedDestination),
                        days: 3,
                        lang: "vi",
                    },
                }
            );
            if (weatherResponse.data?.forecast?.forecastday) {
                setWeatherData(weatherResponse.data);
            } else {
                setWeatherData(null);
            }

            // 🔹 Gọi API tìm tour
            const tourResponse = await axios.get("http://localhost:8084/api/tours/search", {
                params: {
                    destination: formattedDestination,
                    departureDate: selectedDate
                        ? new Date(selectedDate).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                        })
                        : undefined,
                    price: priceValue.toString(),
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTourData(tourResponse.data || []);

            const topResponse = await axios.get("http://localhost:8084/api/dashboard/stats", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const topTourNames = topResponse.data.topTours.map(t => t.tourName);
            setTopTourNames(topTourNames);

            const sortedTours = [...(tourResponse.data || [])].sort((a, b) => {
                const aIndex = topTourNames.indexOf(a.tourName);
                const bIndex = topTourNames.indexOf(b.tourName);
                return (aIndex !== -1 ? aIndex : 999) - (bIndex !== -1 ? bIndex : 999);
            });

            setTourData(sortedTours);

            // 🔹 Gọi API tìm khách sạn
            const searchResponse = await axios.get(
                "https://nominatim.openstreetmap.org/search",
                {
                    params: {
                        q: destination,
                        format: "json",
                        limit: 1,
                    },
                    headers: {
                        "User-Agent": "Travel5/1.0 (contact@yourdomain.com)",
                    },
                }
            );

            if (searchResponse.data.length > 0) {
                const lat = parseFloat(searchResponse.data[0].lat);
                const lon = parseFloat(searchResponse.data[0].lon);

                // Tìm khách sạn quanh đó
                const delta = 0.05;
                const viewbox = [
                    lon - delta,
                    lat + delta,
                    lon + delta,
                    lat - delta,
                ].join(",");

                const hotelResponse = await axios.get(
                    "https://nominatim.openstreetmap.org/search",
                    {
                        params: {
                            format: "json",
                            limit: 20,
                            amenity: "hotel",
                            bounded: 1,
                            viewbox: viewbox,
                        },
                        headers: {
                            "User-Agent": "Travel5/1.0 (contact@yourdomain.com)",
                        },
                    }
                );

                // Chuyển data về format dễ dùng
                const hotels = hotelResponse.data.map(item => ({
                    hotelId: item.place_id,
                    hotelName: item.display_name,
                    lat: parseFloat(item.lat),
                    lon: parseFloat(item.lon),
                }));

                setHotelData(hotels);
            }

        } catch (error) {
            console.error("❌ Lỗi khi gọi API:", error);
            setWeatherData(null);
            setTourData([]);
            setHotelData([]);
            alert("Không tìm thấy dữ liệu phù hợp.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-black/20 h-full">
            <div className="h-full flex justify-center items-center p-4 bg-primary/10">
                <div className="container grid grid-cols-1 gap-4">
                    <div className="text-white">
                        <p className="font-bold text-3xl">Tìm kiếm chuyến đi lý tưởng của bạn</p>
                    </div>

                    <div className="space-y-4 bg-white rounded-md p-4 relative">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-3">
                            <div>
                                <label htmlFor="destination" className="opacity-70">
                                    Địa điểm
                                </label>
                                <input
                                    type="text"
                                    id="destination"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    placeholder="Hà Nội, Đà Nẵng..."
                                    className="w-full bg-gray-100 my-2 rounded-full p-2"
                                />
                            </div>

                            <div>
                                <label htmlFor="date" className="opacity-70">
                                    Ngày đi
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full bg-gray-100 my-2 rounded-full p-2"
                                />
                            </div>

                            <div>
                                <label htmlFor="price" className="opacity-70">
                                    Giá tiền (VND)
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    value={priceValue}
                                    onChange={(e) => setPriceValue(e.target.value)}
                                    placeholder="Nhập giá tối đa..."
                                    className="w-full bg-gray-100 my-2 rounded-full p-2"
                                    min={0}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSearch}
                            className="bg-gradient-to-r from-primary to-secondary text-white hover:scale-105 px-4 py-2 rounded-full duration-200 absolute -bottom-5 left-1/2 -translate-x-1/2"
                            disabled={loading}
                        >
                            {loading ? "Đang tìm..." : "Tìm kiếm ngay"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroChoice;
