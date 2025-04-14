"use client"

import { useState } from "react"
import styles from "./Header.module.css"
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi"
import myImage from '../assets/databridge-logo.png';

const Header = ({ darkMode, toggleDarkMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className={`${styles.header} ${darkMode ? styles.darkMode : ""}`}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img src={myImage} alt="DataBridge Logo" className={styles.logoImage} />
          <h1>DataBridge</h1>
        </div>

        <div className={styles.mobileMenuButton} onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </div>

        <nav className={`${styles.nav} ${mobileMenuOpen ? styles.mobileMenuOpen : ""}`}>
          <button
            className={styles.themeToggle}
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header
