const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: ["http://192.168.101.67:3000"]
};
app.use(cors(corsOptions));

// Security headers
app.use(helmet());

// Logging
app.use(morgan('dev'));

// Body parsing
app.use(bodyParser.json());

// Routes
app.get("/api", (req, res) => {
  res.json({ fruits: ["apple", "orange", "banana"] });
});
// app.use("/api/percen_ng",require("./api/api_percen_ng"))

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(2010, () => {
  console.log('Server running on port 2010');
});
