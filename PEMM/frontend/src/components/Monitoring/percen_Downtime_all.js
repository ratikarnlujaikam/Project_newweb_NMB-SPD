import React, { Component } from "react";
import moment from "moment";
import "./App.css"; // Assuming you have a CSS file for styles


class Downtime_monitering extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {

    };
  }

  componentDidMount = async () => {

  };

  render() {
    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 30 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  {/* <h2>Monthly LAR report all Model</h2> */}
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">
                      {/* Monthly LAR report all Model */}
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div class="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="row">{/* Select Critiria "Year" */}</div>
                </div>

                <div className="row" style={{ marginBottom: "5px" }}>
                  <h1>Downtime Dashboard Monitoring</h1>
                  <div className="col-5"></div>
                </div>
                <div className="row">
                  <div className="row">
                    <div className="button-container">
                      <button
                        type="button"
                        onClick={() =>
                          (window.location.href = "/Dash_board_Downtime")
                        }
                        className="btn btn-info big-button"
                      >
                        Clean room
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          (window.location.href = "/Downtime_monitering_Fec2")
                        }
                        className="btn btn-info big-button"
                      >
                        Fac2
                      </button>
                      <button type="button" className="btn btn-info big-button">
                        Magnettiz room
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          (window.location.href =
                            "/Downtime_monitering_Washing")
                        }
                        className="btn btn-info big-button"
                      >
                        Washing
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          (window.location.href = "/Downtime_monitering_WR")
                        }
                        className="btn btn-info big-button"
                      >
                        White room
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          (window.location.href =
                            "/Downtime_monitering_Winding")
                        }
                        className="btn btn-info big-button"
                      >
                        Winding
                      </button>
                  
                      <div style={{ marginBottom: "15px" }} className="button-container">
                        <button
                          type="button"
                          onClick={() =>
                            (window.location.href =
                              "/Downtime_Zone_co2")
                          }
                          className="btn btn-info big-button"
                        >
                          CO2
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            (window.location.href = "/Downtime_Zone_magnet")}
                          className="btn btn-info big-button"
                        >
                          Auto magnet
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            (window.location.href =
                              "/Downtime_Zone_Layer")
                          }
                          className="btn btn-info big-button"
                        >
                          Layer
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            (window.location.href =
                              "/Downtime_Zone_oven")
                          }
                          className="btn btn-info big-button"
                        >
                          Oven
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            (window.location.href =
                              "/Downtime_Zone_packing")
                          }
                          className="btn btn-info big-button"
                        >
                          Packing
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            (window.location.href =
                              "/Downtime_Zone_QA")
                          }
                          className="btn btn-info big-button"
                        >
                          QA
                        </button>
                       
                        <button
                          type="button"
                          onClick={() =>
                            (window.location.href =
                              "/Downtime_Zone_Sorting")
                          }
                          className="btn btn-info big-button"
                        >
                          Sorting
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Downtime_monitering;
