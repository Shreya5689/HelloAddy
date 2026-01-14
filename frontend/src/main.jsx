import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login.jsx";
import App from "./App.jsx";
import "./index.css";
import Home from "./components/Home.jsx";
import Signup from "./components/Signup.jsx";
import Problems from "./components/Problems.jsx";
import Ranking from "./components/Ranking.jsx";
import TodoWishlist from "./components/Todo_wishlist.jsx";
import Workspace from "./components/Workspace.jsx";
import User_profile from "./components/User_profile.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />

    <Route path="/" element={<App />}>
      <Route index element={<Navigate to="problems" replace />} />
      <Route path="problems" element={<Problems />} />
      <Route path="ranking" element={<Ranking />} />
      <Route path="todo" element={<TodoWishlist/>} />
      <Route path="home" element={<Home/>}/>
      <Route path="workspace" element={<Workspace/>}/>
      <Route path="user" element={<User_profile/>}/>
      </Route>
  </Routes>
  </BrowserRouter>
);
