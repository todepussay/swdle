const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron');

require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { dailyUpdate } = require("./services/dailyUpdate");

cron.schedule(process.env.DAILY_PICK, () => {
  dailyUpdate();
}, {
  timezone: 'Europe/Paris'
});

// Routes
const router = require('./router');
app.use('/swdle/api', router);

app.listen(port, () => {
  dailyUpdate();
  console.log(`Server is running on port ${port}`);
});