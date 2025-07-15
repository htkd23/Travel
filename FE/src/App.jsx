import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/LoginRegister/Login";
import Register from "./components/LoginRegister/Register";
import ForgotPassword from "./components/LoginRegister/ForgotPassword";

import Hero from "./components/User/Hero/Hero";
import Comment from "./components/User/Comments/Comments";
import TourListDomestic from "./components/User/TourList/TourListDomestic";
import TourListInternational from "./components/User/TourList/TourListInternational";
import BookingForm from "./components/User/Navbar/BookingForm.jsx";
import Choice from "./components/User/Choice/Choice";
import Management from "./components/User/BookingManagement/BookingManagement.jsx";
import PaymentPage from "./components/User/TourList/PaymentPage.jsx"
import TopTours from "./components/User/TopTours/TopTours.jsx";

import RequireAdmin from "./components/Admin/RequireAdmin";
import AdminDashboard from "./components/Admin/AdminDashboard";
import BookingDetail from "./components/Admin/BookingManagement/BookingDetail.jsx";

import UserLayout from "./components/layouts/UserLayout";
import Chatbot from "./components/User/Chatbot/chatbot.jsx";
import CallButton from "./components/User/Chatbot/CallButton.jsx";
import UserProfile from "./components/User/Navbar/UserProfile.jsx";
import CartPage from "./components/User/Navbar/CartPage.jsx";
import FeedbackForm from "./components/User/BookingManagement/FeedbackForm.jsx";
import TourDetailUser from "./components/User/TourList/TourDetail.jsx";

import AdminLayout from "./components/layouts/AdminLayout";
import BookingManagement from "./components/Admin/BookingManagement/BookingManagement.jsx";
import BookingEdit from "./components/Admin/BookingManagement/BookingEdit.jsx";
import TourDomesticManagement from "./components/Admin/TourManagement/TourDomesticManagement.jsx";
import TourInternationalManagement from "./components/Admin/TourManagement/TourInternationalManagement.jsx";
import AdminContainer from "./components/Admin/AdminContainer.jsx";
import TourDetailAdmin from "./components/Admin/TourManagement/TourDetail.jsx";
import NewTour from "./components/Admin/TourManagement/NewTour.jsx";
import TourDetailForm from "./components/Admin/TourManagement/TourDetailForm.jsx";
import UserManagement from "./components/Admin/UserManagement/UserManagement.jsx";
import UserForm from "./components/Admin/UserManagement/UserForm.jsx";
import FeedbackManagement from "./components/Admin/FeedbackManagement/FeedbackManagement.jsx";
import VoucherManagement from "./components/Admin/VoucherManagement/VoucherManagement.jsx";
import ScheduleReminder from "./components/Admin/ScheduleReminder/ScheduleReminder.jsx";

// Home component
const Home = () => (
    <>
        <Hero />
        <Comment />
        <TopTours />
    </>
);

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Layout cho các trang không có chatbot */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Layout dành cho user, có kèm chatbot */}
                <Route
                    element={
                        <>
                            <UserLayout />
                            <Chatbot />
                            <CallButton />
                        </>
                    }
                >
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/domestic" element={<TourListDomestic />} />
                    <Route path="/international" element={<TourListInternational />} />
                    <Route path="/tour-detail/:id" element={<TourDetailUser />} />
                    <Route path="/booking/:id" element={<BookingForm />} />
                    <Route path="/management" element={<Management />} />
                    <Route path="/choice" element={<Choice />} />
                    <Route path="/profile/:id" element={<UserProfile />} />
                    <Route path="/payment/:bookingId" element={<PaymentPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/feedback" element={<FeedbackForm />} />
                </Route>

                {/* Layout dành cho admin */}
                <Route
                    path="/admin"
                    element={
                        <RequireAdmin>
                            <AdminContainer />
                        </RequireAdmin>
                    }
                >
                    <Route index element={<AdminDashboard />} />
                    <Route path="dashboard" element={<AdminDashboard />} />

                    <Route path="bookingmanagement" element={<BookingManagement />} />
                    <Route path="bookings/:id/edit" element={<BookingEdit />} />
                    <Route path="bookings/:id" element={<BookingDetail />} />

                    <Route path="tourmanagement/domestic" element={<TourDomesticManagement type="domestic" />} />
                    <Route path="tourmanagement/international" element={<TourInternationalManagement type="international" />} />
                    <Route path="tour-add" element={<NewTour />} />
                    <Route path="tour-edit/:id" element={<NewTour />} />
                    <Route path="tours/:id" element={<TourDetailAdmin />} />
                    <Route path="tours/:id/add-detail" element={<TourDetailForm />} />

                    <Route path="users" element={<UserManagement />} />
                    <Route path="users/add" element={<UserForm />} />
                    <Route path="users/edit/:id" element={<UserForm />} />

                    <Route path="/admin/vouchers" element={<VoucherManagement />} />
                    <Route path="/admin/reminders" element={<ScheduleReminder />} />

                    <Route path="feedback" element={<FeedbackManagement />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
