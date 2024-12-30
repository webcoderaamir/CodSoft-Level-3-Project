const express = require('express');
const app = express();
const mongoDB = require('./data');
const cors = require('cors');
require('dotenv').config();

mongoDB();
app.use(cors());

const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', require('./routes/userRoutes'));
app.use('/api', require('./routes/projectRoutes'));
app.use('/api', require('./routes/taskRoutes'));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;
