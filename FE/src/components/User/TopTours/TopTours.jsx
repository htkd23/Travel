import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";
import { FaShoppingCart } from "react-icons/fa";
import hotIcon from "../../../assets/website/hot.png";

// Hàm định dạng tiền
const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN").format(price);

// Lấy url ảnh
const getImageUrl = (path) => {
    if (!path) return "/default-image.jpg";
    if (path.startsWith("http")) return path;
    if (path.startsWith("//")) return `https:${path}`;
    return `http://localhost:8084/assets/${path}`;
};

const TopTours = () => {
    const [topTours, setTopTours] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTopTours = async () => {
            try {
                const { data } = await axiosClient.get("/dashboard/stats");
                setTopTours(data.topTours || []);
            } catch (err) {
                console.error("Lỗi fetch top tours:", err);
            }
        };
        fetchTopTours();
    }, []);

    const carouselSettings = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 600,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        cssEase: "linear",
        pauseOnHover: true,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 640, settings: { slidesToShow: 1 } },
        ],
    };

    const handleAddToCart = async (tourId) => {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId || !token) {
            alert("Bạn cần đăng nhập để thêm vào giỏ hàng!");
            navigate("/login");
            return;
        }

        try {
            await axiosClient.post(
                "/cart/add",
                {
                    userId: parseInt(userId),
                    tourId,
                    quantity: 1
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("🛒 Đã thêm tour vào giỏ hàng!");
        } catch (error) {
            console.error("Lỗi thêm vào giỏ:", error);
            if (error.response?.status === 400) {
                alert(error.response.data?.message || "Tour đã có trong giỏ hàng!");
            } else {
                alert("❌ Lỗi khi thêm vào giỏ hàng.");
            }
        }
    };

    const renderCard = (t) => {
        return (
            <div
                key={t.tourId}
                className="px-4 my-6"
            >
                <div className="bg-white rounded-3xl shadow-lg p-5 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                    <div className="relative overflow-hidden rounded-2xl mb-4">
                        <img
                            src={getImageUrl(t.imagePath)}
                            alt={t.tourName}
                            className="w-full h-56 object-cover rounded-2xl"
                            onError={(e) => (e.currentTarget.src = "/default-image.jpg")}
                        />

                        {/* ✅ ICON HOT */}
                        <img
                            src={hotIcon}
                            alt="Hot"
                            className="absolute top-2 right-2 w-16 h-16 animate-pulse drop-shadow-lg"
                        />
                    </div>

                    <h3
                        className="text-lg font-bold text-gray-900 mt-1 text-center"
                        dangerouslySetInnerHTML={{ __html: t.tourName }}
                    />

                    <p className="text-center text-sm text-gray-600 mt-2">
                    <span className="text-primary font-semibold">
                        {formatPrice(t.revenue)} VND
                    </span>{" "}
                        - {t.bookings} lượt đặt
                    </p>

                    <div className="flex gap-2 mt-4 items-center justify-center mt-auto">
                        <button
                            onClick={() => {
                                navigate(`/tour-detail/${t.tourId}`, {
                                    state: { tour: t }
                                });
                            }}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-full hover:scale-105 transition-all"
                        >
                            Xem Chi Tiết
                        </button>

                        <button
                            onClick={() => handleAddToCart(t.tourId)}
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


    if (topTours.length === 0) {
        return null;
    }

    return (
        <div className="py-10 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10 max-w-[600px] mx-auto">
                    <p className="text-sm text-primary">
                        Những tour được săn đón nhiều nhất
                    </p>
                    <h1 className="text-3xl font-bold">Top Tours HOT</h1>
                </div>

                <div className="mb-12">
                    {topTours.length >= 4 ? (
                        <Slider {...carouselSettings}>
                            {topTours.map(renderCard)}
                        </Slider>
                    ) : topTours.length === 3 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {topTours.map(renderCard)}
                        </div>
                    ) : topTours.length === 2 ? (
                        <div className="flex justify-center space-x-6">
                            {topTours.map((t) => (
                                <div key={t.tourId} className="w-full md:w-1/2">
                                    {renderCard(t)}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <div className="w-full md:w-1/3">{renderCard(topTours[0])}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopTours;
