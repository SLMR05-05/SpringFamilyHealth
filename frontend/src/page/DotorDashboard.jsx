import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { motion } from "framer-motion";
import DoctorLayout from "../layout/DoctorLayout";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// 🔧 Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function DoctorDashboard() {
  // 📊 Dữ liệu bệnh nhân theo tháng
  const patientData = {
    labels: ["T1", "T2", "T3", "T4", "T5", "T6"],
    datasets: [
      {
        label: "Số bệnh nhân",
        data: [45, 60, 50, 70, 80, 90],
        backgroundColor: "rgba(59,130,246,0.8)",
        borderRadius: 6,
      },
    ],
  };

  // 📉 Dữ liệu lịch hẹn
  const appointmentData = {
    labels: ["T1", "T2", "T3", "T4", "T5", "T6"],
    datasets: [
      {
        label: "Số lịch hẹn",
        data: [20, 30, 25, 35, 40, 45],
        fill: true,
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.1)",
        tension: 0.4,
        pointBackgroundColor: "#10b981",
      },
    ],
  };

  // 🥧 Dữ liệu bệnh phổ biến
  const diseaseData = {
    labels: ["Cảm cúm", "Tiểu đường", "Huyết áp", "Viêm phổi"],
    datasets: [
      {
        label: "Bệnh phổ biến",
        data: [30, 25, 20, 25],
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  // ⚙️ Cấu hình chung cho biểu đồ
  const defaultOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: false },
    },
  };

  return (
    <DoctorLayout>
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* 🩺 Tiêu đề */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-gray-800"
      >
        📋 Bảng điều khiển bác sĩ
      </motion.h1>

      {/* 📦 Cards tổng quan */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {[
          { label: "Tổng bệnh nhân", value: 420, color: "text-blue-600" },
          { label: "Lịch hẹn hôm nay", value: 12, color: "text-green-600" },
          { label: "Báo cáo y tế", value: 8, color: "text-yellow-600" },
        ].map((card, idx) => (
          <motion.div
            key={idx}
            className="bg-white shadow rounded-2xl p-4"
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-gray-500 text-sm">{card.label}</h2>
            <p className={`text-2xl font-bold mt-2 ${card.color}`}>
              {card.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* 📈 Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biểu đồ cột */}
        <motion.div
          className="bg-white p-6 rounded-2xl shadow"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-lg font-semibold mb-4">Bệnh nhân theo tháng</h2>
          <Bar data={patientData} options={defaultOptions} />
        </motion.div>

        {/* Biểu đồ đường */}
        <motion.div
          className="bg-white p-6 rounded-2xl shadow"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-lg font-semibold mb-4">
            Số lịch hẹn theo thời gian
          </h2>
          <Line data={appointmentData} options={defaultOptions} />
        </motion.div>

        {/* Biểu đồ tròn */}
        <motion.div
          className="bg-white p-6 rounded-2xl shadow lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-lg font-semibold mb-4">Tỷ lệ bệnh phổ biến</h2>
          <div className="w-64 mx-auto">
            <Pie data={diseaseData} options={defaultOptions} />
          </div>
        </motion.div>
      </div>
    </div>
    </DoctorLayout>
  );
}
