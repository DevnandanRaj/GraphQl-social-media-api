const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
const User = require("../../models/User");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../middleware/validator");
const Auth = require("../../middleware/auth");

// Generate JWT token
function generateToken(user) {
  const key = process.env.JWT_SECRET_KEY;
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    key,
    { expiresIn: "7h" }
  );
}

module.exports = {
  Mutation: {
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) {
      // Validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      // Check if username is already taken
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create new user
      const newUser = new User({
        email,
        username,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      });

      // Save new user
      try {
        const savedUser = await newUser.save();
        return {
          ...savedUser._doc,
          id: savedUser._id,
        };
      } catch (error) {
        // Handle database errors
        throw new Error("Failed to register user");
      }
    },
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ username });

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong crendetials";
        throw new UserInputError("Wrong crendetials", { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    async followUser(_, { username }, context) {
      const currentUser = await Auth(context);

      try {
        const userToFollow = await User.findOne({ username });

        if (!userToFollow) {
          throw new UserInputError("User not found");
        }

        if (!currentUser.following) {
          currentUser.following = [];
        }
        if (!userToFollow.followers) {
          userToFollow.followers = [];
        }

        if (currentUser.following.includes(userToFollow.id)) {
          throw new UserInputError("You are already following this user");
        }

        currentUser.following.push(userToFollow.id);

        userToFollow.followers.push(currentUser.id);

        await currentUser.save();
        await userToFollow.save();

        return currentUser;
      } catch (error) {
        throw new Error(error, "Failed to follow user");
      }
    },
  },
};
