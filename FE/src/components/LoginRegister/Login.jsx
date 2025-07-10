import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import background from '../../assets/background.jpg';
import { BiUser } from 'react-icons/bi';
import { AiOutlineUnlock, AiOutlineLock } from 'react-icons/ai';
import { jwtDecode } from 'jwt-decode'; // ✅ đúng cho v4 trở lên

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8084/auth/login', {
        username,
        password
      });

      const data = response.data;

      if (!data.token) {
        setError("Không nhận được token!");
        return;
      }

      const token = data.token;
      const decoded = jwtDecode(token);

      // ✅ Chuẩn hóa roles: loại bỏ khoảng trắng, thêm "ROLE_" nếu thiếu
// 👇 Giữ nguyên như backend yêu cầu
      let roles = decoded.roles || [];
      roles = roles.map(role => {
        const clean = role.replace(/\s+/g, '_').toUpperCase(); // "role admin" -> "ROLE_ADMIN"
        return clean.startsWith("ROLE_") ? clean.slice(5) : clean; // 👉 bỏ prefix "ROLE_" => chỉ còn "ADMIN"
      });


      const userId = decoded.sub;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("roles", JSON.stringify(roles));

      console.log("User ID:", userId);
      console.log("Roles:", roles);

      if (roles.includes("ADMIN")) {
        navigate("/admin");
      } else if (roles.includes("USER")) {
        navigate("/home");
      } else {
        setError("Không xác định vai trò người dùng.");
      }
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      setError(err.response?.data?.message || "Lỗi đăng nhập.");
    }
  };
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (newPassword.length < 8) {
      setPasswordError("🔒 Mật khẩu phải ít nhất 8 ký tự!");
    } else {
      setPasswordError("");
    }
  };


  return (
      <div
          className="h-screen w-full bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: `url(${background})` }}
      >
        <div className="bg-black bg-opacity-40 rounded-xl px-10 py-8 shadow-lg backdrop-blur-md text-white w-[350px]">
          <h1 className="text-3xl font-bold text-center mb-6">Đăng nhập</h1>

          <form onSubmit={handleLogin}>
            {/* User Name */}
            <div className="relative my-4">
              <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full py-2 px-3 bg-transparent border-b-2 border-gray-300 text-sm focus:outline-none focus:border-blue-500 peer"
                  placeholder="Nhập tên tài khoản"
                  required
              />
              <BiUser className="absolute right-3 top-2.5 text-lg" />
            </div>

            {/* Password */}
            <div className="relative my-4">
              <input
                  type={showPassword ? "text" : "password"}
                  value={password}
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
            {passwordError && <div className="text-red-400 text-sm -mt-2 mb-2">{passwordError}</div>}


            {/* Error Message */}
            {error && <div className="text-red-400 text-sm mb-2">{error}</div>}

            {/* Remember me & Forgot */}
            <div className="flex justify-between items-center text-sm mb-4">

              <Link to="/forgot-password" className="text-blue-400 hover:underline">
                Quên mật khẩu ?
              </Link>
            </div>

            {/* Login button */}
            <button
                type="submit"
                className="w-full bg-white text-emerald-800 rounded-full py-2 font-semibold hover:bg-emerald-700 hover:text-white transition duration-300"
            >
              Đăng nhập
            </button>

            {/* Register */}
            <div className="text-center mt-4 text-sm">
              <Link to="/register" className="text-blue-400 hover:underline">
                Tạo tài khoản mới
              </Link>
            </div>
          </form>
        </div>
      </div>
  );
};

export default Login;
