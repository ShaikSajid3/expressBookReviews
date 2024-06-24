const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
  "username": "exampleuser",
  "password": "examplepassword"
}];
const SECRET_KEY = 'yourSecretKey'; 
const isValid = (username)=>{ //returns boolean
 return typeof username === 'string' && username.trim() !== '' && !users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
const user = users.find(user => user.username === username && user.password === password);
    return !!user;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    const user = users[username];
    if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
    const { review } = req.body;
    const username = req.user.username;
    if (!review) {
        return res.status(400).json({ error: 'Review is required' });
    }
    if (!reviews[isbn]) {
        reviews[isbn] = [];
    }
    const existingReviewIndex = reviews[isbn].findIndex(r => r.username === username);
    if (existingReviewIndex >= 0) {
        reviews[isbn][existingReviewIndex].review = review;
        res.json({ message: 'Review updated successfully' });
    } else {
        reviews[isbn].push({ username, review });
        res.json({ message: 'Review added successfully' });
    }
});
regd_users.delete('/auth/review/:isbn', authenticateJWT, (req, res) => {
    const { isbn } = req.params;
    const username = req.user.username;
    if (!reviews[isbn]) {
        return res.status(404).json({ error: 'No reviews found for this ISBN' });
    }
    const reviewIndex = reviews[isbn].findIndex(r => r.username === username);
    if (reviewIndex === -1) {
        return res.status(404).json({ error: 'Review not found for this user' });
    }
    reviews[isbn].splice(reviewIndex, 1);
    res.json({ message: 'Review deleted successfully' });
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
