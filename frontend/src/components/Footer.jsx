import styles from "./Footer.module.css"

const Footer = ({ darkMode }) => {
  return (
    <footer className={`${styles.footer} ${darkMode ? styles.darkMode : ""}`}>
      <div className={styles.container}>
        <p>&copy; {new Date().getFullYear()} DataBridge. All rights reserved.</p>
        <div className={styles.links}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
