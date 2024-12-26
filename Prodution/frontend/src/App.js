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
import Procen_ng from "./components/Monitoring/procen_ng"
import Percen_OEE from "./components/Monitoring/percen_OEE"
import Percen_OEE_monthly from "./components/Monitoring/percen_OEE_monthly"
import Prodution_report from "./components/Monitoring/Prodution_report"
import Compare_Output from "./components/Monitoring/Compare_Output"
import Compare_Output_month from "./components/Monitoring/Compare_Output_month";
import Compare_Output_day from "./components/Monitoring/Compare_Output_day";
import Operator_tracking_data from "./components/Report/Operator_tracking_data"
import Monthly_Operator from "./components/Report/Monthly_Operator"
import Report_per_producion_team from "./components/Report/report_per_producion_team"
import Daily_Report_Packing from "./components/Report/Daily_Report_Packing"
import Matching_Tray_Daily_Output from "./components/Report/graph_packing"
import NGlotrecord from "./components/Report/NGlotrecord"
import Packed_half_pallet from "./components/Report/Packed_half_pallet"
import Output_Final_Before_QA from "./components/Report/Output_Final_Before_QA"
import Output_Final_after_QA from "./components/Report/Output_Final_after_QA"
import Production_hold_record from "./components/Report/Production_hold_record"
import Request_label_printing_report from "./components/Report/Request_label_printing_report"
import AlarmTraning from "./components/Report/AlarmTraning"
import ReportOJT from "./components/Report/ReportOJT"
import Sorting_status from "./components/Report/Sorting_status";
export default class App extends Component {
  render() {
    return (
      <Router>
          <Header/>

        <div>
        <SideMenu />
         <Routes>
         <Route path="/Home" element={<Home />} ></Route>
         <Route path="/procen_ng" element={<Procen_ng />}></Route>
         <Route path="/percen_OEE" element={<Percen_OEE />} ></Route>
         <Route path="/percen_OEE_monthly" element={<Percen_OEE_monthly />} ></Route>
         <Route path="/Production_Report" element={<Prodution_report />}></Route>
         <Route path="/Compare_Output" element={<Compare_Output />} ></Route>
         <Route path="/Compare_Output_month" element={<Compare_Output_month />}></Route>
         
         <Route path="/Compare_Output_day" element={<Compare_Output_day/>}></Route> 
         <Route path ="/Operator_tracking_data" element={<Operator_tracking_data/>}></Route>
         <Route path ="/Monthly_Operator" element={<Monthly_Operator/>}></Route>
         <Route path ="/report_per_producion_team" element={<Report_per_producion_team/>}></Route>
         <Route path ="/Daily_Report_Packing" element={<Daily_Report_Packing/>}></Route>
         <Route path ="/output_packing" element={<Matching_Tray_Daily_Output/>}></Route>
         <Route path ="/NG_lotrecord" element={<NGlotrecord/>}></Route>
         <Route path = "/Packed_half_pallet" element={<Packed_half_pallet/>}></Route>
         <Route path = "/Output_Final_Before_QA"  element = {<Output_Final_Before_QA/>}></Route>
         <Route path = "/Output_Final_after_QA" element={<Output_Final_after_QA/>}></Route>
         <Route path = "/Production_hold_record" element={<Production_hold_record/>}></Route>
         <Route path = "/Request_label_printing_report" element={<Request_label_printing_report/>}></Route>
         <Route path = "/AlarmTraning" element={<AlarmTraning/>}></Route>
         <Route path = "/ReportOJT" element={<ReportOJT/>}></Route>
         <Route path = "/Sorting_status" element={<Sorting_status/>}></Route>
        <Route path="/" element={<Navigate replace to="/Home"/>}></Route>

      </Routes>
      </div>
      </Router>
    );
  }
}
