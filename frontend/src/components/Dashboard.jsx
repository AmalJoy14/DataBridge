"use client"

import { useState } from "react"
import styles from "./Dashboard.module.css"
import SourceSelection from "./SourceSelection"
import ConnectionForm from "./ConnectionForm"
import ColumnSelection from "./ColumnSelection"
import IngestionControls from "./IngestionControls"
import StatusDisplay from "./StatusDisplay"
import ResultsDisplay from "./ResultsDisplay"

const Dashboard = ({ darkMode }) => {
  const [activeStep, setActiveStep] = useState(1)
  const [sourceType, setSourceType] = useState("")
  const [targetType, setTargetType] = useState("")
  const [connectionParams, setConnectionParams] = useState({
    clickhouse: {
      host: "",
      port: "",
      database: "",
      user: "",
      token: "",
    },
    flatFile: {
      fileName: "",
      delimiter: ",",
    },
  })
  const [availableTables, setAvailableTables] = useState([])
  const [selectedTable, setSelectedTable] = useState("")
  const [availableColumns, setAvailableColumns] = useState([])
  const [selectedColumns, setSelectedColumns] = useState([])
  const [status, setStatus] = useState("idle") // idle, connecting, fetching, ingesting, completed, error
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [previewData, setPreviewData] = useState(null)

  const handleSourceChange = (source, target) => {
    setSourceType(source)
    setTargetType(target)
    setActiveStep(2)
  }

  const handleConnectionParamsChange = (type, params) => {
    setConnectionParams((prev) => ({
      ...prev,
      [type]: params,
    }))
  }

  const handleConnect = async () => {
    try {
      setStatus("connecting")
      setError(null)

      // Simulate API call to connect to source
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock data for tables
      if (sourceType === "clickhouse") {
        setAvailableTables(["uk_price_paid", "ontime", "hits", "visits"])
      }

      setStatus("idle")
      setActiveStep(3)
    } catch (err) {
      setStatus("error")
      setError("Failed to connect to the source. Please check your connection parameters.")
    }
  }

  const handleTableSelect = async (table) => {
    try {
      setSelectedTable(table)
      setStatus("fetching")
      setError(null)

      // Simulate API call to fetch columns
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data for columns
      if (table === "uk_price_paid") {
        setAvailableColumns([
          { id: 1, name: "transaction_id", type: "String" },
          { id: 2, name: "price", type: "UInt32" },
          { id: 3, name: "date_of_transfer", type: "Date" },
          { id: 4, name: "postcode", type: "String" },
          { id: 5, name: "property_type", type: "String" },
          { id: 6, name: "old_new", type: "String" },
          { id: 7, name: "duration", type: "String" },
          { id: 8, name: "town_city", type: "String" },
          { id: 9, name: "district", type: "String" },
          { id: 10, name: "county", type: "String" },
        ])
      } else if (table === "ontime") {
        setAvailableColumns([
          { id: 1, name: "Year", type: "UInt16" },
          { id: 2, name: "Quarter", type: "UInt8" },
          { id: 3, name: "Month", type: "UInt8" },
          { id: 4, name: "DayofMonth", type: "UInt8" },
          { id: 5, name: "DayOfWeek", type: "UInt8" },
          { id: 6, name: "FlightDate", type: "Date" },
          { id: 7, name: "UniqueCarrier", type: "String" },
          { id: 8, name: "AirlineID", type: "UInt32" },
          { id: 9, name: "Carrier", type: "String" },
          { id: 10, name: "TailNum", type: "String" },
        ])
      } else {
        setAvailableColumns([
          { id: 1, name: "column1", type: "String" },
          { id: 2, name: "column2", type: "UInt32" },
          { id: 3, name: "column3", type: "Date" },
        ])
      }

      setStatus("idle")
      setActiveStep(4)
    } catch (err) {
      setStatus("error")
      setError("Failed to fetch columns. Please try again.")
    }
  }

  const handleColumnSelect = (columns) => {
    setSelectedColumns(columns)
  }

  const handlePreview = async () => {
    try {
      if (selectedColumns.length === 0) {
        setError("Please select at least one column to preview.")
        return
      }

      setStatus("fetching")
      setError(null)

      // Simulate API call to fetch preview data
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock preview data
      const mockData = []
      for (let i = 0; i < 5; i++) {
        const row = {}
        selectedColumns.forEach((col) => {
          if (col.type === "UInt32" || col.type === "UInt16" || col.type === "UInt8") {
            row[col.name] = Math.floor(Math.random() * 1000)
          } else if (col.type === "Date") {
            row[col.name] = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
              .toISOString()
              .split("T")[0]
          } else {
            row[col.name] = `Sample ${col.name} ${i + 1}`
          }
        })
        mockData.push(row)
      }

      setPreviewData(mockData)
      setStatus("idle")
    } catch (err) {
      setStatus("error")
      setError("Failed to fetch preview data. Please try again.")
    }
  }

  const handleStartIngestion = async () => {
    try {
      if (selectedColumns.length === 0) {
        setError("Please select at least one column to ingest.")
        return
      }

      setStatus("ingesting")
      setError(null)
      setResults(null)

      // Simulate ingestion process
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Mock results
      setResults({
        recordsProcessed: Math.floor(Math.random() * 10000) + 5000,
        startTime: new Date(Date.now() - 3000).toISOString(),
        endTime: new Date().toISOString(),
        source: sourceType,
        target: targetType,
        table: selectedTable,
        columnsCount: selectedColumns.length,
      })

      setStatus("completed")
    } catch (err) {
      setStatus("error")
      setError("An error occurred during ingestion. Please try again.")
    }
  }

  const resetFlow = () => {
    setActiveStep(1)
    setSourceType("")
    setTargetType("")
    setSelectedTable("")
    setAvailableColumns([])
    setSelectedColumns([])
    setStatus("idle")
    setResults(null)
    setError(null)
    setPreviewData(null)
  }

  return (
    <div className={`${styles.dashboard} ${darkMode ? styles.darkMode : ""}`}>
      <div className={styles.header}>
        <h2>Data Ingestion Dashboard</h2>
        <p>Configure and execute bidirectional data transfers between ClickHouse and Flat Files</p>
      </div>

      <div className={styles.steps}>
        <div
          className={`${styles.step} ${activeStep >= 1 ? styles.active : ""} ${activeStep > 1 ? styles.completed : ""}`}
        >
          <div className={styles.stepNumber}>1</div>
          <div className={styles.stepLabel}>Source & Target</div>
        </div>
        <div
          className={`${styles.step} ${activeStep >= 2 ? styles.active : ""} ${activeStep > 2 ? styles.completed : ""}`}
        >
          <div className={styles.stepNumber}>2</div>
          <div className={styles.stepLabel}>Connection</div>
        </div>
        <div
          className={`${styles.step} ${activeStep >= 3 ? styles.active : ""} ${activeStep > 3 ? styles.completed : ""}`}
        >
          <div className={styles.stepNumber}>3</div>
          <div className={styles.stepLabel}>Table Selection</div>
        </div>
        <div
          className={`${styles.step} ${activeStep >= 4 ? styles.active : ""} ${activeStep > 4 ? styles.completed : ""}`}
        >
          <div className={styles.stepNumber}>4</div>
          <div className={styles.stepLabel}>Column Selection</div>
        </div>
        <div className={`${styles.step} ${activeStep >= 5 ? styles.active : ""}`}>
          <div className={styles.stepNumber}>5</div>
          <div className={styles.stepLabel}>Ingestion</div>
        </div>
      </div>

      <div className={styles.content}>
        {activeStep === 1 && <SourceSelection onSourceChange={handleSourceChange} darkMode={darkMode} />}

        {activeStep === 2 && (
          <ConnectionForm
            sourceType={sourceType}
            targetType={targetType}
            connectionParams={connectionParams}
            onConnectionParamsChange={handleConnectionParamsChange}
            onConnect={handleConnect}
            onBack={() => setActiveStep(1)}
            status={status}
            error={error}
            darkMode={darkMode}
          />
        )}

        {activeStep === 3 && (
          <div className={styles.tableSelection}>
            <h3>Select Table</h3>
            <p>Choose a table from the source database to ingest data from:</p>

            <div className={styles.tableList}>
              {availableTables.map((table) => (
                <div
                  key={table}
                  className={`${styles.tableItem} ${selectedTable === table ? styles.selected : ""}`}
                  onClick={() => handleTableSelect(table)}
                >
                  <div className={styles.tableName}>{table}</div>
                </div>
              ))}
            </div>

            <div className={styles.formActions}>
              <button className={styles.backButton} onClick={() => setActiveStep(2)} disabled={status === "fetching"}>
                Back
              </button>
            </div>

            {status === "fetching" && (
              <div className={styles.loadingState}>
                <div className={styles.spinner}></div>
                <p>Fetching tables...</p>
              </div>
            )}

            {error && <div className={styles.error}>{error}</div>}
          </div>
        )}

        {activeStep === 4 && (
          <ColumnSelection
            availableColumns={availableColumns}
            selectedColumns={selectedColumns}
            onColumnSelect={handleColumnSelect}
            onBack={() => setActiveStep(3)}
            onNext={() => setActiveStep(5)}
            onPreview={handlePreview}
            previewData={previewData}
            status={status}
            error={error}
            darkMode={darkMode}
          />
        )}

        {activeStep === 5 && (
          <div className={styles.ingestionStep}>
            <IngestionControls
              sourceType={sourceType}
              targetType={targetType}
              selectedTable={selectedTable}
              selectedColumns={selectedColumns}
              onStartIngestion={handleStartIngestion}
              onBack={() => setActiveStep(4)}
              status={status}
              darkMode={darkMode}
            />

            <StatusDisplay status={status} error={error} darkMode={darkMode} />

            {results && <ResultsDisplay results={results} onReset={resetFlow} darkMode={darkMode} />}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
