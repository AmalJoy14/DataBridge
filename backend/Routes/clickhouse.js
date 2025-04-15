import express from 'express';
import { connectToClickHouse } from '../services/clickhouseService.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/tables', async (req, res) => {
  console.log("Fetching tables from ClickHouse");
  console.log(req.body);
  const { host, port, database, user, token } = req.body;
  console.log(token + " " + host + " " + port + " " + database + " " + user);
  const decoded = jwt.decode(token);
  const password = decoded.password;
  
  try {
    const client = connectToClickHouse({ host, port, database, user, password });

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

export default router;
