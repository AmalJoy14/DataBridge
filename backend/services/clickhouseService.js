// clickhouseService.js
import { createClient } from '@clickhouse/client';

export function connectToClickHouse({ host, port, database, user, jwtToken }) {
  const client = createClient({
    host: `http://${host}:${port}`,
    database,
    username: user,
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  return client;
}

export async function testConnection(client) {
  const resultSet = await client.query({
    query: 'SELECT now(), version()',
    format: 'JSON',
  });

  const rows = await resultSet.json();
  return rows;
}
