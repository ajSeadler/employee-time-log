// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Layout from "./components/Layout";

function App() {
  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/me" element={<Layout />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
