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
app.use("/api/percen_ng",require("./api/api_percen_ng"))
app.use("/api/percen_OEE",require("./api/api_percen_OEE"))
app.use("/api/graph_output",require("./api/api_graph_output"))
app.use("/api/Compare_Output",require("./api/api_graph_Compare"));
app.use("/api/graph_Compare_month",require("./api/api_graph_Compare_month"));
app.use("/api/graph_Compare_day",require("./api/api_graph_Compare_day"));
app.use("/api/OPT",require("./api/api_OPT"))
app.use("/api/Monthly_Operator",require("./api/api_Monthly_Operator"))
app.use("/api/report_per_producion_team", require("./api/api_report_per_producion_team"));
app.use("/api/Dailypacking", require("./api/api_Dailypacking"));
app.use("/api/Packing_output",require("./api/api_graph_Packing_output"));
app.use("/api/NGlotrecord",require("./api/api_NGlotrecord"));
app.use("/api/Packed_Half_Pallet", require("./api/api_Packed_Half_Pallet"))
app.use("/api/OutPutCo2", require("./api/api_OutPutCo2"));
app.use("/api/AfterQA", require("./api/api_AfterQA"));
app.use("/api/HoldCo2", require("./api/api_Hold_OutPutCo2"));
app.use("/api/Report_printlabal", require("./api/api_Report_printlabal"));
app.use("/api/alarmtraining",require("./api/api_alarmtraining"));
app.use("/api/reportojt",require("./api/api_reportojt"));
app.use("/api/Unpacking",require("./api/api_Unpacking"));
// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(2010, () => {
  console.log('Server running on port 2010');
});
