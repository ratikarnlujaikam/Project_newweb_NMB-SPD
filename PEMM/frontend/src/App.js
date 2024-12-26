import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  // Redirect,
  Navigate,
} from "react-router-dom";

import Home from "./components/home";
import Header from "./components/header";
import SideMenu from "./components/sidemenu/sidemenu";
import Missing_part_daily from "./components/Traceability/Missing_part_daily";
import Percen_error from "./components/Monitoring/percen_error";
import Percen_Downtime from "./components/Monitoring/percen_Downtime";
import Downtime_monitering from "./components/Monitoring/percen_Downtime_all";
import Downtime_monitering_WR from "./components/Monitoring/percen_Downtime_WR";
import Downtime_monitering_Fec2 from "./components/Monitoring/percen_Downtime_Fac2";
import Downtime_monitering_Winding from "./components/Monitoring/percen_Downtime_Winding";
import Downtime_monitering_Washing from "./components/Monitoring/percen_Downtime_Washing";
import Downtime_Zone_magnet from "./components/Monitoring/percen_Downtime_Zone_magnet";
import Downtime_Zone_co2 from "./components/Monitoring/percen_Downtime_Zone_co2";
import Downtime_Zone_Layer from "./components/Monitoring/percen_Downtime_Zone_Layer";
import Downtime_Zone_oven from "./components/Monitoring/percen_Downtime_Zone_oven";
import Downtime_Zone_packing from "./components/Monitoring/percen_Downtime_Zone_Packing";
import Downtime_Zone_QA from "./components/Monitoring/percen_Downtime_Zone_QA";
import Downtime_Zone_Sorting from "./components/Monitoring/percen_Downtime_Zone_sorting";
import Importment_downtime_line from "./components/Monitoring/Improment_downtime_line";
import Auto_machine_alarm_history from "./components/Report/Auto_machine_alarm_history"
import Auto_machine_alarm_history_Month from "./components/Report/Auto_machine_alarm_history_Month"
import Downtime_daily from "./components/Report/Mainplandaily"
import Mainplan_monthly from "./components/Report/Mainplanmonthly"
import Mainplanreport from "./components/Report/Mainplanreport";
export default class App extends Component {
  render() {
    return (
      <Router>
        <Header />

        <div>
          <SideMenu />
          <Routes>
            <Route path="/Home" element={<Home />}></Route>
            <Route
              path="/Missing_part_daily"
              element={<Missing_part_daily />}
            ></Route>
            <Route path="/percen_error" element={<Percen_error />}></Route>
            <Route
              path="/Dash_board_Downtime"
              element={<Percen_Downtime />}
            ></Route>
            <Route
              path="/Downtime_monitering"
              element={<Downtime_monitering />}
            ></Route>
            <Route
              path="/Downtime_monitering_WR"
              element={<Downtime_monitering_WR />}
            ></Route>
            <Route
              path="/Downtime_monitering_Fec2"
              element={<Downtime_monitering_Fec2 />}
            ></Route>
            <Route
              path="/Downtime_monitering_Winding"
              element={<Downtime_monitering_Winding />}
            ></Route>
            <Route
              path="/Downtime_monitering_Washing"
              element={<Downtime_monitering_Washing />}
            ></Route>
            <Route
              path="/Downtime_Zone_magnet"
              element={<Downtime_Zone_magnet />}
            ></Route>

            <Route
              path="/Downtime_Zone_co2"
              element={<Downtime_Zone_co2 />}
            ></Route>
            <Route
              path="/Downtime_Zone_Layer"
              element={<Downtime_Zone_Layer />}
            ></Route>
            <Route
              path="/Downtime_Zone_oven"
              element={<Downtime_Zone_oven />}
            ></Route>
            <Route
              path="/Downtime_Zone_packing"
              element={<Downtime_Zone_packing />}
            ></Route>
            <Route
              path="/Downtime_Zone_QA"
              element={<Downtime_Zone_QA />}
            ></Route>
            <Route
              path="/Downtime_Zone_Sorting"
              element={<Downtime_Zone_Sorting />}
            ></Route>
            <Route path="/Importment_downtime_line" element={<Importment_downtime_line/>}></Route>
            <Route path="/Auto_machine_alarm_history" element={<Auto_machine_alarm_history/>}></Route>
            <Route path="/Auto_machine_alarm_history_Month" element={<Auto_machine_alarm_history_Month/>}></Route>
            <Route path="/Downtime_daily" element={<Downtime_daily/>}></Route>
            <Route path="/Downtime_monthly" element={<Mainplan_monthly/>}></Route>
            <Route path="/Downtime_all_report" element={<Mainplanreport/>}></Route>

            <Route path="/" element={<Navigate replace to="/Home" />}></Route>
          </Routes>
        </div>
      </Router>
    );
  }
}
