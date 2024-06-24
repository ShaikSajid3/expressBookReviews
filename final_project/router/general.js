const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post('/register', (req,res) => {
  const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    if (users[username]) {
        return res.status(400).json({ message: "Username already exists" });
    }
    users[username] = { password };
    return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get(booksApiUrl);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching book list:', error.message);
        res.status(500).json({ message: 'Failed to fetch book list' });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`${booksApiUrl}/${isbn}`);
        res.status(200).json(response.data);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.status(404).json({ message: 'Book not found' });
        } else {
            console.error('Error fetching book details:', error.message);
            res.status(500).json({ message: 'Failed to fetch book details' });
        }
    }
});

  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const response = await axios.get(`${booksApiUrl}?author=${author}`);
        if (response.data.length > 0) {
            res.status(200).json(response.data);
        } else {
            res.status(404).json({ message: 'Books by this author not found' });
        }
    } catch (error) {
        console.error('Error fetching books by author:', error.message);
        res.status(500).json({ message: 'Failed to fetch books by author' });
    }
});


// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const response = await axios.get(`${booksApiUrl}?title=${title}`);
        if (response.data.length > 0) {
            res.status(200).json(response.data);
        } else {
            res.status(404).json({ message: 'Books with this title not found' });
        }
    } catch (error) {
        console.error('Error fetching books by title:', error.message);
        res.status(500).json({ message: 'Failed to fetch books by title' });
    }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
   const isbn = req.params.isbn;
    const book = books[isbn];
    if (book && book.reviews) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "Book or reviews not found" });
    }
});

module.exports.general = public_users;
