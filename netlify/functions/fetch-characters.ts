import { Handler } from '@netlify/functions';
import mysql from 'mysql2/promise';
import authenticateToken from '../utils/authenticateToken';

require('dotenv').config();

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const token = event.headers.authorization;
  const user = authenticateToken(token);
  if (!user) {
    return { statusCode: 401, body: 'Failed to authenticate token.' };
  }
  const { id } = user;
  try {
    const { DATABASE_URL } = process.env;
    const connection = await mysql.createConnection(DATABASE_URL);
    const [characters] = await connection.execute(
      'SELECT characters FROM players WHERE id = ?',
      [id],
    );
    return {
      statusCode: 200,
      body: JSON.stringify({ characters }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ message: 'Unable to fetch High Scores!' }) };
  }
};

// eslint-disable-next-line import/prefer-default-export
export { handler };
