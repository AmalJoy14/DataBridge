"use client"

import { useState, useEffect } from "react"
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
  onResetPreviewData, // new prop
}) => {
  const [selectAll, setSelectAll] = useState(false)
  const [tempSelectedColumns, setTempSelectedColumns] = useState([])

  // Reset previewData when availableColumns change
  useEffect(() => {
    setTempSelectedColumns([])
    setSelectAll(false)
  }, [availableColumns])

  // Sync with parent when preview is triggered
  const handlePreview = () => {
    onColumnSelect(tempSelectedColumns) // this will update parent state
  }

  useEffect(() => {
    if (selectedColumns.length > 0) {
      onPreview(selectedColumns)
    }
  }, [selectedColumns])

  useEffect(() => {
    setTempSelectedColumns(selectedColumns)
    setSelectAll(selectedColumns.length === availableColumns.length)
  }, [selectedColumns, availableColumns])

  // Reset previewData on column selection change
  useEffect(() => {
    if (onResetPreviewData) {
      onResetPreviewData()
    }
  }, [tempSelectedColumns])

  const handleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)
    if (newSelectAll) {
      setTempSelectedColumns([...availableColumns])
    } else {
      setTempSelectedColumns([])
    }
  }

  const handleColumnToggle = (column) => {
    const isSelected = tempSelectedColumns.some((col) => col.id === column.id)
    if (isSelected) {
      setTempSelectedColumns(tempSelectedColumns.filter((col) => col.id !== column.id))
    } else {
      setTempSelectedColumns([...tempSelectedColumns, column])
    }
  }

  // const handlePreview = () => {
  //   onColumnSelect(tempSelectedColumns)
  //   onPreview()
  // }

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
          {tempSelectedColumns.length} of {availableColumns.length} columns selected
        </div>
      </div>

      <div className={styles.columnsContainer}>
        {availableColumns.map((column) => (
          <div
            key={column.id}
            className={`${styles.columnItem} ${tempSelectedColumns.some((col) => col.id === column.id) ? styles.selected : ""}`}
          >
            <label className={styles.checkboxContainer}>
              <input
                type="checkbox"
                checked={tempSelectedColumns.some((col) => col.id === column.id)}
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
          <p>Preview of the first 100 rows of data:</p>
          <div className={styles.tableWrapper}>
            <table className={styles.previewTable}>
              <thead>
                <tr>
                  {tempSelectedColumns.map((column) => (
                    <th key={column.id}>{column.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.data.map((row, index) => (
                  <tr key={index}>
                    {tempSelectedColumns.map((column) => (
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
            onClick={handlePreview}
            disabled={status === "fetching" || tempSelectedColumns.length === 0}
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
