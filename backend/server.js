import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { connectToClickHouse, testConnection } from './services/clickhouseService.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  console.log("Root route hit");
  res.send("Hello from server");
});

app.post('/api/connect-clickhouse', async (req, res) => {
  const { host, port, database, user, token } = req.body;
  console.log(token + " " + host + " " + port + " " + database + " " + user);
  const decoded = jwt.decode(token);
  console.log(decoded);
  const password = decoded.password;
  
  
  try {
    const client = connectToClickHouse({ host, port, database, user, password});
    const result = await testConnection(client);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Connection error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on PORT:${PORT}`);
});
