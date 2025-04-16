import express from 'express';
import { connectToClickHouse } from '../services/clickhouseService.js';
import jwt from 'jsonwebtoken';
import { createObjectCsvWriter } from "csv-writer";
import path from "path";
import fs from "fs";

const router = express.Router();

router.post('/tables', async (req, res) => {
  const { host, port, database, user, token } = req.body;
  const decoded = jwt.decode(token);
  const password = decoded.password;
  
  try {
    const client =await connectToClickHouse({ host, port, database, user, password });

    const resultSet = await client.query({
      query: `SELECT name FROM system.tables WHERE database = 'default'`,
      format: 'JSON',
    });

    const rows = await resultSet.json();
    const tableNames = rows.data.map(row => row.name);
    res.json({ success: true, tables: tableNames });
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tables' });
  }
});


router.post('/columns', async (req, res) => {
  const { payload , selectedTable} = req.body;
  const { host, port, database, user, token } = payload;
  const  table = selectedTable;
  const decoded = jwt.decode(token);
  const password = decoded.password;

  try {
    const client =await connectToClickHouse({ host, port, database, user, password });
    
    const query = `
      SELECT name, type 
      FROM system.columns 
      WHERE table = '${table}'
      ORDER BY position
    `;
    const resultSet = await client.query({ query, format: 'JSON' });
    const rows = await resultSet.json();
    console.log(rows.data);
    
    res.json({ success: true, columns: rows.data });
  } catch (error) {
    console.error('Error fetching columns:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch columns', error: error.message });
  }
});



router.post('/preview', async (req, res) => {
  const { connectionParams, selectedTable, selectedColumns } = req.body
  console.log(req.body);

  const host = connectionParams.host;
  const port = connectionParams.port;
  const database = connectionParams.database;
  const user = connectionParams.user;
  const decoded = jwt.decode(connectionParams.token);
  const password = decoded.password;

  try {
    const client =await connectToClickHouse({ host, port, database, user, password });
    const cols = selectedColumns.map(c => `\`${c}\``).join(', ')
    const query = `SELECT ${cols} FROM \`${selectedTable}\` LIMIT 100`;

    const resultSet = await client.query({ query, format: 'JSON' });
    const dataResult = await resultSet.json();

    console.log(dataResult);

    res.json({ success: true, data: dataResult.data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Query failed" });
  }
});


router.post("/start-ingestion", async (req, res) => {
  const { connectionParams, selectedTable, selectedColumns } = req.body;
  const { host, port, database, user, token} = connectionParams.clickhouse;
  const { fileName, delimiter } = connectionParams.flatfile;
  const decoded = jwt.decode(token);
  const password = decoded.password;

  const filePath = path.join("output", fileName);

  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: selectedColumns.map(colName => ({ id: colName, title: colName })),
    fieldDelimiter: delimiter || ",",
    append: false 
  });

  try {
    const client = await connectToClickHouse({ host, port, database, user, password });
  
    const batchSize = 1000;
    let offset = 0;
    let totalRowsProcessed = 0;
    let hasMore = true;

    const startTime = new Date();

    while (hasMore) {
      const cols = selectedColumns.join(", ");
      // Use LIMIT and OFFSET for batching.
      const query = `SELECT ${cols} FROM \`${selectedTable}\` LIMIT ${batchSize} OFFSET ${offset}`;

      const resultSet = await client.query({ query, format: "JSON" });
      const result = await resultSet.json(); // result should have a property 'data'

      const rows = result.data;
      if (!rows || rows.length === 0) {
        hasMore = false;
        break;
      }

      await csvWriter.writeRecords(rows);

      totalRowsProcessed += rows.length;
      offset += batchSize;

      // Optionally log progress:
      console.log(`Ingested ${totalRowsProcessed} rows...`);
      
      // If you want to implement progress bar support, consider saving the progress 
      // (e.g. in an in-memory store or cache) and providing a separate endpoint to poll that progress.
    }

    const endTime = new Date();
    // Return the final results to the client.
    res.json({
      success: true,
      message: "Ingestion complete",
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      recordsProcessed: totalRowsProcessed,
      csvFile: fileName || "output.csv"
    });
  } catch (err) {
    console.error("Ingestion error:", err);
    res.status(500).json({ success: false, message: "Ingestion failed", error: err.message });
  }
});


router.get("/download/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.resolve("output", fileName); // adjust path if needed

  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ error: "File not found" });
  }
});

export default router;
