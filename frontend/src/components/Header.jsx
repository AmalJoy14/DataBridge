"use client"

import { useState } from "react"
import styles from "./Header.module.css"
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi"
import { FaDatabase } from "react-icons/fa"

const Header = ({ darkMode, toggleDarkMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className={`${styles.header} ${darkMode ? styles.darkMode : ""}`}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <FaDatabase className={styles.logoIcon} />
          <h1>DataBridge</h1>
        </div>

        <div className={styles.mobileMenuButton} onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </div>

        <nav className={`${styles.nav} ${mobileMenuOpen ? styles.mobileMenuOpen : ""}`}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <a href="#" className={styles.active}>
                Dashboard
              </a>
            </li>
            <li className={styles.navItem}>
              <a href="#">History</a>
            </li>
            <li className={styles.navItem}>
              <a href="#">Settings</a>
            </li>
            <li className={styles.navItem}>
              <a href="#">Help</a>
            </li>
          </ul>
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
