// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login.jsx";
import Desktop from "./pages/Desktop/Desktop.jsx";

function App() {
  return (
    <>
      {/* <Login /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/desktop" element={<Desktop />} />
          {/* <Route path="/login1" element={<Login />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
