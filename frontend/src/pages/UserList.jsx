import React, { useEffect, useState } from "react";
import userApi from "../api/userApi";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userApi.getAll();
        setUsers(res.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: 40 }}>Đang tải...</p>;
  }

  if (users.length === 0) {
    return <p style={{ textAlign: "center", marginTop: 40 }}>Không có user nào!</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>👥 Danh sách người dùng</h2>
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          marginTop: "20px",
          textAlign: "left",
        }}
      >
        <thead>
          <tr>
            <th style={{ borderBottom: "2px solid #ccc", padding: "8px" }}>ID</th>
            <th style={{ borderBottom: "2px solid #ccc", padding: "8px" }}>Tên</th>
            <th style={{ borderBottom: "2px solid #ccc", padding: "8px" }}>Email</th>
            <th style={{ borderBottom: "2px solid #ccc", padding: "8px" }}>Số điện thoại</th>
            <th style={{ borderBottom: "2px solid #ccc", padding: "8px" }}>Vai trò</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.userId}>
              <td style={{ padding: "8px" }}>{u.userId}</td>
              <td style={{ padding: "8px" }}>{u.name}</td>
              <td style={{ padding: "8px" }}>{u.email}</td>
              <td style={{ padding: "8px" }}>{u.phone}</td>
              <td style={{ padding: "8px" }}>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
