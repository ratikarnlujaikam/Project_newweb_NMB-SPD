import React, { Component } from "react";
import { key, server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import Chart from "react-apexcharts";
import moment from "moment";
import Select from "react-select";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";
import ReactDOM from "react-dom";
import ReactApexChart from "react-apexcharts";
import ApexCharts from "apexcharts";
// import {icon} from "public\dist\img\refresh-arrow.png";

function Refresh() {
  window.location.reload(false);
}

class Production_hold_record extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      year: [],
      Month: [],
      Model: [],
      Line: [],
      insType: [],
      report: [],
      report2: [],
      options: {},
      options2: {},
      chart: [],

      Raw_Dat1: [],
      Raw_Dat2: [],

      startDate: moment().format("yyyy-MM-DD"), //moment().add("days", -6).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"), //moment().format("yyyy-MM-DD"),
      listModel: [],
      listLine: [],

      optionSelected: null,
      isDisable: false,
    };
  }

  componentDidMount = async () => {
    let command = await httpClient.get(server.HOLDCO2_URL);
    this.setState({ report: command.data.result });

    let rawData = command.data.listRawData;
    // console.log(rawData);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat1: rawData[0] });
    // console.log(this.state.Raw_Dat1);

    this.setState({
      report: command.data.result,
      isDisable: false,
    });

    let command1 = await httpClient.get(server.HOLDDETAIL_URL);
    this.setState({ report2: command1.data.result });

    let rawData1 = command1.data.listRawData;
    // console.log(rawData);
    for (let i = 1; i < rawData1.length; i++) {
      rawData1[0].push(...rawData1[i]);
    }
    this.setState({ Raw_Dat2: rawData1[0] });
    // console.log(this.state.Raw_Dat2);

    this.setState({
      report2: command1.data.result,
      isDisable: false,
    });
  };

  doGetSumOutputCo2 = async () => {
    const result = await httpClient.get(server.HOLDCO2_URL);
    let rawData = result.data.listRawData;
    console.log(rawData);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat1: rawData[0] });
    // console.log(this.state.Raw_Dat1);

    this.setState({
      report: result.data.result,
      isDisable: false,
    });
  };

  renderreport1 = () => {
    if (this.state.report != null) {
      if (this.state.report.length > 0) {
        return this.state.report.map((item) => (
          <tr align="Center">
            <td align="Left">{item["MfgDate"]}</td>
            <td align="Left">{item["Line"]}</td>
            <td align="Left">{item["Item_No"]}</td>
            <td align="Left">{item["Model"].toUpperCase()}</td>
            <td>
              {Number(item["SHIFT_A"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["SHIFT_B"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["SHIFT_C"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["SHIFT_M"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["SHIFT_N"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["TOTAL"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
          </tr>
        ));
      }
    }
  };
  renderreport2 = () => {
    if (this.state.report2 != null) {
      if (this.state.report2.length > 0) {
        return this.state.report2.map((item) => (
          <tr align="Center">
            <td align="Left">{item["MfgDate"]}</td>
            <td align="Left">{item["Line"]}</td>
            <td align="Left">{item["Shift"]}</td>
            <td align="Left">{item["Model"].toUpperCase()}</td>
            <td align="Left">{item["Item_No"]}</td>
            <td align="Left">{item["QA_No"].toUpperCase()}</td>
            <td align="Left">{item["Mo_number"].toUpperCase()}</td>

            <td align="Left">{item["W/W"]}</td>
            <td>
              {Number(item["Qty"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td align="Left">{item["Special_control"]}</td>
            <td align="Left">{item["Supporter_name"].toUpperCase()}</td>
            <td align="Left">{item["Baseplate"].toUpperCase()}</td>
            <td align="Left">{item["Ramp"].toUpperCase()}</td>
            <td align="Left">{item["Crashstop"].toUpperCase()}</td>
            <td align="Left">{item["Hub"].toUpperCase()}</td>
            <td align="Left">{item["Magnet"].toUpperCase()}</td>
            <td align="Left">{item["Diverter"].toUpperCase()}</td>
            <td align="Left">{item["FPC"].toUpperCase()}</td>
            <td align="Left">{item["FPC"].toUpperCase()}</td>
            <td align="Left">{item["DateTime"]}</td>
            <td align="Left">{item["Machine_no"].toUpperCase()}</td>
            <td align="Left">{item["CO2_EMP"].toUpperCase()}</td>
            <td align="Left">{item["CO2_DATE"].toUpperCase()}</td>
            <td align="Left">{item["CO2_SP1"].toUpperCase()}</td>
            <td align="Left">{item["CO2_SP2"].toUpperCase()}</td>
            <td align="Left">{item["SP1"]}</td>
            <td align="Left">{item["SP2"]}</td>
            <td align="Left">{item["SP3"]}</td>
            <td align="Left">{item["SP4"]}</td>
            <td align="Left">{item["SP5"]}</td>
            <td align="Left">{item["Revision"]}</td>
          </tr>
        ));
      }
    }
  };

  render() {
    // console.log(this.state.report);
    // console.log(this.state.listLine);
    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 70 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-3">
                  <h1>Production hold record</h1>
                </div>
                <div className="col-sm-3">
                  <button
                    onClick={Refresh}
                    type="button"
                    className="btn btn-primary"
                  >
                    <i className="fas fa-sync" />
                    Refresh
                  </button>
                </div>

                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">Production hold record</li>
                  </ol>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              {/* <div className="card card-primary card-outline">
                <div className="card-header">
                  <h3 className="card-title">
                    <h3>Hold Final ass’y</h3>
                  </h3>
                </div>
              </div> */}
              <div className="content" style={{ paddingTop: 5 }}>
                <section className="content-header">
                  <div className="container-fluid">
                    <div className="row mb-1">
                      <div className="col-sm-3">
                        <h1>Hold Final ass’y(Summary)</h1>
                      </div>
                      <div className="col-sm-2">
                        <CSVLink
                          data={this.state.Raw_Dat1}
                          filename={"Hold Final ass’y(Summary).csv"}
                        >
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ marginTop: 1 }}
                          >
                            Download
                          </button>
                        </CSVLink>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
              <div className="row mb-2">
                <div className="col-sm-6">
                  <div className="row"></div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="content">
                    <div className="container-fluid">
                      <div className="card card-primary">
                        <div
                          className="card-body table-responsive p-0"
                          style={{ height: 400 }}
                        >
                          <table className="table table-head-fixed text-nowrap table-hover">
                            <thead>
                              <tr align="center">
                                <th width="120">DATE</th>
                                <th width="120">Line</th>
                                <th width="120">Item No.</th>
                                <th width="120">Model</th>
                                <th width="120">SHIFT A</th>
                                <th width="120">SHIFT B</th>
                                <th width="120">SHIFT C</th>
                                <th width="120">SHIFT M</th>
                                <th width="120">SHIFT N</th>
                                <th width="120">TOTAL</th>
                              </tr>
                            </thead>
                            <tbody>{this.renderreport1()}</tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="content" style={{ paddingTop: 5 }}>
            <section className="content-header">
              <div className="container-fluid">
                <div className="row mb-1">
                  <div className="col-sm-3">
                    <h1>Hold Final ass’y Detail</h1>
                  </div>
                  <div className="col-sm-6">
                    <CSVLink
                      data={this.state.Raw_Dat2}
                      filename={"Hold Final ass’y Detail.csv"}
                    >
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ marginTop: 1 }}
                      >
                        Download
                      </button>
                    </CSVLink>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div className="content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  <div className="content">
                    <div className="container-fluid">
                      <div className="card card-primary">
                        <div
                          className="card-body table-responsive p-0"
                          style={{ height: 400 }}
                        >
                          <table className="table table-head-fixed text-nowrap table-hover">
                            <thead>
                              <tr align="center">
                                <th width="120">MfgDate</th>
                                <th width="120">Line</th>
                                <th width="120">Shift</th>
                                <th width="120">Model</th>
                                <th width="120">Item No</th>
                                <th width="120">QA No</th>
                                <th width="120">Mo_number</th>
                                <th width="120">W/W</th>
                                <th width="120">Qty</th>
                                <th width="120">Special control</th>
                                <th width="120">Supporter name</th>
                                <th width="120">Baseplate</th>
                                <th width="120">Ramp</th>
                                <th width="120">Crashstop</th>
                                <th width="120">Hub</th>
                                <th width="120">Magnet</th>
                                <th width="120">Diverter</th>
                                <th width="120">FPC</th>
                                <th width="120">FPC</th>
                                <th width="120">DateTime</th>
                                <th width="120">Machine no</th>
                                <th width="120">CO2 EMP</th>
                                <th width="120">CO2 DATE</th>
                                <th width="120">CO2 SP1</th>
                                <th width="120">CO2 SP2</th>
                                <th width="120">SP1</th>
                                <th width="120">SP2</th>
                                <th width="120">SP3</th>
                                <th width="120">SP4</th>
                                <th width="120">SP5</th>
                                <th width="120">Revision</th>
                              </tr>
                            </thead>
                            <tbody>{this.renderreport2()}</tbody>
                          </table>
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

export default Production_hold_record;
