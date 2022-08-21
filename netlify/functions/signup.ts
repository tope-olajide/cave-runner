import { Handler } from '@netlify/functions';
import mysql from 'mysql2/promise';

import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const params = JSON.parse(event.body!);
  const {
    username, password, country, characters,
  }: any = params;
  if (!username || username.length < 3) {
    return {
      statusCode: 400, body: 'your username is too short',
    };
  }

  if (!password || password.length < 5) {
    return {
      statusCode: 400, body: 'Your password is too short',
    };
  }

  if (!country) {
    return {
      statusCode: 400, body: 'Please select a valid country',
    };
  }

  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);

    const [userExists]:any = await connection.execute(
      'SELECT * FROM players WHERE username = ?',
      [username.toLowerCase()],
    );
    if (userExists.length) {
      return {
        statusCode: 409, body: JSON.stringify({ message: 'User already exists!' }),
      };
    }
    const encryptedPassword = bcrypt.hashSync(password, 10);
    const [createdUser] : any = await connection.execute(
      'INSERT INTO players( username, password, country, characters) VALUES (?, ?, ?, ?)',
      [username.toLowerCase(), encryptedPassword, country, characters],
    );
    const token = jsonwebtoken.sign(
      {
        id: createdUser.insertId,
        username,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 730,
      },
      process.env.JWT_SECRET,
    );
    return {
      statusCode: 200, body: JSON.stringify({ token }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed fetching data' }) };
  }
};

// eslint-disable-next-line import/prefer-default-export
export { handler };
