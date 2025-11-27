import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9fafb",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ color: "#2563eb" }}>🏥 Quản lý Sức khỏe Gia đình</h1>
      <p style={{ marginTop: "10px", color: "#555" }}>
        Chào mừng đến với hệ thống quản lý hồ sơ sức khỏe gia đình.
      </p>

      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <Link
          to="/users"
          style={{
            padding: "10px 16px",
            backgroundColor: "#2563eb",
            color: "white",
            borderRadius: "6px",
            textDecoration: "none",
          }}
        >
          Xem danh sách User
        </Link>

        <Link
          to="/users/new"
          style={{
            padding: "10px 16px",
            backgroundColor: "#16a34a",
            color: "white",
            borderRadius: "6px",
            textDecoration: "none",
          }}
        >
          Thêm User mới
        </Link>
      </div>
    </div>
  );
}
