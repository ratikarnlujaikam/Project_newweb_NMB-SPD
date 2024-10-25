import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  // Redirect,
Navigate,
} from "react-router-dom";

import Home from "./components/home";
import Header from "./components/header";
import SideMenu from "./components/sidemenu/sidemenu"

import QAInspection from "./components/QAInspection";
import RejectByModel from "./components/Rejection/Rejection";
import Monthlyqa from "./components/monthlyQA/monthlyQA";
import Trace_Dynamic from "./components/trace_Dynamic_Parallelism/trace_Dynamic_Parallelism";
import Daily_LAR_by_Model from "./components/LAR/Daily_LAR_by_Model";
import Monthly_LAR_report_all_Model from "./components/LAR/Monthly_LAR_report_all_Model";
import Monthly_LAR_report_by_Model from './components/LAR/Monthly_LAR_report_by_Model';
import Trace_back_shipment from "./components/dodata/Trace_back_shipment";
import Product_hold_control from "./components/QAInspection/Product_hold_control";
import QA_lots_status from "./components/QAInspection/QA_lots_status";
import Percen_ng from "./components/procen_ng/procen_ng";
import LAR_BY_TEAM_PRODUCTION from "./components/LARInspection/LAR_team_prodution";
import Daily_LAR_by_Model_G from "./components/LARInspection/Daily_LAR_by_Model_G";
import Graph_trendmaster from "./components/LARInspection/graph_trendmaster";
export default class App extends Component {
  render() {
    return (
      <Router>
          <Header/>

        <div>
        <SideMenu />
         <Routes>
         <Route path="/Home" element={<Home />} />
         {/* Traceability */}
         <Route path="/QAInspection" element={<QAInspection />} />   {/* QA by Model & QA by QA Number */}
         <Route path="/RejectByModel" element={<RejectByModel />} />  {/* Reject by Model & Reject by QA Number */}
         <Route path="/MonthlyQA" element={<Monthlyqa />} />    {/* Monthly QA by QA Number */}
       
         <Route path="/trace_Dynamic" element={<Trace_Dynamic />} /> {/* Trace back Data All Process */}
         {/* Report */}
         <Route path="/Daily_LAR_by_Model"element={<Daily_LAR_by_Model/>}></Route>
         <Route path="/Monthly_LAR_report_all_Model"element={<Monthly_LAR_report_all_Model/>}></Route>
         <Route path="/Monthly_LAR_report_by_Model"element={<Monthly_LAR_report_by_Model/>}></Route>
         {/* <Route path="/Trace_back_shipment"element={<Trace_back_shipment/>}></Route> */}
         {/* Monitoring */}
         <Route path="/Product_hold_control"element={<Product_hold_control/>}></Route>
         <Route path="/QA_lots_status"element={<QA_lots_status/>}></Route>
         <Route path="/percen_ng"element={<Percen_ng/>}></Route>
         <Route path="/NG_Monitoring_By_Team"element={<LAR_BY_TEAM_PRODUCTION/>}></Route>
         <Route path="/Daily_UPDATE"element={<Daily_LAR_by_Model_G/>}></Route>
         <Route path="/graph_trend_master"element={<Graph_trendmaster/>}></Route>
        <Route path="/" element={<Navigate replace to="/Home"/>}></Route>

      </Routes>
      </div>
      </Router>
    );
  }
}
