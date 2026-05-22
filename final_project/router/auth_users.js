const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

module.exports.users = users;

// Check if username exists
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Check if username + password match
const authenticatedUser = (username, password) => {
  return users.some(
    user => user.username === username && user.password === password
  );
};

const SECRET = "access";


// ---------------- LOGIN (TASK 7) ----------------
regd_users.post("/login", (req, res) => {

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(403).json({ message: "Invalid login credentials" });
  }

  let accessToken = jwt.sign({ username }, SECRET, { expiresIn: "1h" });

  req.session.authorization = {
    accessToken,
    username
  };

  return res.status(200).json({
    message: "Login successful",
    token: accessToken
  });
});


// ---------------- ADD / MODIFY REVIEW (TASK 8) ----------------
regd_users.put("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  // add or update review (same user overwrites)
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews
  });
});


// ---------------- DELETE REVIEW (TASK 9) ----------------
regd_users.delete("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "No review found for this user" });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully",
    reviews: books[isbn].reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;