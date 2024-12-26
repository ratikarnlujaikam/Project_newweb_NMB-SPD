import React, { Component } from "react";
import { key, server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import moment from "moment";
import Select from "react-select";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";
import ReactApexChart from "react-apexcharts";

class Auto_machine_alarm_history extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      radio_ERROR: true,
      radio_NG: false,
      year: [],
      Table: [],
      EMP: [],
      report: [],
      reportGraph: [],
      xAxis: [],
      xAxis_MC: [],

      seriesY: [],

      seriesY_MC: [],
      seriesCleanroom: [],
      options: {},
      options_MC: {},
      chart: [],
      Table: [],
      Line: [],
      Raw_Dat: [],
      Raw_Dat: [],

      startDate: moment().add("days", -7).format("yyyy-MM-DD"), //moment().format("yyyy-MM-DD"), //moment().add("days", -6).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"), //moment().format("yyyy-MM-DD"),
      listTable: [],
      listLine: [],
      listModel: [],
      listCode: [],

      optionSelected: null,
      isDisable: false,
      reportGraph2: [],
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
        server.MC_ERROR_URL +
          "/" +
          this.state.Table +
          "/" +
          this.state.Line[0].label +
          "/" +
          this.state.startDate +
          "/" +
          this.state.finishDate
      );
    } else if (this.state.radio_NG) {
      result = await httpClient.get(
        server.MC_ERROR_NG_URL +
          "/" +
          this.state.Table +
          "/" +
          this.state.Line[0].label +
          "/" +
          this.state.startDate +
          "/" +
          this.state.finishDate
      );
    }
    let xAxis = [];

    for (let index = 0; index < result.data.resultGraph.length; index++) {
      const item = result.data.resultGraph[index];
      await xAxis.push(item.Date);
    }
    let PivotTable = result.data.PivotTable;
    //console.log("PivotTable", PivotTable);
    let xAxis_MC = [];

    for (let index = 0; index < result.data.resultGraph_MC.length; index++) {
      const item = result.data.resultGraph_MC[index];
      await xAxis_MC.push(item.Machine_no);
    }
    //console.log("xAxis_MC", xAxis_MC);
    let PivotTable_MC = result.data.PivotTable_MC;
    //console.log("PivotTable_MC", PivotTable_MC);

    let rawData = result.data.listRawData;
    //console.log(rawData);
    //console.log(rawData.length);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat: rawData[0] });
    //console.log(this.state.Raw_Dat);

    this.setState({
      report: result.data.result,
      reportGraph: result.data.resultGraph,
      reportGraph_MC: result.data.resultGraph_MC,
      xAxis,
      xAxis_MC,

      PivotTable,
      PivotTable_MC,

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
    //console.log("seriesData", seriesData);

    // Assuming seriesData is your array
    const names = seriesData.map((item) => item.name);

    //console.log(names);
    const seriesName = names[0];
    //console.log(seriesName);

    let numColumns = 0;
    const allData = seriesData.reduce((acc, item) => acc.concat(item.data), []);

    // Calculate the sum of all data values
    const sumData = allData.reduce((sum, value) => sum + value, 0);

    // Loop through the sortedData array
    for (const item of seriesData) {
      // Check if the type is 'column'
      if (item.type === "column") {
        numColumns++;
      }
    }

    //console.log("Number of Columns:", numColumns);

    // Define y-axis configurations
    let yaxisConfig = [];

    // Loop for each column
    const maxIncreasePercentage = 10; // Set the desired percentage increase
    for (let i = 0; i < numColumns; i++) {
      yaxisConfig.push({
        seriesName: seriesName,
        min: 0,

        axisTicks: {},
        axisBorder: {
          show: i === 0,
          color: i === 0 ? "#d62728" : "#3399ff", // Different color for the first column
        },
        labels: {
          show: i === 0,
          style: {
            colors: i === 0 ? "#d62728" : "#3399ff", // Different color for the first column
          },
          formatter: function (val) {
            // แปลงค่าให้เป็นจำนวนเต็ม
            return Number(val).toFixed(0);
          },
        },
        title: {
          show: i === 0,
          text: "QTY",
          style: {
            color: i === 0 ? "#d62728" : "#3399ff", // Different color for the first column
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
          text: "Dayly",
          labels: {
            style: {
              fontSize: "12px",
              fontWeight: 500,
            },
          },
        },
        yaxis: yaxisConfig,
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
        stroke: {
          width: 1, // ความหนาของเส้น (ตั้งค่าเป็น 0 ถ้าต้องการลบเส้นออก)
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

    let series_MC_1 = [];

    for (let i = 0; i < PivotTable_MC.length; i++) {
      const series_MC = {
        name: PivotTable_MC[i].name,
        type: "column",
        data: PivotTable_MC[i].data,
      };
      series_MC_1.push(series_MC);
    }
    //console.log("series_MC", series_MC_1);

    const names_MC = series_MC_1.map((item) => item.name);

    //console.log(names_MC);
    const seriesName_MC = names_MC[0];
    //console.log(seriesName_MC);

    let numColumns_MC = 0;
    const allData_MC = series_MC_1.reduce(
      (acc, item) => acc.concat(item.data),
      []
    );

    // Calculate the sum of all data values
    const sumData_MC = allData_MC.reduce((sum, value) => sum + value, 0);
    //console.log(sumData_MC);
    // Loop through the sortedData array
    for (const item of series_MC_1) {
      // Check if the type is 'column'
      if (item.type === "column") {
        numColumns_MC++;
      }
    }

    //console.log("Number of Columns:", numColumns_MC);
    //console.log("sumData_MC:", sumData_MC);

    // Define y-axis configurations
    let yaxisConfig_MC = [];

    for (let i = 0; i < numColumns_MC; i++) {
      yaxisConfig_MC.push({
        seriesName: seriesName_MC,
        min: 0,
        max: sumData_MC + 0.1 * sumData_MC,
        axisTicks: {},
        axisBorder: {
          show: i === 0,
          color: i === 0 ? "#d62728" : "#3399ff", // Different color for the first column
        },
        labels: {
          show: i === 0,
          style: {
            colors: i === 0 ? "#d62728" : "#3399ff", // Different color for the first column
          },
          formatter: function (val) {
            // แปลงค่าให้เป็นจำนวนเต็ม
            return Number(val).toFixed(0);
          },
        },
        title: {
          show: i === 0,
          text: "QTY",
          style: {
            color: i === 0 ? "#d62728" : "#3399ff", // Different color for the first column
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
      seriesY_MC: series_MC_1,
      options_MC: {
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
          categories: xAxis_MC,
          text: "Dayly",
          labels: {
            style: {
              fontSize: "12px",
              fontWeight: 500,
            },
          },
        },
        yaxis: yaxisConfig_MC,
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
        stroke: {
          width: 1, // ความหนาของเส้น (ตั้งค่าเป็น 0 ถ้าต้องการลบเส้นออก)
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

    const result2 = await httpClient.get(
      server.MC_ERROR_URL +
        "_Data/" +
        this.state.Table +
        "/" +
        this.state.Line[0].label +
        "/" +
        this.state.startDate +
        "/" +
        this.state.finishDate
    );
    // //console.log(result2);
    this.setState({
      reportGraph2: result2.data.result,
    });
    //console.log(this.state.reportGraph2);
  };

  getTable = async () => {
    const array = await httpClient.get(server.ERRORTable_URL);
    const options = array.data.result.map((d) => ({
      label: d.Table,
    }));
    this.setState({ listTable: options });
  };

  getLine = async () => {
    const array = await httpClient.get(
      server.MC_ERROR_Line_URL + "/" + this.state.Table
    );
    const options = array.data.result.map((d) => ({
      label: d.Line,
    }));
    this.setState({ listLine: options });
  };

  // renderReport() {
  //   const { reportGraph2, startDate } = this.state;
  //   // //console.log(report);
  //   // Check if report is not null or undefined and has items
  //   if (reportGraph2 && reportGraph2.length > 0) {
  //     // Extract all unique keys from the report items
  //     const keys = ["Error", "Occurred", "Restored", "Line", "Date"];
  //     const pivotedData = keys.map((key) => {
  //       return (
  //         <tr key={key}>
  //           <td>{key}</td>
  //           {reportGraph2.map((item, index) => (
  //             <td key={index}>
  //               {key === "Error" ||
  //               key === "Occurred" ||
  //               key === "Restored" ||
  //               key === "Line" ||
  //               key === "Date"
  //                 ? item[key]
  //                 : this.formatDate(startDate) +
  //                   "-" +
  //                   this.formatDay(item["Day_txt"])}
  //             </td>
  //           ))}
  //         </tr>
  //       );
  //     });

  //     return pivotedData;
  //   } else {
  //     return (
  //       <tr>
  //         <td colSpan={reportGraph2.length + 1}>No data available</td>
  //       </tr>
  //     );
  //   }
  // }

  render() {
    // //console.log(this.state.xAxis);
    // //console.log(this.state.PivotTable);
    // //console.log(this.state.report);

    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 70 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Daily Auto machine alarm history</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">
                      {" "}
                      Daily Auto machine alarm history
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
                        <div></div>
                        <label>Table</label>
                        <Select
                          options={this.state.listTable}
                          onChange={async (e) => {
                            await this.setState({ Table: e.label });
                            await this.getLine();
                            await this.setState({
                              Line: [{ label: "Select Line_No" }],
                            });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select Table"
                        />
                      </div>
                    </div>

                    {/* //Select Critiria "Type" */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Line_No</label>
                        <Select
                          options={this.state.listLine}
                          value={this.state.Line[0]}
                          onChange={async (e) => {
                            await this.setState({ Line: [] });
                            this.state.Line.push({ label: e.label });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select Line_No"
                        />
                      </div>
                    </div>

                    {/* //Select Start Date */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>By Daily Select From &nbsp;</label>
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

                          if (!this.state.Line.length) {
                            // ถ้าค่า this.state.Line.length เป็น 0 ให้แสดงข้อความแจ้งเตือน
                            Swal.fire({
                              icon: "error",
                              title: "Missing Selection",
                              text: "Please select Table and Line",
                            }).then(() => {
                              // รีเฟรชหน้าใหม่
                              window.location.reload();
                            });
                          } else {
                            // แสดงข้อความ Loading Data และทำการโหลดข้อมูล
                            Swal.fire({
                              icon: "info",
                              title: "Loading Data",
                              timer: 60000,
                              allowOutsideClick: false,
                              didOpen: async () => {
                                Swal.showLoading();
                                try {
                                  await this.doGetDataReport();
                                  // await this.doGetDataReport2();
                                  Swal.close();

                                  if (
                                    this.state.reportGraph &&
                                    Array.isArray(this.state.reportGraph) &&
                                    this.state.reportGraph.length > 0
                                  ) {
                                    if (
                                      this.state.reportGraph[0] &&
                                      Array.isArray(
                                        this.state.reportGraph[0]
                                      ) &&
                                      this.state.reportGraph[0].length > 0
                                    ) {
                                      Swal.fire({
                                        icon: "success",
                                        title: "Success",
                                        text: "Data has been loaded successfully",
                                      });
                                    } else if (
                                      this.state.reportGraph[0] &&
                                      Array.isArray(
                                        this.state.reportGraph[0]
                                      ) &&
                                      this.state.reportGraph[0].length === null
                                    ) {
                                      //console.log(this.state.reportGraph[0]);

                                      Swal.fire({
                                        icon: "error",
                                        title: "No production data1",
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
                                      window.location.reload();
                                    });
                                  }
                                } catch (error) {
                                  Swal.fire({
                                    icon: "error",
                                    title: "No production data",
                                    text: "Please select another date",
                                  }).then(() => {
                                    // รีเฟรชหน้าใหม่
                                    window.location.reload();
                                  });
                                }
                              },
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


                     {/* Download button */}
                     <div className="col-md-1">
                      <CSVLink data={this.state.reportGraph2}
                        filename={'Alarm_history.csv'}
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
              <div className="content">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-12">
                      {/* Insert Xbar Chart */}
                      <div className="row" style={{ width: "100%" }}>
                        <div style={{ width: "1%" }}></div>
                        <div
                          className="card card-warning"
                          style={{ width: "99%" }}
                        >
                          <div className="card-body">
                            <div className="row">
                              <div
                                style={{
                                  width: "100%",
                                  backgroundColor: "#E0FFFF", // Light blue color
                                  border: "1px solid #4682B4", // Border color matching the background color
                                  borderRadius: "10px",
                                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                <ReactApexChart
                                  options={this.state.options}
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

              <div className="content">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-12">
                      {/* Chart Title */}

                      {/* Insert Xbar Chart */}
                      <div className="row" style={{ width: "100%" }}>
                        <div style={{ width: "1%" }}></div>
                        <div
                          className="card card-warning"
                          style={{ width: "99%" }}
                        >
                          <div className="card-body">
                            <div className="row">
                              <div
                                style={{
                                  width: "100%",
                                  backgroundColor: "#E0FFFF", // Light blue color
                                  border: "1px solid #4682B4", // Border color matching the background color
                                  borderRadius: "10px",
                                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                <ReactApexChart
                                  options={this.state.options_MC}
                                  series={this.state.seriesY_MC}
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
          </div>
        </div>
      </div>
    );
  }
}

export default Auto_machine_alarm_history;
