// ReponsiveSider.jsx (Đã sửa)

import React from "react";
import MenuCustom from "./Menu";

const ReponsiveSider = () => {
  return (
    // Giữ lại một wrapper chính với các class responsive và căn giữa
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
      
    >
      {/* Loại bỏ wrapper lồng nhau ở đây: */}
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"> */}
        <MenuCustom />
      {/* </div> */}
    </div>
  );
};

export default ReponsiveSider;