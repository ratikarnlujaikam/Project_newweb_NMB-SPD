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
import Engineer_database from "./components/sidemenu/Engineer_database"
import MasterItemNO from './components/Master/MasterItemNO';
import MasterLine from './components/Master/MasterLine';
import MasterSupplier from './components/Master/MasterSupplier';
import Code_as400 from './components/Master/code_as400'
import Master_ml from './components/Master/Master_ml';



export default class App extends Component {
  render() {
    return (
      <Router>
          <Header/>

        <div>
        <SideMenu />
         <Routes>
         <Route path="/Home" element={<Home />} />
         <Route path="/MasterItemNO" element={<MasterItemNO />} />
         <Route path="/MasterLine" element={<MasterLine />} />
         <Route path="/MasterSupplier" element={<MasterSupplier />} />
         <Route path="/Master_ml" element={<Master_ml />} />
         <Route path="/code_as400" element={<Code_as400 />}/>
  
         <Route path="/Engineer" element={<Engineer_database />} />
       
   
        <Route path="/" element={<Navigate replace to="/Home"/>}></Route>

      </Routes>
      </div>
      </Router>
    );
  }
}
