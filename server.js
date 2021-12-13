'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');


const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.DB_LOCAL_URL);

const db = mongoose.connection;
// on the event of an error, do this:
db.on('error', console.error.bind(console, 'connection error:'));
// once db open, notify user via console.log
db.once('open', function() {
console.log('Mongoose is connected')
});


app.get('/test', (request, response) => {

  response.send('test request received')

})

app.listen(PORT, () => console.log(`listening on ${PORT}`));
