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
      options_shift: {},
      options_model: {},
      options_month: {},

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
      listprocess: [],
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
    this.setState({ countdownEnabled: false });
  };
  doGetDataReport = async () => {
    const result = await httpClient.get(
      server.graph_output_packing_URL + "/" + this.state.startDate
    );

    let xAxis = [];

    for (let index = 0; index < result.data.resultGraph.length; index++) {
      const item = result.data.resultGraph[index];
      await xAxis.push(item.shift);
    }

    let PivotTable = result.data.PivotTable;
    console.log(PivotTable);

    let xAxis_model = [];

    for (let index = 0; index < result.data.resultGraph_model.length; index++) {
      const item = result.data.resultGraph_model[index];
      await xAxis_model.push(item.Model);
    }

    let PivotTable_model = result.data.PivotTable_model;
    console.log(PivotTable_model);

    let xAxis_month = [];

    for (let index = 0; index < result.data.resultGraph_month.length; index++) {
      const item = result.data.resultGraph_month[index];
      await xAxis_month.push(item.MfgDate);
    }

    let PivotTable_month = result.data.PivotTable_month;
    console.log(PivotTable_month);

    let rawData = result.data.listRawData_details;
    console.log(rawData);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);

    }
    this.setState({ Raw_Dat: rawData[0] });
    console.log(this.state.Raw_Dat);

    this.setState({
      report: result.data.result,
      xAxis,
      xAxis_model,
      xAxis_month,
      reportModel: result.data.resultGraph_model,
      pivotTableModel: result.data.PivotTable_model,
      result_shift: result.data.resultGraph,

      isDisable: false,
    });

    let seriesData = [];

    for (let i = 0; i < PivotTable.length; i++) {
      const series = {
        name: PivotTable[i].name,
        type:
          PivotTable[i].name === "Output" || PivotTable[i].name === "Target"
            ? "line"
            : "column",
        data: PivotTable[i].data,
      };
      seriesData.push(series);
    }

    // Now seriesData contains objects with modified types
    console.log(seriesData);
    let columnSeries = seriesData.filter((series) => series.type === "column");
    let lineSeries = seriesData.filter((series) => series.type === "line");

    // Now columnSeries contains objects with type 'column' and lineSeries contains objects with type 'line'
    console.log(columnSeries);
    console.log(lineSeries);

    const sortedData = seriesData.sort((a, b) => {
      // Move items with type 'line' to the end
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

    // Assuming your array is named dataSeries
    const maxValues = sortedData.map((series) => Math.max(...series.data));

    // The maximum value among all data arrays
    const globalMaxValue = Math.max(...maxValues) + 100000;

    console.log(globalMaxValue);

    // Assuming mappedSeriesNames[0] is the series name you want to use
    const seriesName = mappedSeriesNames[0];
    console.log(seriesName);
    //outputby shift
    await this.setState({
      options_shift: {
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
          style: {
            fontSize: "13px",
            color: "#000000", // Set the color to black
          },
          formatter: function (val) {
            return Number(val).toLocaleString();
          },
          textAlign: "center",
        },

        title: {
          text: `Output by Shift ${this.state.startDate}`,
          align: "center",
          offsetX: 0,
        },
        xaxis: {
          categories: xAxis,
          labels: {
            show: true, // Set to true to display labels
            rotate: 0, // Rotate angle of labels
            rotateAlways: false, // Rotate labels even if they overlap
            hideOverlappingLabels: true, // Hide labels that overlap
            trim: false, // Trim labels if they exceed the available space
            offsetY: 0, // Adjust the vertical position of labels
            offsetX: 0, // Adjust the horizontal position of labels
            style: {
              colors: [], // You can set the color of each label if needed
              fontSize: "12px", // Set the font size of labels
              fontFamily: "Arial, sans-serif", // Set the font family of labels
              fontWeight: 400, // Set the font weight of labels
            },
          },
        },

        yaxis: [
          {
            axisTicks: {
              show: true,
            },
            min: 0,
            max: globalMaxValue,
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
              text: "Qty(pcs)",
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
          "#ff7f0e",
          "#2ca02c",
          "#d62728",
          "#9467bd",
          "#c49c94",

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
          width: 5,
          curve: "smooth",
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

      seriesY: PivotTable,
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
          enabled: false,
          offsetX: 0,
          offsetY: 0,
          style: {
            colors: ["#000000", "#111111", "#222222", "#333333"], // กำหนดสีของตัวอักษร
            borderColor: "#000000", // กำหนดสีของขอบ
            borderWidth: 3, // กำหนดความกว้างของขอบ
          },
          formatter: function (val) {
            return Number(val).toLocaleString();
          },
          textAlign: "center",
        },

        title: {
          text: `Output by Model ${this.state.startDate}`,
          align: "center",
          offsetX: 0,
        },
        xaxis: {
          categories: xAxis_model,
        },

        yaxis: [
          {
            axisTicks: {
              show: true,
            },
            min: 0,
            max: 100000,
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
              text: "Qty(pcs)",
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
          "#ff7f0e",
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
          "#339933",
          "#1f77b4",
          "#c5b0d5",
          "#c49c94",
          "#f7b6d2",
          "#c7c7c7",
          "#dbdb8d",
          "#9edae5",
          "#ff6600",
          "#339933",
          "#cc0000",

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
          width: 0,
          curve: "smooth",
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

      series_model: PivotTable_model,
    });

    //output by Daily
    await this.setState({
      options_month: {
        chart: {
          height: 350,
          type: "line",

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
              position: "bottom", // Change this line to "center" or "insideEnd"
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
          style: {
            fontSize: "12px",
            color: "#000000", // หรือให้เป็น "black"
          },
          formatter: function (val) {
            return Number(val).toLocaleString();
          },
          textAlign: "center",
        },

        title: {
          text: `Matching Tray Daily Output`,
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
            min: 0,
            max: 250000,
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
              text: "Qty(pcs)",
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
          "#9467bd",
          "#c49c94",
          "#e377c2",
          "#7f7f7f",
          "#bcbd22",
          "#17becf",
          "#aec7e8",
          "#ffbb78",
          "#339933",
          "#1f77b4",
          "#c5b0d5",
          "#c49c94",
          "#f7b6d2",
          "#c7c7c7",
          "#dbdb8d",
          "#9edae5",
          "#ff6600",
          "#339933",
          "#cc0000",

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
          width: 0,
          curve: "smooth",
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

      series_month: PivotTable_month,
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

  const filteredData = this.state.Raw_Dat.filter(item => 
    item.Model === selectedModel && item.MfgDate === startDate
  );

  if (filteredData.length > 0) {
    // Use SweetAlert to display QA values with running numbers
    const qaValues = filteredData.map((item, index) => `${index + 1}. ${item.QA_no} Qty:${item.QTY}`);
    Swal.fire({
      title: `QA Values for Model ${selectedModel} after ${startDate}`,
      html: `<ul>${qaValues.map(qa => `<li>${qa}</li>`).join('')}</ul>`,
      icon: 'info',
    });
  } else {
    Swal.fire({
      title: 'No Data',
      text: `No QA values found for Model ${selectedModel} after ${startDate}`,
      icon: 'warning',
    });
  }
};


  
  renderReport = () => {

    if (this.state.reportModel != null) {
      if (this.state.reportModel.length > 0) {
        return this.state.reportModel.map((item, index) => (
          <tr key={index}>
            <td>{item["Tray_no"]}</td>
            <td onClick={() => this.handleModelClick(item["Model"])}>{item["Model"]}</td>
            
            <td align="RIGHT">
              {Number(item["count_lot"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td align="RIGHT">
              {Number(item["A"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td align="RIGHT">
              {Number(item["B"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td align="RIGHT">
              {Number(item["C"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td align="RIGHT">
              {Number(item["TOTAL_ABC"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td align="RIGHT">
              {Number(item["M"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td align="RIGHT">
              {Number(item["N"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
           
            <td align="RIGHT">
              {Number(item["TOTAL_MN"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
          
          </tr>
        ));
      }
    }
  };

  render() {
    console.log(this.state.process);

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

        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card card-primary card-outline">
                <div className="card-header">
                  <h3 className="card-title">
                   
                  </h3>
                </div>
                <h2>Matching Tray Daily Output</h2>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-2">
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
                    <div className="col-md-1">
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
                    <div className="col-md-1">
                      <CSVLink
                        data={this.state.Raw_Dat}
                        filename={"report.csv"}
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
                            type="line"
                            height={350}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-4">
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
                            options={this.state.options_shift}
                            series={this.state.seriesY}
                            type="bar"
                            height={350}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-8">
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
              <div className="row">
                <div className="col-12">
                  <div className="content">
                    <div className="container-fluid">
                      <div className="card card-primary">
                        <div className="row">
                          <div className="col-12">
                            {/* /.card-header */}
                            <div
                              className="card-body table-responsive p-0"
                              style={{
                                height: 350,
                                zIndex: "3",
                                position: "relative",
                                zIndex: "0",
                              }}
                            >
                              <table className="table text-nowrap table-hover table-head-fixed">
                                <thead>
                                  <tr align="Center">
                                    <th width="175">ItemNo</th>
                                    <th width="175">Model</th>
                                    <th width="175">Count lot</th>
                                    <th width="175">Shift A</th>
                                    <th width="175">Shift B</th>
                                    <th width="175">Shift C</th>
                                    <th width="175">TOTAL ABC</th>
                                    <th width="175">Shift M</th>
                                    <th width="175">Shift N</th>
                                   
                                    <th width="175">TOTAL MN</th>
                          
                                  </tr>
                                </thead>
                                <tbody>{this.renderReport()}</tbody>
                              </table>
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

export default Monthly_LAR_report_all_Model;
