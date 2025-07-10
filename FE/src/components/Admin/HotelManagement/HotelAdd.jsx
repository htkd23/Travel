import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HotelAdd = () => {
    const navigate = useNavigate();
    const [hotelName, setHotelName] = useState("");
    const [address, setAddress] = useState("");
    const [rating, setRating] = useState("");
    const [description, setDescription] = useState("");
    const [highlight, setHighlight] = useState("");
    const [facilities, setFacilities] = useState("");
    const [hotelType, setHotelType] = useState("Resort");
    const [suitableFor, setSuitableFor] = useState("");
    const [priceStart, setPriceStart] = useState("");
    const [imageFile, setImageFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        const hotelDTO = {
            hotelName,
            address,
            rating,
            description,
            highlight,
            facilities,
            hotelType,
            suitableFor,
            priceStart,
        };

        const formData = new FormData();
        formData.append("hotelDTO", JSON.stringify(hotelDTO));
        if (imageFile) {
            formData.append("image", imageFile); // ✅ đúng key backend yêu cầu
        }

        try {
            await axios.post("http://localhost:8084/api/hotels", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Thêm khách sạn thành công!");
            navigate("/admin/hotel-management");
        } catch (error) {
            console.error("❌ Lỗi khi thêm khách sạn:", error.response?.data || error.message);
            alert("Thêm khách sạn thất bại.");
        }
    };


    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Thêm Khách Sạn Mới</h2>
            <form onSubmit={handleSubmit} className="max-w-4xl space-y-4">
                {[
                    { label: "Tên khách sạn", value: hotelName, setter: setHotelName, required: true },
                    { label: "Địa chỉ", value: address, setter: setAddress, required: true },
                    { label: "Đánh giá", value: rating, setter: setRating, required: true, type: "number", placeholder: "VD: 9.5" },
                    { label: "Mô tả", value: description, setter: setDescription, isTextArea: true },
                    { label: "Nổi bật", value: highlight, setter: setHighlight },
                    { label: "Tiện nghi", value: facilities, setter: setFacilities },
                    { label: "Phù hợp cho", value: suitableFor, setter: setSuitableFor },
                    { label: "Giá bắt đầu", value: priceStart, setter: setPriceStart, required: true, type: "number" },
                ].map((field, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                        <label className="w-48 pt-2 font-medium">
                            {field.label}
                        </label>
                        {field.isTextArea ? (
                            <textarea
                                value={field.value}
                                onChange={(e) => field.setter(e.target.value)}
                                placeholder={field.placeholder || ""}
                                className="w-full border px-4 py-2 rounded"
                            />
                        ) : (
                            <input
                                type={field.type || "text"}
                                value={field.value}
                                onChange={(e) => field.setter(e.target.value)}
                                placeholder={field.placeholder || ""}
                                required={field.required}
                                className="w-full border px-4 py-2 rounded"
                            />
                        )}
                    </div>
                ))}

                {/* Chọn loại hình khách sạn */}
                <div className="flex items-start gap-4">
                    <label className="w-48 pt-2 font-medium">Loại hình</label>
                    <select
                        value={hotelType}
                        onChange={(e) => setHotelType(e.target.value)}
                        className="w-full border px-4 py-2 rounded"
                    >
                        <option value="Resort">Resort</option>
                        <option value="Villa">Villa</option>
                        <option value="Hotel">Hotel</option>
                    </select>
                </div>

                {/* Ảnh đại diện */}
                <div className="flex items-start gap-4">
                    <label className="w-48 pt-2 font-medium">Hình ảnh</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                        className="w-full border px-4 py-2 rounded"
                        required
                    />
                </div>

                {/* Nút điều hướng */}
                <div className="flex justify-end gap-2 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/hotel-management")}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Xác nhận
                    </button>
                </div>
            </form>
        </div>
    );
};

export default HotelAdd;
