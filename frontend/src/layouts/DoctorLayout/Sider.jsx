// ReponsiveSider.jsx - Menu chính và menu phụ

import React from "react";
import MenuCustom from "./Menu";
import SubMenu from "./SubMenu";

const ReponsiveSider = ({ hasViewedPatients }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      {/* Menu chính - luôn hiển thị */}
      <MenuCustom />
      
      {/* Menu phụ - chỉ hiển thị khi đã nhấn "Xem bệnh nhân" */}
      {hasViewedPatients && (
        <div className="mt-3">
          <SubMenu />
        </div>
      )}
    </div>
  );
};

export default ReponsiveSider;