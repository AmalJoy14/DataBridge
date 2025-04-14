import styles from "./StatusDisplay.module.css"
import { FiLoader, FiCheck, FiAlertTriangle } from "react-icons/fi"

const StatusDisplay = ({ status, error, darkMode }) => {
  if (status === "idle" && !error) {
    return null
  }

  return (
    <div className={`${styles.statusDisplay} ${darkMode ? styles.darkMode : ""}`}>
      {status === "connecting" && (
        <div className={styles.statusItem}>
          <div className={`${styles.statusIcon} ${styles.connecting}`}>
            <FiLoader className={styles.spinnerIcon} />
          </div>
          <div className={styles.statusText}>
            <div className={styles.statusTitle}>Connecting to source...</div>
            <div className={styles.statusDescription}>Establishing connection to the data source.</div>
          </div>
        </div>
      )}

      {status === "fetching" && (
        <div className={styles.statusItem}>
          <div className={`${styles.statusIcon} ${styles.fetching}`}>
            <FiLoader className={styles.spinnerIcon} />
          </div>
          <div className={styles.statusText}>
            <div className={styles.statusTitle}>Fetching data...</div>
            <div className={styles.statusDescription}>Retrieving data from the source.</div>
          </div>
        </div>
      )}

      {status === "ingesting" && (
        <div className={styles.statusItem}>
          <div className={`${styles.statusIcon} ${styles.ingesting}`}>
            <FiLoader className={styles.spinnerIcon} />
          </div>
          <div className={styles.statusText}>
            <div className={styles.statusTitle}>Ingesting data...</div>
            <div className={styles.statusDescription}>Transferring data between source and target.</div>
          </div>
        </div>
      )}

      {status === "completed" && (
        <div className={styles.statusItem}>
          <div className={`${styles.statusIcon} ${styles.completed}`}>
            <FiCheck />
          </div>
          <div className={styles.statusText}>
            <div className={styles.statusTitle}>Ingestion completed</div>
            <div className={styles.statusDescription}>Data has been successfully transferred.</div>
          </div>
        </div>
      )}

      {error && (
        <div className={styles.statusItem}>
          <div className={`${styles.statusIcon} ${styles.error}`}>
            <FiAlertTriangle />
          </div>
          <div className={styles.statusText}>
            <div className={styles.statusTitle}>Error</div>
            <div className={styles.statusDescription}>{error}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StatusDisplay
