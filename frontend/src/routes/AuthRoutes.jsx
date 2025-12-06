import React from "react";
import { Navigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
// use older login UI that integrates with AuthProvider
// import LoginPage from "../page/Login";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";


export const AuthRoutes = {
    children: [
        {
            path:"/auth",
            element: <AuthLayout/>,
            children: [
                {
                    index: true,
                    element: <Navigate to="login" replace />
                },
                {
                    path: "login",  
                    element: <LoginPage />
                },
                {
                    path: "register",
                    element: <RegisterPage />
                },
                {
                    path: "forgot-password",
                    element: <ForgotPasswordPage />
                }

            ]
        }
    ]
}