const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");
const public_users = express.Router();

function doesExist(username) {
  return users.filter((user) => user.username == username).length > 0;
}

public_users.get("/user", function (req, res) {
  res.send(JSON.stringify(users, null, 4));
});

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (doesExist(username)) {
      return res.send("User already exist");
    } else {
      users.push({ username: username, password: password });
      return res.send(`User ${username} registered.`);
    }
  }

  res.send("Username or password not provided.");
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  //Write your code here
  try {
    const response = await axios.get("http://localhost:8080/booksdata");
    return res.send(JSON.stringify(response.data, null, 4));
  } catch (erorr) {
    return res.status(500).send("Error fetching books: " + error.message);
  }
});

public_users.get("/booksdata", function (req, res) {
  res.send(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.send(books[isbn]);
});

public_users.get("/async/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:8080/isbn/${isbn}`);
    return res.send(response.data);
  } catch (error) {
    return res.status(500).send("Error fetching book: " + error.message);
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;
  let matched_books = [];
  for (const isbn in books) {
    if (
      books[isbn].author.toLowerCase().replace(/\s+/g, "") ==
      author.toLowerCase()
    ) {
      matched_books.push(books[isbn]);
    }
  }

  if (matched_books.length > 0) {
    return res.send(matched_books);
  }

  res.send(`No books found that were written by ${author}`);
});

public_users.get("/async/author/:author", async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:8080/author/${author}`);
    return res.send(response.data);
  } catch {
    return res.status(500).send(`Error fetching book by author ${author}`);
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title;
  for (const isbn in books) {
    if (
      books[isbn].title.toLowerCase().replace(/\s+/g, "") ==
      title.replace(/\s+/g, "").toLowerCase()
    ) {
      return res.send(books[isbn]);
    }
  }

  res.send(`No book with the title: ${title}`);
});

public_users.get("/async/title/:title", async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:8080/title/${title}`);
    return res.send(response.data);
  } catch {
    return res.status(500).send(`Error fetching book by the title of ${title}`);
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.send(books[isbn].reviews);
  }
  res.send("Invalid ISBN");
});

module.exports.general = public_users;
