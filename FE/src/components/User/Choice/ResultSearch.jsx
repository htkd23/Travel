import React from "react";
import TourCard from "../../TourCard.jsx";
import HotelMap from "./HotelMap";

const ResultSearch = ({ weatherData, selectedDate, tourData, hotelData, topTourNames = [] }) => {
    const hasWeatherData = weatherData?.forecast?.forecastday?.length > 0;
    const hasTourData = Array.isArray(tourData) && tourData.length > 0;
    const hasHotelData = Array.isArray(hotelData) && hotelData.length > 0;

    if (!hasWeatherData && !hasTourData && !hasHotelData) {
        return (
            <p className="text-center text-gray-500 font-semibold">
                Không có dữ liệu phù hợp với tìm kiếm.
            </p>
        );
    }

    const locationName = weatherData?.location?.name || "Không xác định";

    return (
        <div className="bg-white rounded-md p-4 mt-4 max-w-[1200px] mx-auto">
            {/* Thời tiết */}
            {hasWeatherData && (
                <>
                    <h2 className="text-xl font-bold mb-4">
                        Dự báo thời tiết tại {locationName} trong 3 ngày tới
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {weatherData.forecast.forecastday.map((day, index) => (
                            <div
                                key={index}
                                className="
        p-4 rounded-2xl shadow-lg border border-cyan-300
        bg-cyan-50/60 backdrop-blur-sm
        flex flex-col items-center text-cyan-700
    "
                            >
                                <p className="text-base font-semibold mb-2">{day.date}</p>
                                <img
                                    src={day.day.condition.icon}
                                    alt="icon"
                                    className="w-12 h-12 mb-2"
                                />
                                <p className="text-lg font-bold">{day.day.avgtemp_c}°C</p>
                                <p className="text-sm text-center">{day.day.condition.text}</p>
                            </div>

                        ))}
                    </div>
                </>
            )}

            {/* Danh sách tour */}
            {hasTourData && (
                <>
                    <h3 className="text-xl font-bold mb-4">Các tour phù hợp</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {tourData.map((tour) => (
                            <TourCard
                                key={tour.tourId}
                                tour={tour}
                                isHot={topTourNames.includes(tour.tourName)} // ✅
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Danh sách khách sạn */}
            {hasHotelData && (
                <>
                    <h3 className="text-xl font-bold mb-4 mt-8">
                        Bản đồ khách sạn tại {locationName}
                    </h3>
                    <HotelMap hotels={hotelData} />
                </>
            )}

        </div>
    );
};

export default ResultSearch;
