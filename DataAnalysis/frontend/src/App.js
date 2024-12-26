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
export default class App extends Component {
  render() {
    return (
      <Router>
          <Header/>

        <div>
        <SideMenu />
         <Routes>
         <Route path="/Home" element={<Home />} ></Route>
        <Route path="/" element={<Navigate replace to="/Home"/>}></Route>

      </Routes>
      </div>
      </Router>
    );
  }
}
