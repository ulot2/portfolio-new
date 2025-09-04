"use client"
import React from 'react'
import "@/styles/ThemeToggle.css";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useState } from 'react';

export const ThemeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const handleToggleTheme = () => {
      setIsDarkMode((prev) => !prev);
      document.body.classList.toggle('dark-theme');
    };

  return (
    <div onClick={handleToggleTheme} className='theme-toggle'>
      {isDarkMode ? <MdLightMode /> : <MdDarkMode />}
    </div>
  )
}
