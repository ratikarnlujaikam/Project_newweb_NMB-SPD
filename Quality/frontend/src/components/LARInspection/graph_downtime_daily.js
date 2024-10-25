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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import swal from "sweetalert";
import chroma from "chroma-js"; // Import chroma library

//npm install @mui/material @emotion/react @emotion/styled

class Monthly_LAR_report_all_Model extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      year: [],
      Month: [],
      process: [],
      report: [],
      xAxis: [],
      yAxis1: [],
      seriesY: [],
      series2: [],
      series_: [],
      seriesCleanroom: [],
      options: {},
      options_pp: {},
      options2: {},
      chart: [],
      rawData: [],
      lineName: "",

      Raw_Dat: [],
      yAxisIndex: [],

      startDate: moment().format("yyyy-MM"), //moment().add("days", -6).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"), //moment().format("yyyy-MM-DD"),
      listyear: [],
      listMonth: [],
      listModel: [],

      listYear: [],
      listMonth: [],
      listprocess: [],
      selectedMaxYear: "",
      selectedMaxMonth: "",
      lineFromState: "",
      show_link: "",
      optionSelected: null,
      isDisable: false,
      countdownEnabled: false, // เพิ่ม state สำหรับการเปิด/ปิด countdown
      intervalId: null, // เพิ่ม state สำหรับเก็บ ID ของ interval
      countdownTime: 150, // 5 นาทีในวินาที
    };
  }

  componentDidMount = async () => {
    await this.getyear();
    this.setState({ countdownEnabled: false });
    // const savedStartDate = localStorage.getItem("startDate");

    // if (savedStartDate) {
    //   this.setState({ startDate: savedStartDate });
    // }

    const { location } = this.props;
    const { state } = location;

    const urlParams = new URLSearchParams(window.location.search);

    const lineFromState = urlParams.get("line");
    const startDateParam = urlParams.get("startDate");
    const to_link = urlParams.get("to_link");

    console.log("Line:", lineFromState);
    console.log("StartDate:", startDateParam);
    console.log("this.state.startDate:", this.state.startDate);

    this.setState({ show_link: to_link });
    if (to_link != null) {
      this.setState(
        {
          year: lineFromState,
        },
        () => {
          const url =
            server.Compare_Output_day_URL +
            "/" +
            lineFromState +
            "/" +
            this.state.startDate;

          console.log("Request URL:", url);

          // Now, you can proceed with making the HTTP request or perform other actions
          this.doGetDataReport();
        }
      );
    }
  };
  handleSweetAlertConfirm = () => {
    // Additional actions to perform after the user clicks "OK" in SweetAlert
    // For example, you can reload the page:
    window.location.reload();
  };

  doGetDataReport = async () => {
    function generateUniqueColors(numColors) {
      console.log(numColors);
      const hueIncrement = 360 / numColors;
      let colors = [];

      for (let i = 0; i < numColors; i++) {
        const hue = i * hueIncrement;
        const saturation = 100; // ค่า saturation แนะนำ
        const lightness = 45; // ค่า lightness แนะนำ
        const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        colors.push(color);
      }

      return colors;
    }

    // สร้างพาเลทสี 20 สีที่ไม่ซ้ำกัน
    const uniqueColors = generateUniqueColors(18);

    try {
      const result = await httpClient.get(
        server.graph_downtime_daily_URL +
          "/" +
          this.state.year +
          "/" +
          this.state.startDate
      );
      console.log(result);
      if (
        !result.data ||
        !result.data.resultGraph ||
        result.data.resultGraph.length === 0
      ) {
        console.log("No data available");

        // Show SweetAlert
        swal({
          title: "No Running",
          text: "There is no data available for the selected criteria.",
          icon: "info",
          button: "OK",
        }).then(() => {
          // Attach the callback to "OK" button
          // Redirect to the specified page
          window.location.href = "/percen_OEE";
        });

        this.setState({ noData: true }); // Set a flag for no data

        return;
      }

      let xAxis = [];

      for (let index = 0; index < result.data.resultGraph.length; index++) {
        const item = result.data.resultGraph[index];
        await xAxis.push(item.Date);
      }

      let PivotTable = result.data.PivotTable;
      //console.log(PivotTable);

      this.setState({
        report: result.data.result,
        xAxis,
        isDisable: false,
      });

      let seriesData = [];

      for (let i = 0; i < PivotTable.length; i++) {
        const series = {
          name: PivotTable[i].name,
          type:
            PivotTable[i].name === "Actual_Input" ||
            PivotTable[i].name === "Total_DT"
              ? "scale"
              : PivotTable[i].name === "DT_Percentage"
              ? "line"
              : "column",
          data: PivotTable[i].data,
          label: {
            show: true, // เปิดใช้งาน label
            position: "top", // ตำแหน่งของ label
            style: {
              colors: "#000000", // สีข้อความใน label
            },
            formatter: function (val) {
              return Number(val).toFixed(2) + "%";
            },
          },
        };
        seriesData.push(series);
      }

      // Now seriesData contains objects with modified types
      //console.log(seriesData);
      let columnSeries = seriesData.filter(
        (series) => series.type === "column"
      );
      let lineSeries = seriesData.filter((series) => series.type === "line");

      let mergedSeries = columnSeries.concat(lineSeries);
      console.log(mergedSeries);

      // Now columnSeries contains objects with type 'column' and lineSeries contains objects with type 'line'
      //console.log(columnSeries);
      //console.log(lineSeries);

      const sortedData = seriesData.sort((a, b) => {
        // Items with name "Actual_Input" or "Total_NG" should be moved to the end
        if (
          (a.name === "Actual_Input" || a.name === "Total_DT") &&
          !(b.name === "Actual_Input" || b.name === "Total_DT")
        ) {
          return 1;
        } else if (
          !(a.name === "Actual_Input" || a.name === "Total_DT") &&
          (b.name === "Actual_Input" || b.name === "Total_DT")
        ) {
          return -1;
        } else {
          return 0;
        }
      });

      //console.log(sortedData);

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

      // Sum the counts of columns and lines
      let totalColumnsAndLines = numColumns + numLines;

      console.log("Total columns and lines:", totalColumnsAndLines);

      const mappedSeriesNames = sortedData.map((item) => item.name);

      console.log(mappedSeriesNames);

      // Assuming your array is named dataSeries
      const maxValues = sortedData.map((series) => Math.max(...series.data));

      // The maximum value among all data arrays
      const globalMaxValue = Math.max(...maxValues);

      //console.log(globalMaxValue);

      const X_left = Math.max(...maxValues) / 2;
      //console.log(X_left);

      // Assuming mappedSeriesNames[0] is the series name you want to use
      const seriesName = mappedSeriesNames[0];
      const line_percen = mappedSeriesNames[mappedSeriesNames.length - 1];
      console.log(line_percen); // ผลลัพธ์คือ "NG_Percentage"

      console.log(seriesName);

      let yaxisConfig = [];

      // Loop for each column
      for (let i = 0; i < totalColumnsAndLines; i++) {
        let config = {
          seriesName: seriesName,
          min: 0,
          max: 50,
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
          min: 0,
          max: 20,
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
        },
        {
          seriesName: "Output",
          min: 0,
          max: 20,
          axisTicks: {
            show: false,
          },
          labels: {
            show: false,
            style: {
              colors: "#000000",
            },
          },
          yAxisIndex: 1,
          grouping: true,
          type: "bar",
          // Apply dataLabels configuration for yAxisIndex 1
          dataLabels: {
            enabled: false, // Set to false to hide dataLabels
          },
        }
      );

      // Options object
      let options = {
        chart: {
          height: 350,
          type: "line",
          stacked: true,
          marginLeft: 0,
          // background: "#000000", // Set the background color to black
        },
        plotOptions: {
          bar: {
            // ส่วนอื่น ๆ ของ plotOptions ที่มีอยู่ในโค้ด
            dataLabels: {
              position: "center",
              offsetY: 1,
              color: "#000000", // กำหนดสีให้กับ dataLabels ใน plotOptions
            },
          },
        },
        tooltip: {
          fixed: {
            enabled: false,
          },
          followCursor: false,
        },
        dataLabels: {
          enabled: true,
          offsetX: 0,
          offsetY: 0,
          color: "#000000", // กำหนดสีให้กับ dataLabels ใน options
          formatter: function (val) {
            return Number(val).toFixed(2) + "%";
          },
          yAxisIndex: 0,
        },

        dataLabels: {
          enabled: true,
          enabledOnSeries: [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21,
          ],

          formatter: function (val) {
            return val.toFixed(1) + "%";
          },
          align: "bottom",
          offsetX: 0,
          offsetY: 10,
          style: {
            colors: [
              "#000000",
              "#000000",
              "#000000",
              "#000000",
              "#000000",
              "#000000",
              "#000000",
              "#000000",
              "#000000",
              "#000000",
              "#000000",
              "#000000",
            ], // Replace with your preferred font colors
          },
        },

        title: {
          text: `%DT Daily's Summary Line ${this.state.year} Month  ${this.state.startDate}`,
          align: "center",
          offsetX: 0,
        },
        xaxis: {
          categories: xAxis,
        },
        yaxis: yaxisConfig !== 0 ? yaxisConfig : undefined,

        colors: uniqueColors,
        fill: {
          opacity: 1,
        },
        tooltip: {
          show: false,
          enabled: true,
          formatter: function (params) {
            if (params.value !== 0) {
              return params.value;
            } else {
              return ""; // ไม่แสดงค่าที่เป็น 0
            }
          },
        },
        legend: {
          position: "bottom",
          horizontalAlign: "left",
          offsetY: 10,
          markers: {
            width: 12,
            height: 12,
            radius: 4,
          },
          itemMargin: {
            horizontal: 10,
            vertical: 5,
          },
        },
        stroke: {
          width: 4,
          curve: "smooth",
          color: "#000000", // กำหนดสีของกรอบเป็นสีดำ
        },
        markers: {
          size: 5,
          strokeColors: "#7f7f7f",
          strokeWidth: 2,
          hover: {
            size: 7,
          },
        },
        yaxis: yaxisConfig,
        className: "apexcharts-bar-area",
      };

      //console.log(options);

      await this.setState({
        options: options,

        seriesY: sortedData,
      });
      this.setState({
        options: {
          ...this.state.options,
          chart: {
            ...this.state.options.chart,
            type: "bar", // Change the type to bar or any other supported type
          },
        },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle the error, display an error message, or log it as needed
    }
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
    const array = await httpClient.get(server.graph_downtime_daily_Line_URL);
    const options = array.data.result.map((d) => ({
      label: d.year,
    }));
    this.setState({ listyear: options });
  };

  stopInterval() {
    clearInterval(this.intervalId);
  }

  // ฟังก์ชันเพื่อ refreath
  handleRefresh = () => {
    // สร้าง Date ใหม่
    const currentDate = new Date();

    // ทำการ setState ให้ this.state.startDate เป็นวันปัจจุบัน
    this.setState(
      { startDate: currentDate.toISOString().split("T")[0] },
      () => {
        // เรียกฟังก์ชันที่ต้องการทำหลังจาก setState เสร็จสิ้น
        this.doGetDataReport();
      }
    );
  };

  // ฟังก์ชันที่เรียกเมื่อต้องการ refreath

  startInterval() {
    this.intervalId = setInterval(() => {
      this.setState((prevState) => ({
        countdownTime: prevState.countdownTime - 1,
      }));

      if (this.state.countdownTime <= 0) {
        // เมื่อเวลาครบถ้วน, ให้ทำการ Summit ข้อมูล
        this.handleRefresh();
        // และรีเซ็ตเวลานับถอยหลังเป็น 5 นาทีใหม่
        this.setState({ countdownTime: 300 }); // 5 นาทีในวินาที
      }
    }, 1000); // 1 วินาที
  }

  stopInterval() {
    clearInterval(this.intervalId);
  }

  render() {
    console.log(this.state.show_link);

    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 10 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  {/* <h1>Monthly LAR report all Model</h1> */}
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
        <div className="col-12">
          <div style={{ paddingTop: 20 }}>
            {this.state.show_link !== null && (
              <a href="/percen_OEE">
                <i className="fa fa-arrow-left"></i> back to OEE Dashboard
                Monitoring Monitoring
              </a>
            )}
          </div>
        </div>
        <div class="container-fluid">
          <div className="row">
            <div className="col-12">
              {this.state.show_link == null && (
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
                          <label>Line</label>
                          <Select
                            options={this.state.listyear}
                            onChange={async (e) => {
                              await this.setState({ year: e.label });
                            }}
                            placeholder="Select Line"
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="form-group">
                          <label>By Monthly Select From &nbsp;</label>
                          <input
                            value={this.state.startDate}
                            onChange={(e) => {
                              this.setState({ startDate: e.target.value });
                            }}
                            type="month" // กำหนด type เป็น month
                            className="form-control"
                            placeholder="Select Month and Year"
                          />
                        </div>
                      </div>

                      <div className="col-md-2">
                        <button
                          disabled={this.state.isDisable}
                          onClick={async (e) => {
                            this.setState({ isDisable: true });
                            if (!this.state.year.length) {
                              // ถ้าค่า this.state.Line.length เป็น 0 ให้แสดงข้อความแจ้งเตือน
                              Swal.fire({
                                icon: "error",
                                title: "Missing Selection",
                                text: "Please select Line",
                              }).then(() => {
                                // รีเฟรชหน้าใหม่
                                window.location.reload();
                              });
                            } else {
                              Swal.fire({
                                icon: "info",
                                title: "Loading Data",
                                timer: 60000,
                                allowOutsideClick: false,
                                didOpen: async () => {
                                  Swal.showLoading();
                                  await this.doGetDataReport();
                                  Swal.close();
                                },
                              }).then(() => {});
                            }
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
              )}

              <div className="row">
                <div className="col-12">
                  {/* Insert Xbar Chart */}
                  <div className="row" style={{ width: "100%" }}>
                    <div style={{ width: "2%" }}></div>
                    <div
                      className="card card-warning"
                      style={{ width: "100%" }}
                    >
                      <div className="row">
                        <div
                          style={{
                            width: "100%",
                            backgroundColor: "#F8F5FD", // Very light blue

                            border: "1px solid #000000", // Black border color
                            borderRadius: "10px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <ReactApexChart
                            options={this.state.options}
                            series={this.state.seriesY}
                            type="line"
                            height={650}
                          />
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

export default Monthly_LAR_report_all_Model;
