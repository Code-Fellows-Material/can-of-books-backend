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

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;
// on the event of an error, do this:
db.on('error', console.error.bind(console, 'connection error:'));
// once db open, notify user via console.log
db.once('open', function() {
console.log('Mongoose is connected')
});

//------------------------------------Routes------------------------------------


app.get('/test', (request, response) => {
  response.send('test request received')
})

app.get('/books', handleGetBooks);
app.post('/books', handlePostBooks);
app.delete('/books/:id', handleDeleteBooks);




//------------------------------------Handlers------------------------------------

//----get------
async function handleGetBooks(req, res) {
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
  try {
    const createdBook = await Book.create(req.body)
    res.status(201).send(createdBook);
  } catch (e) {
    res.status(500).send(e);
  }
};

//-----delete-------

async function handleDeleteBooks(req, res) {
  if (req.query.email === req.params.email) {
    const { id } = req.params
    // const id = req.params.id
    try {
      //delete the record
      await Book.findByIdAndDelete(id);
      res.status(204).send('success')
      // send back success
    } catch (e) {
      res.status(500).send('Server Error');
    }
  } else {
    res.status(500).send('Server Error, Email does not match');
  }
}



//------------------------------------Listener------------------------------------
app.listen(PORT, () => console.log(`listening on ${PORT}`));
