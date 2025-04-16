"use client"

import styles from "./ResultsDisplay.module.css"
import { FiCheckCircle, FiClock, FiDatabase, FiFile, FiColumns } from "react-icons/fi"

const ResultsDisplay = ({ results, onReset, darkMode }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <div className={`${styles.resultsDisplay} ${darkMode ? styles.darkMode : ""}`}>
      <div className={styles.resultsHeader}>
        <div className={styles.successIcon}>
          <FiCheckCircle />
        </div>
        <h3>Ingestion Completed Successfully</h3>
      </div>

      <div className={styles.resultsCard}>
        <div className={styles.resultItem}>
          <div className={styles.resultIcon}>
            <FiDatabase />
          </div>
          <div className={styles.resultLabel}>Records Processed</div>
          <div className={styles.resultValue}>{results.recordsProcessed.toLocaleString()}</div>
        </div>

        <div className={styles.resultItem}>
          <div className={styles.resultIcon}>
            <FiClock />
          </div>
          <div className={styles.resultLabel}>Start Time</div>
          <div className={styles.resultValue}>{formatDate(results.startTime)}</div>
        </div>

        <div className={styles.resultItem}>
          <div className={styles.resultIcon}>
            <FiClock />
          </div>
          <div className={styles.resultLabel}>End Time</div>
          <div className={styles.resultValue}>{formatDate(results.endTime)}</div>
        </div>

        <div className={styles.resultItem}>
          <div className={styles.resultIcon}>{results.source === "clickhouse" ? <FiDatabase /> : <FiFile />}</div>
          <div className={styles.resultLabel}>Source</div>
          <div className={styles.resultValue}>{results.source === "clickhouse" ? "ClickHouse" : "Flat File"}</div>
        </div>

        <div className={styles.resultItem}>
          <div className={styles.resultIcon}>{results.target === "clickhouse" ? <FiDatabase /> : <FiFile />}</div>
          <div className={styles.resultLabel}>Target</div>
          <div className={styles.resultValue}>{results.target === "clickhouse" ? "ClickHouse" : "Flat File"}</div>
        </div>

        <div className={styles.resultItem}>
          <div className={styles.resultIcon}>
            <FiColumns />
          </div>
          <div className={styles.resultLabel}>Columns</div>
          <div className={styles.resultValue}>{results.columnsCount}</div>
        </div>
      </div>

      <div className={styles.actionsContainer}>
        <button className={styles.resetButton} onClick={onReset}>
          Start New Ingestion
        </button>

        <button
          className={styles.downloadButton}
          onClick={() => {
            const fileName = results.csvFile || "output.csv";
            const downloadUrl = `http://localhost:3000/api/clickhouse/download/${fileName}`;
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
          }}
        >
          Download Report
        </button>
      </div>
    </div>
  )
}

export default ResultsDisplay
