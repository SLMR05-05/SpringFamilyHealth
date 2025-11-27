import React from "react";
import AuthLayout from "../layouts/AuthLayout";
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