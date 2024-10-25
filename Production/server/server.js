const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: ["http://localhost:3000"]
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
app.use("/api/model_tbMasteritemNO",require("./api/api_model_tbMasterItemNO"))
app.use("/api/MasterItemNO", require("./api/api_MasterItemNO"));
app.use("/api/MasterLine", require("./api/api_MasterLine"));
app.use("/api/MasterSupplier", require("./api/api_MasterSupplier"));
app.use("/api/side_menu", require("./api/api_side_menu"));
app.use("/api/Master_ML", require("./api/api_Master"));
app.use("/api/code_AS400",require("./api/api_code_AS400"));
// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(2010, () => {
  console.log('Server running on port 2010');
});
