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

class Output_Final_Before_QA extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      year: [],
      Month: [],
      Model: { label: "**ALL**" },
      Line: [{ label: "**ALL**" }],
      insType: [],
      report1: [],
      report2: [],
      xAxis: [],
      yAxis: [],
      seriesY: [],
      seriesY2: [],
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
    await this.getModel();
    await this.getLine();
    await this.doGetSumOutputCo2();
    await this.doGetDetailOutputCo2();
  };

  doGetSumOutputCo2 = async () => {
    const modelLabel =
      this.state.Model.label === "**ALL**" ? "**ALL**" : this.state.Model.label;
    const result = await httpClient.get(
      server.SUMOUTPUTCO2_URL +
        "/" +
        modelLabel +
        "/" +
        this.state.Line[0].label +
        "/" +
        this.state.startDate +
        "/" +
        this.state.finishDate
    );
    let rawData = result.data.listRawData;
    // console.log(rawData);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat1: rawData[0] });
    // console.log(this.state.Raw_Dat1);

    this.setState({
      report1: result.data.result,
      isDisable: false,
    });
  };
  doGetDetailOutputCo2 = async () => {
    const modelLabel =
      this.state.Model.label === "**ALL**" ? "**ALL**" : this.state.Model.label;
    const result = await httpClient.get(
      server.DETAILCO2_URL +
        "/" +
        modelLabel +
        "/" +
        this.state.Line[0].label +
        "/" +
        this.state.startDate +
        "/" +
        this.state.finishDate
    );
    let rawData = result.data.listRawData1;
    // console.log(rawData);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat2: rawData[0] });
    // console.log(this.state.Raw_Dat2);

    this.setState({
      report2: result.data.result,
      isDisable: false,
    });
  };

  renderreport1 = () => {
    if (this.state.report1 != null) {
      if (this.state.report1.length > 0) {
        return this.state.report1.map((item) => (
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
            <td align="Left">{item["Item_No"]}</td>
            <td align="Left">{item["Model"].toUpperCase()}</td>
            <td align="Left">{item["QA_No"].toUpperCase()}</td>
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
          </tr>
        ));
      }
    }
  };
  getModel = async () => {
    const array = await httpClient.get(server.MODELCO2_URL);
    const options = array.data.result.map((d) => ({
      label: d.ModelGroup,
    }));
    this.setState({ listModel: options });
  };
  getLine = async () => {
    const modelLabel =
      this.state.Model.label === "**ALL**" ? "**ALL**" : this.state.Model.label;
    const array = await httpClient.get(server.LINECO2_URL + "/" + modelLabel);
    const options = array.data.result.map((d) => ({
      label: d.Line,
    }));
    this.setState({ listLine: options });
  };

  render() {

    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 70 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Daily Output Final ass’y (Before QA)</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">
                      Daily Output Final ass’y (Before QA)
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card card-primary card-outline">
                <div className="card-header">
                  <h3 className="card-title">
                    <label>Select Parameter</label>
                  </h3>
                </div>

                <div className="card-body">
                  <div className="row">
                    {/* //Select Critiria "Model" */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Model group</label>
                        <Select
                          options={this.state.listModel}
                          value={this.state.Model}
                          onChange={async (e) => {
                            await this.setState({ Model: e });
                            await this.getLine();
                            await this.setState({
                              Line: [{ label: "**ALL**" }],
                            });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select Model"
                        />
                      </div>
                    </div>
                    {/* //Select Critiria "Type" */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Line</label>
                        <Select
                          options={this.state.listLine}
                          value={this.state.Line[0]}
                          onChange={async (e) => {
                            await this.setState({ Line: [] });
                            this.state.Line.push({ label: e.label });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select Line"
                        />
                      </div>
                    </div>

                    {/* //Select Start Date */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>
                          Select Date &nbsp;
   
                        </label>
                        <input
                          value={this.state.startDate}
                          onChange={(e) => {
                            this.setState({ startDate: e.target.value });
                          }}
                          type="date"
                          className="form-control"
                          placeholder="Select Start Date"
                        />
                      </div>
                    </div>

                    {/* //Select Finish Date */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>To</label>
                        <input
                          value={this.state.finishDate}
                          onChange={(e) => {
                            this.setState({ finishDate: e.target.value });
                          }}
                          type="date"
                          className="form-control"
                          placeholder="Select Finish Date"
                        />
                      </div>
                    </div>

                    {/* Submit button */}
                    <div className="col-md-1">
                      <button
                        disabled={this.state.isDisable}
                        // type="button"
                        // className="btn btn-info btn-flat"
                        onClick={(e) => {
                          this.setState({ isDisable: true });

                          // this.doGetDataReport();
                          Swal.fire({
                            icon: "info",
                            title: "Loading Data",
                            timer: 60000,
                            allowOutsideClick: false,
                            didOpen: async () => {
                              Swal.showLoading();
                              await this.doGetSumOutputCo2();
                              await this.doGetDetailOutputCo2();

                              Swal.close();
                            },
                          }).then(() => {
                            if (this.state.report1.length > 0) {
                              if (this.state.report1[0].Model.length > 0) {
                                Swal.fire({
                                  icon: "success",
                                  title: "Success",
                                  text: "Data has been loaded successfully",
                                });
                              } else if (
                                this.state.report1[0].Model.length == 0
                              ) {
                                Swal.fire({
                                  icon: "error",
                                  title: "No production data",
                                  text: "Please select other date",
                                });
                              }
                            } else {
                              Swal.fire({
                                icon: "error",
                                title:
                                  "Data loading has encountered some error, please try again",
                              });
                            }
                          });
                        }}
                        type="submit"
                        className="btn btn-primary"
                        style={{ marginTop: 30 }}
                      >
                        Submit
                      </button>
                    </div>
                    <div style={{ marginTop: 30 }} className="col-md-2">
                      <a
                        href="/Home"
                        className="btn btn-primary"
                        role="button"
                        aria-pressed="true"
                      >
                        Back
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content" style={{ paddingTop: 5 }}>
                <section className="content-header">
                  <div className="container-fluid">
                    <div className="row mb-1">
                      <div className="col-sm-3">
                        <h1>Daily Output(Summary)</h1>
                      </div>
                      <div className="col-sm-2">
                        <CSVLink
                          data={this.state.Raw_Dat1}
                          filename={"Daily Output(Summary).csv"}
                        >
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ marginTop: 1 }}
                          >
                            Download Output(Summary)
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
                          style={{ height: 400 
                            ,zIndex:"3",
                            position:"relative",
                            zIndex:"0",
                          }}
                        >
                          <table className="table table-head-fixed text-nowrap table-hover">
                            <thead>
                              <tr className = "center-align">
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
                    <h1>Daily Output Detail</h1>
                  </div>
                  <div className="col-sm-6">
                    <CSVLink
                      data={this.state.Raw_Dat2}
                      filename={"Daily Output Detail.csv"}
                    >
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ marginTop: 5 }}
                      >
                        Download Output Detail
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
                          style={{ height: 400 
                            ,zIndex:"3",
                            position:"relative",
                            zIndex:"0",
                          }}
                        >
                          <table className="table table-head-fixed text-nowrap table-hover">
                            <thead>
                              <tr className="center-align">
                                <th width="120">DATE</th>
                                <th width="120">Line</th>
                                <th width="120">Item No.</th>
                                <th width="120">Model</th>
                                <th width="120">QA No.</th>
                                <th width="120">SHIFT A</th>
                                <th width="120">SHIFT B</th>
                                <th width="120">SHIFT C</th>
                                <th width="120">SHIFT M</th>
                                <th width="120">SHIFT N</th>
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

export default Output_Final_Before_QA;
