const mongoose = require("mongoose");
const Book = require("./models/bookModel");
require("dotenv").config(); // need for process.env

// 'seed' database with instances of things we want to store in db, so mongo db knows what the data structure should look like
async function seed() {
  console.log("seed function called");
  mongoose.connect(process.env.DB_URL);

  await Book.create({
    title: "Eloquent Javascript",
    description: "Modern introduction to programming.",
    status: "partially read",
    email: "kellen.linse@gmail.com",
  });

  await Book.create({
    title: "The Dark Tower I: The Gunslinger",
    description: "First book in Dark Tower series by Stephen King",
    status: "read",
    email: "spencerjtower1@gmail.com",
  });

  await Book.create({
    title: "Alice in Wonderland",
    description:
      "A young girl named Alice falls through a rabbit hole into a fantasy world.",
    status: "read",
    email: "kellen.linse@gmail.com",
  });

  // close connection - dont want db-server connection to stay open - uses resources
  mongoose.disconnect();
}

seed();
