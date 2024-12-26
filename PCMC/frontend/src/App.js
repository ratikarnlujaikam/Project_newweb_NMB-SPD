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
import Vrecode from "./components/Traceability/Vrecode"
import Shipmentdata from './components/Monitoring/Shipmentdata';
import PC_shipment from './components/Monitoring/PC_shipment'
import For_Inspection_tags_status from './components/Report/For_Inspection_tags_status';
import Daily_store_issue from "./components/Report/Daily_store_issue"
export default class App extends Component {
  render() {
    return (
      <Router>
          <Header/>

        <div>
        <SideMenu />
         <Routes>
         <Route path="/Home" element={<Home />} ></Route>
         <Route path = "/Vrecode" element={<Vrecode/>}></Route>
         <Route path = "/Shipmentdata" element={<Shipmentdata/>}></Route>
         <Route path = "/PC_shipment" element={<PC_shipment/>}></Route>
         <Route path ="/For_Inspection_tags_status" element={<For_Inspection_tags_status/>}></Route>
         <Route path = "/Daily_store_issue" element={<Daily_store_issue/>}></Route>
        <Route path="/" element={<Navigate replace to="/Home"/>}></Route>

      </Routes>
      </div>
      </Router>
    );
  }
}
