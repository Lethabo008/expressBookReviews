const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// ---------------- TASK 6: REGISTER USER ----------------
public_users.post("/register", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (isValid(username)) {
    return res.status(400).json({ message: "User already exists!" });
  }

  users.push({ username, password });

  return res.status(200).json({
    message: "User successfully registered. Now you can login"
  });
});


// ---------------- TASK 10: GET ALL BOOKS (ASYNC + AXIOS) ----------------
public_users.get('/', async function (req, res) {

  try {
    const response = await axios.get("http://localhost:5000/books");
    return res.status(200).json(response.data);

  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});


// ---------------- TASK 11: GET BOOK BY ISBN ----------------
public_users.get('/isbn/:isbn', async function (req, res) {

  try {
    const isbn = req.params.isbn;

    const response = await axios.get("http://localhost:5000/books");

    return res.status(200).json(response.data[isbn]);

  } catch (error) {
    return res.status(500).json({ message: "Error fetching book by ISBN" });
  }
});


// ---------------- TASK 12: GET BOOKS BY AUTHOR ----------------
public_users.get('/author/:author', async function (req, res) {

  try {
    const author = req.params.author;

    const response = await axios.get("http://localhost:5000/books");

    const booksData = response.data;
    let result = [];

    for (let key in booksData) {
      if (booksData[key].author === author) {
        result.push(booksData[key]);
      }
    }

    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author" });
  }
});


// ---------------- TASK 13: GET BOOKS BY TITLE ----------------
public_users.get('/title/:title', async function (req, res) {

  try {
    const title = req.params.title;

    const response = await axios.get("http://localhost:5000/books");

    const booksData = response.data;
    let result = [];

    for (let key in booksData) {
      if (booksData[key].title === title) {
        result.push(booksData[key]);
      }
    }

    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by title" });
  }
});


// ---------------- TASK 5: GET REVIEWS ----------------
public_users.get('/review/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  return res.status(200).json(books[isbn]?.reviews || {});
});


module.exports.general = public_users;