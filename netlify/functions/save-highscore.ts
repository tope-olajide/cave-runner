import { Handler } from '@netlify/functions';
import mysql from 'mysql2/promise';
// import querystring from 'querystring';
import authenticateToken from './authenticateToken';

require('dotenv').config();

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const token = event.headers.authorization;
  const params = JSON.parse(event.body!);
  const { scores }: any = params;
  
  const user = authenticateToken(token);
  if (!user) {
    return { statusCode: 401, body: 'Failed to authenticate token.' };
  }

  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    const { id } = user;
    const [rows] = await connection.execute(
      'UPDATE players SET scores = ? WHERE id = ?',
      [scores, id],
    );
    return {
      statusCode: 200,
      body: JSON.stringify(rows),
      message: 'Score Saved Successfully!',

    };
  } catch (error) {
    return { statusCode: 500, body: String(error), message: 'unable to save scores' };
  }
};

// eslint-disable-next-line import/prefer-default-export
export { handler };
