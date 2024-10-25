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
//npm install @mui/material @emotion/react @emotion/styled

class Monthly_LAR_report_all_Model extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      year: [],
      Month: [],
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

      Raw_Dat: [],
      yAxisIndex: [],

      startDate: moment().format("yyyy-MM-DD"), //moment().add("days", -6).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"), //moment().format("yyyy-MM-DD"),
      listyear: [],
      listMonth: [],
      listModel: [],

      listYear: [],
      listMonth: [],
      selectedMaxYear: "",
      selectedMaxMonth: "",

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
  };
  doGetDataReport = async () => {
    const result = await httpClient.get(
      server.graph_output_URL + "/" + this.state.year + "/" + this.state.startDate
    );

    let xAxis = [];

    for (let index = 0; index < result.data.resultGraph.length; index++) {
      const item = result.data.resultGraph[index];
      await xAxis.push(item.Hour);
    }

    let yAxis6 = result.data.Actual;
    let yAccum_Actual = result.data.Accum_Actual;
    let yAccum_Plan = result.data.Accum_Plan;
    let yRejectPP = result.data.Plan;
    let ydiff = result.data.diff;
    let rawData = result.data.listRawData;

    // Set a maximum value for yRejectPP
    const maxAllowedValue = Math.max(...yRejectPP) + 200;

    console.log(maxAllowedValue);
    // Access the first element of the result_Operating array
    const operatingResult = result.data.result_Operating[0];

    const Plen_PercentageResult =
      operatingResult.Plen_Percentage !== null
        ? parseFloat(operatingResult.Plen_Percentage.toFixed(1))
        : null;

    const PE_PercentageResult =
      operatingResult.PE_Percentage !== null
        ? parseFloat(operatingResult.PE_Percentage.toFixed(1))
        : null;

    const NG_PercentageResult =
      operatingResult.NG_Percentage !== null
        ? parseFloat(operatingResult.NG_Percentage.toFixed(1))
        : null;

    const DT_PercentageResult =
      operatingResult.DT_Percentage !== null
        ? parseFloat(operatingResult.DT_Percentage.toFixed(1))
        : null;

    // Log the results
    console.log("Results from result.data:");
    console.log(`Plen_Percentage: ${Plen_PercentageResult}`);
    console.log(`PE_Percentage: ${PE_PercentageResult}`);
    console.log(`NG_Percentage: ${NG_PercentageResult}`);
    console.log(`DT_Percentage: ${DT_PercentageResult}`);

    // เข้าถึงค่าของ Actual, Plan_1, และ diff จากตำแหน่ง 0 ในอาเรย์
    let actualValue = Number(rawData[0][0].Actual).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });

    let plan1Value = Number(rawData[0][0].Plan_1).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });

    let diffValue = Number(rawData[0][0].diff).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });

    // แสดงค่า
    console.log("Actual:", actualValue);
    console.log("Plan_1:", plan1Value);
    console.log("diff:", diffValue);

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
      yAccum_Plan,
      yAccum_Actual,
      yRejectPP,
      ydiff,
      rawData,
      Plen_PercentageResult,
      PE_PercentageResult,
      NG_PercentageResult,
      DT_PercentageResult,
      maxAllowedValue,
      // series,

      isDisable: false,
    });

    await this.setState({
      options: {
        chart: {
          height: 350,
          type: "bar",
          stacked: true,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "60%",
            endingShape: "rounded",
          },
        },

        dataLabels: {
          enabled: true,
          offsetX: 0,
          offsetY: 0,
          style: {
            fontSize: "15px", // Set your desired font size here
          },
        },

        title: {
          text: "Hourly Output",
          align: "left",
          offsetX: 110,
        },
        xaxis: {
          categories: xAxis,
        },

        yaxis: [
          {
            seriesName: "Actual",
            min: 0,
            max: maxAllowedValue,
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
            },
            title: {
              text: "QTY",
              style: {
                color: "#ff1a1a",
              },
            },
            tooltip: {
              enabled: true,
            },
            yAxisIndex: 0,
          },
          {
            seriesName: "Actual",
            min: 0,
            max: maxAllowedValue,

            axisTicks: {
              show: false,
            },
            labels: {
              show: false,
              style: {
                colors: "#ff1a1a",
              },
            },
            yAxisIndex: 1,
          },
          {
            seriesName: "Actual",
            min: 0,
            max: maxAllowedValue,

            axisTicks: {
              show: false,
            },
            labels: {
              show: false,
              style: {
                colors: "#3399ff",
              },
            },
            yAxisIndex: 2,
          },
        ],

        colors: ["#33cc33", "#ff1a1a", "#3399ff"],

        tooltip: {
          fixed: {
            enabled: true,
            position: "topLeft",
            offsetY: 30,
            offsetX: 60,
          },
        },

        legend: {
          position: "right",
          offsetY: 40,
        },

        stroke: {
          width: 5,
          curve: "smooth",
        },
        markers: {
          size: 5,
          strokeColors: "#fff",
          strokeWidth: 2,
          hover: {
            size: 7,
          },
        },
      },

      seriesY: [
        {
          name: "Actual",
          type: "bar",
          data: yAxis6,
          stack: "one",
          dataLabels: {
            enabled: true,
            offsetX: 0,
            offsetY: -5,
          },
        },
        {
          name: "Diff",
          type: "bar",
          data: ydiff,
          stack: "one",
          dataLabels: {
            enabled: true,
            offsetX: 0,
            offsetY: -30,
          },
        },
        {
          name: "Plan",
          type: "line",
          data: yRejectPP,
          dataLabels: {
            enabled: true,
            offsetX: 0,
            offsetY: -50,
          },
        },
      ],
    });
    await this.setState({
      options2: {
        chart: {
          type: "bar",
          height: 350,
          stacked: true,
          stackType: "100%",
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },

        title: {
          text: "Operating/Non Operating time",
        },

        dataLabels: {
          enabled: true,
          enabledOnSeries: [0, 1, 2, 3],
          formatter: function (val) {
            return val.toFixed(1) + "%";
          },
          align: "bottom",
          offsetX: 0,
          offsetY: 10,
          style: {
            colors: ["#000000", "#111111", "#222222", "#333333"], // Replace with your preferred font colors
          },
        },

        yaxis: {
          title: {
            text: undefined,
          },
        },

        states: {
          hover: {
            filter: "none",
          },
        },
        legend: {
          position: "right",
          offsetY: 40,
        },

        yaxis: [
          {
            seriesName: "Total",
            axisTicks: {
              show: false,
            },
            axisBorder: {
              show: false,
              color: "#33cc33",
            },
            labels: {
              show: false,
              style: {
                colors: "#33cc33",
              },
            },
            title: {
              text: "Total",
              style: {
                color: "#33cc33",
              },
            },
            tooltip: {
              enabled: false,
            },
            yAxisIndex: 0,
          },
        ],
        colors: ["#33cc33", "#ff3399", "#ffff00", "#3399ff"],
        tooltip: {
          fixed: {
            enabled: true,
            position: "topLeft",
            offsetY: 30,
            offsetX: 60,
          },
        },
        legend: {
          position: "right",
          offsetY: 40,
        },
        stroke: {
          width: 2,
          curve: "smooth",
        },
      },
      series2: [
        {
          name: "%OparationTime",
          type: "bar",
          data: [Plen_PercentageResult],
          stacked: true,
          dataLabels: {
            enabled: true,
            offsetY: -20,
            style: {
              fontSize: "12px",
              colors: ["#33cc33"],
            },
          },
          yAxisIndex: 0,
        },
        {
          name: "%PE",
          type: "bar",
          data: [PE_PercentageResult],
          stacked: true,
          dataLabels: {
            enabled: true,
            offsetY: -20,
            style: {
              fontSize: "12px",
              color: "#ff3399",
            },
          },
          yAxisIndex: 0,
        },
        {
          name: "%Yield",
          type: "bar",
          data: [NG_PercentageResult],
          dataLabels: {
            enabled: true,
            offsetY: -20,
            style: {
              fontSize: "12px",
              colors: ["#ff1a1a"],
            },
          },
          yAxisIndex: 0,
        },
        {
          name: "%DT",
          type: "bar",
          data: [DT_PercentageResult],
          dataLabels: {
            enabled: true,
            offsetY: -20,
            style: {
              fontSize: "12px",
              colors: ["#aaffaa"],
            },
          },
          yAxisIndex: 0,
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

  getyear = async () => {
    const array = await httpClient.get(server.Lgraph_output_Line_URL);
    const options = array.data.result.map((d) => ({
      label: d.year,
    }));
    this.setState({ listyear: options });
  };

  stopInterval() {
    clearInterval(this.intervalId);
  }

  startInterval() {
    this.intervalId = setInterval(() => {
      this.setState((prevState) => ({
        countdownTime: prevState.countdownTime - 1,
      }));

      if (this.state.countdownTime <= 0) {
        // เมื่อเวลาครบถ้วน, ให้ทำการ Summit ข้อมูล
        this.doGetDataReport();
        // และรีเซ็ตเวลานับถอยหลังเป็น 5 นาทีใหม่
        this.setState({ countdownTime: 300 }); // 5 นาทีในวินาที
      }
    }, 1000); // 1 วินาที
  }

  stopInterval() {
    clearInterval(this.intervalId);
  }

  render() {
    console.log(this.state.xAxis);
    console.log(this.state.yAccum_Actual);
    console.log(this.state.yReject);

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

        <div class="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card-body">
                <div className="row">{/* Select Critiria "Year" */}</div>
              </div>

              <div className="row">
                <div className="col-7">
                  {/* Insert Xbar Chart */}
                  <div className="row" style={{ width: "100%" }}>
                    <div style={{ width: "1%" }}></div>
                    <div
                      className="card card-warning"
                      style={{ width: "100%" }}
                    >
                      <div className="card-body">
                        <div className="row">
                          <div style={{ width: "100%" }}>
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
                <div className="col-5">
                  <div className="row" style={{ marginBottom: "20px" }}>
                    <div className="col-md-4">
                      <label>Line&Model</label>
                      <Select
                        options={this.state.listyear}
                        onChange={async (e) => {
                          await this.setState({ year: e.label });
                        }}
                        placeholder="Select Line&Model"
                      />
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Select Date&nbsp;</label>
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
                    <div className="col-md-2">
                      <button
                        disabled={this.state.isDisable}
                        onClick={async (e) => {
                          this.setState({ isDisable: true });
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
                            // Rest of your code...
                          });
                        }}
                        type="submit"
                        className="btn btn-primary"
                        style={{ marginTop: 30 }}
                      >
                        Submit
                      </button>
                    </div>

                    <label>Lock Line</label>
                    <input
                      type="checkbox"
                      checked={this.state.countdownEnabled}
                      onChange={(e) => {
                        this.setState(
                          { countdownEnabled: e.target.checked },
                          () => {
                            if (this.state.countdownEnabled) {
                              this.startInterval();
                              // Set the startDate to the current date
                              const currentDate = new Date()
                                .toISOString()
                                .split("T")[0];
                              this.setState({ startDate: currentDate });
                            } else {
                              this.stopInterval();
                            }
                          }
                        );
                      }}
                    />

                    {this.state.countdownEnabled && (
                      <p>
                        {Math.floor(this.state.countdownTime / 60)} :{" "}
                        {this.state.countdownTime % 60}
                      </p>
                    )}
                  </div>

                  {this.state.rawData.map((data, index) => (
                    <div key={index} className="row">
                      <div className="col-md-3">
                        <div
                          className="card card-warning text-center"
                          style={{ backgroundColor: "blue" }}
                        >
                          <h1 style={{ color: "white" }}>Plan </h1>
                          <h1 style={{ color: "white" }}>
                            {Number(data[0].Plan_1).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}
                          </h1>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div
                          className="card card-warning text-center"
                          style={{ backgroundColor: "#33cc33" }}
                        >
                          <h1 style={{ color: "white" }}>Actual </h1>
                          <h1 style={{ color: "white" }}>
                            {Number(data[0].Actual).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}
                          </h1>
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[0].diff < 0 ? "red" : "green",
                          }}
                        >
                          <h1 style={{ color: "white" }}>Diff</h1>
                          <h1 style={{ color: "white" }}>
                            {Number(data[0].diff).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}
                          </h1>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Insert Xbar Chart */}
                  <div className="row" style={{ width: "100%" }}>
                    <div style={{ width: "1%" }}></div>
                    <div
                      className="card card-warning"
                      style={{ width: "100%" }}
                    >
                      <div className="card-body">
                        <div className="row">
                          <div style={{ width: "100%" }}>
                            <ReactApexChart
                              options={this.state.options2}
                              series={this.state.series2}
                              type="bar"
                              height={250}
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

export default Monthly_LAR_report_all_Model;
