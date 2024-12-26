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
app.use("/api/missing_part", require("./api/api_Missing_part"));
app.use("/api/percen_error",require("./api/api_percen_error"));
app.use("/api/percen_Downtime",require("./api/api_percen_Downtime"));
app.use("/api/importment_downtime", require("./api/api_importment_downtime"));
app.use("/api/downtime", require("./api/api_Mainplan"));
app.use("/api/MC_Error", require("./api/api_MC_Error"));
app.use("/api/MC_Error_Month", require("./api/api_MC_Error_Month"));
// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(2010, () => {
  console.log('Server running on port 2010');
});
