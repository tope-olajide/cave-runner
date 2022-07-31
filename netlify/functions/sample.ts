const querystring = require('querystring');

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const params = querystring.parse(event.body);
  const { name } = params;
  console.log(event.headers.authorization);
  return {
    statusCode: 200,
    body: `Hello, ${name}`,
  };
};
