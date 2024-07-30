const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.send(books[isbn]);
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
