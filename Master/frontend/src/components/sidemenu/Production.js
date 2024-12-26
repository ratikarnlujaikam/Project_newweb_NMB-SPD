import React, { Component } from "react";
import { server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import moment from "moment";
import "./sidemenu.css";

class Engineer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      xAxis: [],
      yAxis: [],
      yAxis2: [],
      //filter
      startDate: moment().add("days", -30).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"),
    };
  }

  render() {

    return (
      <div className="content-wrapper" style={{ border: "1px solid #e6f7ff" }}>
        <div className="content" style={{ paddingTop: 80 }}>
          {/* ... rest of your code ... */}

          <div className="row">
            <ol className="breadcrumb float-sm-right">
              <li className="breadcrumb-item">
                <a href="/Home">
                  <i className="fa fa-arrow-left"></i> Home
                </a>
              </li>
            </ol>
            <div className="col-md-12">
              <div
                className="card card-primary card-outline"
                style={{
                  width: "100%",
                  height: "130%",
                  backgroundColor: "#e6f7ff",
                }}
              >
                <div className="col-sm-12">
                  <h2>Production</h2>

                  <div className="row">
                    <div className="col-md-6">
                      <div
                        className="card card-primary card-outline"
                        style={{
                          width: "100%",
                          height: "100%",
                          border: "2px solid #0073e6", // Set border color to a darker blue
                        }}
                      >
                        <div className="card-header">
                          <h3 className="card-title">
                            <h5>Traceability</h5>
                          </h3>
                        </div>
                        <div className="card-body">
                          <li className="breadcrumb-item">
                            <a href="trace_back_ng">
                              Trace back NG Dynamic Parallelism Tester
                            </a>
                          </li>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="card card-primary card-outline"
                        style={{
                          width: "95%",
                          height: "100%",
                          border: "2px solid #0073e6", // Set border color to a darker blue
                        }}
                      >
                        <div className="card-header">
                          <h3 className="card-title">
                            <h5>Monitoring</h5>
                          </h3>
                        </div>
                        <div className="card-body">
                          <li className="breadcrumb-item">
                            <a href="/percen_OEE">
                              Realtime OEE Dashboard Monitoring
                              <img
                                src="icons8-graph-50.png"
                                alt="Icon"
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  marginLeft: "5px",
                                }}
                              />{" "}
                            </a>
                            <li className="breadcrumb-item">
                              <a href="/percen_OEE_monthly">
                                OEE Monthly Dashboard Monitoring
                                <img
                                  src="icons8-graph-50.png"
                                  alt="Icon"
                                  style={{
                                    width: "30px",
                                    height: "30px",
                                    marginLeft: "5px",
                                  }}
                                />{" "}
                              </a>
                              <li className="breadcrumb-item">
                                <a href="http://10.120.122.28:1820">
                                  Production data result
                                  <img
                                    src="icons8-graph-50.png"
                                    alt="Icon"
                                    style={{
                                      width: "30px",
                                      height: "30px",
                                      marginLeft: "5px",
                                    }}
                                  />{" "}
                                </a>
                                <li className="breadcrumb-item">
                                  <a href="http://wbp2.bp.minebea.local/Domino_SpindleDrawing/Realtime_Dashboard/Realtime_Monitoring.xlsm">
                                    Download Production result dashboard
                                    <img
                                      src="icons8-export-excel-48.png"
                                      alt="Icon"
                                      style={{
                                        width: "30px",
                                        height: "30px",
                                        marginLeft: "5px",
                                      }}
                                    />{" "}
                                  </a>
                                  <li className="breadcrumb-item">
                                    <a href="http://wbp2.bp.minebea.local/Domino_SpindleDrawing/OEE_Dashboard/OEE_Compare_MfgDate.xlsm">
                                      OEE Compare by Mfgdate download
                                      <img
                                        src="icons8-export-excel-48.png"
                                        alt="Icon"
                                        style={{
                                          width: "30px",
                                          height: "30px",
                                          marginLeft: "5px",
                                        }}
                                      />{" "}
                                    </a>
                                  <li className="breadcrumb-item">
                                    <a href="http://wbp2.bp.minebea.local/Domino_SpindleDrawing/Availability/Excel_VBA%20_Production_report.xlsm">
                                    Download  availability of production
                                      <img
                                        src="icons8-export-excel-48.png"
                                        alt="Icon"
                                        style={{
                                          width: "30px",
                                          height: "30px",
                                          marginLeft: "5px",
                                        }}
                                      />{" "}
                                    </a>
                                    <li className="breadcrumb-item">
                                      <a href="/Test_graph">
                                        Production Report's Traceability
                                        <img
                                          src="icons8-graph-50.png"
                                          alt="Icon"
                                          style={{
                                            width: "30px",
                                            height: "30px",
                                            marginLeft: "5px",
                                          }}
                                        />{" "}
                                      </a>

                                      <li className="breadcrumb-item">
                                        <a href="/Compare_Output">
                                          Compare Output & NG With Target
                                          <img
                                            src="icons8-graph-50.png"
                                            alt="Icon"
                                            style={{
                                              width: "30px",
                                              height: "30px",
                                              marginLeft: "5px",
                                            }}
                                          />{" "}
                                        </a>

                                        <li className="breadcrumb-item">
                                          <a href="/Compare_Output_month">
                                            %NG Monthly's Summary
                                            <img
                                              src="icons8-graph-50.png"
                                              alt="Icon"
                                              style={{
                                                width: "30px",
                                                height: "30px",
                                                marginLeft: "5px",
                                              }}
                                            />{" "}
                                          </a>

                                          <li className="breadcrumb-item">
                                            <a href="/Compare_Output_Day">
                                              %NG Daily's Summary
                                              <img
                                                src="icons8-graph-50.png"
                                                alt="Icon"
                                                style={{
                                                  width: "30px",
                                                  height: "30px",
                                                  marginLeft: "5px",
                                                }}
                                              />{" "}
                                            </a>
                                          </li>
                                        </li>
                                      </li>
                                      </li>
                                    </li>
                                  </li>
                                </li>
                              </li>
                            </li>
                          </li>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6" style={{ paddingTop: 60 }}>
                    <div
                      className="card card-primary card-outline"
                      style={{
                        width: "100%",
                        height: "100%",
                        border: "2px solid #0073e6", // Set border color to a darker blue
                      }}
                    >
                      <div className="card-header">
                        <h3 className="card-title">
                          <h5>Report</h5>
                        </h3>
                      </div>
                      <div className="card-body">
                        <li className="breadcrumb-item">
                          <a href="/Operator_tracking_data">
                            Operator tracking data
                          </a>
                          <li className="breadcrumb-item">
                            <a href="/Monthly_Operator">
                              Monthly Operator Tracking Record
                            </a>
                            <li className="breadcrumb-item">
                              <a href="/report_per_producion_team">
                                LAR report per Production team
                                <img
                                  src="icons8-graph-50.png"
                                  alt="Icon"
                                  style={{
                                    width: "30px",
                                    height: "30px",
                                    marginLeft: "5px",
                                  }}
                                />{" "}
                              </a>
                              <li className="breadcrumb-item">
                                <a href="/Daily_Report_Packing">
                                  Daily Report Packing
                                  <img
                                    src="icons8-graph-50.png"
                                    alt="Icon"
                                    style={{
                                      width: "30px",
                                      height: "30px",
                                      marginLeft: "5px",
                                    }}
                                  />{" "}
                                </a>
                                <li className="breadcrumb-item">
                                  <a href="/output_packing">
                                    Matching Tray Daily Output
                                    <img
                                      src="icons8-graph-50.png"
                                      alt="Icon"
                                      style={{
                                        width: "30px",
                                        height: "30px",
                                        marginLeft: "5px",
                                      }}
                                    />{" "}
                                  </a>
                                  <li className="breadcrumb-item">
                                    <a href="/Packed_half_pallet">
                                      Packing Pallet in progress
                                      <img
                                        src="icons8-graph-50.png"
                                        alt="Icon"
                                        style={{
                                          width: "30px",
                                          height: "30px",
                                          marginLeft: "5px",
                                        }}
                                      />{" "}
                                    </a>
                                    <li className="breadcrumb-item">
                                      <a href="/Output_Final_Before_QA">
                                        Daily Output Final ass’y (Before QA)
                                      </a>
                                      <li className="breadcrumb-item">
                                        <a href="/Output_Final_after_QA">
                                          Daily Output Final ass’y (After QA)
                                        </a>
                                        <li className="breadcrumb-item">
                                          <a href="/Production_hold_record">
                                            Production hold record
                                          </a>

                                          <li className="breadcrumb-item">
                                            <a href="/Request_label_printing_report">
                                              Request label printing report
                                            </a>

                                            <li className="breadcrumb-item">
                                              <a href="/AlarmTraning">
                                                Training expired record
                                              </a>

                                              <li className="breadcrumb-item">
                                                <a href="/ReportOJT">
                                                  Training record report
                                                </a>
                                          
                                              <li className="breadcrumb-item">
                                                <a href="/Sorting_status">
                                                Sorting Status
                                                
                                                </a>
                                                <img
                                        src="icons8-box-64.png"
                                        alt="Icon"
                                        style={{
                                          width: "30px",
                                          height: "30px",
                                          marginLeft: "5px",
                                        }}
                                      />{" "}
   
                                              </li>
                                              </li>
                                            </li>


                                          </li>
                                          
                                        </li>
                                      </li>
                                    </li>
                                  </li>
                                </li>
                              </li>
                            </li>
                          </li>
                        </li>
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

export default Engineer;
