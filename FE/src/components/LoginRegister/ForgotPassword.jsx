import React, { useState } from 'react';
import axios from 'axios';
import { BiUser } from 'react-icons/bi';
import { AiOutlineUnlock } from 'react-icons/ai';
import background from '../../assets/background.jpg';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Step 1: Gửi OTP qua email
  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8084/api/auth/forgot-password', { email });
      setMessage(res.data);
      setStep(2);
    } catch (err) {
      setMessage('Gửi OTP thất bại');
    }
  };

  // Step 2: Xác minh OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8084/api/auth/verify-otp', { email, otp });
      setMessage(res.data);
      setStep(3);
    } catch (err) {
      setMessage('OTP không đúng');
    }
  };

  // Step 3: Đặt lại mật khẩu mới
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8084/api/auth/reset-password', {
        email,
        newPassword,
      });
      setMessage(res.data);
      setTimeout(() => navigate('/login'), 2000); // chuyển về login sau 2s
    } catch (err) {
      setMessage('Đổi mật khẩu thất bại');
    }
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="bg-black bg-opacity-40 rounded-xl px-10 py-8 shadow-lg backdrop-blur-md text-white w-[350px]">
        <h1 className="text-3xl font-bold text-center mb-6">Quên mật khẩu</h1>

        <form
          onSubmit={
            step === 1
              ? handleSendOTP
              : step === 2
              ? handleVerifyOTP
              : handleResetPassword
          }
        >
          {/* Bước 1: Nhập email */}
          {step === 1 && (
            <div className="relative my-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full py-2 px-3 bg-transparent border-b-2 border-gray-300 text-sm focus:outline-none focus:border-blue-500 peer"
                placeholder="Nhập email"
                required
              />
              <BiUser className="absolute right-3 top-2.5 text-lg" />
            </div>
          )}

          {/* Bước 2: Nhập OTP */}
          {step === 2 && (
            <div className="relative my-4">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                className="block w-full py-2 px-3 bg-transparent border-b-2 border-gray-300 text-sm focus:outline-none focus:border-blue-500 peer"
                placeholder="Nhập mã OTP"
                required
              />
              <AiOutlineUnlock className="absolute right-3 top-2.5 text-lg" />
            </div>
          )}

          {/* Bước 3: Nhập mật khẩu mới */}
          {step === 3 && (
            <div className="relative my-4">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full py-2 px-3 bg-transparent border-b-2 border-gray-300 text-sm focus:outline-none focus:border-blue-500 peer"
                placeholder="Nhập mật khẩu mới"
                required
              />
              <AiOutlineUnlock className="absolute right-3 top-2.5 text-lg" />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-white text-emerald-800 rounded-full py-2 font-semibold hover:bg-emerald-700 hover:text-white transition duration-300"
          >
            {step === 1
              ? 'Gửi mã OTP'
              : step === 2
              ? 'Xác minh OTP'
              : 'Tạo mật khẩu mới'}
          </button>
        </form>

        {message && <p className="text-sm text-center text-green-400 mt-2">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
