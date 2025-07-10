import React from "react";
import { Check } from "lucide-react";

const HotelCard = ({ hotel }) => {
    const imageUrl = `http://localhost:8084${hotel.imagePath}`;
    const facilities = hotel.facilities?.split(",") || [];

    return (
        <div className="w-full bg-white rounded-xl shadow-md overflow-hidden p-4 mb-6">
            <div className="flex flex-col md:flex-row">
                {/* Bên trái: Ảnh khách sạn */}
                <div className="md:w-[35%] w-full h-[220px] md:h-auto">
                    <img
                        src={imageUrl}
                        alt={hotel.hotelName}
                        className="w-full h-full object-cover rounded-xl"
                    />
                </div>

                {/* Bên phải: Nội dung */}
                <div className="md:w-[65%] w-full md:pl-6 mt-4 md:mt-0 flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{hotel.hotelName}</h2>
                        <p className="text-gray-600 text-sm mt-1">{hotel.address}</p>

                        {/* Đánh giá */}
                        <div className="flex items-center mt-2 text-sm">
                            <span className="bg-blue-500 text-white px-2 py-1 rounded-lg text-xs font-bold mr-2">
                                {hotel.rating}
                            </span>
                            <span className="font-semibold text-blue-700">Rất tốt</span>
                            <span className="ml-1 text-gray-600">- 21 đánh giá</span>
                        </div>

                        {/* Highlight mô tả */}
                        <p className="italic text-sm text-gray-700 mt-2">
                            {hotel.highlight}
                        </p>

                        {/* Tiện nghi */}
                        <div className="flex flex-wrap gap-2 mt-3">
                            {facilities.map((item, index) => (
                                <span
                                    key={index}
                                    className="bg-gray-200 px-3 py-1 rounded-full text-xs"
                                >
                                    {item.trim()}
                                </span>
                            ))}
                        </div>

                        {/* Điểm nổi bật */}
                        <div className="mt-4">
                            <p className="font-bold text-gray-800 mb-2">Điểm nổi bật</p>
                            <ul className="text-sm text-gray-700 space-y-1">
                                {hotel.description?.split(".").map((point, index) =>
                                    point.trim() ? (
                                        <li key={index} className="flex items-start">
                                            <Check size={16} className="text-green-600 mt-1 mr-2" />
                                            {point.trim()}
                                        </li>
                                    ) : null
                                )}
                            </ul>
                        </div>

                        {/* Loại hình và phù hợp */}
                        <div className="mt-4 text-sm">
                            <p>
                                <span className="font-bold">Loại hình: </span>
                                {hotel.hotelType}
                            </p>
                            <p>
                                <span className="font-bold">Phù hợp với: </span>
                                {hotel.suitableFor}
                            </p>
                        </div>
                    </div>

                    {/* Giá hiển thị dưới cùng bên phải */}
                    <div className="flex justify-end mt-4">
                        <span className="text-red-600 font-bold text-xl border border-red-600 px-4 py-1 rounded-lg">
                            {Number(hotel.priceStart).toLocaleString()}đ
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelCard;
