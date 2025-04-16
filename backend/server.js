import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { connectToClickHouse, testConnection } from './services/clickhouseService.js';
import clickhouseRoutes from './Routes/clickhouse.js';
import flatfileRoutes from './Routes/flatfile.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/clickhouse', clickhouseRoutes);
app.use('/api/flatfile', flatfileRoutes);

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


app.get('/tables', async (req, res) => {
  try {
    const resultSet = await clickhouseClient.query({
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


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on PORT:${PORT}`);
});
