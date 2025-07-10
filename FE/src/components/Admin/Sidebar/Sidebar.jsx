import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiGrid,
  FiUsers,
  FiFileText,
  FiLogOut,
  FiChevronDown,
  FiChevronUp,
  FiTag,
  FiBriefcase,
  FiCalendar,
  FiMessageCircle
} from "react-icons/fi";

const Sidebar = ({ isSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isTourMenuOpen, setIsTourMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleConfirmLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    alert("Đăng xuất thành công!");
    setShowLogoutConfirm(false);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
      <>
        <aside
            className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 bg-white border-r border-gray-200
        transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="h-full px-4 overflow-y-auto">
            <ul className="space-y-1 text-gray-700 text-sm">
              <li>
                <Link
                    to="/admin/dashboard"
                    className={`flex items-center px-4 py-3 rounded hover:bg-blue-50 ${
                        isActive("/admin/dashboard") ? "text-blue-600 font-semibold border-l-4 border-blue-600 bg-blue-50" : ""
                    }`}
                >
                  <FiHome className="mr-3 text-lg" />
                  Dashboard
                </Link>
              </li>

              <li>
                <button
                    onClick={() => setIsTourMenuOpen(!isTourMenuOpen)}
                    className="w-full flex justify-between items-center px-4 py-3 rounded hover:bg-blue-50 text-gray-700"
                >
                <span className="flex items-center">
                  <FiGrid className="mr-3 text-lg" />
                  Quản lý Tour
                </span>
                  {isTourMenuOpen ? <FiChevronUp /> : <FiChevronDown />}
                </button>

                {isTourMenuOpen && (
                    <ul className="ml-10 mt-1 space-y-1">
                      <li>
                        <Link
                            to="/admin/tourmanagement/domestic"
                            className={`block py-2 rounded hover:bg-blue-50 ${
                                isActive("/admin/tourmanagement/domestic") ? "text-blue-600 font-semibold" : ""
                            }`}
                        >
                          Trong nước
                        </Link>
                      </li>
                      <li>
                        <Link
                            to="/admin/tourmanagement/international"
                            className={`block py-2 rounded hover:bg-blue-50 ${
                                isActive("/admin/tourmanagement/international") ? "text-blue-600 font-semibold" : ""
                            }`}
                        >
                          Quốc tế
                        </Link>
                      </li>
                    </ul>
                )}
              </li>

              <li>
                <Link
                    to="/admin/bookingmanagement"
                    className={`flex items-center px-4 py-3 rounded hover:bg-blue-50 ${
                        isActive("/admin/bookingmanagement") ? "text-blue-600 font-semibold border-l-4 border-blue-600 bg-blue-50" : ""
                    }`}
                >
                  <FiFileText className="mr-3 text-lg" />
                  Quản lý đơn đặt tour
                </Link>
              </li>

              <li>
                <Link
                    to="/admin/hotel-management"
                    className={`flex items-center px-4 py-3 rounded hover:bg-blue-50 ${
                        isActive("/admin/hotel-management") ? "text-blue-600 font-semibold border-l-4 border-blue-600 bg-blue-50" : ""
                    }`}
                >
                  <FiBriefcase className="mr-3 text-lg" />
                  Quản lý khách sạn
                </Link>
              </li>

              <li>
                <Link
                    to="/admin/users"
                    className={`flex items-center px-4 py-3 rounded hover:bg-blue-50 ${
                        isActive("/admin/users") ? "text-blue-600 font-semibold border-l-4 border-blue-600 bg-blue-50" : ""
                    }`}
                >
                  <FiUsers className="mr-3 text-lg" />
                  Quản lý người dùng
                </Link>
              </li>

              <li>
                <Link
                    to="/admin/feedback"
                    className={`flex items-center px-4 py-3 rounded hover:bg-blue-50 ${
                        isActive("/admin/feedback") ? "text-blue-600 font-semibold border-l-4 border-blue-600 bg-blue-50" : ""
                    }`}
                >
                  <FiFileText className="mr-3 text-lg" />
                  Phản hồi khách hàng
                </Link>
              </li>

              <li>
                <Link
                    to="/admin/vouchers"
                    className={`flex items-center px-4 py-3 rounded hover:bg-blue-50 ${
                        isActive("/admin/vouchers") ? "text-blue-600 font-semibold border-l-4 border-blue-600 bg-blue-50" : ""
                    }`}
                >
                  <FiTag className="mr-3 text-lg" />
                  Mã giảm giá
                </Link>
              </li>

              <li>
                <Link
                    to="/admin/reminders"
                    className={`flex items-center px-4 py-3 rounded hover:bg-blue-50 ${
                        isActive("/admin/reminders") ? "text-blue-600 font-semibold border-l-4 border-blue-600 bg-blue-50" : ""
                    }`}
                >
                  <FiCalendar className="mr-3 text-lg" />
                  Quản lý lịch hẹn
                </Link>
              </li>

              <li className="mt-4">
                <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="flex items-center w-full px-4 py-3 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <FiLogOut className="mr-3 text-lg" />
                  Đăng xuất
                </button>
              </li>
            </ul>
          </div>
        </aside>

        {/* Modal logout */}
        {showLogoutConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                <h2 className="text-lg font-bold mb-4">Xác nhận đăng xuất</h2>
                <p className="text-gray-600 mb-4">
                  Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?
                </p>
                <div className="flex justify-end gap-2">
                  <button
                      onClick={() => setShowLogoutConfirm(false)}
                      className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                  >
                    Hủy
                  </button>
                  <button
                      onClick={handleConfirmLogout}
                      className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
        )}
      </>
  );
};

export default Sidebar;
