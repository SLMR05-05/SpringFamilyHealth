import { useState } from 'react'
import './index.css'
import Login from './page/Login.jsx'
import Dashboard from "./page/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  const [count, setCount] = useState(0)

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
