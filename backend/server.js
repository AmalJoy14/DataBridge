import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectToClickHouse, testConnection } from './clickhouseService.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/connect-clickhouse', async (req, res) => {
  const { host, port, database, user, jwtToken } = req.body;

  try {
    const client = connectToClickHouse({ host, port, database, user, jwtToken });
    const result = await testConnection(client);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Connection error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
