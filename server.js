'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Book = require('./models/bookModel');
const verifyUser = require('./auth')

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
});

//------------------------------------Routes------------------------------------

app.get('/books', handleGetBooks);
app.post('/books', handlePostBooks);
app.delete('/books/:id', handleDeleteBooks);
app.put('/books/:id', handlePutBooks);

//------------------------------------Handlers------------------------------------

//----get------
async function handleGetBooks(req, res) {
  // let userFromClient = {};

  // if (req.query.user) {
  //   userFromClient = { email: req.query.user }
  // }
  // pass req and callback function
  verifyUser(req, async (err, user) => {
    if (err) {
      console.error(err);
      res.send('Invalid Token');
    } else {
      try {
        const booksFromDB = await Book.find({ email: user.email});
        if (booksFromDB.length > 0) {
          res.status(200).send(booksFromDB);
        } else {
          res.status(404).send('No books found');
        }
      } catch(e) {
        res.status(500).send('Server Error');
      }
    };
  });
}

//----post------
async function handlePostBooks(req, res) {
  verifyUser(req, async (err, user) => {
    if (err) {
      console.error(err);
      res.status(500).send(e);
      res.send('Invalid Token');
    } else {
      try {
        const createdBook = await Book.create(req.body)
        res.status(201).send(createdBook);
      } catch (e) {
        res.status(500).send(e);
      }
    };
  })
};

//-----delete-------

async function handleDeleteBooks(req, res) {
    
    verifyUser(req, async (err, user) => {
      if (err) {
        res.send('Invalid Token');
      } else {
        const { id } = req.params;
        try {
          const book = await Book.findOne({ _id: id, email: user.email})
          if(!book){
            res.status(400).send('Unable to delete book');
          } else {
            await Book.findByIdAndDelete(id);
            res.status(204).send('Book successfully deleted')
          }      
      } catch (e) {
        res.status(500).send('Server Error');
      }
    }
  })
}

//------put------------

async function handlePutBooks(req, res) {
  
  verifyUser(req, async (err, user) => {
    if (err) {
      res.send('Invalid Token');
    } else { 
      const { id } = req.params;
        try {
        const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true, overwrite: true });
        res.status(200).send(updatedBook);
      } catch (e) {
        res.status(500).send('Server Error');
      }
    }
  })
}


//----test-------

  app.get('/test', (request, response) => {
    response.send('test request received')
  })


//------------------------------------Listener------------------------------------
app.listen(PORT, () => console.log(`listening on ${PORT}`));
