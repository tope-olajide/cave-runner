import { Handler } from '@netlify/functions';
import mysql from 'mysql2/promise';
// import querystring from 'querystring';
import authenticateToken from './authenticateToken';


const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const token = event.headers.authorization;
  const params = JSON.parse(event.body!);
  const { characters }: any = params;
  const { scores }: any = params;
  const { coins }: any = params;
  const user = authenticateToken(token);
  if (!user) {
    return { statusCode: 401, body: 'Failed to authenticate token.' };
  }

  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    const { id } = user;
    const [rows] = await connection.execute(
      'UPDATE players SET characters = ?, scores= ?, coins = ? WHERE id = ?',
      [characters, scores, coins, id],
    );
    return {
      statusCode: 200,
      body: JSON.stringify(rows),
      message: 'characters Saved Successfully!',
    };
  } catch (error) {
    return { statusCode: 500, body: String(error), message: 'unable to save characters' };
  }
};

// eslint-disable-next-line import/prefer-default-export
export { handler };
