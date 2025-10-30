import { useState } from 'react'
import './index.css'
import Login from './page/Login.jsx'
import Dashboard from "./page/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
function App() {
    const { t, i18n } = useTranslation();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
      );
}

export default App
