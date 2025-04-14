"use client"

import { useState } from "react"
import styles from "./SourceSelection.module.css"
import { FiDatabase, FiFile, FiArrowRight } from "react-icons/fi"

const SourceSelection = ({ onSourceChange, darkMode }) => {
  const [source, setSource] = useState("")
  const [target, setTarget] = useState("")

  const handleSourceClick = (selectedSource) => {
    setSource(selectedSource)
    setTarget(selectedSource === "clickhouse" ? "flatfile" : "clickhouse")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (source && target) {
      onSourceChange(source, target)
    }
  }

  return (
    <div className={`${styles.sourceSelection} ${darkMode ? styles.darkMode : ""}`}>
      <h3>Select Source and Target</h3>
      <p>Choose the source and target for your data ingestion:</p>

      <form onSubmit={handleSubmit}>
        <div className={styles.selectionContainer}>
          <div className={styles.sourceContainer}>
            <h4>Source</h4>
            <div className={styles.options}>
              <div
                className={`${styles.option} ${source === "clickhouse" ? styles.selected : ""}`}
                onClick={() => handleSourceClick("clickhouse")}
              >
                <div className={styles.iconContainer}>
                  <FiDatabase className={styles.icon} />
                </div>
                <div className={styles.optionLabel}>ClickHouse</div>
              </div>

              <div
                className={`${styles.option} ${source === "flatfile" ? styles.selected : ""}`}
                onClick={() => handleSourceClick("flatfile")}
              >
                <div className={styles.iconContainer}>
                  <FiFile className={styles.icon} />
                </div>
                <div className={styles.optionLabel}>Flat File</div>
              </div>
            </div>
          </div>

          {source && (
            <>
              <div className={styles.arrow}>
                <FiArrowRight />
              </div>

              <div className={styles.targetContainer}>
                <h4>Target</h4>
                <div className={styles.options}>
                  <div className={`${styles.option} ${styles.selected}`}>
                    <div className={styles.iconContainer}>
                      {target === "clickhouse" ? (
                        <FiDatabase className={styles.icon} />
                      ) : (
                        <FiFile className={styles.icon} />
                      )}
                    </div>
                    <div className={styles.optionLabel}>{target === "clickhouse" ? "ClickHouse" : "Flat File"}</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.nextButton} disabled={!source}>
            Next
          </button>
        </div>
      </form>
    </div>
  )
}

export default SourceSelection
