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
    await this.doGetDataReport();
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
    try {
      const result = await httpClient.get(
        server.Projection_URL +
          "/" +
          this.state.year +
          "/" +
          this.state.startDate
      );

     // การเข้าถึงข้อมูลใน result.data.resultGraph
let resultGraph = result.data.resultGraph;
const extractData = (key) => resultGraph.map(item => item[key]).filter(val => val !== undefined && !isNaN(val));

const dataA = extractData('Set_Dim_A');
const dataB = extractData('Set_Dim_B');
const dataC = extractData('Set_Dim_C');
const dataP1 = extractData('Projection1');
console.log(dataA);
console.log(dataB);
console.log(dataC);
console.log(dataP1);

const getBoxPlotValues = (arr) => {
  arr.sort((a, b) => a - b);
  const q1 = arr[Math.floor(arr.length * 0.25)];
  const median = arr[Math.floor(arr.length * 0.5)];
  const q3 = arr[Math.floor(arr.length * 0.75)];
  const min = arr[0];
  const max = arr[arr.length - 1];
  return [min, q1, median, q3, max];
};

        // Calculate box plot values
        const boxPlotData = [
          { x: 'Set_Dim_A', y: getBoxPlotValues(dataA) },
          { x: 'Set_Dim_B', y: getBoxPlotValues(dataB) },
          { x: 'Set_Dim_C', y: getBoxPlotValues(dataC) },
          { x: 'Projection1', y: getBoxPlotValues(dataP1) }
      ];
      let options = {
        chart: {
            type: 'boxPlot',
            height: 350
        },
        series: [{
            name: 'Box',
            type: 'boxPlot',
            data: boxPlotData
        }],
        title: {
            text: 'Box Plot Example',
            align: 'center'
        },
        xaxis: {
            type: 'category'
        },
        yaxis: {
            title: {
                text: 'Values'
            }
        }
    };

      console.log("result************************************",result);
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
        }).then(this.handleSweetAlertConfirm); // Attach the callback to "OK" button

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
    const array = await httpClient.get(server.Compare_Output_day_Line_URL);
    const options = array.data.result.map((d) => ({
      label: d.year,
    }));
    this.setState({ listyear: options });
  };

  getprocess = async () => {
    const array = await httpClient.get(server.Compare_Output_process_URL);
    const options = array.data.result.map((d) => ({
      label: d.process,
    }));
    this.setState({ listprocess: options });
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
                            }).then(() => {
               
                            });
                          }}
                        }
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
                            backgroundColor: "#FFFFE0", // Very light blue

                            border: "1px solid #000000", // Black border color
                            borderRadius: "10px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <ReactApexChart
                            options={this.state.options}
                            series={this.state.seriesY}
                            type="line"
                            height={550}
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
