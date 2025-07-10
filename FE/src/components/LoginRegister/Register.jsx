import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import background from '../../assets/background.jpg';
import { BiUser } from 'react-icons/bi';
import { AiOutlineUnlock, AiOutlineLock } from 'react-icons/ai';
import { FaRegCalendarAlt } from 'react-icons/fa';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    dob: '',
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [usernameExists, setUsernameExists] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const checkUsernameAvailability = async (username) => {
    try {
      const response = await axios.get(`http://localhost:8084/auth/check-username/${username}`);
      setUsernameExists(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'username') {
      await checkUsernameAvailability(value);
      if (usernameExists) {
        setErrorMessage('Username đã tồn tại, vui lòng chọn tên khác');
      } else {
        setErrorMessage('');
      }
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;

    setFormData((prev) => ({
      ...prev,
      password: newPassword
    }));

    if (newPassword.length < 8) {
      setPasswordError("🔒 Mật khẩu phải ít nhất 8 ký tự!");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8084/auth/register', formData);
      if (response.status === 201) {
        alert('Đăng ký thành công!');
        navigate('/home');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage('Đã có lỗi xảy ra, vui lòng thử lại!');
      }
      console.error(error);
    }
  };

  return (
      <div
          className="h-screen w-full bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: `url(${background})` }}
      >
        <div className="bg-black bg-opacity-40 rounded-xl px-10 py-8 shadow-lg backdrop-blur-md text-white w-[350px]">
          <h1 className="text-3xl font-bold text-center mb-6">Đăng ký</h1>
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="relative my-4">
              <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full py-2 px-3 bg-transparent border-b-2 border-gray-300 text-sm focus:outline-none focus:border-blue-500 peer"
                  placeholder="Tên tài khoản"
                  required
              />
              <BiUser className="absolute right-3 top-2.5 text-lg" />
            </div>
            {usernameExists && (
                <p className="text-red-500 text-center">Tên người dùng đã tồn tại!</p>
            )}

            {/* First Name */}
            <div className="relative my-4">
              <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="block w-full py-2 px-3 bg-transparent border-b-2 border-gray-300 text-sm focus:outline-none focus:border-blue-500 peer"
                  placeholder="Tên"
                  required
              />
              <BiUser className="absolute right-3 top-2.5 text-lg" />
            </div>

            {/* Last Name */}
            <div className="relative my-4">
              <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="block w-full py-2 px-3 bg-transparent border-b-2 border-gray-300 text-sm focus:outline-none focus:border-blue-500 peer"
                  placeholder="Họ"
                  required
              />
              <BiUser className="absolute right-3 top-2.5 text-lg" />
            </div>

            {/* Date of Birth */}
            <div className="relative my-4">
              <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="block w-full py-2 px-3 bg-transparent border-b-2 border-gray-300 text-sm text-white focus:outline-none focus:border-blue-500 peer"
                  required
              />
              <FaRegCalendarAlt className="absolute right-3 top-2.5 text-lg" />
            </div>

            {/* Password */}
            <div className="relative my-4">
              <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  className="block w-full py-2 px-3 bg-transparent border-b-2 border-gray-300 text-sm focus:outline-none focus:border-blue-500 peer"
                  placeholder="Nhập mật khẩu"
                  required
              />
              <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-lg"
              >
                {showPassword ? <AiOutlineUnlock /> : <AiOutlineLock />}
              </button>
            </div>
            {passwordError && (
                <div className="text-red-400 text-sm -mt-2 mb-2">{passwordError}</div>
            )}

            {/* Error tổng */}
            {errorMessage && (
                <p className="text-red-500 text-center">{errorMessage}</p>
            )}

            {/* Submit */}
            <button
                type="submit"
                className="w-full bg-white text-emerald-800 rounded-full py-2 font-semibold hover:bg-emerald-700 hover:text-white transition duration-300"
            >
              Đăng ký
            </button>

            {/* Link đến Login */}
            <div className="text-center mt-4 text-sm">
              Đã có tài khoản?{" "}
              <Link to="/login" className="text-blue-400 hover:underline">
                Đăng nhập
              </Link>
            </div>
          </form>
        </div>
      </div>
  );
};

export default Register;
