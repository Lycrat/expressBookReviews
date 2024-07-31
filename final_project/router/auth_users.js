const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {};

const authenticatedUser = (username, password) => {
  matched_users = users.filter(
    (user) => user.username == username && user.password == password
  );
  return matched_users.length > 0;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.send("Username or password not provided");
  }
  console.log(authenticatedUser(username, password));
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        username: username,
        data: password,
      },
      "fingerprint_customer",
      { expiresIn: 60 * 60 }
    );
    req.session.authorization = { accessToken, username };
    console.log(req.session.authorization);
    return res.send(`User ${username} logged in successfully.`);
  }
  res.status(208).json({ message: "Invalid login credentials." });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const user = req.user.username;
  const userReview = req.body.review;
  let reviews = books[req.params.isbn].reviews;
  reviews[user] = userReview;
  res.send(`The reivew: ${userReview} \n by user: ${user} has been added.`);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const user = req.user.username;
  let reviews = books[req.params.isbn].reviews;
  if (reviews[user]) {
    let review = reviews[user];
    delete reviews[user];
    return res.send(`Deleted review: ${review} \n By user: ${user}`);
  }
  res.send(
    `No review written for book: ${
      books[req.params.isbn].title
    } by user: ${user}`
  );
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
