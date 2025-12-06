import React from "react";
import  DoctorSidebar  from "../component/DoctorSidebar";
import  DoctorHeader  from "../component/DoctorHeader";

export default function DoctorLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <DoctorSidebar />

      {/* Phần nội dung chính */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DoctorHeader />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
