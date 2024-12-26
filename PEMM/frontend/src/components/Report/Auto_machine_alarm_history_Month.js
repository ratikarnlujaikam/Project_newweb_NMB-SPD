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
import { Bar } from "react-chartjs-2";

class Auto_machine_alarm_history_Month extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      radio_ERROR: true,
      radio_NG: false,
      month_start: [],
      year_start: [],

      month_end: [],
      year_end: [],

      Table: [],
      EMP: [],
      report: [],
      reportGraph: [],
      xAxis: [],
      yAxis1: [],
      seriesY: [],
      series2: [],
      seriesCleanroom: [],
      options: {},
      options2: {},
      chart: [],
      Table: [],
      Line: [],
      Raw_Dat: [],

      startDate: moment().format("MM"), //moment().format("yyyy-MM-DD"), //moment().add("days", -6).format("yyyy-MM-DD"),

      listTable: [],
      listLine: [],
      listModel: [],
      listCode: [],
      listyear_start: [],
      listmonth_start: [],
      optionSelected: null,
      isDisable: false,
    };
  }

  componentDidMount = async () => {
    await this.getTable();
    // await this.getLine();
  };
  doGetDataReport = async () => {
    let result;
    if (this.state.radio_ERROR) {
      result = await httpClient.get(
        server.MONTH_MC_ERROR_URL +
          "/" +
          this.state.Table +
          "/" +
          this.state.Line[0].label +
          "/" +
          this.state.year_start +
          "/" +
          this.state.year_end
      );
    } else if (this.state.radio_NG) {
      result = await httpClient.get(
        server.MONTH_MC_ERROR_NG_URL +
          "/" +
          this.state.Table +
          "/" +
          this.state.Line[0].label +
          "/" +
          this.state.year_start +
          "/" +
          this.state.year_end
      );
    }
    console.log("this.state.year_start", this.state.year_start);
    let xAxis = [];

    for (let index = 0; index < result.data.resultGraph.length; index++) {
      const item = result.data.resultGraph[index];
      await xAxis.push(item.Date);
    }

    let PivotTable = result.data.PivotTable;

    let rawData = result.data.listRawData;
    console.log(rawData);
    console.log(rawData.length);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat: rawData[0] });
    console.log(this.state.Raw_Dat);

    this.setState({
      report: result.data.result,
      reportGraph: result.data.resultGraph,
      xAxis,

      PivotTable,

      // series,

      isDisable: false,
    });
    let seriesData = [];

    for (let i = 0; i < PivotTable.length; i++) {
      const series = {
        name: PivotTable[i].name,
        type: "column",
        data: PivotTable[i].data,
      };
      seriesData.push(series);
    }
    const names = seriesData.map((item) => item.name);

    console.log(names);
    const seriesName = names[0];
    console.log(seriesName);

    let numColumns = 0;
    const allData = seriesData.reduce((acc, item) => acc.concat(item.data), []);

    // Calculate the sum of all data values
    const sumData = allData.reduce((sum, value) => sum + value, 0);

    console.log(sumData); // Output: 105

    // Loop through the sortedData array
    for (const item of seriesData) {
      // Check if the type is 'column'
      if (item.type === "column") {
        numColumns++;
      }
    }

    console.log("Number of Columns:", numColumns);

    // Define y-axis configurations
    let yaxisConfig = [];

    // Loop for each column
    const maxIncreasePercentage = 10; // Set the desired percentage increase

    for (let i = 0; i < numColumns; i++) {
      const maxIncrease = sumData / 2; // Calculate the increase amount
      yaxisConfig.push({
        seriesName: seriesName,
        min: 0,
        max: maxIncrease, // Increase the maximum value by 10%
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
            return Number(val).toFixed(0);
          },
        },
        title: {
          show: i === 0,
          text: "QTY",
          style: {
            color: i === 0 ? "#d62728" : "#3399ff",
          },
        },
        tooltip: {
          show: i === 0,
          enabled: true,
        },
        show: i === 0,
        yAxisIndex: 0,
      });
    }

    await this.setState({
      // Existing code...
      seriesY: seriesData,
      options: {
        chart: {
          height: 350,
          type: "bar",
          stacked: true,
        },
        title: {
          text: "M/C error monitoring",
          align: "center",
        },
        xaxis: {
          categories: xAxis,
          text: "Monthly",
          labels: {
            style: {
              fontSize: "12px",
              fontWeight: 500,
            },
          },
        },
        yaxis: yaxisConfig,
        colors: [
          "#1f77b4",
          "#ff7f0e",
          "#2ca02c",
          "#d62728",
          "#9467bd",
          "#8c564b",
          "#e377c2",
          "#7f7f7f",
          "#bcbd22",
          "#17becf",
          "#aec7e8",
          "#ffbb78",
          "#98df8a",
          "#ff9896",
          "#c5b0d5",
          "#c49c94",
          "#f7b6d2",
          "#c7c7c7",
          "#dbdb8d",
          "#9edae5",
          "#ff6600",
          "#339933",
          "#cc0000",
          "#993366",
          "#663300",
          "#ff66cc",
          "#666666",
          "#cccc00",
          "#00ccff",
          "#ff3300",
          "#66ff66",
          "#990000",
          "#996699",
          "#996633",
          "#ff99cc",
          "#999999",
          "#ffff00",
          "#0099ff",
        ],
        tooltip: {
          fixed: {
            enabled: true,
            position: "topLeft",
            offsetY: 30,
            offsetX: 0,
          },
        },
        legend: {
          horizontalAlign: "center",
          offsetX: 40,
        },
        fill: {
          opacity: 0.8,
        },

        plotOptions: {
          bar: {
            dataLabels: {
              position: "top", // Adjust the position as needed
              offsetY: -10, // Adjust the offset as needed
            },
          },
        },
        stroke: {
          width: 1,
          // curve: "smooth",
          colors: ["#000000"], // เปลี่ยนสีของเส้นถ้าจำเป็น
        },
        markers: {
          size: 4,
          strokeColors: "#fff",
          strokeWidth: 2,
          hover: {
            size: 7,
          },
        },
      },
      // Rest of the code...
    });
  };

  getTable = async () => {
    const array = await httpClient.get(server.MONTH_ERRORTable_URL);
    const options = array.data.result.map((d) => ({
      label: d.Table,
    }));
    this.setState({ listTable: options });
  };

  getLine = async () => {
    const array = await httpClient.get(
      server.MONTH_MC_ERROR_Line_URL + "/" + this.state.Table
    );
    const options = array.data.result.map((d) => ({
      label: d.Line,
    }));
    this.setState({ listLine: options });
  };
  getMonth = async () => {
    const array = await httpClient.get(
      server.MONTH_MC_ERROR_MONTH_URL + "/" + this.state.Table
    );
    const options = array.data.result.map((d) => ({
      label: d.month_Error,
    }));
    this.setState({ listmonth_Error: options });
  };
  getYear = async () => {
    const array = await httpClient.get(
      server.MONTH_MC_ERROR_Year_URL + "/" + this.state.Table
    );
    const options = array.data.result.map((d) => ({
      label: d.year_Error,
    }));
    this.setState({ listyear_Error: options });
  };

  render() {
    console.log(this.state.xAxis);
    console.log(this.state.PivotTable);
    console.log(this.state.report);

    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 70 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Monthly Auto machine alarm history</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">
                      Monthly Auto machine alarm history
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
              <div className="card card-primary card-outline">
                <div className="card-header">
                  <h3 className="card-title">
                    <label>Select Parameter</label>
                  </h3>
                </div>

                <div className="card-body">
                  <div className="row">
                    {/* //Select Critiria "Model" */}
                    <div className="col-sm-2">
                      <div className="form-group">
                        <div></div>
                        <label>Table</label>
                        <Select
                          options={this.state.listTable}
                          onChange={async (e) => {
                            await this.setState({ Table: e.label });
                            await this.getLine();
                            await this.getMonth();
                            await this.getYear();
                            await this.setState({
                              Line: [{ label: "Line" }],
                            });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select Table"
                        />
                      </div>
                    </div>

                    {/* //Select Critiria "Type" */}
                    <div className="col-sm-1">
                      <div className="form-group">
                        <label>Line No</label>
                        <Select
                          options={this.state.listLine}
                          value={this.state.Line[0]}
                          onChange={async (e) => {
                            await this.setState({ Line: [] });
                            this.state.Line.push({ label: e.label });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Line "
                        />
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Start Month&nbsp;</label>
                        <input
                          value={this.state.year_start}
                          onChange={async (e) => {
                            this.setState({ year_start: e.target.value });
                          }}
                          type="month" // กำหนด type เป็น month
                          className="form-control"
                          placeholder="Select Month and Year"
                        />
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="form-group">
                        <label>finish Month&nbsp;</label>
                        <input
                          value={this.state.year_end}
                          onChange={async (e) => {
                            this.setState({ year_end: e.target.value });
                          }}
                          type="month" // กำหนด type เป็น month
                          className="form-control"
                          placeholder="Select Month and Year"
                        />
                      </div>
                    </div>
                    {/* <div className="col-md-1">
                      <div className="form-group" style={{ marginTop: 30 }}>
                        <Select
                          options={this.state.listyear_Error}
                          value={this.state.year_end[0]}
                          onChange={async (e) => {
                            await this.setState({ year_end: [] });
                            this.state.year_end.push({ label: e.label });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Year"
                        />
                      </div>
                    </div>

                    <div className="col-md-1">
                      <div className="form-group" style={{ marginTop: 30 }}>
                        <Select
                          options={this.state.listmonth_Error}
                          value={this.state.month_end[0]}
                          onChange={async (e) => {
                            await this.setState({ month_end: [] });
                            this.state.month_end.push({ label: e.label });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Month"
                        />
                      </div>
                    </div> */}
                    <div>
                      <label htmlFor="option1">
                        <input
                          type="radio"
                          id="option1"
                          name="option"
                          checked={this.state.radio_ERROR}
                          onChange={() =>
                            this.setState({
                              radio_ERROR: true,
                              radio_NG: false,
                            })
                          }
                        />
                        Error
                      </label>
                      <br />
                      <label htmlFor="option2">
                        <input
                          type="radio"
                          id="option2"
                          name="option"
                          checked={this.state.radio_NG}
                          onChange={() =>
                            this.setState({
                              radio_ERROR: false,
                              radio_NG: true,
                            })
                          }
                        />
                        NG
                      </label>
                    </div>
                    {/* Submit button */}
                    <div className="col-md-1">
                      <button
                        disabled={this.state.isDisable}
                        // type="button"
                        // className="btn btn-info btn-flat"
                        onClick={async (e) => {
                          this.setState({ isDisable: true });
                          // this.doGetDataReport();
                          Swal.fire({
                            icon: "info",
                            title: "Loading Data",
                            timer: 60000,
                            allowOutsideClick: false,
                            didOpen: async () => {
                              Swal.showLoading();
                              try {
                                await this.doGetDataReport();
                                setTimeout(() => { Swal.close();},1000)
                               
                                if (
                                  this.state.reportGraph &&
                                  Array.isArray(this.state.reportGraph) &&
                                  this.state.reportGraph.length > 0
                                ) {
                                  if (
                                    this.state.reportGraph[0] &&
                                    Array.isArray(this.state.reportGraph[0]) &&
                                    this.state.reportGraph[0].length > 0
                                  ) {
                                    Swal.fire({
                                      icon: "success",
                                      title: "Success",
                                      text: "Data has been loaded successfully",
                                    });
                                  } else if (
                                    this.state.reportGraph[0] &&
                                    Array.isArray(this.state.reportGraph[0]) &&
                                    this.state.reportGraph[0].length === null
                                  ) {
                                    Swal.fire({
                                      icon: "error",
                                      title: "No production data",
                                      text: "Please select another date",
                                    });
                                  }
                                } else {
                                  Swal.fire({
                                    icon: "error",
                                    title:
                                      "Data loading encountered an error, please try again",
                                  }).then(() => {
                                    // รีเฟรชหน้าใหม่
                                    // window.location.reload();
                                  });
                                }
                              } catch (error) {
                                Swal.fire({
                                  icon: "error",
                                  title: "No production data",
                                  text: "Please select another date", // แสดงข้อความของ error เป็นข้อความใน Swal
                                }).then(() => {
                                  // รีเฟรชหน้าใหม่
                                  // window.location.reload();
                                });
                              }
                            },
                          });
                        }}
                        type="submit"
                        className="btn btn-primary"
                        style={{ marginTop: 30 }}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="content">
                <div class="container-fluid">
                  <div className="row">
                    <div className="col-12">
                      <div className="card card-primary card-outline">
              

                        {/* Insert Xbar Chart */}
                        <div className="row" style={{ width: "100%" }}>
                          <div style={{ width: "1%" }}></div>
                          <div
                          
                            style={{ width: "99%" }}
                          >
                            <div className="card-body">
                              <div className="row">
                                <div style={{ width: "100%" }}>
                                  <ReactApexChart
                                    options={this.state.options}
                                    series={this.state.seriesY}
                                    type="bar"
                                    height={450}
                                    style={{
                                      width: "100%",
                                      backgroundColor: "#E0FFFF", // Light blue color
                                      border: "1px solid #4682B4", // Border color matching the background color
                                      borderRadius: "10px",
                                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                    }}
                                    
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Auto_machine_alarm_history_Month;
