// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/NavBar';

function App() {
  return (
    <>
    <div>
      <Navbar />
  
      <Routes>
        <Route path="/" element={<Home />} />
        
      </Routes>
    </div>
    </>
  );
}

export default App;
