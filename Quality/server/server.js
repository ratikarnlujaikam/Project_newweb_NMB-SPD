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

app.use("/api/side_menu", require("./api/api_side_menu"));
app.use("/api/QAInspection", require("./api/api_QAInspection"));
app.use("/api/Rejection", require("./api/api_Rejection"));
app.use("/api/monthlyQA", require("./api/api_monthlyQA"));
app.use("/api/QPM", require("./api/api_QPM"))
app.use("/api/Trace_Dynamic", require("./api/api_Trace_Dynamic_parallelirm"));
app.use("/api/Daily_LAR_by_Model", require("./api/api_Daily_LAR_by_Model"));
app.use("/api/Monthly_LAR_report_all_Model", require("./api/api_Monthly_LAR_report_all_Model"));
app.use("/api/Monthly_LAR_report_by_Model", require("./api/api_Monthly_LAR_report_by_Model"));
app.use("/api/Product_hold_control", require("./api/api_Product_hold_control"));
app.use("/api/QA_lots_status", require("./api/api_QA_lots_status"));
app.use("/api/percen_ng", require("./api/api_percen_ng"));
app.use("/api/graph_LAR_byteam", require("./api/api_graph_LAR_byteam"));
app.use("/api/LAR_BY_MODEL_UPDATE", require("./api/api_LAR_BY_MODEL_G"));
app.use("/api/trend_master",require("./api/api_trendmaster_values"));
app.use("/api/LAR_by_team",require("./api/api_LAR_by_team"));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(2010, () => {
  console.log('Server running on port 2010');
});
