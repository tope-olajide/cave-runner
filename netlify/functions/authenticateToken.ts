import jsonwebtoken from 'jsonwebtoken';

const authenticateToken = (token) => {
  if (token) {
    const decodedUser = jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return null;
      }
      return decoded;
    });
    return decodedUser;
  }
  return null;
};

export default authenticateToken;
