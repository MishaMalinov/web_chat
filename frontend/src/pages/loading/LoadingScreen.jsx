// components/LoadingScreen.jsx
import React from "react";
import "./LoadingScreen.css"; // необов’язково для стилів

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingScreen;
