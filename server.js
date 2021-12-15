'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Book = require('./models/bookModel');

const app = express();
app.use(cors());
app.options('*', cors());  
app.use(express.json());

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.DB_LOCAL_URL);

const db = mongoose.connection;
// on the event of an error, do this:
db.on('error', console.error.bind(console, 'connection error:'));
// once db open, notify user via console.log
db.once('open', function() {
console.log('Mongoose is connected')
});

//------------------------------------Routes------------------------------------


app.get('/test', (request, response) => {
  console.log("test hit")
  response.send('test request received')
})

app.get('/books', handleGetBooks);
app.post('/books', handlePostBooks);




//------------------------------------Handlers------------------------------------

//----get------
async function handleGetBooks(req, res) {
  console.log("get hit")
  let userFromClient = {};

  if (req.query.user) {
    userFromClient = { email: req.query.user }
  }

  try {
    const booksFromDB = await Book.find(userFromClient);
    if (booksFromDB.length > 0) {
      res.status(200).send(booksFromDB);
    } else {
      res.status(404).send('No books found');
    }
  } catch(e) {
    res.status(500).send('Server Error');
  }
};

//----post------
async function handlePostBooks(req, res) {
  console.log("post hit", req.body)
  try {
    const createdBook = await Book.create(req.body)
    res.status(201).send(createdBook);
  } catch (e) {
    res.status(500).send('Server Error');
  }
};

//-----delete-------




//------------------------------------Listener------------------------------------
app.listen(PORT, () => console.log(`listening on ${PORT}`));
