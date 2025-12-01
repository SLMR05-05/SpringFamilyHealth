import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="auth-layout min-h-screen flex items-center justify-center bg-gray-50">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
