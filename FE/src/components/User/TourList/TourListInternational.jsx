import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";
import 'bootstrap-icons/font/bootstrap-icons.css';
import TourCard from "../../TourCard.jsx";

const TourListInternational = () => {
    const [tours, setTours] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const toursPerPage = 9;

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const token = localStorage.getItem("token");

                const tourRes = await axiosClient.get("tours", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Lọc các tour có trạng thái ACTIVE và ngày bắt đầu trong tương lai
                const filteredTours = tourRes.data
                    .filter((tour) => tour.tourType === "international" && tour.status === "ACTIVE")
                    .filter((tour) => new Date(tour.startDate) > new Date()); // Lọc những tour có ngày bắt đầu trong tương lai

                setTours(filteredTours);
                setTotalPages(Math.ceil(filteredTours.length / toursPerPage));
            } catch (error) {
                console.error("❌ Lỗi khi tải danh sách tour:", error);
            }
        };

        fetchTours();
    }, []);

    const currentTours = tours.slice(
        (currentPage - 1) * toursPerPage,
        currentPage * toursPerPage
    );

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="container mx-auto pt-20 pb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {currentTours.map((tour) => (
                    <TourCard
                        key={tour.tourId}
                        tour={tour}
                    />
                ))}
            </div>

            {/* ✅ Phân trang */}
            <div className="flex justify-center mt-8 space-x-2">
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Trước
                </button>

                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => goToPage(i + 1)}
                        className={`px-3 py-1 border rounded ${
                            currentPage === i + 1 ? "bg-blue-500 text-white" : ""
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Sau
                </button>
            </div>
        </div>
    );
};

export default TourListInternational;
