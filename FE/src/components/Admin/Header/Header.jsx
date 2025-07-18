import React from "react";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import Logo from "../../../assets/logo3.png";
import NotificationBell from "../../NotificationBell.jsx";
import { jwtDecode } from "jwt-decode";

const Header = ({ toggleSidebar }) => {
    const token = localStorage.getItem("token");
    let userRole = null;
    let userId = null;

    if (token) {
        try {
            const decoded = jwtDecode(token);

            // ✅ Log gọn gàng, không nhảy dòng lung tung
            console.log("Decoded token:", JSON.stringify(decoded, null, 2));

            userId = decoded.sub;

            const roles = decoded.roles || [];

            // Chuẩn hóa role
            userRole = roles.some((role) => role.includes("ADMIN"))
                ? "ADMIN"
                : "USER";

            console.log("userRole:", userRole);
            console.log("userId:", userId);
        } catch (err) {
            console.error("Lỗi giải mã token:", err);
        }
    } else {
        console.log("Không tìm thấy token trong localStorage.");
    }

    return (
        <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
            <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Left - Logo + toggle sidebar */}
                <div className="flex items-center gap-3">
                    {/* Sidebar toggle */}
                    <button
                        onClick={toggleSidebar}
                        className="text-gray-600 hover:bg-gray-100 p-2 rounded-md transition"
                    >
                        <HiOutlineMenuAlt2 className="text-2xl" />
                    </button>

                    {/* Logo */}
                    <a href="/" className="flex items-center gap-2">
                        <img src={Logo} alt="Logo" className="h-8 w-auto" />
                        <span className="hidden sm:block text-lg font-bold text-gray-800">
              Quản trị Du lịch
            </span>
                    </a>
                </div>

                {/* Right - Notifications */}
                <div className="flex items-center gap-4">
                    {/* Chuông thông báo nếu là ADMIN */}
                    {userRole === "ADMIN" && userId && token && (
                        <NotificationBell userId={userId} token={token} />
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;
