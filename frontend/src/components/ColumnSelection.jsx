"use client"

import { useState } from "react"
import styles from "./ColumnSelection.module.css"

const ColumnSelection = ({
  availableColumns,
  selectedColumns,
  onColumnSelect,
  onBack,
  onNext,
  onPreview,
  previewData,
  status,
  error,
  darkMode,
}) => {
  const [selectAll, setSelectAll] = useState(false)

  const handleSelectAll = () => {
    if (selectAll) {
      onColumnSelect([])
    } else {
      onColumnSelect([...availableColumns])
    }
    setSelectAll(!selectAll)
  }

  const handleColumnToggle = (column) => {
    const isSelected = selectedColumns.some((col) => col.id === column.id)

    if (isSelected) {
      onColumnSelect(selectedColumns.filter((col) => col.id !== column.id))
    } else {
      onColumnSelect([...selectedColumns, column])
    }
  }

  return (
    <div className={`${styles.columnSelection} ${darkMode ? styles.darkMode : ""}`}>
      <h3>Select Columns</h3>
      <p>Choose the columns you want to include in the data ingestion:</p>

      <div className={styles.selectionHeader}>
        <div className={styles.selectAllContainer}>
          <label className={styles.checkboxContainer}>
            <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
            <span className={styles.checkmark}></span>
            Select All Columns
          </label>
        </div>

        <div className={styles.columnCount}>
          {selectedColumns.length} of {availableColumns.length} columns selected
        </div>
      </div>

      <div className={styles.columnsContainer}>
        {availableColumns.map((column) => (
          <div
            key={column.id}
            className={`${styles.columnItem} ${selectedColumns.some((col) => col.id === column.id) ? styles.selected : ""}`}
          >
            <label className={styles.checkboxContainer}>
              <input
                type="checkbox"
                checked={selectedColumns.some((col) => col.id === column.id)}
                onChange={() => handleColumnToggle(column)}
              />
              <span className={styles.checkmark}></span>
              <div className={styles.columnInfo}>
                <div className={styles.columnName}>{column.name}</div>
                <div className={styles.columnType}>{column.type}</div>
              </div>
            </label>
          </div>
        ))}
      </div>

      {previewData && (
        <div className={styles.previewContainer}>
          <h4>Data Preview</h4>
          <div className={styles.tableWrapper}>
            <table className={styles.previewTable}>
              <thead>
                <tr>
                  {selectedColumns.map((column) => (
                    <th key={column.id}>{column.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, index) => (
                  <tr key={index}>
                    {selectedColumns.map((column) => (
                      <td key={column.id}>{row[column.name]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.formActions}>
        <button className={styles.backButton} onClick={onBack} disabled={status === "fetching"}>
          Back
        </button>

        <div>
          <button
            className={styles.previewButton}
            onClick={onPreview}
            disabled={status === "fetching" || selectedColumns.length === 0}
          >
            {status === "fetching" ? "Loading..." : "Preview Data"}
          </button>

          <button className={styles.nextButton} onClick={onNext} disabled={selectedColumns.length === 0}>
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default ColumnSelection
