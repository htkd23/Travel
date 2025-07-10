import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";

const UserProfile = () => {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("info");
    const [user, setUser] = useState({
        username: "",
        firstName: "",
        lastName: "",
        dob: "",
        email: "",
        loyaltyPoints: 0,
    });
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState("");

    const [passwordForm, setPasswordForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [passwordMessage, setPasswordMessage] = useState("");

    useEffect(() => {
        axiosClient.get(`/users/${id}`)
            .then(res => {
                const data = res.data;
                setUser({
                    username: data.username || "",
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    email: data.email || "",
                    dob: data.dob || "",
                    loyaltyPoints: data.loyaltyPoints || 0,
                });
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi khi tải thông tin user:", err);
                setLoading(false);
            });
    }, [id]);

    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveInfo = () => {
        axiosClient.put(`/users/${id}/profile`, user)
            .then(() => setSuccess("✅ Đã lưu thay đổi!"))
            .catch(err => alert("❌ Lỗi khi lưu: " + (err.response?.data || err.message)));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({ ...prev, [name]: value }));
    };

    const handleChangePassword = () => {
        if (passwordForm.newPassword.length < 8) {
            return setPasswordMessage("❌ Mật khẩu mới phải có ít nhất 8 ký tự!");
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            return setPasswordMessage("❌ Mật khẩu mới không khớp!");
        }

        axiosClient.put(`/users/change-password/${id}`, {
            oldPassword: passwordForm.oldPassword,
            newPassword: passwordForm.newPassword
        })
            .then(() => {
                setPasswordMessage("✅ Đổi mật khẩu thành công!");
                setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
            })
            .catch(err => {
                setPasswordMessage("❌ " + (err.response?.data || err.message));
            });
    };

    if (loading) return <div className="p-8 text-center text-lg">Đang tải...</div>;

    return (
        <div className="pt-32 pb-16 px-4 min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
                {/* Tabs + Loyalty */}
                <div className="flex justify-between items-center border-b border-blue-200 pb-4 mb-8">
                    <div className="flex gap-6">
                        <button
                            className={`text-lg font-medium transition duration-300 ${
                                activeTab === "info"
                                    ? "text-blue-700 border-b-2 border-blue-600 pb-1"
                                    : "text-gray-500 hover:text-blue-600"
                            }`}
                            onClick={() => setActiveTab("info")}
                        >
                            Thay đổi thông tin
                        </button>
                        <button
                            className={`text-lg font-medium transition duration-300 ${
                                activeTab === "password"
                                    ? "text-blue-700 border-b-2 border-blue-600 pb-1"
                                    : "text-gray-500 hover:text-blue-600"
                            }`}
                            onClick={() => setActiveTab("password")}
                        >
                            Đổi mật khẩu
                        </button>
                    </div>
                    <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg"
                             fill="none"
                             viewBox="0 0 24 24"
                             strokeWidth={1.5}
                             stroke="currentColor"
                             className="w-5 h-5 text-yellow-400">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0
                               1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12
                               c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879
                               4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        {user.loyaltyPoints} điểm
                    </div>
                </div>

                {activeTab === "info" ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-semibold text-gray-600 mb-1 block">Tên tài khoản</label>
                                <input
                                    name="username"
                                    value={user.username}
                                    disabled
                                    className="w-full bg-gray-100 border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-blue-200"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600 mb-1 block">Email</label>
                                <input
                                    name="email"
                                    value={user.email}
                                    onChange={handleUserChange}
                                    className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-blue-200"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600 mb-1 block">Họ</label>
                                <input
                                    name="lastName"
                                    value={user.lastName}
                                    onChange={handleUserChange}
                                    className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-blue-200"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600 mb-1 block">Tên</label>
                                <input
                                    name="firstName"
                                    value={user.firstName}
                                    onChange={handleUserChange}
                                    className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-blue-200"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-semibold text-gray-600 mb-1 block">Ngày sinh</label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={user.dob}
                                    onChange={handleUserChange}
                                    className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-blue-200"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSaveInfo}
                            className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded shadow hover:scale-105 transition-transform"
                        >
                            Lưu thay đổi
                        </button>
                        {success && <div className="text-green-600 mt-4 text-center text-sm">{success}</div>}
                    </>
                ) : (
                    <>
                        <div className="space-y-5">
                            {/* Password Field */}
                            {["oldPassword", "newPassword", "confirmPassword"].map(field => {
                                const isVisible =
                                    field === "oldPassword" ? showOldPassword :
                                        field === "newPassword" ? showNewPassword :
                                            showConfirmPassword;
                                const setVisible =
                                    field === "oldPassword" ? setShowOldPassword :
                                        field === "newPassword" ? setShowNewPassword :
                                            setShowConfirmPassword;
                                const label =
                                    field === "oldPassword" ? "Mật khẩu cũ *" :
                                        field === "newPassword" ? "Mật khẩu mới *" :
                                            "Nhập lại mật khẩu *";

                                return (
                                    <div key={field}>
                                        <label className="text-sm font-semibold text-gray-600 mb-1 block">{label}</label>
                                        <div className="relative">
                                            <input
                                                type={isVisible ? "text" : "password"}
                                                name={field}
                                                value={passwordForm[field]}
                                                onChange={handlePasswordChange}
                                                className="w-full border border-gray-300 px-4 py-2 rounded pr-10 focus:ring-2 focus:ring-blue-200"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-2.5"
                                                onClick={() => setVisible(!isVisible)}
                                            >
                                                {isVisible ? (
                                                    <svg className="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none">
                                                        <path stroke="currentColor" strokeWidth="2" d="M3 3l18 18M10.58 10.58A3 3 0 0012 15a3 3 0 002.12-.88M6.41 6.41C4.5 7.84 3 10 3 12c0 1 4 6 9 6 1.26 0 2.45-.36 3.5-1M18.36 18.36C20.15 16.91 21 14.93 21 12c0-1-4-6-9-6-1.13 0-2.21.23-3.2.65" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none">
                                                        <path stroke="currentColor" strokeWidth="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                                                        <path stroke="currentColor" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}

                            <button
                                onClick={handleChangePassword}
                                className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded shadow hover:scale-105 transition-transform"
                            >
                                Đổi mật khẩu
                            </button>
                            {passwordMessage && (
                                <div className={`text-sm mt-3 text-center ${passwordMessage.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
                                    {passwordMessage}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
