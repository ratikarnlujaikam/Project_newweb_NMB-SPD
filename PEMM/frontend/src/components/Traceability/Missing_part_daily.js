import React, { Component } from "react";
import { key, server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import moment from "moment";
import Select from "react-select";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";
import ReactApexChart from "react-apexcharts";

class Mainplan extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      model: { label: "**Select**" },
      insType: [{}],
      report: [],
      xAxis: [],
      report: [],
      Raw_Dat: [],
      options: {},
      seriesY: [],
      chart: [],
      reportGraph: [],
      startDate: moment().add("days", -7).format("yyyy-MM-DD"), //moment().format("yyyy-MM-DD"), //moment().add("days", -6).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"), //moment().format("yyyy-MM-DD"),

      listline: [],
      listProcess: [],
      listInsType: [],

      optionSelected: null,
      isDisable: false,
      groupBy: "Equipment_No.", // Default grouping criterion
      sumOfTotalTimeByGroup: {},
      SumOfTotalTimedelaytime: {},
    };
  }
  componentDidMount = async () => {
    // await this.getProcess();
    await this.getline();
  };

  doGetDataReport = async () => {
    const values = this.state.startDate.split("-").map((value) => value.trim());

    // Ensure the part number is extracted correctly

    const result = await httpClient.get(
      server.MISSING_PART_URL +
        "/daily/" +
        this.state.startDate +
        "/" +
        this.state.finishDate +
        "/" +
        this.state.line.label
    );

    console.log(result);

    let xAxis = [];

    for (let index = 0; index < result.data.resultGraph.length; index++) {
      const item = result.data.resultGraph[index];

      await xAxis.push(item.Date);
    }

    let Date = result.data.Date;
    let Diverter_catch_miss = result.data.Diverter_catch_miss;
    let Crash_stop_catch_miss = result.data.Crash_stop_catch_miss;
    let Ramp_catch_miss = result.data.Ramp_catch_miss;

    console.log(result);
    console.log(Date);
    console.log(Diverter_catch_miss);
    console.log(Crash_stop_catch_miss);
    console.log(Ramp_catch_miss);

    this.setState(
      {
        report: result.data.result,
        reportGraph: result.data.resultGraph,
        noData: false,
        Date,
        Diverter_catch_miss,
        Crash_stop_catch_miss,
        Ramp_catch_miss,
        xAxis,
        isDisable: false,
        seriesY: [
          {
            name: "Diverter_catch_miss",
            type: "bar",
            data: Diverter_catch_miss,
            stacked: true,
          },
          {
            name: "Crash_stop_catch_miss",
            type: "bar",
            data: Crash_stop_catch_miss,
          },
          {
            name: "Ramp_catch_miss",
            type: "bar",
            data: Ramp_catch_miss,
          },
        ],
        options: {
          chart: {
            type: "line",
            height: 350,
            stacked: true,
            toolbar: {
              show: true,
            },
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                legend: {
                  position: "bottom",
                  offsetX: -10,
                  offsetY: 0,
                },
              },
            },
          ],
          title: {
            text:
              "Date : " +
              this.state.startDate +
              "  -  " +
              this.state.finishDate +
              "  Line : " +
              this.state.line.label,
            align: "center",
          },
          dataLabels: {
            enabled: true,
            enabledOnSeries: [0, 1],
          },
          xaxis: {
            type: "date",
            categories: xAxis,
          },
          yaxis: [
            {
              chart: {
                type: "bar",
                stacked: true,
              },
              plotOptions: {
                bar: {
                  horizontal: false,
                  columnWidth: "55%",
                  endingShape: "rounded",
                },
              },
              dataLabels: {
                enabled: false,
              },
              axisTicks: {
                show: true,
              },
              axisBorder: {
                show: true,
                color: "#ff0000",
              },
              labels: {
                style: {
                  colors: "#ff0000",
                },
              },
              title: {
                style: {
                  color: "#ff0000",
                },
              },
              tooltip: {
                enabled: true,
                shared: true,
                intersect: false,
                theme: "dark",
                fixed: {
                  enabled: true,
                  position: "topRight",
                  offsetX: 0,
                  offsetY: 0,
                },
              },
            },
          ],
          colors: [
            "#3498db",
            "#e67e22",
            "#DAF7A6",
            "#ffff00",
            "#00ff00",
          ],
          fill: {
            opacity: 1,
          },
          tooltip: {
            shared: true,
            intersect: false,
          },
          legend: {
            position: "bottom",
            horizontalAlign: "center",
            floating: false,
            offsetY: 5,
          },
        },
      },
      () => {
        console.log("Updated reportGraph:", this.state.reportGraph);
      }
    );
    
  };
  getline = async () => {
    const array = await httpClient.get(server.MISSING_PART_GETLINE);

    const options = array.data.result.map((d) => ({
      label: d.Line,
    }));
    // console.log(options);
    this.setState({ listline: options });
  };
  // Function to group data by a specific key
  groupData = (data, key) => {
    return data.reduce((acc, item) => {
      const groupValue = item[key];
      if (!acc[groupValue]) {
        acc[groupValue] = [];
      }
      acc[groupValue].push(item);
      return acc;
    }, {});
  };
  // Add these methods to your component
  formatDate(date) {
    // Assuming date is a number (e.g., 1, 2, 11, etc.)
    return String(date).padStart(2, "0");
  }

  formatDay(day) {
    // Assuming day is a number (e.g., 1, 2, 11, etc.)
    return String(day).padStart(2, "0");
  }
  formatDate(date) {
    // Implement your date formatting logic here
    return date.toLocaleDateString();
  }

  formatDay(dayTxt) {
    // Implement your day formatting logic here
    return dayTxt;
  }

  renderReport() {
    const { report, startDate } = this.state;

    // Check if report is not null or undefined and has items
    if (report && report.length > 0) {
      // Extract all unique keys from the report items
      const keys = ["Downtime", "Delay_Time", "Total"];
      const pivotedData = keys.map((key) => {
        return (
          <tr key={key}>
            <td>{key}</td>
            {report.map((item, index) => (
              <td key={index}>
                {key === "Downtime" || key === "Delay_Time" || key === "Total"
                  ? item[key]
                  : this.formatDate(startDate) +
                    "-" +
                    this.formatDay(item["Day_txt"])}
              </td>
            ))}
          </tr>
        );
      });

      return pivotedData;
    } else {
      return (
        <tr>
          <td colSpan={report.length + 1}>No data available</td>
        </tr>
      );
    }
  }

  render() {
    return (
      //Hander
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 70 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Part catch up miss</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">
                      Part catch up miss
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </section>
        </div>
        {/* select Parameter */}
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
                    {/* //Select Critiria "Process PE" */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Line</label>

                        <Select
                          options={this.state.listline}
                          value={this.state.line}
                          onChange={async (e) => {
                            await this.setState({ line: e });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select line"
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
                                setTimeout(() => {
                                  Swal.close();
                                }, 2000);

                                const { reportGraph } = this.state;

                                console.log("reportGraph:", reportGraph);

                                const isDataValid =
                                  Array.isArray(reportGraph) &&
                                  reportGraph.length > 0 &&
                                  typeof reportGraph[0] === "object" && // ตรวจสอบว่าเป็นอ็อบเจ็กต์
                                  Object.keys(reportGraph[0]).length > 0 && // ตรวจสอบว่าอ็อบเจ็กต์มีข้อมูล
                                  reportGraph[0].hasOwnProperty("Date") && // ตรวจสอบว่าแต่ละ object มี Date
                                  reportGraph[0].hasOwnProperty(
                                    "Diverter_catch_miss"
                                  ) && // ตรวจสอบว่าแต่ละ object มี Diverter_catch_miss
                                  reportGraph[0].hasOwnProperty(
                                    "Crash_stop_catch_miss"
                                  ) && // ตรวจสอบว่าแต่ละ object มี Crash_stop_catch_miss
                                  reportGraph[0].hasOwnProperty(
                                    "Ramp_catch_miss"
                                  ); // ตรวจสอบว่าแต่ละ object มี Ramp_catch_miss

                                console.log("isDataValid:", isDataValid);

                                if (isDataValid) {
                                  Swal.fire({
                                    icon: "success",
                                    title: "Success",
                                    text: "Data has been loaded successfully",
                                  });
                                } else {
                                  Swal.fire({
                                    icon: "error",
                                    title: "Data loading encountered an error",
                                    text: "Please try again.",
                                  }).then(() => {
                                    // window.location.reload(); // เปิดคอมเม้นต์ได้ถ้าต้องการรีเฟรชหน้า
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
                    <div className="col-md-1">
                      <CSVLink
                        data={this.state.report}
                        filename={"Missing_part_daily.csv"}
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

              {/* Chart */}
              <div class="content">
                <div class="container-fluid">
                  <div className="card card-primary">
                    <div className="row">
                      <div className="col-12">
                        {/* /.card-header */}
                        <div
                          className="card-body table-responsive p-0"
                          style={{
                            height: 400,
                            height: 500,
                            zIndex: "3",
                            position: "relative",
                            zIndex: "0",
                          }}
                        >
                          {/* Insert Xbar Chart */}
                          <div className="row" style={{ width: "100%" }}>
                            <div style={{ width: "1%" }}></div>
                            <div
                              className="card card-warning"
                              style={{
                                width: "99%",
                                backgroundColor: "#e0f3ee", // Very light blue

                                border: "1px solid #000000", // Black border color
                                borderRadius: "10px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              <div className="row">
                                {/* div className="card-body" */}
                                <div style={{ width: "100%" }}>
                                  <ReactApexChart
                                    options={this.state.options}
                                    series={this.state.seriesY} // Ensure this contains your series data
                                    type="bar" // Set chart type to 'bar'
                                    height={420} // Set chart height
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
      </div>
    );
  }
}

export default Mainplan;
