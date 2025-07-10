import React, { useState, useEffect, useRef } from "react";
import Logo from "../../../assets/logo3.png";
import { Link, useNavigate } from "react-router-dom";
import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import { BiBasket } from "react-icons/bi";
import ResponsiveMenu from "./ResponsiveMenu";
import NotificationBell from "../../NotificationBell.jsx";
import axiosClient from "../../../api/axiosClient";

export const Menu = [
  { id: 1, name: "Trang chủ", link: "/home" },
  { id: 2, name: "Nội địa", link: "/domestic" },
  { id: 3, name: "Quốc tế", link: "/international" },
  { id: 4, name: "Tìm kiếm", link: "/choice" },
  { id: 5, name: "Quản lý đặt tour", link: "/management" },
];

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const userMenuRef = useRef();

  const [loyaltyPoints, setLoyaltyPoints] = useState(0);

  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const toggleMenu = () => setShowMenu(!showMenu);
  const toggleUserMenu = () => setShowUserMenu(!showUserMenu);

  const handleConfirmLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    setShowLogoutConfirm(false);
    navigate("/login");
  };

  useEffect(() => {
    const fetchLoyaltyPoints = async () => {
      try {
        const res = await axiosClient.get(`/users/${userId}`);
        setLoyaltyPoints(res.data.loyaltyPoints || 0);
      } catch (err) {
        console.error("Lỗi khi lấy điểm tích lũy:", err);
      }
    };

    if (userId) fetchLoyaltyPoints();
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
      <div className="absolute top-0 left-0 w-full z-10">
        <div className="container mx-auto flex justify-between items-center py-4 px-6 md:px-20 lg:px-32 bg-transparent">
          <a href="/home" className="font-bold text-2xl sm:text-3xl flex items-center gap-2">
            <img src={Logo} alt="Logo" className="w-10" />
            Website du lịch
          </a>

          <ul className="hidden md:flex gap-7 text-black">
            {Menu.map((item) => (
                <Link key={item.id} to={item.link} className="cursor-pointer hover:text-gray-400">
                  {item.name}
                </Link>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <Link
                to="/choice"
                className="hidden md:block bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition"
            >
              Đặt ngay
            </Link>

            {userId && (
                <div className="flex items-center gap-4">
                  <NotificationBell userId={userId} token={localStorage.getItem("token")} />

                  <div className="flex items-center gap-1 text-gray-700 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-yellow-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    {loyaltyPoints}
                  </div>

                  <Link to="/cart">
                    <BiBasket className="text-3xl text-blue-600 hover:text-blue-800" title="Xem giỏ hàng" />
                  </Link>

                  <div className="relative hidden md:block">
                    <button onClick={toggleUserMenu} className="flex items-center">
                      <FaUserCircle size={30} className="text-black cursor-pointer" />
                    </button>
                    {showUserMenu && (
                        <div ref={userMenuRef} className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md py-2">
                          <button onClick={() => navigate(`/profile/${userId}`)} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                            Xin chào, {username}
                          </button>
                          <button onClick={() => setShowLogoutConfirm(true)} className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">
                            Đăng xuất
                          </button>
                        </div>
                    )}
                  </div>
                </div>
            )}

            <button className="md:hidden block text-gray-800" onClick={toggleMenu}>
              {showMenu ? <HiMenuAlt1 size={30} /> : <HiMenuAlt3 size={30} />}
            </button>
          </div>
        </div>

        <ResponsiveMenu
            setShowMenu={setShowMenu}
            showMenu={showMenu}
            setShowLogoutConfirm={setShowLogoutConfirm}
            handleConfirmLogout={handleConfirmLogout}
        />

        {showLogoutConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center pt-20 z-50 items-start">
              <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                <h2 className="text-xl font-bold mb-2">Xác nhận đăng xuất</h2>
                <p className="mb-4 text-red-600">Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?</p>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowLogoutConfirm(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">
                    Hủy
                  </button>
                  <button onClick={handleConfirmLogout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default Navbar;
