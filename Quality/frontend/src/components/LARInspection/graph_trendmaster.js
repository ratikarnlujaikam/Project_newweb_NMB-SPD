import React, { Component } from "react";
import { key, server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import moment from "moment";
import Select from "react-select";
import Swal from "sweetalert2";
import ReactApexChart from "react-apexcharts";
import "./Test_graph.css"; // นำเข้าไฟล์ CSS สำหรับสไตล์ของกล่อง
//npm install @mui/material @emotion/react @emotion/styled

class Graph_trendmaster extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      Process: [],
      listProcess: [],

      parameter: [],
      listparameter: [],

      Model: [],
      listModel: [],

      Line: [],
      listLine: [],

      Serialnumber: [],
      listSerial: [],
      fixture: [],
      listfixture: [],
      machine: [],
      listmachine: [],
      noData: [],

      value_y: [],

      report: [],
      xAxis: [],
      yAxis1: [],
      seriesY: [],
      series2: [],
      series3: [],
      series4: [],
      series_: [],
      series_shift: [],
      seriesCleanroom: [],
      options: {},
      options_pp: {},
      options2: {},
      options3: {},
      options4: {},
      options_shift: {},
      chart: [],

      Raw_Dat: [],
      yAxisIndex: [],
      xAxis_shift: [],

      startDate: moment().format("yyyy-MM-DD"), //moment().add("days", -6).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"), //moment().format("yyyy-MM-DD"),
      listyear: [],
      listMonth: [],
      listModel: [],

      listYear: [],
      listMonth: [],
      selectedMaxYear: "",
      selectedMaxMonth: "",
      show_link: "",
      optionSelected: null,
      isDisable: false,
      countdownEnabled: false, // เพิ่ม state สำหรับการเปิด/ปิด countdown
      intervalId: null, // เพิ่ม state สำหรับเก็บ ID ของ interval
      countdownTime: 50, // 5 นาทีในวินาที
    };
  }

  componentDidMount = async () => {
    await this.getprocess();
  };

  handleSweetAlertConfirm = () => {
    // Additional actions to perform after the user clicks "OK" in SweetAlert
    // For example, you can set a state variable to indicate confirmation:
    this.setState({ sweetAlertConfirmed: true });
  };
  doGetDataReport = async () => {
    const result = await httpClient.get(
      server.VALUE_Y_TRENDMASTER_URL +
        "/" +
        this.state.Process.label +
        "/" +
        this.state.parameter.label +
        "/" +
        this.state.Model.label +
        "/" +
        this.state.Line.label +
        "/" +
        this.state.machine.label +
        "/" +
        this.state.fixture.label +
        "/" +
        this.state.Serialnumber.label +
        "/" +
        this.state.startDate +
        "/" +
        this.state.finishDate
    );
    console.log(result);

    console.log(result);

    let xAxis = [];

    for (let index = 0; index < result.data.resultGraph.length; index++) {
      const item = result.data.resultGraph[index];
      await xAxis.push(item.Date_time);
    }

    let value_y = result.data.value_y;

    let CL = result.data.CL;
    let UCL = result.data.UCL;
    let LCL = result.data.LCL;
    console.log(value_y);

    console.log("CL : " + CL);

    console.log(UCL);
    console.log(LCL);

    this.setState({
      report: result.data.result,
      noData: false, // Reset the flag for no data
      xAxis,
      value_y,
      CL,
      UCL,
      LCL,

      // series,

      isDisable: false,
    });

    // graph Hourly Output
    await this.setState({
      options: {
        chart: {
          height: 350,
          type: "line",
          stacked: false,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "60%",
            endingShape: "rounded",
            borderWidth: 1,
            borderColor: "#000000",
            dataLabels: {
              position: "bottom", // เปลี่ยนจาก "center" เป็น "bottom"
              offsetY: 1,
              rotation: -90, // เพิ่มค่า rotation เป็น -90 องศา
            },
          },
        },

        dataLabels: {
          enabled: false,
          offsetX: 0,
          offsetY: 0,
          style: {
            fontSize: "13px", // Set your desired font size here
          },
          formatter: function (val) {
            return Number(val).toFixed(4);
          },
        },

        title: {
          text: `Trend master`,
          align: "left",
          offsetX: 50,
        },
        xaxis: {
          categories: xAxis,
        },

        yaxis: {
          axisTicks: {
            show: true,
          },

          axisBorder: {
            show: true,
            color: "#000000",
          },
          labels: {
            style: {
              colors: "#000000",
            },
            formatter: function (val) {
              return Number(val).toFixed(4);
            },
          },
          title: {
            text: "values",
            style: {
              color: "#000000",
            },
          },
          tooltip: {
            enabled: true,
          },
        },

        markers: {
          size: [5, 5, 5, 5, 5, 5, 5, 5, 6],
        },
        stroke: {
          width: [4, 4, 4, 4, 4, 4, 4, 4, 2],
          dashArray: [6, 6, 6, 6, 6, 0, 0, 0, 0],
        },

        colors: [
          "#78909C",
          "#FF5722",
          "#FF5722",

          "#4DD0E1",
          "#9CCC65",
          "#1976D2",
        ],

        tooltip: {
          fixed: {
            enabled: false, // ตั้งค่า fixed ให้เป็น false
          },
          followCursor: true, // เปิดใช้งาน followCursor เพื่อให้ tooltip ตามตำแหน่งของเมาส์
          offsetY: 20,
          offsetX: 30,
        },

        legend: {
          position: "bottom",
          offsetY: 5,
        },

        stroke: {
          width: 5,
          curve: "smooth",
        },

        markers: {
          size: [0, 0, 0, 5, 0, 5, 6],
        },
        stroke: {
          width: [2, 2, 2, 2, 2, 2, 2], //ขนาดเส้น
          dashArray: [0, 0, 0, 6, 0, 0, 0], //เส้นทึบ 0,เส้นประ
        },
        className: "apexcharts-bar-area", // เพิ่มคลาส CSS ที่คุณต้องการใช้งาน
      },

      seriesY: [
        {
          name: "CL",
          type: "line",
          data: CL,
          dataLabels: {
            enabled: true,
            offsetX: 0,
            offsetY: -50,
          },
        },
        {
          name: "UCL",
          type: "line",
          data: UCL,
          dataLabels: {
            enabled: true,
            offsetX: 0,
            offsetY: -50,
          },
        },
        {
          name: "LCL",
          type: "line",
          data: LCL,
          dataLabels: {
            enabled: true,
            offsetX: 0,
            offsetY: -50,
          },
        },
        {
          name: `${this.state.Serialnumber.label}`,
          type: "line",
          data: value_y,
          stack: "one",
          dataLabels: {
            enabled: true,
            offsetX: 0,
            offsetY: -5,
          },
        },
      ],
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

  getprocess = async () => {
    const array = await httpClient.get(server.PROCESS_TRENDMASTER_URL);
    const options = array.data.result.map((d) => ({
      label: d.Process,
    }));
    this.setState({ listProcess: options });
  };
  getparameters = async () => {
    const array = await httpClient.get(
      server.PARAMETER_TRENDMASTER_URL + "/" + this.state.Process.label
    );
    console.log(array);
    const options = array.data.result.map((d) => ({
      label: d.Parameter,
    }));
    this.setState({ listparameter: options });
  };

  getmodel = async () => {
    const array = await httpClient.get(
      server.MODEL_TRENDMASTER_URL +
        "/" +
        this.state.Process.label +
        "/" +
        this.state.startDate +
        "/" +
        this.state.finishDate
    );
    const options = array.data.result.map((d) => ({
      label: d.Model,
    }));
    this.setState({ listModel: options });
  };
  getline = async () => {
    const array = await httpClient.get(
      server.LINE_TRENDMASTER_URL +
        "/" +
        this.state.Model.label +
        "/" +
        this.state.Process.label +
        "/" +
        this.state.startDate +
        "/" +
        this.state.finishDate
    );
    console.log(array);
    const options = array.data.result.map((d) => ({
      label: d.Line,
    }));
    this.setState({ listLine: options });
  };
  getmachine = async () => {
    const array = await httpClient.get(
      server.MACHINE_TRENDMASTER_URL +
        "/" +
        this.state.Line.label +
        "/" +
        this.state.Process.label +
        "/" +
        this.state.startDate +
        "/" +
        this.state.finishDate
    );
    console.log(array);
    const options = array.data.result.map((d) => ({
      label: d.Matchine,
    }));
    this.setState({ listmachine: options });
  };
  getfixture = async () => {
    const array = await httpClient.get(
      server.FIXTURE_TRENDMASTER_URL +
        "/" +
        this.state.Line.label +
        "/" +
        this.state.Process.label +
        "/" +
        this.state.machine.label +
        "/" +
        this.state.startDate +
        "/" +
        this.state.finishDate
    );
    console.log(array);
    const options = array.data.result.map((d) => ({
      label: d.Fix,
    }));
    this.setState({ listfixture: options });
  };
  getSerial = async () => {
    const array = await httpClient.get(
      server.SERIAL_TRENDMASTER_URL +
        "/" +
        this.state.machine.label +
        "/" +
        this.state.Process.label +
        "/" +
        this.state.parameter.label +
        "/" +
        this.state.Line.label +
        "/" +
        this.state.startDate +
        "/" +
        this.state.finishDate
    );
    console.log(array);
    const options = array.data.result.map((d) => ({
      label: d.Serialnumber,
    }));
    this.setState({ listSerial: options });
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
    console.log(this.state.Process);
    console.log(this.state.parameter);
    console.log(this.state.Model);
    console.log(this.state.Line);
    console.log(this.state.Serialnumber);

    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 70 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Trend Master judgement</h1>
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
              {this.state.show_link != "OEE" && (
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
                          <label>Process </label>
                          <Select
                            options={this.state.listProcess}
                            value={this.state.Process}
                            onChange={async (e) => {
                              await this.setState({ Process: e });
                              await this.getparameters();

                              await this.setState({
                                parameter: [{ label: "Select parameter" }],
                              });
                              await this.setState({
                                Model: [{ label: "Select Model" }],
                              });
                              await this.setState({
                                Line: [{ label: "Select Line" }],
                              });
                              await this.setState({
                                machine: [{ label: "Select machine" }],
                              });
                              await this.setState({
                                Serialnumber: [
                                  { label: "Select Serialnumber" },
                                ],
                              });
                            }}
                            placeholder="Select Process"
                          />
                        </div>
                      </div>

                      <div className="col-md-2">
                        <div className="form-froup">
                          <label>parameter</label>
                          <Select
                            options={this.state.listparameter}
                            value={this.state.parameter[0]}
                            onChange={async (e) => {
                              // await this.setState({ insType: e.label });
                              await this.setState({ parameter: e });
                              await this.getmodel();
                            }}
                          />
                        </div>
                      </div>
                      {/* //Select Start Date */}
                      <div className="col-md-2">
                        <div className="form-group">
                          <label>By Daily Select From &nbsp;</label>
                          <input
                            value={this.state.startDate}
                            onChange={async (e) => {
                              await this.setState({
                                startDate: e.target.value,
                              });
                              await this.getmodel();
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
                            onChange={async (e) => {
                              await this.setState({
                                finishDate: e.target.value,
                              });
                              await this.getmodel();
                            }}
                            type="date"
                            className="form-control"
                            placeholder="Select Finish Date"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      {/* Model */}
                      <div className="col-md-2">
                        <div className="form-froup">
                          <label>Model </label>
                          <Select
                            options={this.state.listModel}
                            value={this.state.Model}
                            onChange={async (e) => {
                              await this.setState({ Model: e });
                              await this.getline();
                            }}
                          />
                        </div>
                      </div>
                      {/* Line */}
                      <div className="col-md-2">
                        <div className="form-froup">
                          <label>Line</label>
                          <Select
                            options={this.state.listLine}
                            value={this.state.Line[0]}
                            onChange={async (e) => {
                              // await this.setState({ insType: e.label });
                              await this.setState({ Line: e });

                              await this.getmachine();
                              await this.setState({
                                machine: [{ label: "Select machine" }],
                              });
                              await this.setState({
                                Serialnumber: [
                                  { label: "Select Serialnumber" },
                                ],
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="form-froup">
                          <label>Machine</label>
                          <Select
                            options={this.state.listmachine}
                            value={this.state.machine[0]}
                            onChange={async (e) => {
                              // await this.setState({ insType: e.label });
                              await this.setState({ machine: e });
                              await this.getSerial();
                              await this.getfixture();
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="form-froup">
                          <label>Fixture</label>
                          <Select
                            options={this.state.listfixture}
                            value={this.state.fixture[0]}
                            onChange={async (e) => {
                              // await this.setState({ insType: e.label });
                              await this.setState({ fixture: e });
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="form-froup">
                          <label>Serialnumber</label>
                          <Select
                            options={this.state.listSerial}
                            value={this.state.Serialnumber[0]}
                            onChange={async (e) => {
                              // await this.setState({ insType: e.label });
                              await this.setState({ Serialnumber: e });
                            }}
                          />
                        </div>
                      </div>

                      <div className="col-md-2">
                        <button
                          disabled={this.state.isDisable}
                          onClick={async (e) => {
                            e.preventDefault(); // Prevent the default form submission behavior

                            this.setState({ isDisable: true });

                            // Check if any parameter is missing
                            if (
                              !this.state.parameter.label ||
                              !this.state.Model.label ||
                              !this.state.Line.label ||
                              !this.state.machine.label ||
                              !this.state.Serialnumber.label
                            ) {
                              Swal.fire({
                                icon: "error",
                                title: "Missing Input",
                                text: "Please select all parameters",
                              });
                              this.setState({ isDisable: false });
                            } else {
                              // All required parameters are selected, continue with the rest of the code
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
                                if (this.state.value_y.length > 0) {
                                  Swal.fire({
                                    icon: "success",
                                    title: "Success",
                                    text: "Data has been loaded successfully",
                                  });
                                } else {
                                  Swal.fire({
                                    icon: "error",
                                    title: "No production data",
                                    text: "Please select other date",
                                  });
                                }
                              });
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
                    <div style={{ width: "1%" }}></div>
                    <div
                      className="card card-warning"
                      style={{
                        width: "100%",
                        backgroundColor: "#FFFFE0", // Light yellow color
                        border: "1px solid #000000", // Black border color
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <div className="card-body">
                        <div className="row">
                          <div style={{ width: "100%" }}>
                            <ReactApexChart
                              options={this.state.options}
                              series={this.state.seriesY}
                              type="line"
                              height={350}
                            />
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
export default Graph_trendmaster;
