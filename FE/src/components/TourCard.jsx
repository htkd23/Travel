import React from "react";
import { useNavigate } from "react-router-dom";
import hotIcon from "../assets/website/hot.png";
import saleIcon from "../assets/sale.png";
import axiosClient from "../api/axiosClient.jsx";
import { FaShoppingCart } from "react-icons/fa";

// Hàm lấy giá sau giảm
const getDiscountedPrice = (tour) => {
    if (
        tour.voucher &&
        tour.voucher.status === "ACTIVE" &&
        new Date() >= new Date(tour.voucher.validFrom) &&
        new Date() <= new Date(tour.voucher.validTo)
    ) {
        return tour.price * (1 - tour.voucher.discountPercentage / 100);
    }
    return tour.price;
};

// Hàm định dạng giá tiền
const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
};

// Hàm bóc src từ thẻ <img ... >
const extractImageSrc = (htmlString) => {
    if (!htmlString) return "";
    const div = document.createElement("div");
    div.innerHTML = htmlString;
    const img = div.querySelector("img");
    return img?.getAttribute("src") || "";
};

// Hàm build ra link ảnh đúng
const getImageUrl = (path) => {
    if (!path) {
        return "/default-image.png";
    }

    // Nếu path chứa HTML <img ... >
    if (path.includes("<img")) {
        path = extractImageSrc(path);
    }

    if (path.startsWith("http")) {
        return path;
    }

    if (path.startsWith("//")) {
        return `https:${path}`;
    }

    return `http://localhost:8084/assets/${path}`;
};

const TourCard = ({ tour, isHot }) => {
    const navigate = useNavigate();

    const imageUrl = getImageUrl(tour.imagePath);

    console.log("TOUR_IMAGE_PATH:", tour.imagePath);
    console.log("TOUR_IMAGE_URL:", imageUrl);

    const discountedPrice = getDiscountedPrice(tour);

    const hasDiscount =
        tour.voucher &&
        tour.voucher.status === "ACTIVE" &&
        new Date() >= new Date(tour.voucher.validFrom) &&
        new Date() <= new Date(tour.voucher.validTo);

    return (
        <div className="bg-white rounded-3xl shadow-lg p-5 hover:shadow-xl transition-all duration-300">
            <div className="relative overflow-hidden rounded-2xl">
                <img
                    src={imageUrl}
                    alt={tour.tourName}
                    className="w-full h-56 object-cover rounded-2xl"
                />

                {hasDiscount && (
                    <img
                        src={saleIcon}
                        alt="Sale"
                        className="absolute top-2 left-2 w-16 h-16"
                    />
                )}

                {isHot && (
                    <img
                        src={hotIcon}
                        alt="Hot"
                        className="absolute top-2 right-2 w-16 h-16"
                    />
                )}
            </div>

            <div className="mt-4">
                <span
                    className="text-sm text-gray-500"
                    dangerouslySetInnerHTML={{ __html: tour.location }}
                />

                <h3
                    className="text-lg font-bold text-gray-900 mt-1"
                    dangerouslySetInnerHTML={{ __html: tour.tourName }}
                />

                <p
                    className="text-sm text-gray-500 mt-1 text-ellipsis line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: tour.description }}
                />

                <p className="text-sm text-gray-500 mt-2">
                    🗓 {new Date(tour.startDate).toLocaleDateString("vi-VN")} -{" "}
                    {new Date(tour.endDate).toLocaleDateString("vi-VN")}
                </p>

                <div className="flex justify-between items-center mt-3">
                    {!hasDiscount ? (
                        <span className="text-lg font-semibold text-blue-600">
                            {formatPrice(tour.price)} VND
                        </span>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400 line-through text-sm">
                                {formatPrice(tour.price)} VND
                            </span>
                            <span className="text-lg font-semibold text-red-600">
                                {formatPrice(discountedPrice)} VND
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex gap-2 mt-4 items-center">
                    <button
                        onClick={() =>
                            navigate(`/booking/${tour.tourId}`, { state: { tour } })
                        }
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-full hover:scale-105 transition-all"
                    >
                        Đặt Ngay
                    </button>

                    <button
                        onClick={async () => {
                            const userId = localStorage.getItem("userId");
                            try {
                                await axiosClient.post(`/cart/add`, null, {
                                    params: { userId, tourId: tour.tourId },
                                    headers: {
                                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                                    },
                                });
                                alert("🛒 Đã thêm tour vào giỏ hàng!");
                            } catch (error) {
                                if (error.response?.status === 400) {
                                    alert(
                                        error.response.data?.message ||
                                        "Tour đã tồn tại trong giỏ hàng."
                                    );
                                } else {
                                    console.error("Lỗi thêm vào giỏ:", error);
                                    alert("❌ Lỗi khi thêm vào giỏ hàng.");
                                }
                            }
                        }}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-3"
                        title="Thêm vào giỏ hàng"
                    >
                        <FaShoppingCart className="text-red-500 text-xl hover:text-red-600 transition-colors duration-200" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TourCard;
