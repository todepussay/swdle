const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const port = 5000;

require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const router = require('./router');
app.use('/api', router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});