import React, { Component } from "react";
import { key, server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import moment from "moment";
import Select from "react-select";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";
import ReactApexChart from "react-apexcharts";

class Monthly_LAR_report_all_Model extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      year: [],
      Month: [],
      product_type: [],
      report: [],
      xAxis: [],
      yAxis1: [],
      seriesY: [],
      series2: [],
      seriesCleanroom: [],
      options: {},
      options2: {},
      chart: [],
      Raw_Dat: [],
      startDate: moment().format("yyyy-MM-DD"), //moment().add("days", -6).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"), //moment().format("yyyy-MM-DD"),
      listyear: [],
      listMonth: [],
      listproduct_type: [],
      selectedMaxYear: "",
      selectedMaxMonth: "",

      optionSelected: null,
      isDisable: false,
    };
  }

  componentDidMount = async () => {
    await this.getproduct_type();
  };
  doGetDataReport = async () => {
    const result = await httpClient.get(
      server.LAR_URL +
        "/" +
        this.state.product_type.label +
        "/" +
        this.state.year[0].label +
        "/" +
        this.state.Month[0].label
    );

    let xAxis = [];

    for (let index = 0; index < result.data.resultGraph.length; index++) {
      const item = result.data.resultGraph[index];
      await xAxis.push(item.Model_Name);
    }

    let yAxis6 = result.data.LAR;
    let yInput = result.data.Input;
    let yReject = result.data.Reject;
    let yRejectPP = result.data.Reject_Percent;

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
      xAxis,
      yAxis6,
      yReject,
      yInput,
      yRejectPP,

      // series,

      isDisable: false,
    });

    await this.setState({
      seriesY: [
        {
          name: "LAR %",
          type: "column",
          data: yAxis6,
        },
        {
          name: "Reject %",
          type: "line",
          data: yRejectPP,
        },
      ],
      options: {
        chart: {
          height: 500,
          type: "line",
          stacked: false,
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [0, 1],
          formatter: function (value) {
            return value + "%"; // Add '%' to LAR axis labels
          },
        },
        stroke: {
          width: [0, 5],
        },
        title: {
          text: "Monthly LAR report all Model",
          align: "left",
          offsetX: 110,
        },
        xaxis: {
          categories: xAxis,
          labels: {
            rotate: -60, // Rotate x-axis labels
            rotateAlways: true,
            style: {
              fontSize: "12px",
            },
          },
        },
        yaxis: [
          {
            min: 0.0,
            max: 100.0,
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: "#55d6be",
            },
            labels: {
              style: {
                colors: "#55d6be",
              },
              formatter: function (value) {
                return value + "%"; // Add '%' to LAR axis labels
              },
            },
            title: {
              text: "LAR%",
              style: {
                color: "#55d6be",
              },
            },
            tooltip: {
              enabled: true,
            },
          },
          {
            opposite: true,
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: "#ff1a1a",
            },
            labels: {
              style: {
                colors: "#ff1a1a",
              },
              formatter: function (value) {
                return value + "%"; // Add '%' to Reject axis labels
              },
            },
            title: {
              text: "Reject%",
              style: {
                color: "#ff1a1a",
              },
            },
          },
        ],
        colors: ["#55d6be", "#ff1a1a"],
        tooltip: {
          fixed: {
            enabled: false,
            position: "center",
            offsetY: 30,
            offsetX: 60,
          },
        },
        stroke: {
          width: 1, // Width of the border
          colors: ["#000000"], // Color of the border (black)
        },
        legend: {
          position: "right",
          offsetY: 40,
        },
      },
    });
  };

  getMaxValue = (options) => {
    let max = -Infinity;
    let maxOption = null;

    for (const option of options) {
      const value = parseFloat(option.label);
      if (!isNaN(value) && value > max) {
        max = value;
        maxOption = option;
      }
    }

    return maxOption;
  };

  getyear = async () => {
    const array = await httpClient.get(server.LARYEAR_URL);
    const options = array.data.result.map((d) => ({
      label: d.year,
    }));
    this.setState({ listyear: options });
  };

  getMonth = async () => {
    const array = await httpClient.get(server.LARMONTH_URL);
    const options = array.data.result.map((d) => ({
      label: d.Month,
    }));
    this.setState({ listMonth: options });
  };
  getproduct_type = async () => {
    const array = await httpClient.get(server.DEFECPRODUCT_TYPE_URL);
    const options = array.data.result.map((d) => ({
      label: d.Product_type,
    }));
    this.setState({ listproduct_type: options });
  };

  renderreport = () => {
    const { report } = this.state;

    if (report && report.length > 0) {
      return report.map((item, rowIndex) => (
        <tr key={rowIndex} className="text-right">
          {" "}
          {/* Use a CSS class for alignment */}
          <td className="text-left">{item["Model_Name"] || 0}</td>
          <td
            style={{
              color: item["TOTAL"] < 95 ? "red" : "black",
            }}
          >
            {item["TOTAL"] || 0}
          </td>
          {Array.from({ length: 31 }, (_, index) => {
            const day = index + 1;
            return (
              <td
                key={day}
                style={{
                  color:
                    item[`DAY${day}`] === null
                      ? "black"
                      : item[`DAY${day}`] < 95
                      ? "red"
                      : "black",
                }}
              >
                {item[`DAY${day}`] || 0}
              </td>
            );
          })}
        </tr>
      ));
    }
    return null; // Return null if there is no data
  };

  render() {
    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 70 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Monthly LAR report all Model</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">
                      Monthly LAR report all Model
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
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Product type</label>
                        <Select
                          options={this.state.listproduct_type}
                          value={this.state.product_type}
                          onChange={async (e) => {
                            await this.setState({ product_type: e });
                            await this.getyear();
                            await this.setState({
                              year: [{ label: "Select Year" }],
                            });
                            await this.setState({
                              Month: [{ label: "Select Month" }],
                            });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select Product Type"
                        />
                      </div>
                    </div>
                    {/* //Select Critiria "Year" */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Year</label>
                        <Select
                          options={this.state.listyear}
                          value={this.state.year[0]}
                          onChange={async (e) => {
                            // await this.setState({ year: e.label });
                            await this.setState({ year: [] });
                            this.state.year.push({ label: e.label });
                            await this.getMonth();
                          }}
                          
                          // type="text"
                          // className="form-control"
                          placeholder="Select Year"
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
                            // await this.setState({ Month: e.label });
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
                          const { year, Month } = this.state;
                          console.log("year:", year);
                          console.log("Month:", Month);

                          if (!year || !Month[0] || !Month[0].label) {
                            Swal.fire({
                              icon: "error",
                              title: "Missing Data",
                              text: "Please select a valid year and month.",
                            });
                            return;
                          }
                          if (
                            !Array.isArray(Month) ||
                            Month.length === 0 ||
                            !Month[0] ||
                            !Month[0].label ||
                            Month[0].label === "Select Month"
                          ) {
                            Swal.fire({
                              icon: "error",
                              title: "Missing Month",
                              text: "Please select a valid month.",
                            });
                            return; // Stop execution if month is invalid
                          }

                          // ถ้าผ่านทั้งสองเงื่อนไข
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
                              await new Promise((resolve) =>
                                setTimeout(resolve, 100)
                              );
                              Swal.close();
                            },
                          }).then(() => {
                            if (this.state.report.length > 0) {
                              if (this.state.report[0].Model_Name.length > 0) {
                                Swal.fire({
                                  icon: "success",
                                  title: "Success",
                                  text: "Data has been loaded successfully",
                                });
                              } else if (
                                this.state.report[0].Model_Name.length === 0
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
                    <div className="col-md-1">
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
                    <div className="col-md-2">
                      <a
                        style={{ marginTop: 30 }}
                        href="/defectNG"
                        className="fas fa-angle-double-left"
                        class="btn btn-primary"
                        role="button"
                        aria-pressed="true"
                      >
                        Back
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
                            style={{ width: "99%" }}
                          >
                            <div className="card-body">
                              <div className="row">
                                <div style={{ width: "100%" }}>
                                  <ReactApexChart
                                    options={this.state.options}
                                    series={this.state.seriesY}
                                    type="line"
                                    height={500}
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
                          style={{ height: 500 }}
                        >
                          <table className="table table-head-fixed text-nowrap table-hover">
                            <thead>
                              <tr className="text-center">
                                {" "}
                                {/* Use className instead of Align */}
                                <th width="100">Model_Name</th>
                                <th width="120">LAR</th>
                                <th width="120">01</th>
                                <th width="120">02</th>
                                <th width="120">03</th>
                                <th width="120">04</th>
                                <th width="120">05</th>
                                <th width="120">06</th>
                                <th width="120">07</th>
                                <th width="120">08</th>
                                <th width="120">09</th>
                                <th width="120">10</th>
                                <th width="120">11</th>
                                <th width="120">12</th>
                                <th width="120">13</th>
                                <th width="120">14</th>
                                <th width="120">15</th>
                                <th width="120">16</th>
                                <th width="120">17</th>
                                <th width="120">18</th>
                                <th width="120">19</th>
                                <th width="120">20</th>
                                <th width="120">21</th>
                                <th width="120">22</th>
                                <th width="120">23</th>
                                <th width="120">24</th>
                                <th width="120">25</th>
                                <th width="120">26</th>
                                <th width="120">27</th>
                                <th width="120">28</th>
                                <th width="120">29</th>
                                <th width="120">30</th>
                                <th width="120">31</th>
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Monthly_LAR_report_all_Model;
