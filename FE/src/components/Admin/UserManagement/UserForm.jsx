import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";

const UserForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        dob: "",
        loyaltyPoints: 0,
        roles: ["USER"],
    });

    useEffect(() => {
        if (id) {
            axiosClient
                .get(`/users/${id}`)
                .then((res) => {
                    const userData = res.data;
                    const rawRole =
                        Array.isArray(userData.roles) && typeof userData.roles[0] === "string"
                            ? userData.roles[0]
                            : "ROLE_USER";
                    const cleanRole = rawRole.replace("ROLE_", "");
                    setFormData({
                        ...userData,
                        loyaltyPoints: userData.loyaltyPoints || 0,
                        roles: [cleanRole],
                        password: "",
                    });
                })
                .catch((err) => {
                    alert("❌ Không tải được thông tin người dùng!");
                    console.error(err);
                });
        }
    }, [id]);

    const validateField = (name, value) => {
        if (name === "username" && (!value || value.length < 3)) {
            return "Tên người dùng phải từ 3 ký tự";
        }
        if (name === "password" && !id && (!value || value.length < 8)) {
            return "Mật khẩu phải ít nhất 8 ký tự";
        }
        if (name === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return "Email không hợp lệ";
        }
        if (name === "loyaltyPoints" && (isNaN(value) || Number(value) < 0)) {
            return "Điểm tích lũy phải là số không âm";
        }
        return null;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const parsedValue = name === "loyaltyPoints" ? Number(value) : value;
        const error = validateField(name, parsedValue);
        setFormData((prev) => ({ ...prev, [name]: parsedValue }));
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    const handleSubmit = async () => {
        const newErrors = {};
        Object.entries(formData).forEach(([key, value]) => {
            const error = validateField(key, value);
            if (error) newErrors[key] = error;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            if (id) {
                await axiosClient.put(`/users/${id}`, formData);
                alert("✅ Cập nhật người dùng thành công!");
            } else {
                await axiosClient.post("/users", {
                    ...formData,
                    roles: ["USER"],
                });
                alert("✅ Thêm người dùng thành công!");
            }
            navigate("/admin/users");
        } catch (err) {
            if (err.response?.status === 400 && typeof err.response.data === "object") {
                setErrors(err.response.data);
            } else {
                alert("❌ Lỗi: " + (err.response?.data || err.message));
            }
        }
    };

    return (
        <div className="px-6 py-0 mt-20 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                {id ? (
                    <>
                        <span className="text-blue-600">✏️</span> Cập nhật Người Dùng
                    </>
                ) : (
                    <>
                        <span className="text-purple-600">➕</span> Thêm Người Dùng
                    </>
                )}
            </h1>

            <div className="grid grid-cols-12 gap-y-6 gap-x-4">
                {[
                    { label: "Tên tài khoản", name: "username", type: "text" },
                    { label: "Mật khẩu", name: "password", type: "password" },
                    { label: "Họ", name: "lastName", type: "text" },
                    { label: "Tên", name: "firstName", type: "text" },
                    { label: "Email", name: "email", type: "email" },
                    { label: "Ngày sinh", name: "dob", type: "date" },
                    { label: "Điểm tích lũy", name: "loyaltyPoints", type: "number" },
                ].map(({ label, name, type }) => (
                    <React.Fragment key={name}>
                        <label className="col-span-3 text-gray-700 font-medium py-2">
                            {label}
                        </label>
                        <div className="col-span-9">
                            <input
                                type={type}
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                className={`w-full border px-3 py-2 rounded focus:outline-none text-gray-700 ${
                                    errors[name]
                                        ? "border-red-500 focus:ring-red-400"
                                        : "border-gray-300 focus:ring-green-500"
                                }`}
                            />
                            {errors[name] && (
                                <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
                            )}
                        </div>
                    </React.Fragment>
                ))}

                {id && (
                    <>
                        <label className="col-span-3 text-gray-700 font-medium py-2">
                            Vai trò
                        </label>
                        <div className="col-span-9">
                            <input
                                type="text"
                                value={formData.roles[0]}
                                disabled
                                className="w-full border border-gray-300 bg-gray-100 px-3 py-2 rounded text-gray-700"
                            />
                        </div>
                    </>
                )}
            </div>

            <div className="flex justify-end gap-3 mt-8">
                <button
                    onClick={() => navigate("/admin/users")}
                    className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                    Hủy
                </button>
                <button
                    onClick={handleSubmit}
                    className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300"
                >
                    Xác nhận
                </button>
            </div>
        </div>
    );
};

export default UserForm;
