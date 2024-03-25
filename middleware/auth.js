const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");
const User = require("../models/User");
require("dotenv").config();

module.exports = (context) => {
  const authHeader = context.req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];

    if (token) {
      try {
        const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
        return User.findById(user.id);
      } catch (err) {
        throw new AuthenticationError("Invalid/Expired token");
      }
    }
    throw new Error("Authentication token must be 'Bearer [token]");
  }
  throw new Error("Authorization header must be provided");
};
