const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send({ message: 'Authentication token is required.' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWTPRIVATEKEY);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({ message: 'Invalid or expired token.' });
  }
};

module.exports = authenticateToken;
