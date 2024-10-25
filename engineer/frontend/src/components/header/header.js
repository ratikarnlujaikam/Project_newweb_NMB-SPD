import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  Button,
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { apiUrlhome } from "../../constants/index.js";
import { FaHome } from "react-icons/fa"; // ใช้ไอคอนจาก react-icons
import {header} from "../header/header.css"
const useStyles = makeStyles(() => ({
  logo: {
    fontFamily: "Work Sans, sans-serif",
    fontWeight: 600,
    color: "#0B274D",
  },
  menuButton: {
    fontFamily: "Open Sans, sans-serif",
    fontWeight: 600,
    color: "#0B274F",
    size: "20px",
    textAlign: "left",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
  header: {
    backgroundColor: "#FFF",
  },
}));

const headersData = [];

export default function Header() {
  const { header, logo, menuButton, toolbar } = useStyles();

  // เปิดmanu auto
  useEffect(() => {
    // เมื่อคอมโพเนนต์ถูกโหลด
    const pushmenuButton = document.querySelector(
      ".nav-link[data-widget='pushmenu']"
    );
    if (pushmenuButton) {
      pushmenuButton.click(); // คลิกที่ปุ่ม pushmenu โดยอัตโนมัติ
    }
  }, []); // เรียกในรอบแรกที่คอมโพเนนต์ถูกโหลดเท่านั้น

  const displayDesktop = () => {
    return (
      <div className="bodylayout-fixed">
        <Toolbar className={toolbar}>
          <Link to="/home" className="nav-link">
            <img src="BlueText.png" alt="Home" />
          </Link>
          
          <img src="minebeamitsumi_logo_en.png" alt="Logo" />
    
          <div className="menu-main-menu-container">
            <ul className="main-menu menu-main-menu">
            <div className="app-bar-content">
    
            <a className="home-icon-link" href={`${apiUrlhome}`}>
              <FaHome size={24} />
              HOME
            </a>
          </div>
              <li
                id="menu-item-301"
                className="menu-item menu-item-type-post_type menu-item-object-page menu-item-home menu-item-301"
              >
              </li>
              <li
                id="menu-item-333"
                className="menu-item menu-item-type-post_type menu-item-object-page menu-item-333"
              >
                <a href={`${apiUrlhome}Home_Engineer`}>Engineer</a>
              </li>
              <li
                id="menu-item-977"
                className="menu-item menu-item-type-post_type menu-item-object-page menu-item-977"
              >
                <a href={`${apiUrlhome}Home_Quality`}>Quality</a>
              </li>
              <li
                id="menu-item-978"
                className="menu-item menu-item-type-post_type menu-item-object-page menu-item-978"
              >
                <a href={`${apiUrlhome}Home_Production`}>Production</a>
              </li>
              <li
                id="menu-item-341"
                className="menu-item menu-item-type-post_type menu-item-object-page menu-item-341"
              >
                <a href={`${apiUrlhome}Home_PCMC`}>PCMC</a>
              </li>
              <li
                id="menu-item-1103"
                className="menu-item menu-item-type-post_type_archive menu-item-object-career menu-item-1103"
              >
                <a href={`${apiUrlhome}Home_PE_MM`}>PE&MM</a>
              </li>
            </ul>

          </div>
    
       
        </Toolbar>
      </div>
    );
    
  };

  const NMBLogo = (
    <Typography variant="h6" component="h1" className={logo}>
      I-Spindle 4.0
    </Typography>
  );

  const getMenuButtons = () => {
    return headersData.map(({ label, href }) => {
      return (
        <Button
          {...{
            key: label,
            color: "inherit",
            to: href,
            component: RouterLink,
            className: menuButton,
          }}
        >
          {label}
        </Button>
      );
    });
  };

  return (
<header>
  <AppBar
    className={`${header} layout-fixed`}
    main-header="true"
    navbar="true"
    navbar-expand="true"
    navbar-white="true"
    navbar-light="true"
    style={{ backgroundColor: 'white' }} // Inline style for gray background
  >
    {displayDesktop()}
  </AppBar>
</header>

  );
}
