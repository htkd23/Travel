import React, { useState, useEffect } from "react";
import axiosClient from "../../../api/axiosClient";
import { useNavigate, useParams } from "react-router-dom";
import TourStepper from "./TourStepper";

const NewTour = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [imagePreview, setImagePreview] = useState(null);
    const [tour, setTour] = useState({
        tourName: "",
        location: "",
        description: "",
        price: "",
        startDate: "",
        endDate: "",
        imagePath: "",
        tourType: "domestic",
    });

    useEffect(() => {
        if (isEditMode) {
            axiosClient
                .get(`/tours/${id}`)
                .then((res) => {
                    const t = res.data;
                    setTour({
                        tourName: t.tourName || "",
                        location: t.location || "",
                        description: t.description || "",
                        price: t.price || "",
                        startDate: t.startDate || "",
                        endDate: t.endDate || "",
                        imagePath: t.imagePath || "",
                        tourType: t.tourType || "domestic",
                    });
                    if (t.imagePath) {
                        setImagePreview(t.imagePath);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    alert("Không tìm thấy tour.");
                    navigate("/admin/tourmanagement/domestic");
                });
        }
    }, [isEditMode, id, navigate]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "imagePath" && files.length > 0) {
            const file = files[0];
            setTour((prev) => ({ ...prev, [name]: file }));
            setImagePreview(URL.createObjectURL(file));
        } else {
            setTour((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async () => {
        const formatDate = (d) => {
            if (!d) return "";
            const date = new Date(d);
            return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
        };

        const formData = new FormData();
        formData.append(
            "tourDTO",
            JSON.stringify({
                tourName: tour.tourName,
                location: tour.location,
                description: tour.description,
                price: tour.price,
                startDate: formatDate(tour.startDate),
                endDate: formatDate(tour.endDate),
                tourType: tour.tourType,
            })
        );

        if (tour.imagePath instanceof File) {
            formData.append("imagePath", tour.imagePath);
        }

        try {
            let tourId;

            if (isEditMode) {
                const res = await axiosClient.put(`/tours/${id}`, formData);
                tourId = res.data.tourId;
                alert("✅ Cập nhật tour thành công!");
            } else {
                const res = await axiosClient.post("/tours", formData);
                tourId = res.data.tourId;
                alert("✅ Thêm tour thành công!");
            }

            // Đây là đoạn fix:
            navigate(`/admin/tours/${tourId}/add-detail`, {
                state: { tourType: tour.tourType },
            });
        } catch (err) {
            console.error("❌ Lỗi:", err.response?.data || err.message);
            alert("Đã xảy ra lỗi khi lưu tour.");
        }
    };

    return (
        <div className="w-full">
            <TourStepper currentStep="location" />

            <div className="w-full max-w-4xl px-4 mt-6 pl-10">
                <h1 className="text-2xl font-bold mb-6">
                    {isEditMode ? "Cập nhật Tour" : "Thêm Tour Mới"}
                </h1>

                <div className="space-y-4">
                    {[
                        { label: "Tên Tour", name: "tourName", type: "text" },
                        { label: "Địa điểm", name: "location", type: "text" },
                        { label: "Ngày đi", name: "startDate", type: "date" },
                        { label: "Ngày về", name: "endDate", type: "date" },
                        { label: "Giá", name: "price", type: "number" },
                    ].map(({ label, name, type }) => (
                        <div
                            className="grid grid-cols-12 items-center gap-x-1"
                            key={name}
                        >
                            <label className="col-span-3 font-medium">{label}</label>
                            <input
                                type={type}
                                name={name}
                                value={tour[name]}
                                onChange={handleChange}
                                className="col-span-9 p-2 border border-gray-300 rounded w-full"
                            />
                        </div>
                    ))}

                    <div className="grid grid-cols-12 items-start gap-x-1">
                        <label className="col-span-3 font-medium mt-2">
                            Mô tả
                        </label>
                        <textarea
                            name="description"
                            value={tour.description}
                            onChange={handleChange}
                            className="col-span-9 p-2 border border-gray-300 rounded resize-none h-24 w-full"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-12 items-center gap-x-1">
                        <label className="col-span-3 font-medium">Hình ảnh</label>
                        <div className="col-span-9">
                            <input
                                type="file"
                                name="imagePath"
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                accept="image/*"
                            />
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-32 mt-2 border rounded"
                                />
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-12 items-center gap-x-1">
                        <label className="col-span-3 font-medium">
                            Loại Tour
                        </label>
                        <select
                            name="tourType"
                            value={tour.tourType}
                            onChange={handleChange}
                            className="col-span-9 p-2 border border-gray-300 rounded w-full"
                            required
                        >
                            <option value="domestic">Nội địa</option>
                            <option value="international">Quốc tế</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
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
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        {isEditMode
                            ? "Đi đến sửa chi tiết tour"
                            : "Đi đến thêm chi tiết tour"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewTour;
