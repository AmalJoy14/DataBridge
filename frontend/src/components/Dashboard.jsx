"use client"

import { useState } from "react"
import styles from "./Dashboard.module.css"
import SourceSelection from "./SourceSelection"
import ConnectionForm from "./ConnectionForm"
import ColumnSelection from "./ColumnSelection"
import IngestionControls from "./IngestionControls"
import StatusDisplay from "./StatusDisplay"
import ResultsDisplay from "./ResultsDisplay"
import axios from "axios"

const Dashboard = ({ darkMode }) => {
  const [activeStep, setActiveStep] = useState(1)
  const [sourceType, setSourceType] = useState("")
  const [targetType, setTargetType] = useState("")
  const [connectionParams, setConnectionParams] = useState({
    clickhouse: { host: '', port: '', database: '', user: '', jwtToken: '' },
    flatfile: { fileName: '', delimiter: ',' ,  fileObject: null }
  });
  

  const [availableTables, setAvailableTables] = useState([])
  const [selectedTable, setSelectedTable] = useState("")
  const [availableColumns, setAvailableColumns] = useState([])
  const [selectedColumns, setSelectedColumns] = useState([])
  const [status, setStatus] = useState("idle") 
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [previewData, setPreviewData] = useState(null)

  const handleResetPreviewData = () => {
    setPreviewData(null)
  }

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

      

      let payload = connectionParams.clickhouse;
      console.log(payload);
      const res = await axios.post('http://localhost:3000/api/connect-clickhouse', payload);
      console.log(res.data);
      setStatus('connected');

      if (sourceType === "clickhouse") {
        const res = await axios.post('http://localhost:3000/api/clickhouse/tables', payload);
        if (res.data.success) {
          setAvailableTables(res.data.tables);
        } else {
          throw new Error('Failed to fetch tables');
        }
        setStatus("idle")
        setActiveStep(3)
      }
      else if (sourceType === "flatfile") {
        await uploadFlatFile();
        setAvailableTables([]); 
        payload = connectionParams.flatfile;
        console.log(payload);
        const res = await axios.post('http://localhost:3000/api/flatfile/columns', payload);
        console.log(res);
        if (res.data.success) {
          setAvailableColumns(res.data.columns);
        } else {
          throw new Error('Failed to fetch columns');
        }
        setStatus("idle")
        setActiveStep(4)
      }

      
    } catch (err) {
      setStatus("error")
      setError("Failed to connect to the source. Please check your connection parameters.")
    }
  }

  const handleTableSelect = async (table) => {
    try {
      setSelectedTable(table)
      setAvailableColumns([]);
      setSelectedColumns([]); // Reset selected columns
      setPreviewData(null); // Reset preview data
      setStatus("fetching")
      setError(null)

      const payload = connectionParams.clickhouse;
      const res = await axios.post('http://localhost:3000/api/clickhouse/columns', {payload , selectedTable : table});
      console.log(res.data);
      
      if (res.data.success) {
        // Add an `id` field (unique key) for each column
        const columnsWithIds = res.data.columns.map((column, index) => ({
          ...column,
          id: index, 
        }));
        
        setAvailableColumns(columnsWithIds);
      } else {
        throw new Error(res.data.message);
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
      let res = null;

      if (sourceType === "flatfile") {
        const payload = {
          connectionParams: connectionParams.flatfile,
          selectedColumns: selectedColumns.map(col => col.name),
        }
  
        res = await axios.post('http://localhost:3000/api/flatfile/preview', payload)
      }
      else{
        const payload = {
          connectionParams: connectionParams.clickhouse,
          selectedTable,
          selectedColumns: selectedColumns.map(col => col.name),
        }
  
        res = await axios.post('http://localhost:3000/api/clickhouse/preview', payload)
      }

      
      console.log(res.data);
      if (res.data.success) {
        setPreviewData(res.data)
      } else {
        throw new Error( "Failed to fetch preview")
      }
      setStatus("idle")
    } catch (err) {
      setStatus("error")
      setError("Failed to fetch preview data. Please try again.")
    }
  }

  const handleStartIngestion = async () => {
    try {
      if (selectedColumns.length === 0) {
        setError("Please select at least one column to ingest.");
        return;
      }
  
      setStatus("ingesting");
      setError(null);
      setResults(null);
  
      const payload = {
        connectionParams: connectionParams,
        selectedTable,
        selectedColumns: selectedColumns.map(col => col.name),
      }
      let response = null;
      if (sourceType === "flatfile") {
        response = await axios.post("http://localhost:3000/api/flatfile/start-ingestion", payload);
      }
      else{
        response = await axios.post("http://localhost:3000/api/clickhouse/start-ingestion", payload);
      }
       
  
      if (response.data.success) {
        // If ingestion was successful, update results
        setResults({
          recordsProcessed: response.data.recordsProcessed,
          startTime: response.data.startTime,
          endTime: response.data.endTime,
          source: sourceType,
          target: targetType,
          table: selectedTable,
          columnsCount: selectedColumns.length,
        });
        
        setStatus("completed");
      } else {
        throw new Error("Ingestion failed");
      }
    } catch (err) {
      setStatus("error");
      setError("An error occurred during ingestion. Please try again.");
      console.error(err);
    }
  };

  const uploadFlatFile = async () => {
    const formData = new FormData()
  
    // assuming these are set
    const file = connectionParams.flatfile.fileObject
    const delimiter = connectionParams.flatfile.delimiter
  
    formData.append("file", file)
    formData.append("delimiter", delimiter)
  
    try {
      const response = await axios.post("http://localhost:3000/api/flatfile/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      connectionParams.flatfile.fileName = response.data.file;
      console.log("Upload success", response.data)
    } catch (error) {
      console.error("Upload failed", error)
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
            onBack={() => setActiveStep(sourceType === "flatfile" ? 2 : 3)}
            onNext={() => setActiveStep(5)}
            onPreview={handlePreview}
            previewData={previewData}
            status={status}
            error={error}
            darkMode={darkMode}
            onResetPreviewData={handleResetPreviewData}
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

            {results && <ResultsDisplay results={results} onReset={resetFlow} darkMode={darkMode} sourceType={sourceType}/>}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
