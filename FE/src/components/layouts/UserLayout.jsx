import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../User/Navbar/Navbar";
import Footer from "../User/Footer/Footer";

const UserLayout = () => {
    const location = useLocation();
    const hideNavAndFooter =
        location.pathname === "/login" ||
        location.pathname === "/register" ||
        location.pathname === "/forgot-password";

    return (
        <div className="flex flex-col min-h-screen">
            {!hideNavAndFooter && <Navbar />}
            <main className="flex-grow">
                <Outlet />
            </main>
            {!hideNavAndFooter && <Footer />}
        </div>
    );
};

export default UserLayout;
