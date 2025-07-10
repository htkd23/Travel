import React, { useState } from 'react';
import axios from 'axios';
import { BiUser } from 'react-icons/bi';
import { AiOutlineUnlock } from 'react-icons/ai';
import background from '../../assets/background.jpg';
import { useNavigate } from 'react-router-dom';

const Password = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

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

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8084/api/auth/verify-otp', { email, otp });
      setMessage(res.data);
      // Lưu email vào localStorage (hoặc state management khác) để truyền sang trang đổi mật khẩu
      localStorage.setItem('resetEmail', email);
      navigate('/reset-password');
    } catch (err) {
      setMessage('OTP không đúng');
    }
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="bg-black bg-opacity-40 rounded-xl px-10 py-8 shadow-lg backdrop-blur-md text-white w-[350px]">
        <h1 className="text-3xl font-bold text-center mb-6">Quên mật khẩu</h1>
        <form onSubmit={step === 1 ? handleSendOTP : handleVerifyOTP}>
          {/* Nhập email */}
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

          {/* Nhập OTP */}
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

          <button
            type="submit"
            className="w-full bg-white text-emerald-800 rounded-full py-2 font-semibold hover:bg-emerald-700 hover:text-white transition duration-300"
          >
            {step === 1 ? 'Gửi mã OTP' : 'Xác minh OTP'}
          </button>
        </form>
        {message && <p className="text-sm text-center text-green-400 mt-2">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
