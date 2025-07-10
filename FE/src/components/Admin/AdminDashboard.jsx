import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import axiosClient from "../../api/axiosClient.jsx";
import { FiDollarSign, FiShoppingCart, FiUsers } from "react-icons/fi";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    monthlyStats: [],
    topTours: [],
    domesticTours: 0,  // Số lượng tour nội địa
    internationalTours: 0,  // Số lượng tour quốc tế
  });

  useEffect(() => {
    axiosClient.get("/dashboard/stats")
        .then((res) => setStats(res.data))
        .catch((err) => {
          console.error("❌ Lỗi khi lấy dữ liệu dashboard:", err);
          console.error("❗ Response:", err.response?.data);
        });
  }, []);

  return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">Dashboard</h2>

        {/* Top summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <SummaryCard
              icon={<FiDollarSign className="text-green-600 text-3xl" />}
              label="Doanh thu tháng"
              value={`${(stats.totalRevenue || 0).toLocaleString()} VND`}
          />
          <SummaryCard
              icon={<FiShoppingCart className="text-purple-600 text-3xl" />}
              label="Số lượng đơn hàng"
              value={stats.totalBookings || 0}
          />
          <SummaryCard
              icon={<FiShoppingCart className="text-yellow-600 text-3xl" />}
              label="Số lượng tour nội địa"
              value={stats.domesticTours || 0}
          />
          <SummaryCard
              icon={<FiShoppingCart className="text-red-600 text-3xl" />}
              label="Số lượng tour quốc tế"
              value={stats.internationalTours || 0}
          />
        </div>

        {/* Chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Lượt đặt tour theo tháng</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" fill="#3182CE" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Doanh thu theo tháng</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#38A169" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {stats.topTours?.length > 0 && (
            <div className="mt-10 bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Top 5 tour được đặt nhiều nhất</h3>
              <div className="space-y-4">
                {stats.topTours.map((tour, index) => (
                    <div key={index} className="border-b pb-2">
                      <p className="font-semibold text-gray-800">
                        #{index + 1} - {tour.tourName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {tour.bookings} lượt đặt | {tour.revenue.toLocaleString()} VND
                      </p>
                    </div>
                ))}
              </div>
            </div>
        )}
      </div>
  );
};

const SummaryCard = ({ icon, label, value }) => (
    <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
      <div>{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
);

export default AdminDashboard;
