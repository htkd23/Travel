import React from "react";
import { Link } from "react-router-dom"; // Import Link từ react-router-dom
import footerLogo from "../../../assets/logo3.png";

const FooterLinks = [
  { title: "Trang chủ", link: "/home" },
  { title: "Trong nước", link: "/domestic" },
  { title: "Nước ngoài", link: "/international" },
  { title: "Tự chọn", link: "/choice" },
  { title: "Quản lý đặt tour", link: "/management" },
];

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

const Footer = () => {
  return (
    <div className="text-black py-6 bg-gray-100 mt-auto">
      <div className="container mx-auto px-6 flex flex-col items-center">
        {/* Grid bố cục */}
        <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl">
          {/* Logo & Giới thiệu */}
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl text-primary">
              <img src={footerLogo} alt="logo" className="w-10" />
              Website du lịch
            </h2>
            <p>Du lịch trải nghiệm những địa điểm nổi tiếng với giá cả phù hợp</p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-4">
            <ul>
              <li className="text-[22px] list-none font-semibold text-primary py-2 uppercase">Menu</li>
              {FooterLinks.map((link) => (
                <li key={link.title} className="my-4 list-none">
                  <Link to={link.link} className="cursor-pointer hover:text-primary">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liên hệ */}
          <div className="flex flex-col gap-4">
            <ul>
              <li className="text-[22px] list-none font-semibold text-primary py-2 uppercase">Liên hệ</li>
              <li className="my-4 list-none">Số điện thoại: +84123456789</li>
              <li className="my-4 list-none">Email: admin@gmail.com</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
