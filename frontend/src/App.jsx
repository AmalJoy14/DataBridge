"use client"

import { useState } from "react"
import Header from "./components/Header"
import Dashboard from "./components/Dashboard"
import Footer from "./components/Footer"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import styles from "./App.module.css"

function App() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div className={`${styles.app} ${darkMode ? styles.darkMode : ""}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className={styles.main}>
        <Dashboard darkMode={darkMode} />
      </main>
      <Footer darkMode={darkMode} />
      <ToastContainer position="bottom-right" theme={darkMode ? "dark" : "light"} />
    </div>
  )
}

export default App
