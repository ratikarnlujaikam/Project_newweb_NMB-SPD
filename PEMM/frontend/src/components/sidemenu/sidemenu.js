import React, { Component } from "react";
import { key } from "../../constants";
import { Link } from "react-router-dom";


class sidemenu extends Component {
  render() {
    return (
<aside
  className="main-sidebar sidebar-dark-primary elevation-4 open"
  style={{ top: 69 }}
>
        <a href="../index3.html" className="brand-link">
          <span className="brand-text font-weight-light">I-Spindle 4.0</span>
        </a>
        <div className="sidebar os-host os-theme-light os-host-resize-disabled os-host-scrollbar-horizontal-hidden os-host-scrollbar-vertical-hidden os-host-transition">
          <div className="os-resize-observer-host observed">
            <div
              className="os-resize-observer"
              style={{ left: 0, right: "auto" }}
            />
          </div>
          <div
            className="os-size-auto-observer observed"
            style={{ height: "calc(100% + 1px)", float: "left" }}
          >
            <div className="os-resize-observer" />
          </div>
          <div className="os-content-glue" style={{ margin: "0px -8px" }} />
          <div className="os-padding">
            <div className="os-viewport os-viewport-native-scrollbars-invisible">
              <div
                className="os-content"
                style={{
                  padding: "0px 8px",
                  height: "100%",
                  width: "100%",
                  top: 20,
                }}
              >
                <div className="form-inline">
                  <div className="input-group" data-widget="sidebar-search">
                    <input
                      className="form-control form-control-sidebar"
                      type="search"
                      placeholder="Search"
                      aria-label="Search"
                    />
                    <div className="input-group-append">
                      <button className="btn btn-sidebar">
                        <i className="fas fa-search fa-fw" />
                      </button>
                    </div>
                  </div>
                  <div className="sidebar-search-results">
                    <div className="list-group">
                      <a href="#Search1" className="list-group-item">
                        <div className="search-title">
                          <strong className="text-light" />N
                          <strong className="text-light" />o
                          <strong className="text-light" />{" "}
                          <strong className="text-light" />e
                          <strong className="text-light" />l
                          <strong className="text-light" />e
                          <strong className="text-light" />m
                          <strong className="text-light" />e
                          <strong className="text-light" />n
                          <strong className="text-light" />t
                          <strong className="text-light" />{" "}
                          <strong className="text-light" />f
                          <strong className="text-light" />o
                          <strong className="text-light" />u
                          <strong className="text-light" />n
                          <strong className="text-light" />d
                          <strong className="text-light" />!
                          <strong className="text-light" />
                        </div>
                        <div className="search-path" />
                      </a>
                      <a href="#Search2" className="list-group-item">
                        <div className="search-title">
                          <strong className="text-light" />N
                          <strong className="text-light" />o
                          <strong className="text-light" />{" "}
                          <strong className="text-light" />e
                          <strong className="text-light" />l
                          <strong className="text-light" />e
                          <strong className="text-light" />m
                          <strong className="text-light" />e
                          <strong className="text-light" />n
                          <strong className="text-light" />t
                          <strong className="text-light" />{" "}
                          <strong className="text-light" />f
                          <strong className="text-light" />o
                          <strong className="text-light" />u
                          <strong className="text-light" />n
                          <strong className="text-light" />d
                          <strong className="text-light" />!
                          <strong className="text-light" />
                        </div>
                        <div className="search-path" />
                      </a>
                    </div>
                  </div>
                </div>
                <nav className="mt-2">
                  <ul
                    className="nav nav-pills nav-sidebar flex-column"
                    data-widget="treeview"
                    role="menu"
                    data-accordion="false"
                  >
                        <li className="nav-item">
                          <Link to="/Engineer" className="nav-link">
                     
                            Engineer
                          </Link>
                        </li> 
                        <li className="nav-item">
                          <Link to="/Quality" className="nav-link">
                          
                           Quality
                          </Link>
                        </li> 
                        <li className="nav-item">
                          <Link to="/Production" className="nav-link">
                          
                           Production
                          </Link>
                        </li> 
                        <li className="nav-item">
                          <Link to="/PCMC" className="nav-link">
                         
                          PCMC
                          </Link>
                        </li> 
                        <li className="nav-item">
                          <Link to="/PE_MM" className="nav-link">
                         
                           PE&MM
                          </Link>
                        </li> 
                        <li className="nav-item">
                          <Link to="/Data_Analysis" className="nav-link">
                         
                          Data Analysis
                          </Link>
                        </li> 
                 

                    {/* admin */}
                    <li className="nav-item">
                      <Link to="/information" className="nav-link">
                        <i className="nav-icon fas fa-user-cog" />
                        Specification Control (Admin)
                      </Link>
                    </li>
                  </ul>


                  {/* Insert Logout button */}
                  <div className="card-footer">
                    <a href="/login" className="nav-link ">
                      <button
                        onClick={() => {
                          localStorage.removeItem(key.LOGIN_PASSED);
                          localStorage.removeItem(key.JWT_TOKEN);
                          localStorage.removeItem(key.USER_LV);
                          localStorage.removeItem(key.USER_NAME);
                        }}
                        className="btn btn-danger"
                      >
                        Logout
                      </button>
                    </a>
                  </div>
                </nav>
              </div>
            </div>
          </div>
          <div className="os-scrollbar os-scrollbar-horizontal os-scrollbar-unusable os-scrollbar-auto-hidden">
            <div className="os-scrollbar-track">
              <div
                className="os-scrollbar-handle"
                style={{ width: "100%", transform: "translate(0px, 0px)" }}
              />
            </div>
          </div>
          <div className="os-scrollbar os-scrollbar-vertical os-scrollbar-unusable os-scrollbar-auto-hidden">
            <div className="os-scrollbar-track">
              <div
                className="os-scrollbar-handle"
                style={{ height: "100%", transform: "translate(0px, 0px)" }}
              />
            </div>
          </div>
          <div className="os-scrollbar-corner" />
        </div>
      </aside>
    );
  }
}

export default sidemenu;
