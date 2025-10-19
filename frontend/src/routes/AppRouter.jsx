import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserList from "../pages/UserList";
import UserForm from "../pages/UserForm";
import HomePage from "../pages/HomePage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/new" element={<UserForm />} />
      </Routes>
    </BrowserRouter>
  );
}
