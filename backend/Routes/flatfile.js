import express from 'express';
import { connectToClickHouse } from '../services/clickhouseService.js';
import jwt from 'jsonwebtoken';
import multer from 'multer'
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/') // folder to save
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
  })
  
  const upload = multer({ storage })

router.post('/upload', upload.single('file'), (req, res) => {
  const { delimiter } = req.body
  const filePath = req.file.path

  console.log("File uploaded to:", filePath)
  console.log("Delimiter:", delimiter)

  res.json({ status: "success", message: "Received file", file: req.file.originalname })
})


router.post('/columns', (req, res) => {
    const { fileName, delimiter } = req.body;
    const filePath = path.join('uploads', fileName);
    console.log("File path:", filePath);
  
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }
  
    const columns = new Set();
    const sampleRows = []; // We'll store a sample of rows for type inference
    const MAX_SAMPLE_SIZE = 100; // Limit sample size for performance
  
    console.log("Parsing CSV file:");
  
    fs.createReadStream(filePath)
      .pipe(csv({ separator: delimiter || ',' }))
      .on('headers', (headers) => {
        headers.forEach((header) => columns.add(header));
      })
      .on('data', (row) => {
        if (sampleRows.length < MAX_SAMPLE_SIZE) {
          sampleRows.push(row); // Collect sample rows
        }
      })
      .on('end', () => {
        const formatted = Array.from(columns).map((col, index) => {
          let datatype = inferDataType(sampleRows, col);
          return {
            id: index,
            name: col,
            type: datatype
          };
        });
  
        res.json({ success: true, columns: formatted });
      })
      .on('error', (err) => {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to parse CSV' });
      })
      .resume();
  });
  
  /**
   * Helper function to infer the data type of a column.
   */
  function inferDataType(sampleRows, columnName) {
    let isInteger = true;
    let isFloat = true;
    let isDateTime = true;
    let isString = false;
  
    sampleRows.forEach(row => {
      const value = row[columnName];
  
      if (value === undefined || value === null) return; // Skip undefined/null values
  
      // Check if value is a string
      if (typeof value === 'string') {
        isString = true;
      }
  
      // Check if value can be converted to an integer
      if (isInteger && !/^\d+$/.test(value)) {
        isInteger = false;
      }
  
      // Check if value can be converted to a float
      if (isFloat && isNaN(parseFloat(value))) {
        isFloat = false;
      }
  
      // Check if value is a valid date
      if (isDateTime && isNaN(Date.parse(value))) {
        isDateTime = false;
      }
    });
  
    // Prioritize DateTime, then Float, then Integer, and fallback to String
    if (isDateTime) {
      return 'DateTime';
    } else if (isFloat) {
      return 'Float64';
    } else if (isInteger) {
      return 'Int64';
    } else {
      return 'String';
    }
  }




  router.post('/preview', (req, res) => {
    const { connectionParams, selectedColumns } = req.body;
    // connectionParams should have fileName and delimiter properties
    const fileName = connectionParams.fileName;
    const delimiter = connectionParams.delimiter || ',';
    const filePath = path.join('uploads', fileName);
  
    if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: 'File not found' });
    }

    const indexedColumns = [];
    const data = []; 
    const MAX_SAMPLE_SIZE = 100; 
  
  
    fs.createReadStream(filePath)
      .pipe(csv({ separator: delimiter || ',' }))
      .on('data', (row) => {
        if (data.length < MAX_SAMPLE_SIZE) {
            const filteredRow = {};

            // Only keep the selected columns
            selectedColumns.forEach((col) => {
              filteredRow[col] = row[col];
            });
        
            data.push(filteredRow);
        }
      })
      .on('end', () => {
        res.json({ success: true, data : data , message: "Preview data"});
      })
      .on('error', (err) => {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to parse CSV' });
      })
      .resume();
  });


  router.post('/start-ingestion', (req, res) => {
    const { connectionParams, selectedColumns } = req.body;
    const { host, port, database, user, token } = connectionParams.clickhouse;
    const { fileName, delimiter } = connectionParams.flatfile;
    const decoded = jwt.decode(token);
    const password = decoded.password;
    
    console.log("Ingestion started with params:", connectionParams);
    console.log("host: " + host + " port: " + port + " database: " + database + " user: " + user + " fileName: " + fileName + " delimiter: " + delimiter);
    const client = connectToClickHouse({ host, port, database, user, password });
    const filePath = path.join('uploads', fileName);
    const tableName = path.basename(fileName, path.extname(fileName));
  
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }
  
    const rows = [];
    const startTime = new Date();
  
    fs.createReadStream(filePath)
      .pipe(csv({ separator: delimiter || ',' }))
      .on('data', (row) => {
        const filtered = {};
        selectedColumns.forEach(col => {
        filtered[col] = row[col];
        });
        rows.push(filtered); 
      })
      .on('end', async () => {
  
        try {
            await client.insert({
                table: tableName,
                values: rows, 
                format: 'JSONEachRow'
              });
          const endTime = new Date();
          res.json({ success: true, message: "Ingestion complete", recordsProcessed: rows.length ,startTime: startTime.toISOString(), endTime: endTime.toISOString()});
        } catch (err) {
          console.error("ClickHouse insert error:", err);
          res.status(500).json({ success: false, message: "ClickHouse insertion failed", error: err.message });
        }
      })
      .on('error', (err) => {
        console.error("CSV read error:", err);
        res.status(500).json({ success: false, message: "Failed to read CSV", error: err.message });
      });
  });
  
export default router
