# **GraphQL Social Media API**

## **Queries**

### getPosts

**Description:** Fetches a list of all posts.

**Usage:** Use this query to retrieve all posts available in the database.

**Input:** None
```query {
  getPosts {
    id
    body
    username
    createdAt
  }
}
```
**Output:** An array of Post objects, each containing the post ID, body, username of the author, and the creation date.

### getPostsByUser

**Description:** Fetches posts authored by a specific user.

**Usage:** Use this query to retrieve posts created by a particular user.

**Input:**
- username: The username of the user whose posts you want to fetch.
```query GetPostsByUser($username: String!) {
  getPostsByUser(username: $username) {
    id
    body
    username
    createdAt
  }
}
```
**Output:** An array of Post objects authored by the specified user.

## **Mutations**

### register

**Description:** Registers a new user.

**Usage:** Use this mutation to create a new user account.

**Input:**
- username: The desired username for the new user.
- email: The email address of the new user.
- password: The password for the new user.
- confirmPassword: Confirmation of the password for validation.
```mutation{
  register (registerInput: {
    username: "dev2"
    password: "124"
    confirmPassword: "124"
    email: "dev2@gamil.com"
  }){
    id

  }
}
```
**Output:** A User object containing the user's ID, email, username, token, and creation date.

### login

**Description:** Logs in an existing user.

**Usage:** Use this mutation to authenticate an existing user.

**Input:**
- username: The username of the user attempting to log in.
- password: The password of the user attempting to log in.
```mutation($username: String!, $password: String!){
  login(username: $username, password: $password) {
    id
    token
  }
}
```
**Output:** A User object containing the user's ID, email, username, token, and creation date upon successful authentication.

### createPost

**Description:** Creates a new post.

**Usage:** Use this mutation to create a new post.

**Input:**
- body: The content/body of the post.
```mutation($body: String!, $postId: ID!){
  createPost(body: $body) {
  id
  body
  username
  createdAt
  }
}
```
**Output:** A Post object containing the ID, body, username of the author, and creation date of the new post.

### deletePost

**Description:** Deletes an existing post.

**Usage:** Use this mutation to delete a post.

**Input:**
- postId: The ID of the post to be deleted.
```mutation($postId: ID!){
  deletePost(postId: $postId)
}
```
**Output:** A confirmation message indicating the successful deletion of the post.

### followUser

**Description:** Allows a user to follow another user.

**Usage:** Use this mutation to follow another user.

**Input:**
- username: The username of the user to follow.
```mutation($username: String!){
  followUser(username: $username) {
    following {
      id
    }
  }
}
```
**Output:** The updated User object of the current user, including the newly followed user in the 'following' array.


