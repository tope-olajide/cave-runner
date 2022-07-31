import { Handler } from '@netlify/functions';
import mysql from 'mysql2/promise';
import authenticateToken from './authenticateToken';

require('dotenv').config();

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const token = event.headers.authorization;
  const user = authenticateToken(token);
  console.log(user);
  try {
    const { DATABASE_URL } = process.env;
    const connection = await mysql.createConnection(DATABASE_URL);
    const [rows] = await connection.execute(
      'SELECT username, scores, country FROM players ORDER BY scores DESC LIMIT 10',
    );
    return {
      statusCode: 200,
      body: JSON.stringify(rows),
    };
  } catch (error) {
    return { statusCode: 500, body: String(error), message: 'unable to fetch scores' };
  }
};

// eslint-disable-next-line import/prefer-default-export
export { handler };
