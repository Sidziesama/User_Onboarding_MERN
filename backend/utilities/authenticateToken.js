const jwt = require('jsonwebtoken');
const { User } = require("../Models/user");

const authenticateToken = async (req, res, next) => {

  const fulltoken = req.headers.authorization;
  const parts = fulltoken.split(" ");

  // JWT token from header 
  const token = parts[1];

  if (!token) {
    return res.status(401).send({ message: 'Authentication token is required.' });
  }

  try {
    //verify and decode the token
    const decodedToken = jwt.verify(token, process.env.JWTPRIVATEKEY);

    //extract decodedtoken._id
    const userIdFromToken = decodedToken._id
    const user = await User.findById(userIdFromToken);
    if (!user) {
      // If user not found, token is invalid
      return res.status(401).send({ message: 'User Not found.' });
    }

    req.user = user;

    if (userIdFromToken !== req.user._id.toString()) {
      return res.status(401).send({ message: 'Token does not match user ID.' });
    }

    // console.log("This Works");
    // If everything is okay, proceed to the next middleware or route handler
    next();

  } catch (error) {
    console.error(error);
    res.status(401).send({ message: "Invalide token :(" });
  }
};

module.exports = authenticateToken;
