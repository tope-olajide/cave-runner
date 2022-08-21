import { Handler } from '@netlify/functions';
import mysql from 'mysql2/promise';

import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const params = JSON.parse(event.body!);
    const { username, password }: any = params;
    const connection = await mysql.createConnection(process.env.DATABASE_URL);

    const [user]:any = await connection.execute(
      'SELECT id, username, password, scores, coins, characters FROM players WHERE username = ?',
      [username.toLowerCase()],
    );
    if (!user.length) {
      return {
        statusCode: 401, body: JSON.stringify({ message: 'Account Does Not Exist!' }),
      };
    }

    if (bcrypt.compareSync(password, user[0].password)) {
      const token = jsonwebtoken.sign(
        {
          id: user[0].id,
          username,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 730,
        },
        process.env.JWT_SECRET,
      );

      return {
        statusCode: 200,
        body: JSON.stringify({
          token, coins: user[0].coins, scores: user[0].scores, characters: user[0].characters,
        }),
      };
    }

    return {
      statusCode: 401, body: JSON.stringify({ message: 'Invalid Credentials!' }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ message: 'Unable to Log in' }) };
  }
};

// eslint-disable-next-line import/prefer-default-export
export { handler };
