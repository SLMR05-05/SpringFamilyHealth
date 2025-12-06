import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Thêm Link
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../context/AuthProvider";

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [role, setRole] = useState("Gia đình"); // Có thể bỏ nếu không dùng trong UI
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const success = await login(email, password);
      
      if (success) {
        // Lấy thông tin user từ localStorage sau khi login thành công
        // Lưu ý: Đảm bảo hàm login() trong AuthProvider đã setItem 'user'
        const userInfo = JSON.parse(localStorage.getItem('user'));
        
        if (userInfo) {
            const userRole = userInfo.role?.toUpperCase(); // Normalize to uppercase
            switch (userRole) {
            case "ADMIN":
                navigate("/admin");
                break;
            case "DOCTOR":
                navigate("/doctor"); // Hoặc trang dashboard bác sĩ
                break;
            case "USER":
            default:
                navigate("/user-dashboard");
                break;
            }
        } else {
             navigate("/user-dashboard"); // Fallback mặc định
        }
      } else {
        setError("Tên đăng nhập hoặc mật khẩu không đúng");
      }
    } catch (error) {
      setError(error.message || "Đã xảy ra lỗi khi đăng nhập");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex items-center justify-center p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-2xl w-full max-w-md p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-bl-full opacity-30 blur-2xl"></div>

        <div className="text-center mb-8 relative z-10">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            {t("LoginPage.Welcome")} {t("LoginPage.Name")}
          </h1>
          <p className="text-gray-500">
            {t("LoginPage.LoginToProject")} {t("LoginPage.Name")}
          </p>
        </div>

        {/* FORM START */}
        <motion.form
          onSubmit={handleLogin}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-5 relative z-10"
        >
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t("LoginPage.Email")}
            </label>
            <input
              type="email"
              placeholder={t("LoginPage.EnterYourEmail")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t("LoginPage.Password")}
            </label>
            <div className="relative">
                <input
                type={showPassword ? "text" : "password"}
                placeholder={t("LoginPage.EnterYourPassword")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition pr-10"
                />
                <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-500 hover:text-indigo-600 focus:outline-none"
                >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
            {/* Forgot Password Link */}
            <div className="flex justify-end mt-2">
                <span 
                    onClick={() => navigate("/auth/forgot-password")}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium hover:underline cursor-pointer"
                >
                    {t("LoginPage.ForgotPassword")}
                </span>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm text-center bg-red-50 p-2 rounded border border-red-100"
            >
                {error}
            </motion.p>
          )}
      
          {/* Login button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 shadow-lg mt-2"
          >
            {t("LoginPage.Login")}
          </motion.button>

          {/* Register Link */}
          <div className="text-center mt-6 text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <span 
                onClick={() => navigate("/auth/register")}
                className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline transition cursor-pointer"
            >
                {t("LoginPage.Register")}
            </span>
          </div>

        </motion.form>
        {/* FORM END */}
      </motion.div>

      {/* Help Button (Giữ nguyên) */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-6 right-6 w-12 h-12 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 flex items-center justify-center text-xl z-50"
        onClick={() => alert("Liên hệ hỗ trợ: support@familyhealth.com")}
      >
        ?
      </motion.button>
    </div>
  );
}