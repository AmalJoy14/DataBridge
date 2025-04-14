"use client"

import styles from "./IngestionControls.module.css"
import { FiDatabase, FiFile, FiArrowRight } from "react-icons/fi"

const IngestionControls = ({
  sourceType,
  targetType,
  selectedTable,
  selectedColumns,
  onStartIngestion,
  onBack,
  status,
  darkMode,
}) => {
  return (
    <div className={`${styles.ingestionControls} ${darkMode ? styles.darkMode : ""}`}>
      <h3>Data Ingestion</h3>
      <p>Review your selection and start the data ingestion process:</p>

      <div className={styles.summaryCard}>
        <div className={styles.summaryHeader}>
          <h4>Ingestion Summary</h4>
        </div>

        <div className={styles.summaryContent}>
          <div className={styles.summaryFlow}>
            <div className={styles.sourceInfo}>
              <div className={styles.iconContainer}>
                {sourceType === "clickhouse" ? (
                  <FiDatabase className={styles.icon} />
                ) : (
                  <FiFile className={styles.icon} />
                )}
              </div>
              <div className={styles.sourceDetails}>
                <div className={styles.sourceType}>{sourceType === "clickhouse" ? "ClickHouse" : "Flat File"}</div>
                {sourceType === "clickhouse" && <div className={styles.tableName}>Table: {selectedTable}</div>}
              </div>
            </div>

            <div className={styles.flowArrow}>
              <FiArrowRight />
            </div>

            <div className={styles.targetInfo}>
              <div className={styles.iconContainer}>
                {targetType === "clickhouse" ? (
                  <FiDatabase className={styles.icon} />
                ) : (
                  <FiFile className={styles.icon} />
                )}
              </div>
              <div className={styles.targetType}>{targetType === "clickhouse" ? "ClickHouse" : "Flat File"}</div>
            </div>
          </div>

          <div className={styles.columnsSummary}>
            <div className={styles.summaryLabel}>Selected Columns:</div>
            <div className={styles.columnsList}>
              {selectedColumns.map((column, index) => (
                <span key={column.id} className={styles.columnTag}>
                  {column.name}
                  {index < selectedColumns.length - 1 && ", "}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.formActions}>
        <button className={styles.backButton} onClick={onBack} disabled={status === "ingesting"}>
          Back
        </button>

        <button className={styles.startButton} onClick={onStartIngestion} disabled={status === "ingesting"}>
          {status === "ingesting" ? "Ingesting Data..." : "Start Ingestion"}
        </button>
      </div>
    </div>
  )
}

export default IngestionControls
