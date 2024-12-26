import React, { Component } from "react";
import {  server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import moment from "moment";
import Select from "react-select";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";
import ReactApexChart from "react-apexcharts";

class Report_per_producion_team extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      year: [],
      Month: [],
      EMP: [],
      report: [],
      reportGraph: [],
      xAxis: [],
      yAxis1: [],
      seriesY: [],
      series2: [],
      seriesCleanroom: [],
      options1: {},
      options2: {},
      chart: [],

      Raw_Dat: [],

      startDate: moment().format("yyyy-MM-DD"), //moment().add("days", -6).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"), //moment().format("yyyy-MM-DD"),
      listyear: [],
      listMonth: [],
      listModel: [],
      listCode: [],

      optionSelected: null,
      isDisable: false,
    };
  }

  componentDidMount = async () => {
    await this.getyear();
    await this.getMonth();
  };
  doGetDataReport = async () => {
    const result = await httpClient.get(
      server.MQT_URL + "/" + this.state.year + "/" + this.state.Month[0].label
    );
  
    if (!result.data || !result.data.resultGraph || result.data.resultGraph.length === 0) {
      console.log("No data available");
      this.setState({ noData: true });
      return;
    }
  
    let xAxis = [];
    for (let index = 0; index < result.data.resultGraph.length; index++) {
      const item = result.data.resultGraph[index];
      await xAxis.push(item.SupporterName);
    }
  
    const dropNames = ['LAR', 'ENEmpName', 'Output'];
    let PivotTable = result.data.PivotTable.filter(item => !dropNames.includes(item.name));
  
    console.log(PivotTable);
  
    this.setState({
      report: result.data.result,
      reportGraph: result.data.resultGraph,
      xAxis,
      isDisable: false,
    });
  
    // Step 1: Create seriesData
    let seriesData = [];
    for (let i = 0; i < PivotTable.length; i++) {
      const series = {
        name: PivotTable[i].name,
        type: PivotTable[i].name === "Reject_Percent" ? "line" : "column", // "Reject_Percent" is line
        data: PivotTable[i].data,
      };
      seriesData.push(series);
    }
  
    // Step 2: Sort the seriesData by type
    const sortedData = seriesData.sort((a, b) => {
      if (a.type === "line" && b.type !== "line") {
        return 1;
      } else if (a.type !== "line" && b.type === "line") {
        return -1;
      } else {
        return 0;
      }
    });
    let numColumns = 0;
    let numLines = 0;

    // Loop through the sortedData array
    for (const item of sortedData) {
      // Check if the type is 'column'
      if (item.type === "column") {
        numColumns++;
      }
      // Check if the type is 'line'
      if (item.type === "line") {
        numLines++;
      }
    }
    let totalColumnsAndLines = numColumns + numLines;
  
    // Step 3: Create columnSeries and lineSeries
    const columnSeries = sortedData
    .filter((item) => item.type === "column")
    .map((item) => ({
      name: item.name,
      type: "column",
      data: item.data,
      yAxisIndex: 0,
    }));
    console.log("columnSeries",columnSeries);
    

  const lineSeries = sortedData
    .filter((item) => item.type === "line")
    .map((item) => ({
      name: item.name,
      type: "line",
      data: item.data,
      yAxisIndex: 1, // Use secondary axis for line series
    }));
  console.log("lineSeries",lineSeries);

  const mappedSeriesNames = sortedData.map((item) => item.name);
  const seriesName = mappedSeriesNames[0];
  let yaxisConfig = [];

  // Loop for each column
  for (let i = 0; i < totalColumnsAndLines; i++) {
    let config = {
      seriesName: seriesName,

      axisTicks: {},
      axisBorder: {
        show: i === 0,
        color: i === 0 ? "#d62728" : "#3399ff",
      },
      labels: {
        show: i === 0,
        style: {
          colors: i === 0 ? "#d62728" : "#3399ff",
        },
        formatter: function (val) {
          return Number(val).toFixed(2) + "%";
        },
        yAxisIndex: 0, // Set the yAxisIndex to 0 for the left side
      },
      title: {
        show: i === 0,
        text: "Percentage",
        style: {
          color: i === 0 ? "#d62728" : "#3399ff",
        },
      },
      tooltip: {
        show: true,
        enabled: true,
      },
      show: i === 0,
      yAxisIndex: 0, // Set the yAxisIndex to 0 for the left side
      type: i === 0 ? "line" : "bar", // Set type to line for the first series, bar for others
      dataLabels: {
        enabled: true,
        offsetX: 0,
        offsetY: 0,
        style: {
          fontSize: "13px",
          color: "#000000", // Set the color to black for yAxisIndex 0
        },
        formatter: function (val) {
          return Number(val).toFixed(2) + "%";
        },
        yAxisIndex: 0, // Set the yAxisIndex to 0 for the left side
      },
      line: {
        show: i === 0, // Set show property of line to false for bars
      },
    };

    yaxisConfig.push(config);
  }

  yaxisConfig.push(
    {
      seriesName: "Income",

      opposite: false,
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
        color: "#1f77b4",
      },
      labels: {
        show: false,
        style: {
          colors: "#1f77b4",
        },
      },
      yAxisIndex: 1,
      grouping: true,
      type: "line",
      // Apply dataLabels configuration for yAxisIndex 1
      dataLabels: {
        enabled: false, // Set to false to hide dataLabels
      },
    },

  );
  console.log("Column Series:", columnSeries);
  console.log("Line Series:", lineSeries);


  
    // Step 4: Set state with the sorted data and series
    this.setState({
      seriesY: [...columnSeries, ...lineSeries],
      
    
      options1: {
        chart: {
          height: 350,
          type: "bar",
          stacked: true, // Set stacked to true to stack the columns
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "50%", // Adjust column width
            endingShape: "rounded",
          },
        },
        dataLabels: {
          enabled: true,
          style: {
            fontSize: "13px",
            color: "#000000",
          },
          formatter: function (val) {
            return Number(val).toFixed(0); // Format as integer
          },
        },
        title: {
          text: `Compare Output & NG With Target ${this.state.year}`,
          align: "center",
        },
        xaxis: {
          categories: xAxis, // Categories for X-axis
        },
        yaxis: [
          {
            title: {
              text: "Series A"
            },
          },
          {
            opposite: true,
            title: {
              text: "Series B"
            }
          }
        ],
        
        colors: ["#993366", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"],
        tooltip: {
          shared: true,
        },
        fill: {
          opacity: 1,
        },
        stroke: {
          width: [0, 0, 2], // No stroke for columns; width=2 for line
          curve: "smooth", // Smooth curve for the line series
        },
        markers: {
          size: [0, 0, 5], // Markers for line series only
        },
      },
    });
    console.log(this.state.seriesY);
    
  };
  
  
  
  


  getyear = async () => {
    const array = await httpClient.get(server.MQTYEAR_URL);
    const options = array.data.result.map((d) => ({
      label: d.year,
    }));
    this.setState({ listyear: options });
  };

  getMonth = async () => {
    const array = await httpClient.get(server.MQTMONTH_URL);
    const options = array.data.result.map((d) => ({
      label: d.Month,
    }));
    this.setState({ listMonth: options });
  };

  renderreport = () => {
    if (this.state.reportGraph != null) {
      if (this.state.reportGraph.length > 0) {
        return this.state.reportGraph.map((item,index) => (
          <tr key={item.id || index} align="center">
            <td>{item["SupporterName"]}</td>
            <td align="Left">{item["ENEmpName"]}</td>
            <td align="RIGHT">
              {Number(item["Input"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td align="RIGHT">
              {Number(item["Output"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td align="RIGHT">
              {Number(item["Reject"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>{item["LAR"]}</td>
            <td>{item["Reject_Percent"]}</td>
          </tr>
        ));
      }
    }
  };

  renderreport1 = () => {
    if (this.state.report != null) {
      if (this.state.report.length > 0) {
        return this.state.report.map((item,index) => (
          <tr key={item.id || index} align="center">
            <td align="left">{item["ModelName"]}</td>
            <td>{item["Line_No"]}</td>
            <td>{item["SupporterName"]}</td>
            <td align="Left">{item["ENEmpName"]}</td>
            <td align="RIGHT">
              {Number(item["Input"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td align="RIGHT">
              {Number(item["Output"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td align="RIGHT">
              {Number(item["Reject"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>{item["LAR"]}</td>
            <td>{item["Reject_Percent"]}</td>
          </tr>
        ));
      }
    }
  };

  render() {

    // console.log("Y-axis Configuration:", yaxisConfig);
    // console.log("Series Data:", this.state.seriesY);
    
    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 70 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>LAR report per Production team</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">
                      LAR report per Production team
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
                    {/* //Select Critiria "Year" */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Year</label>
                        <Select
                          options={this.state.listyear}
                          onChange={async (e) => {
                            await this.setState({ year: e.label });
                            await this.getMonth();

                            await this.setState({
                              Month: [{ label: "Select Month" }],
                            });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select year"
                        />
                      </div>
                    </div>
                    {/* //Select Critiria "Month" */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Month</label>
                        <Select
                          options={this.state.listMonth}
                          value={this.state.Month[0]}
                          onChange={async (e) => {
                            await this.setState({ Month: [] });
                            this.state.Month.push({ label: e.label });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select Month"
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
                              await this.doGetDataReport();
                              setTimeout (() => {Swal.close();}, 200);
                              
                            },
                          }).then(() => {
                            if (this.state.report.length > 0) {
                              if (
                                this.state.report[0].SupporterName.length > 0
                              ) {
                                Swal.fire({
                                  icon: "success",
                                  title: "Success",
                                  text: "Data has been loaded successfully",
                                });
                              } else if (
                                this.state.report[0].SupporterName.length === 0
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
                    <div className="col-md-2">
                      <CSVLink
                        data={this.state.Raw_Dat}
                        filename={"Reject_report.csv"}
                      >
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ marginTop: 30 }}
                        >
                          Download
                        </button>
                      </CSVLink>
                    </div>
                    <div className="col-md-4">
                      <a
                        style={{ marginTop: 30 }}
                        href="/MQTByModel"
                        className="btn btn-primary"
                        role="button"
                        aria-pressed="true"
                      >
                        Reject(%)By Supporter
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-12">
                      <div className="card card-primary card-outline">
                        {/* Chart Title */}
                        <div className="card-header">
                          <h3 className="card-title">
                            <i className="far fa-chart-bar" />
                          </h3>
                        </div>

                        {/* Insert Xbar Chart */}
                        <div className="row" style={{ width: "100%" }}>
                          <div style={{ width: "1%" }}></div>
                          <div
                            className="card card-warning"
                            style={{
                              width: "99%",
                              background:
                                "linear-gradient(to right, #8080FF, #FFFFFF)",

                              borderRadius: "10px", // เพิ่มความโค้งให้การ์ดดูสวยขึ้น
                              padding: "10px",
                            }}
                          >
                            <div className="card-body">
                              <div className="row">
                                <div style={{ width: "100%" }}>
                                  <ReactApexChart
                                    options={this.state.options1}
                                    series={this.state.seriesY}
                                    type="line"
                                    height={450}
                                  />
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
              {/* Table*/}
              <div className="content">
                <div className="container-fluid">
                  <div className="card card-primary">
                    <div className="row">
                      <div className="col-12">
                        {/* /.card-header */}
                        <div
                          className="card-body table-responsive p-0"
                          style={{ height: 400 }}
                        >
                          <table className="table table-head-fixed text-nowrap table-hover">
                            <thead>
                              <tr align="center">
                                <th width="10">EMP</th>
                                <th width="100">SupporterName</th>
                                <th width="100">Input(Lot)</th>
                                <th width="100">Output(Lot)</th>
                                <th width="100">Reject(Lot)</th>
                                <th width="100">LAR(%)</th>
                                <th width="100">Reject(%)</th>
                              </tr>
                            </thead>
                            <tbody>{this.renderreport()}</tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="content">
                <div className="container-fluid">
                  <div className="card card-primary">
                    <div className="row">
                      <div className="col-12">
                        {/* /.card-header */}
                        <div
                          className="card-body table-responsive p-0"
                          style={{ height: 400 }}
                        >
                          <table className="table table-head-fixed text-nowrap table-hover">
                            <thead>
                              <tr align="center">
                                <th width="120">Model Name</th>
                                <th width="120">Line_No</th>
                                <th width="120">Emp No.</th>
                                <th width="120">Supporter Name</th>
                                <th width="120">Input(Lot)</th>
                                <th width="120">Output(Lot)</th>
                                <th width="120">Reject(Lot)</th>
                                <th width="120">LAR(%)</th>
                                <th width="120">Reject(%)</th>
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
        </div>
      </div>
    );
  }
}

export default Report_per_producion_team;
