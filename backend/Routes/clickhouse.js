import express from 'express';
import { connectToClickHouse } from '../services/clickhouseService.js';
import jwt from 'jsonwebtoken';

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


export default router;
