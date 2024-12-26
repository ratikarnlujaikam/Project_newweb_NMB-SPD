import React, { Component } from "react";
import { server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import moment from "moment";
import { apiUrl_python } from "../../constants/index.js";
class Quality extends Component {
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

  doGetData = async () => {
    console.log(this.state.startDate);
    console.log(this.state.finishDate);
    let result = await httpClient.get(
      server.YIELD_URL +
        "/" +
        this.state.startDate +
        "&" +
        this.state.finishDate
    );
    console.log(result.data.result);
    let xAxis = [];
    let yAxis = [];
    let yAxis2 = [];

    for (let index = 0; index < result.data.result.length; index++) {
      const item = result.data.result[index];
      await xAxis.push(item.Date);
      await yAxis.push(item["%Yield"]);
      await yAxis2.push(90);
    }

    this.setState({ data: result.data.result, xAxis, yAxis, yAxis2 });
  };

  componentDidMount = async () => {
    console.log(this.state.startDate);
    console.log(this.state.finishDate);
    let result = await httpClient.get(
      server.YIELD_URL +
        "/" +
        this.state.startDate +
        "&" +
        this.state.finishDate
    );
    console.log(result.data.result);
    let xAxis = [];
    let yAxis = [];
    let yAxis2 = [];

    for (let index = 0; index < result.data.result.length; index++) {
      const item = result.data.result[index];
      await xAxis.push(item.Date);
      await yAxis.push(item["%Yield"]);
      await yAxis2.push(90);
    }

    this.setState({ data: result.data.result, xAxis, yAxis, yAxis2 });
  };

  renderTableRow = () => {
    return this.state.data.map((item) => (
      <tr>
        <td>{item.Date}</td>
        <td>{item["%Yield"]}</td>
      </tr>
    ));
  };

  render() {
    const Process_SPC = `${apiUrl_python}SPC_hr`;
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
                  height: "150%",
                  backgroundColor: "#e6f7ff",
                }}
              >
                <div className="col-sm-12">
                  <h2>Quality</h2>
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
                            <a href="/QAInspection">
                              QA by Model & QA by QA Number
                            </a>
                            <li className="breadcrumb-item">
                              <a href="/Rejection">
                                Reject by Model & Reject by QA Number
                              </a>

                              <li className="breadcrumb-item">
                                <a href="/monthlyQA">Monthly QA Inspection</a>

                                <li className="breadcrumb-item">
                                  <a href="/Trace_back_function_test">
                                    Trace back function test by MBA S/N
                                  </a>
                                  <li className="breadrumb-item">
                                    <a href="/trace_Dynamic">
                                      Trace back Data All Process
                                    </a>
                                  </li>

                                  {/* <li className="breadcrumb-item">
                                    <a href="/STACKHEIGHT">
                                      Static dimension SPC chart
                                    </a>

                                    <li className="breadcrumb-item">
                                      <a href="/MOTORDIM">
                                        Dynamic parallelism data SPC chart
                                      </a>
                                      <li className="breadrumb-item">
                                        <a href="/ROTOR">
                                          Rotor assembly SPC chart (He drive)
                                        </a>
                                        <li className="breadrumb-item">
                                          <a href="/MOTOREWMS">
                                            EWMS data SPC chart
                                          </a>
                                          <li className="breadrumb-item">
                                            <a href="/MOTORHIPOT">
                                              Hi-pot data SPC chart
                                            </a>
                                            <li className="breadrumb-item">
                                              <a href="/MOTORDIMAI">
                                                Ai-press data SPC chart
                                              </a>
                                            </li>
                                           
                                          </li>
                                        </li>
                                      </li>
                                    </li>
                                  </li> */}
                                </li>
                              </li>
                            </li>
                          </li>
                        </div>
                      </div>
                    </div>
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
                            <h5>Monitoring</h5>
                          </h3>
                        </div>
                        <div className="card-body">
                          <li className="breadcrumb-item">
                            <a href="/Product_hold_control">
                              Product hold control
                            </a>

                            <li className="breadcrumb-item">
                              <a href="/QA_lots_status">QA lots status</a>

                              <li className="breadcrumb-item">
                                <a href="/percen_ng">
                                  %NG Dashboard Monitoring
                                </a>
                                <li className="breadcrumb-item">
                                  <a href="/Yield_Monitoring_By_Team">
                                    Yield Monitoring By Team
                                  </a>

                                  <li className="breadcrumb-item">
                                    <a href="/Daily_UPDATE">
                                      Daily LAR Monitoring
                                    </a>
                                    <li className="breadcrumb-item">
                                      <a href={Process_SPC}>Process SPC</a>
                                      <li className="breadcrumb-item">
                                        <a href="/graph_SPC_master">
                                          SPC Master judgement
                                        </a>
                                        <li className="breadcrumb-item">
                                        <a href="/graph_trend_master">
                                        Trend Master judgement
                                        </a>
                            
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
                  <div className="row">
                    <div className="col-md-6 " style={{ paddingTop: 60 }}>
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
                            <a href="/Daily_LAR_by_Model">
                              Daily LAR by Model
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
                              <a href="/Monthly_LAR_report_all_Model">
                                Monthly LAR report all Model
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
                                <a href="/Monthly_LAR_report_by_Model">
                                  Monthly LAR report by Model
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
                                  <a href="Trace_back_shipment">
                                    Trace back shipment
                                  </a>
                                </li>
                              </li>
                            </li>
                          </li>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 " style={{ paddingTop: 60 }}>
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
                            <h5>Analysis requester</h5>
                          </h3>
                        </div>
                        <div className="card-body">
                          <li className="breadcrumb-item">
                            <a href="/Samcleanliness">
                              Analysis Requester Special
                            </a>
                            <li className="breadcrumb-item">
                              <a href="/ViewdatabaseUser">
                                Database Analysis Requester
                              </a>
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
      </div>
    );
  }
}

export default Quality;
