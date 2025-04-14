import styles from "./Footer.module.css"

const Footer = ({ darkMode }) => {
  return (
    <footer className={`${styles.footer} ${darkMode ? styles.darkMode : ""}`}>
      <div className={styles.container}>
        <p>&copy; {new Date().getFullYear()} DataBridge. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
