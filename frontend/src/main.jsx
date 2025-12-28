import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login.jsx";
import App from "./App.jsx";
import "./index.css";
import Home from "./Home.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/app" element={<App />} />
      <Route path="/home" element={<Home/>}/>
    </Routes>
  </BrowserRouter>
);
