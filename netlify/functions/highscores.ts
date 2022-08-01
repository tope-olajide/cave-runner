import { Handler } from '@netlify/functions';
import mysql from 'mysql2/promise';

require('dotenv').config();

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const { DATABASE_URL } = process.env;
    const connection = await mysql.createConnection(DATABASE_URL);
    const [highscores] = await connection.execute(
      'SELECT username, scores, country FROM players ORDER BY scores DESC LIMIT 10',
    );
    return {
      statusCode: 200,
      body: JSON.stringify({ highscores }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ message: 'Unable to fetch High Scores!' }) };
  }
};

// eslint-disable-next-line import/prefer-default-export
export { handler };
