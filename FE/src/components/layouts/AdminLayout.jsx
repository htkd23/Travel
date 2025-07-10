import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Admin/Header/Header";
import Sidebar from "../Admin/Sidebar/Sidebar";

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [userToggled, setUserToggled] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
        setUserToggled(true);
    };

    useEffect(() => {
        const handleResize = () => {
            if (!userToggled) {
                setIsSidebarOpen(window.innerWidth >= 1024);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [userToggled]);

    return (
        <div className="min-h-screen">
            <div className="flex justify-between items-center px-4 py-2 bg-gray-100 fixed w-full z-50">
                <Header toggleSidebar={toggleSidebar} />
            </div>

            <Sidebar isSidebarOpen={isSidebarOpen} />
            <main className={`pt-16 ${isSidebarOpen ? "pl-64" : "pl-0"} transition-all duration-300`}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
