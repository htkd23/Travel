import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { Menu } from "./Navbar";

const ResponsiveMenu = ({ showMenu, setShowMenu }) => {
  const navigate = useNavigate();
  const menuRef = useRef();

  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleConfirmLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    setShowLogoutConfirm(false);
    setShowMenu(false);
    alert("Đăng xuất thành công!");
    navigate("/login");
  };

  const handleGoToProfile = () => {
    setShowMenu(false);
    navigate(`/profile/${userId}`);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
      <>
        <div
            ref={menuRef}
            className={`${showMenu ? "left-0" : "-left-full"}
        fixed top-0 z-20 flex h-auto w-[70%] max-w-[250px]
        flex-col bg-white dark:bg-gray-800 dark:text-white
        px-6 py-4 text-black transition-all duration-200
        md:hidden rounded-r-lg shadow-lg`}
        >
          <div
              className="flex items-center gap-3 border-b pb-4 cursor-pointer"
              onClick={handleGoToProfile}
          >
            <FaUserCircle size={40} className="text-gray-500" />
            <div>
              <h1 className="text-base font-semibold">Xin chào {username}</h1>
              <h2 className="text-sm text-gray-500">Xem hồ sơ cá nhân</h2>
            </div>
          </div>

          <ul className="mt-2 space-y-2 text-[16px] font-medium">
            {Menu.map((item) => (
                <li key={item.id}>
                  <Link
                      to={item.link}
                      className="hover:text-primary duration-200 block p-2"
                      onClick={() => setShowMenu(false)}
                  >
                    {item.name}
                  </Link>
                </li>
            ))}
          </ul>

          <button
              onClick={() => setShowLogoutConfirm(true)}
              className="mt-4 bg-red-500 text-white text-center py-2 rounded-md font-semibold hover:bg-red-600 transition"
          >
            Đăng xuất
          </button>
        </div>

        {/* Modal xác nhận đăng xuất */}
        {showLogoutConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center pt-20 items-start z-50">
              <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                <h2 className="text-xl font-bold mb-2">Xác nhận đăng xuất</h2>
                <p className="mb-4 text-red-600">Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?</p>
                <div className="flex justify-end gap-2">
                  <button
                      onClick={() => setShowLogoutConfirm(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  >
                    Hủy
                  </button>
                  <button
                      onClick={handleConfirmLogout}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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

export default ResponsiveMenu;
