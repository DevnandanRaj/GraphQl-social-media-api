const { AuthenticationError, UserInputError } = require("apollo-server");
const Post = require("../../models/Post");
const Auth = require("../../middleware/auth");
module.exports = {
  Query: {
    async getPosts(_, __, context) {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPostsByUser(_, { username }, context) {
      const user = Auth(context);
      try {
        if (username.id !== user.id) {
          throw new AuthenticationError(
            "You are not authorized to view posts for this user"
          );
        }
        const posts = await Post.find({ username }).sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    async createPost(_, { body }, context) {
      const user = Auth(context);

      if (body.trim() === "") {
        throw new Error("Post body must not be empty");
      }

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();

      return post;
    },
    async deletePost(_, { postId }, context) {
      const user = Auth(context);

      try {
        const post = await Post.findById(postId);

        if (!post) {
          throw new UserInputError("Post not found");
        }

        if (user.id !== post.username.id) {
          throw new AuthenticationError("Action not allowed");
        }

        await post.deleteOne();

        return "Post deleted successfully";
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
