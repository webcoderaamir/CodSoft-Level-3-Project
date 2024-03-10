const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.DB_KEY;

const mongoDB = async () => {
    try {
        await mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true});
        console.log('Connected to MongoDB Atlas...');
    } catch (error) {
        console.log(error);
    }
}

module.exports = mongoDB;
