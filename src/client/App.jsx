// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ProfilePage from "./components/ProfilePage";

function App() {
  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/me" element={<ProfilePage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
