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
  const { coins, scores }: any = params;

  try {
    const user = authenticateToken(token);
    if (!user) {
      return { statusCode: 401, body: 'Failed to authenticate token.' };
    }
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    const { id } = user;
    const [rows] = await connection.execute(
      'UPDATE players SET scores = ?, coins = ? WHERE id = ?',
      [scores, coins, id],
    );
    return {
      statusCode: 200,
      body: JSON.stringify(rows),
      message: 'Coins Saved Successfully!',

    };
  } catch (error) {
    return { statusCode: 500, body: String(error), message: 'unable to save coins' };
  }
};

// eslint-disable-next-line import/prefer-default-export
export { handler };
