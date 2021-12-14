const mongoose = require('mongoose');

const {Schema} = mongoose;

// make new book schema
// title, desc, status, email

const bookSchema = new Schema({
  title: String,
  description: String,
  status: String,
  email: String
})

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;

