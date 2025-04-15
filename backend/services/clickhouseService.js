
import { createClient } from '@clickhouse/client';

export function connectToClickHouse({ host, port, database, user, password }) {
  console.log(host + " " + port + " " + database + " " + user + " " + password);

  const client = createClient({
    url: `http://${host}:${port}`,
    database,
    username: user,
    password: password,
  });

  return client;
}

export async function testConnection(client) {
  try {
    const resultSet = await client.query({
      query: 'SELECT now(), version()',
      format: 'JSON',
    });

    const rows = await resultSet.json();
    console.log(rows); 
    return rows;
  } catch (error) {
    console.error('Connection Error:', error);
  }
}
