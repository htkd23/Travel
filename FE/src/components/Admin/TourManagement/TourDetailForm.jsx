import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosClient from "../../../api/axiosClient.jsx";
import TourStepper from "./TourStepper";

const TourDetailForm = ({ tourId, tourType }) => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [detail, setDetail] = useState({
        introduction: "",
        itinerary: "",
        reviews: "",
        policy: "",
    });

    useEffect(() => {
        if (id) {
            axiosClient
                .get(`/tours/${id}/detail-dto`)
                .then((res) => {
                    if (res.data) {
                        setDetail(res.data);
                    }
                })
                .catch(() => {
                    console.log("Tour chưa có detail.");
                });
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetail((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveDetail = async () => {
        try {
            if (id) {
                if (!detail.id) {
                    // Nếu tourDetail không có id, gọi API POST để thêm mới chi tiết tour
                    const response = await axiosClient.post(`/tours/${id}/add-detail`, detail, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });

                    if (response.status === 200) {
                        alert("✅ Đã lưu chi tiết tour!");
                        navigate(tourType === "domestic" ? "/admin/tourmanagement/domestic" : "/admin/tourmanagement/international");
                    } else {
                        alert("❌ Lỗi khi lưu chi tiết tour!");
                    }
                } else {
                    // Nếu tourDetail đã có id (tức là chi tiết tour đã tồn tại), gọi API PUT để cập nhật
                    const response = await axiosClient.put(`/tours/${id}/update-detail`, detail, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });

                    if (response.status === 200) {
                        alert("✅ Đã cập nhật chi tiết tour!");
                        navigate(tourType === "domestic" ? "/admin/tourmanagement/domestic" : "/admin/tourmanagement/international");
                    } else {
                        alert("❌ Lỗi khi cập nhật chi tiết tour!");
                    }
                }
            } else {
                alert("Thiếu ID tour để lưu chi tiết.");
            }
        } catch (err) {
            console.error("❌ Lỗi khi lưu chi tiết:", err.response?.data || err.message);
            alert("Đã xảy ra lỗi khi lưu chi tiết tour.");
        }
    };

    return (
        <div className="w-full">
            <TourStepper currentStep="details" />
            <div className="space-y-4 max-w-4xl mx-auto mt-6 p-4 border rounded shadow">
                <h2 className="text-2xl font-bold mb-4">
                    {id ? "Cập nhật Chi Tiết Tour" : "Thêm Chi Tiết Tour"}
                </h2>
                {["introduction", "itinerary", "reviews", "policy"].map((field) => (
                    <div key={field}>
                        <label className="block font-medium capitalize">
                            {field}
                        </label>
                        <textarea
                            name={field}
                            value={detail[field]}
                            onChange={handleChange}
                            className="w-full p-2 border rounded h-24"
                        />
                    </div>
                ))}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => {
                            if (tour.tourType === "domestic") {
                                navigate("/admin/tourmanagement/domestic");
                            } else {
                                navigate("/admin/tourmanagement/international");
                            }
                        }}
                        className="px-4 py-2 bg-gray-500 text-white rounded"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSaveDetail}
                        className="px-4 py-2 bg-green-600 text-white rounded"
                    >
                        Lưu Chi Tiết
                    </button>
                </div>

            </div>
        </div>
    );
};

export default TourDetailForm;
