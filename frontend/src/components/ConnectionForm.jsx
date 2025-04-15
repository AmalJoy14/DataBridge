"use client"
import styles from "./ConnectionForm.module.css"
import { FiDatabase, FiFile } from "react-icons/fi"

const ConnectionForm = ({
  sourceType,
  targetType,
  connectionParams,
  onConnectionParamsChange,
  onConnect,
  onBack,
  status,
  error,
  darkMode,
}) => {
  
  const handleClickhouseChange = (e) => {
    const { name, value } = e.target
    onConnectionParamsChange("clickhouse", {
      ...connectionParams.clickhouse,
      [name]: value,
    })
  }

  const handleFlatFileChange = (e) => {
    const { name, value } = e.target
    onConnectionParamsChange("flatfile", {
      ...connectionParams.flatfile,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onConnect()
  }

  return (
    <div className={`${styles.connectionForm} ${darkMode ? styles.darkMode : ""}`}>
      <h3>Configure Connection</h3>
      <p>Enter the connection details for your source and target:</p>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.iconContainer}>
                {sourceType === "clickhouse" ? (
                  <FiDatabase className={styles.icon} />
                ) : (
                  <FiFile className={styles.icon} />
                )}
              </div>
              <h4>Source: {sourceType === "clickhouse" ? "ClickHouse" : "Flat File"}</h4>
            </div>

            {sourceType === "clickhouse" ? (
              <div className={styles.formFields}>
                <div className={styles.formGroup}>
                  <label htmlFor="source-host">Host</label>
                  <input
                    type="text"
                    id="source-host"
                    name="host"
                    value={connectionParams.clickhouse.host}
                    onChange={handleClickhouseChange}
                    placeholder="localhost or domain.com"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="source-port">Port</label>
                  <input
                    type="text"
                    id="source-port"
                    name="port"
                    value={connectionParams.clickhouse.port}
                    onChange={handleClickhouseChange}
                    placeholder="9440 or 8443 for https"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="source-database">Database</label>
                  <input
                    type="text"
                    id="source-database"
                    name="database"
                    value={connectionParams.clickhouse.database}
                    onChange={handleClickhouseChange}
                    placeholder="default"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="source-user">User</label>
                  <input
                    type="text"
                    id="source-user"
                    name="user"
                    value={connectionParams.clickhouse.user}
                    onChange={handleClickhouseChange}
                    placeholder="default"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="source-token">JWT Token</label>
                  <textarea
                    id="source-token"
                    name="token"
                    value={connectionParams.clickhouse.token}
                    onChange={handleClickhouseChange}
                    placeholder="Enter your JWT token"
                    rows="3"
                    required
                  />
                </div>
              </div>
            ) : (
              <div className={styles.formFields}>
                <div className={styles.formGroup}>
                  <label htmlFor="source-file-name">File Name</label>
                  <input
                    type="text"
                    id="source-file-name"
                    name="fileName"
                    value={connectionParams.flatfile?.fileName || ''}
                    onChange={handleFlatFileChange}
                    placeholder="data.csv"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="source-delimiter">Delimiter</label>
                  <select
                    id="source-delimiter"
                    name="delimiter"
                    value={connectionParams.flatfile?.delimiter || ','}
                    onChange={handleFlatFileChange}
                    required
                  >
                    <option value=",">Comma (,)</option>
                    <option value=";">Semicolon (;)</option>
                    <option value="\t">Tab</option>
                    <option value="|">Pipe (|)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.iconContainer}>
                {targetType === "clickhouse" ? (
                  <FiDatabase className={styles.icon} />
                ) : (
                  <FiFile className={styles.icon} />
                )}
              </div>
              <h4>Target: {targetType === "clickhouse" ? "ClickHouse" : "Flat File"}</h4>
            </div>

            {targetType === "clickhouse" ? (
              <div className={styles.formFields}>
                <div className={styles.formGroup}>
                  <label htmlFor="target-host">Host</label>
                  <input
                    type="text"
                    id="target-host"
                    name="host"
                    value={connectionParams.clickhouse.host}
                    onChange={handleClickhouseChange}
                    placeholder="localhost or domain.com"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="target-port">Port</label>
                  <input
                    type="text"
                    id="target-port"
                    name="port"
                    value={connectionParams.clickhouse.port}
                    onChange={handleClickhouseChange}
                    placeholder="9440 or 8443 for https"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="target-database">Database</label>
                  <input
                    type="text"
                    id="target-database"
                    name="database"
                    value={connectionParams.clickhouse.database}
                    onChange={handleClickhouseChange}
                    placeholder="default"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="target-user">User</label>
                  <input
                    type="text"
                    id="target-user"
                    name="user"
                    value={connectionParams.clickhouse.user}
                    onChange={handleClickhouseChange}
                    placeholder="default"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="target-token">JWT Token</label>
                  <textarea
                    id="target-token"
                    name="token"
                    value={connectionParams.clickhouse.token}
                    onChange={handleClickhouseChange}
                    placeholder="Enter your JWT token"
                    rows="3"
                    required
                  />
                </div>
              </div>
            ) : (
              <div className={styles.formFields}>
                <div className={styles.formGroup}>
                  <label htmlFor="target-file-name">File Name</label>
                  <input
                    type="text"
                    id="target-file-name"
                    name="fileName"
                    value={connectionParams.flatfile?.fileName || ''}
                    onChange={handleFlatFileChange}
                    placeholder="output.csv"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="target-delimiter">Delimiter</label>
                  <select
                    id="target-delimiter"
                    name="delimiter"
                    value={connectionParams.flatfile?.delimiter || ','}
                    onChange={handleFlatFileChange}
                    required
                  >
                    <option value=",">Comma (,)</option>
                    <option value=";">Semicolon (;)</option>
                    <option value="\t">Tab</option>
                    <option value="|">Pipe (|)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.formActions}>
          <button type="button" className={styles.backButton} onClick={onBack} disabled={status === "connecting"}>
            Back
          </button>

          <button type="submit" className={styles.connectButton} disabled={status === "connecting"}>
            {status === "connecting" ? "Connecting..." : "Connect"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ConnectionForm
