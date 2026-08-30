import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Recover from "./pages/Recover";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/recover/:id" element={<Recover />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;