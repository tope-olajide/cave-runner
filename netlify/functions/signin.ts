import { Handler } from '@netlify/functions';
import mysql from 'mysql2/promise';
import querystring from 'querystring';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  
  try {
    const params = JSON.parse(event.body!);
    const { username, password }: any = params;
    console.log({ username, password });
    const connection = await mysql.createConnection(process.env.DATABASE_URL);

    const [user]:any = await connection.execute(
      'SELECT id, username, password FROM players WHERE username = ?',
      [username.toLowerCase()],
    );
    console.log(user);
    if (!user.length) {
      return {
        statusCode: 401, body: 'Account Does Not Exist!', message: 'Account Does Not Exist!',
      };
    }

    if (bcrypt.compareSync(password, user[0].password)) {
      const token = jsonwebtoken.sign(
        {
          id: user[0].id,
          username,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        },
        process.env.JWT_SECRET,
      );

      console.log(token);
      return {
        statusCode: 200, body: token,
      };
    }

    return {
      statusCode: 401, body: 'Invalid Credentials!',
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed fetching data' }) };
  }
};

// eslint-disable-next-line import/prefer-default-export
export { handler };
