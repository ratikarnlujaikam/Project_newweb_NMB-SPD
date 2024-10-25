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
      process: [],
      report: [],
      xAxis: [],
      yAxis1: [],
      seriesY: [],
      series_model: [],
      series_month: [],

      seriesCleanroom: [],
      options: {},
      options_model: {},
      options_month: {},

      chart: [],
      rawData: [],
      start_Date_one_day: moment().format("yyyy-MM-DD"),
      Raw_Dat: [],
      yAxisIndex: [],
      supportor: [],
      startDate: moment().format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"), //moment().format("yyyy-MM-DD"),
      xAxis_month: [], // Initialize to an empty array
      listYear: [],
      listMonth: [],
      listprocess: [],
      selectedMaxYear: "",
      selectedMaxMonth: "",
      Supporter_name: [],
      listSupporter_name: [],
      optionSelected: null,
      isDisable: false,
      countdownEnabled: false, // เพิ่ม state สำหรับการเปิด/ปิด countdown
      intervalId: null, // เพิ่ม state สำหรับเก็บ ID ของ interval
      countdownTime: 150, // 5 นาทีในวินาที
    };
  }

  componentDidMount = async () => {
    this.setState({ countdownEnabled: false });
    await this.getsupport();
  };
  doGetDataReport = async () => {
    try {
      const result = await httpClient.get(
        server.GRAPH_LAR_BYTEAM_URL + "/" + this.state.start_Date_one_day
      );
      console.log("result", result);

      let xAxis_month = [];

      for (
        let index = 0;
        index < result.data.resultGraph_month.length;
        index++
      ) {
        const item = result.data.resultGraph_month[index];
        await xAxis_month.push(item.Supporter_name);
      }

      let PivotTable_month = result.data.PivotTable_month;
      console.log(PivotTable_month);

      this.setState({
        report: result.data.result,
        xAxis_month,
        PivotTable_month,
        isDisable: false,
      });

      let seriesData = PivotTable_month; // Assuming PivotTable_month contains series data

      console.log(seriesData);
      let columnSeries = seriesData.filter(
        (series) => series.type === "column"
      );
      let lineSeries = seriesData.filter((series) => series.type === "line");

      console.log(columnSeries);
      console.log(lineSeries);

      const sortedData = seriesData.sort((a, b) => {
        if (a.type === "line" && b.type !== "line") {
          return 1;
        } else if (a.type !== "line" && b.type === "line") {
          return -1;
        } else {
          return 0;
        }
      });

      console.log(sortedData);

      const mappedSeriesNames = sortedData.map((item) => item.name);

      console.log(mappedSeriesNames[0]);

      const maxValues = sortedData.map((series) => Math.max(...series.data));

      const globalMaxValue = Math.max(...maxValues) + 100000;

      console.log(globalMaxValue);

      const seriesName = mappedSeriesNames[0];
      console.log(seriesName);

      await this.setState({
        options_month: {
          chart: {
            height: 350,
            type: "line",
            stacked: true,
            events: {
              dataPointSelection: (event, chartContext, config) => {
                // Get the category and value
                const category = this.state.xAxis_month[config.dataPointIndex];
                const value =
                  this.state.series_month[config.seriesIndex].data[
                    config.dataPointIndex
                  ];
                const seriesName =
                  this.state.series_month[config.seriesIndex].name;
                this.props.history.push(
                  `/Compare_Output?&line=${seriesName}&startDate=${this.state.start_Date_one_day}&to_link=$("ok")&from=/Yield_Monitoring_By_Team`
                );
              },
            },
            marginLeft: 0,
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "60%",
              endingShape: "rounded",
              borderWidth: 1,
              borderColor: "#000000",
              dataLabels: {
                position: "top",
                offsetY: 1,
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
            formatter: function (val) {
              return Number(val).toFixed(2) + "%";
            },
            textAlign: "center",
            style: {
              colors: ["#000000"],
              dropShadow: {
                enabled: true,
                top: 0,
                left: 0,
                blur: 2,
                opacity: 0.7,
              },
            },
          },
          title: {
            text: `NG(%) Monitoring By Team`,
            align: "center",
            offsetX: 0,
          },
          xaxis: {
            categories: xAxis_month,
          },
          yaxis: [
            {
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
                formatter: function (val) {
                  return val.toFixed(2) + "%";
                },
              },
              title: {
                text: "NG(%)",
                style: {
                  color: "#ff1a1a",
                },
              },
              tooltip: {
                enabled: true,
              },
            },
          ],
          colors: [
            "#993366",
            "#2ca02c",
            "#d62728",
            "#9467bd",
            "#c49c94",
            "#e377c2",
            "#7f7f7f",
            "#bcbd22",
            "#17becf",
            "#aec7e8",
            "#ffbb78",
            "#1f77b4",
            "#c5b0d5",
            "#f7b6d2",
            "#c7c7c7",
            "#dbdb8d",
            "#9edae5",
            "#ff6600",
            "#663300",
            "#ff66cc",
            "#666666",
            "#00ccff",
            "#66ff66",
            "#990000",
            "#996699",
          ],
          fill: {
            opacity: 1,
          },
          tooltip: {
            fixed: {
              enabled: false,
            },
            followCursor: true,
            offsetY: 20,
            offsetX: 30,
          },
          legend: {
            position: "bottom",
            horizontalAlign: "center",
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
            width: 1, // Width of the border
            colors: ["#000000"], // Color of the border (black)
          },
          markers: {
            size: 5,
            strokeColors: "#7f7f7f",
            strokeWidth: 2,
            hover: {
              size: 7,
            },
          },
          className: "apexcharts-bar-area",
        },
        series_month: PivotTable_month,
      });
    } catch (error) {
      console.error("An error occurred: ", error);
      this.setState({ xAxis_month: 0 });
      this.setState({ options_month: {}, series_month: [], xAxis_month: 0 });
    }

    this.setState({
      options: {
        ...this.state.options,
        chart: {
          ...this.state.options.chart,
          type: "bar",
        },
      },
    });
  };

  doGetDataReport_dailY = async () => {
    try {
      const result = await httpClient.get(
        server.GRAPH_DAILY_LAR_BY_TEAM_URL +
          "/" +
          this.state.Supporter_name.label +
          "/" +
          this.state.startDate +
          "/" +
          this.state.finishDate
      );
      console.log("result", result);

      let xAxis_month = [];

      for (
        let index = 0;
        index < result.data.resultGraph_month.length;
        index++
      ) {
        const item = result.data.resultGraph_month[index];
        await xAxis_month.push(item.Date);
      }

      let PivotTable_month = result.data.PivotTable_month;
      console.log(PivotTable_month);

      this.setState({
        report: result.data.result,

        xAxis_month,
        reportModel: result.data.resultGraph_model,

        result_shift: result.data.resultGraph,

        isDisable: false,
      });

      //output by Model
      await this.setState({
        options_model: {
          chart: {
            height: 350,
            type: "line",
            stacked: true,
            marginLeft: 0,
          },

          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "60%",
              endingShape: "rounded",
              borderWidth: 1,
              borderColor: "#000000",
              dataLabels: {
                position: "center", // Change this line to "center" or "insideEnd"
                offsetY: 1,
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
            formatter: function (val) {
              return Number(val).toFixed(2) + "%";
            },
            textAlign: "center",
            style: {
              colors: ["#000000"], // สีดำ
              dropShadow: {
                enabled: true,
                top: 0,
                left: 0,
                blur: 2,
                opacity: 0.7,
              },
            },
          },

          title: {
            text: `${this.state.startDate}  -  ${this.state.finishDate}`,
            align: "center",
            offsetX: 0,
          },
          xaxis: {
            categories: xAxis_month,
          },

          yaxis: [
            {
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
                formatter: function (val) {
                  return Number(val).toFixed(2) + "%";
                },
              },
              title: {
                text: "NG(%)",
                style: {
                  color: "#ff1a1a",
                },
              },

              tooltip: {
                enabled: true,
              },
            },
          ],

          colors: [
            "#993366",
            "#2ca02c",
            "#d62728",
            "#9467bd",
            "#c49c94",
            "#e377c2",
            "#7f7f7f",
            "#bcbd22",
            "#17becf",
            "#aec7e8",
            "#ffbb78",
            "#1f77b4",
            "#c5b0d5",
            "#f7b6d2",
            "#c7c7c7",
            "#dbdb8d",
            "#9edae5",
            "#ff6600",
            "#663300",
            "#ff66cc",
            "#666666",
            "#00ccff",
            "#66ff66",
            "#990000",
            "#996699",
          ],

          fill: {
            opacity: 1,
          },

          tooltip: {
            fixed: {
              enabled: false, // ตั้งค่า fixed ให้เป็น false
            },
            followCursor: true, // เปิดใช้งาน followCursor เพื่อให้ tooltip ตามตำแหน่งของเมาส์
            offsetY: 20,
            offsetX: 30,
          },

          legend: {
            position: "bottom", // เลือกตำแหน่งของ legend
            horizontalAlign: "center", // เลือกการจัดวางแนวนอน
            offsetY: 10, // ปรับตำแหน่งของ legend ในแนวดิ่ง
            markers: {
              width: 12,
              height: 12,
              radius: 4,
            },
            itemMargin: {
              horizontal: 10, // ระยะห่างระหว่างรายการของ legend ในแนวนอน
              vertical: 5, // ระยะห่างระหว่างรายการของ legend ในแนวดิ่ง
            },
          },
          stroke: {
            width: 1, // Width of the border
            colors: ["#000000"], // Color of the border (black)
          },
          markers: {
            size: 5,
            strokeColors: "#7f7f7f",
            strokeWidth: 2,
            hover: {
              size: 7,
            },
          },
          className: "apexcharts-bar-area", // เพิ่มคลาส CSS ที่คุณต้องการใช้งาน
        },

        series_model: PivotTable_month,
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
      console.error("An error occurred: ", error);
      this.setState({ xAxis_month: 0 });
      this.setState({ options_model: {}, series_model: [], xAxis_month: "" });
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

  // ...

  handleModelClick = (selectedModel) => {
    const startDate = this.state.startDate;

    const filteredData = this.state.Raw_Dat.filter(
      (item) => item.Model === selectedModel && item.MfgDate === startDate
    );

    if (filteredData.length > 0) {
      // Use SweetAlert to display QA values with running numbers
      const qaValues = filteredData.map(
        (item, index) => `${index + 1}. ${item.QA_no} Qty:${item.QTY}`
      );
      Swal.fire({
        title: `QA Values for Model ${selectedModel} after ${startDate}`,
        html: `<ul>${qaValues.map((qa) => `<li>${qa}</li>`).join("")}</ul>`,
        icon: "info",
      });
    } else {
      Swal.fire({
        title: "No Data",
        text: `No QA values found for Model ${selectedModel} after ${startDate}`,
        icon: "warning",
      });
    }
  };
  getsupport = async () => {
    const array = await httpClient.get(
      server.GET_SUPPORT_URL +
        "/" +
        this.state.startDate +
        "/" +
        this.state.finishDate
    );
    console.log(array);
    const options = array.data.result.map((d) => ({
      label: d.Supporter_name,
    }));
    this.setState({ listSupporter_name: options });
  };

  render() {
    console.log(this.state.xAxis_month.length);

    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 10 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>%NG Monitoring By Team</h1>
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
              <div className="card card-primary card-outline">
                <div className="card-header">
                  <h3 className="card-title"></h3>
                </div>
                <h2>%NG Monitoring By Team</h2>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Start Date&nbsp;</label>
                        <input
                          value={this.state.start_Date_one_day}
                          onChange={(e) => {
                            const selectedDate = new Date(e.target.value);
                            const startDateLimit = new Date("2024-07-11");

                            // ตรวจสอบว่าวันที่ที่ผู้ใช้เลือกมามีค่ามากกว่าหรือเท่ากับ '2024-07-11' หรือไม่
                            if (selectedDate >= startDateLimit) {
                              this.setState({
                                start_Date_one_day: e.target.value,
                              });
                            } else {
                              // ถ้าไม่ใช่ กำหนดให้เป็นวันที่ '2024-07-11'
                              this.setState({
                                start_Date_one_day: "2024-07-11",
                              });
                            }
                          }}
                          type="date"
                          className="form-control"
                          placeholder="Select Start Date"
                          min="2024-07-11" // กำหนดวันที่น้อยสุดที่ให้เลือกได้
                        />
                      </div>
                    </div>

                    <div className="col-md-1">
                      <button
                        disabled={this.state.isDisable}
                        onClick={async (e) => {
                          this.setState({ isDisable: true });
                          this.setState({
                            options_month: null,
                            series_month: null,
                          });
                          try {
                            Swal.fire({
                              icon: "info",
                              title: "Loading Data",
                              timer: 60000,
                              allowOutsideClick: false,
                              didOpen: async () => {
                                Swal.showLoading();
                                await this.doGetDataReport();
                                await new Promise((resolve) => 
                                  setTimeout(resolve,100));
                                Swal.close();
                              },
                            }).then(() => {
                              if (this.state.xAxis_month.length > 0) {
                                if (this.state.xAxis_month[0] !== 0) {
                                  Swal.fire({
                                    icon: "success",
                                    title: "Success",
                                    text: "Data has been loaded successfully",
                                  });
                                } else {
                                  Swal.fire({
                                    icon: "error",
                                    title: "No data",
                                    text: "Please select another date",
                                  });
                                }
                              } else {
                                Swal.fire({
                                  icon: "error",
                                  title: "No data",
                                  text: "Please select another date",
                                });
                              }
                            });
                          } catch (error) {
                            console.error("Error loading data:", error);
                            Swal.fire({
                              icon: "error",
                              title: "Error",
                              text: "An error occurred while loading data. Please try again.",
                            });
                          } finally {
                            this.setState({ isDisable: false });
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
                            options={this.state.options_month}
                            series={this.state.series_month}
                            type="bar"
                            height={350}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-2">
                  <div className="form-group">
                    <label>Start Date&nbsp;</label>
                    <input
                      value={this.state.startDate}
                      onChange={(e) => {
                        const selectedDate = new Date(e.target.value);
                        const startDateLimit = new Date("2024-07-11");

                        // ตรวจสอบว่าวันที่ที่ผู้ใช้เลือกมามีค่ามากกว่าหรือเท่ากับ '2024-07-11' หรือไม่
                        if (selectedDate >= startDateLimit) {
                          this.setState({ startDate: e.target.value });
                        } else {
                          // ถ้าไม่ใช่ กำหนดให้เป็นวันที่ '2024-07-11'
                          this.setState({ startDate: "2024-07-11" });
                        }
                      }}
                      type="date"
                      className="form-control"
                      placeholder="Select Start Date"
                      min="2024-07-11" // กำหนดวันที่น้อยสุดที่ให้เลือกได้
                    />
                  </div>
                </div>
                <label>To</label>

                <div className="col-md-2">
                  <div className="form-group">
                    <label>Finish Date</label>
                    <input
                      value={this.state.finishDate}
                      onChange={(e) => {
                        const selectedDate = new Date(e.target.value);
                        const startDateLimit = new Date("2024-07-11");

                        // ตรวจสอบว่าวันที่ที่ผู้ใช้เลือกมามีค่ามากกว่าหรือเท่ากับ '2024-07-11' หรือไม่
                        if (selectedDate >= startDateLimit) {
                          this.setState({ finishDate: e.target.value });
                        } else {
                          // ถ้าไม่ใช่ กำหนดให้เป็นวันที่ '2024-07-11'
                          this.setState({ finishDate: "2024-07-11" });
                        }
                      }}
                      type="date"
                      className="form-control"
                      placeholder="Select Start Date"
                      min="2024-07-11" // กำหนดวันที่น้อยสุดที่ให้เลือกได้
                    />
                  </div>
                </div>

                <div className="col-md-2">
                  <div className="form-group">
                    <label>Supporter</label>
                    <Select
                      options={this.state.listSupporter_name}
                      value={this.state.Supporter_name}
                      onChange={async (e) => {
                        await this.setState({ Supporter_name: e });
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-1">
                  <button
                    disabled={this.state.isDisable}
                    onClick={async (e) => {
                      this.setState({ isDisable: true });
                      try {
                        Swal.fire({
                          icon: "info",
                          title: "Loading Data",
                          timer: 60000,
                          allowOutsideClick: false,
                          didOpen: async () => {
                            Swal.showLoading();
                            await this.doGetDataReport_dailY();
                             await new Promise((resolve) => 
                              setTimeout(resolve,100));
                            Swal.close();
                          },
                        }).then(() => {
                          if (
                            this.state.xAxis_month &&
                            this.state.xAxis_month.length > 0
                          ) {
                            // ตรวจสอบว่ามีข้อมูลที่ถูกส่งกลับมาหรือไม่
                            Swal.fire({
                              icon: "success",
                              title: "Success",
                              text: "Data has been loaded successfully",
                            });
                          } else {
                            // แสดงข้อความแจ้งเตือนเมื่อไม่มีข้อมูลที่ถูกส่งกลับมา
                            Swal.fire({
                              icon: "error",
                              title: "No Data",
                              text: "No data available for the selected date range. Please select another date.",
                            });
                          }
                        });
                      } catch (error) {
                        console.error("Error loading data:", error);
                        Swal.fire({
                          icon: "error",
                          title: "Error",
                          text: "An error occurred while loading data. Please try again.",
                        });
                      } finally {
                        this.setState({ isDisable: false });
                      }
                    }}
                    type="button" // ปรับเป็น type="button" เนื่องจากไม่ได้ใช้ในการ submit form
                    className="btn btn-primary"
                    style={{ marginTop: 30 }}
                  >
                    Submit
                  </button>
                </div>
              </div>

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
                            options={this.state.options_model}
                            series={this.state.series_model}
                            type="bar"
                            height={350}
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
    );
  }
}

export default Monthly_LAR_report_all_Model;
