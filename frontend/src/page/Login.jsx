import {useState} from 'react';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// import { useTranslation } from "react-i18next";
export default function Login() {
    const {t} = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Gia đình');
    const navigate = useNavigate();
    
    const handleLogin = () => {
        console.log('Login:', { email, password, role });
//         alert(`Đăng nhập với vai trò: ${role}`);
        navigate("Dashboard");
    };
    const handleDemoLogin = (demoRole) => {
//         alert(`Đăng nhập nhanh với vai trò: ${demoRole}`);
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
            {/* Header */}
            <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {t("LoginPage.Welcome")}  {t("LoginPage.Name")}
            </h1>
            <p className="text-gray-500">
                {t("LoginPage.LoginToProject")} {t("LoginPage.Name")}
            </p>
            </div>

            {/* Login Form */}
            <div className="space-y-5">
            {/* Email Input */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("LoginPage.Email")}
                </label>
                <input
                type="email"
                placeholder= {t("LoginPage.EnterYourEmail")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
            </div>

            {/* Password Input */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mật khẩu
                </label>
                <input
                type="password"
                placeholder={t("LoginPage.EnterYourPassword")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
            </div>
            {/* Role Select */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                Vai trò
                </label>
                <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none cursor-pointer"
                >
                <option value="Gia đình">Gia đình</option>
                <option value="Bác sĩ">Bác sĩ</option>
                <option value="Quản trị viên">Quản trị viên</option>
                </select>
            </div>

            {/* Login Button */}
            <button
                onClick={handleLogin}
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition duration-200 shadow-md"
            >
                {t("LoginPage.Login")}
            </button>
            </div>

            {/* Demo Login Section */}
            <div className="mt-8">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                    Đăng nhập nhanh (Demo):
                </span>
                </div>
            </div>

            <div className="mt-6 space-y-3">
                {/* Manager Demo Button */}
                <button
                onClick={() => handleDemoLogin('Quản trị viên')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition duration-200"
                >
                <span className="text-xl">🔧</span>
                <span className="font-medium text-gray-700">Quản trị viên</span>
                </button>

                {/* Doctor Demo Button */}
                <button
                onClick={() => handleDemoLogin('Bác sĩ')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition duration-200"
                >
                <span className="text-xl">👨‍⚕️</span>
                <span className="font-medium text-gray-700">Bác sĩ</span>
                </button>

                {/* Family Demo Button */}
                <button
                onClick={() => handleDemoLogin('Gia đình')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition duration-200"
                >
                <span className="text-xl">👨‍👩‍👧‍👦</span>
                <span className="font-medium text-gray-700">Gia đình</span>
                </button>
            </div>
            </div>
        </div>

        {/* Help Button */}
        <button className="fixed bottom-6 right-6 w-12 h-12 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition duration-200 flex items-center justify-center">
            <span className="text-xl">?</span>
        </button>
        </div>
    );
    }