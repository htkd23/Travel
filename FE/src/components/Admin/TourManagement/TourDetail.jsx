import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const TourDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tour, setTour] = useState(null);

    useEffect(() => {
        axios
            .get(`http://localhost:8084/api/tours/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res) => {
                const tourData = res.data;
                tourData.imagePath = tourData.imagePath.startsWith("http")
                    ? tourData.imagePath
                    : `http://localhost:8084/assets/${tourData.imagePath}`;
                setTour(tourData);
            })
            .catch((err) => {
                console.error("Lỗi khi tải tour:", err);
            });
    }, [id]);

    if (!tour) return <div className="p-4">Đang tải dữ liệu...</div>;

    return (
        <div className="p-4 max-w-4xl mx-auto">
            {/* Nút quay lại */}
            <div className="mb-4">
                <button
                    onClick={() => {
                        if (tour.tourType === "domestic") {
                            navigate("/admin/tourmanagement/domestic");
                        } else {
                            navigate("/admin/tourmanagement/international");
                        }
                    }}
                    className="flex items-center text-gray-700 hover:text-blue-600"
                >
                    <svg
                        className="w-6 h-6 text-gray-800 hover:text-blue-600"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 12h14M5 12l4-4m-4 4 4 4"
                        />
                    </svg>
                    <span className="ml-2 font-medium">Quay lại</span>
                </button>
            </div>

            <h1 className="text-2xl font-bold mb-4">Chi tiết tour</h1>

            <table className="w-full table-auto border">
                <tbody>
                <tr><td className="border p-2 font-semibold w-1/3">ID</td><td className="border p-2">{tour.tourId}</td></tr>
                <tr><td className="border p-2 font-semibold">Tên tour</td><td className="border p-2">{tour.tourName}</td></tr>
                <tr><td className="border p-2 font-semibold">Mô tả</td><td className="border p-2">{tour.description}</td></tr>
                <tr><td className="border p-2 font-semibold">Địa điểm</td><td className="border p-2">{tour.location}</td></tr>
                <tr><td className="border p-2 font-semibold">Ảnh</td><td className="border p-2"><img src={tour.imagePath} alt="tour" className="w-48 rounded" /></td></tr>
                <tr><td className="border p-2 font-semibold">Giá</td><td className="border p-2">{tour.price} VND</td></tr>
                <tr><td className="border p-2 font-semibold">Ngày đi</td><td className="border p-2">{new Date(tour.startDate).toLocaleDateString()}</td></tr>
                <tr><td className="border p-2 font-semibold">Ngày về</td><td className="border p-2">{new Date(tour.endDate).toLocaleDateString()}</td></tr>
                <tr><td className="border p-2 font-semibold">Loại tour</td><td className="border p-2">{tour.tourType}</td></tr>
                <tr><td className="border p-2 font-semibold">Ngày tạo</td><td className="border p-2">{new Date(tour.createdAt).toLocaleString()}</td></tr>
                <tr><td className="border p-2 font-semibold">Cập nhật</td><td className="border p-2">{new Date(tour.updatedAt).toLocaleString()}</td></tr>
                {/* Trạng thái tour */}
                <tr><td className="border p-2 font-semibold">Trạng thái</td><td className="border p-2">{tour.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}</td></tr>
                </tbody>
            </table>

            {tour.tourDetail && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-2">Chi tiết bổ sung</h2>
                    <div className="mb-4">
                        <strong>Giới thiệu:</strong>
                        <p className="whitespace-pre-line mt-1">{tour.tourDetail.introduction}</p>
                    </div>
                    <div className="mb-4">
                        <strong>Lịch trình:</strong>
                        <p className="whitespace-pre-line mt-1">{tour.tourDetail.itinerary}</p>
                    </div>
                    <div className="mb-4">
                        <strong>Đánh giá:</strong>
                        <p className="whitespace-pre-line mt-1">{tour.tourDetail.reviews}</p>
                    </div>
                    <div className="mb-4">
                        <strong>Chính sách:</strong>
                        <p className="whitespace-pre-line mt-1">{tour.tourDetail.policy}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TourDetail;
