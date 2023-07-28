/**
 * Initializing our database on mongoose...
 */

const mongoose = require('mongoose');
const uri = process.env.DB

module.exports = () => {
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Successfully connected to Database.'))
    .catch((error) => console.error('Connection error:', error));
}