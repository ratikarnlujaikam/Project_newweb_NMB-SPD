import React, { Component } from "react";
import { key, server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import moment from "moment";
import Select from "react-select";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";
import ReactApexChart from "react-apexcharts";
import CanvasJSReact from "@canvasjs/react-charts";
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
class Importment_dowtime_line extends Component {
  constructor(props) {
    super(props);
    this.createPareto = this.createPareto.bind(this);
    this.createPareto2 = this.createPareto2.bind(this);
    //set state
    this.state = {
      model: { label: "**Select**" },
      insType: [{}],
      report: [],
      report2: [],
      xAxis: [],
      xAxis2: [],
      Raw_Dat: [],
      Raw_Dat2: [],
      options: {},
      options2: {},
      seriesY: [],
      seriesY2: [],
      chart: [],
      chart2: [],
      reportGraph: [],
      reportGraph2: [],
      startDate: moment().add("days", -7).format("yyyy-MM-DD"), //moment().format("yyyy-MM-DD"), //moment().add("days", -6).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"), //moment().format("yyyy-MM-DD"),
      MotorType:[],
      listchart1: [],
      listchart2: [],
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
    await this.getProcess();
    await this.getMotorType();
  };

  doGetDataReport = async () => {
    // First chart
    // Fetch the data from the server
    const result = await httpClient.get(
      server.IMPORTMENT_DOWNTIME_PART_URL +
        "/Downtime_line_importment/" +
        this.state.startDate +
        "/" +
        this.state.finishDate +
        "/" +
        this.state.model.label + 
        "/" +
        this.state.MotorType.label
        
    );

    let xAxis = [];
    let newData = [];

    // Iterate over the result data to populate xAxis and newData
    for (let index = 0; index < result.data.resultGraph.length; index++) {
      const item = result.data.resultGraph[index];
      xAxis.push(item.Line);

      // Format Total_Downtime to two decimal places
      const formattedDowntime = parseFloat(item.Total_Downtime).toFixed(2);

      newData.push({
        label: item.Line,
        y: parseFloat(formattedDowntime), // Convert the formatted string back to float
      });
    }

    let Line = result.data.Line;
    let Total_Downtime = result.data.Total_Downtime.map((downtime) =>
      parseFloat(downtime).toFixed(2)
    ); // Format each downtime value

    this.setState({ listchart1: newData }, () => {
      // This callback will execute after the state has been updated
    });
    ////////////////////////////////////////////////////////////////////////////////

    // Second chart
    // Fetch the data from the server
    const result_Second = await httpClient.get(
      server.IMPORTMENT_DOWNTIME_PART_URL +
        "/Frequency_line_importment/" +
        this.state.startDate +
        "/" +
        this.state.finishDate +
        "/" +
        this.state.model.label+
        "/" +
        this.state.MotorType.label
    );

    let xAxis2 = [];
    let newData2 = [];

    // Iterate over the result data to populate xAxis and newData
    for (
      let index = 0;
      index < result_Second.data.resultGraph.length;
      index++
    ) {
      const item = result_Second.data.resultGraph[index];
      xAxis2.push(item.Line);
      newData2.push({
        label: item.Line,
        y: item.Frequency,
      });
    }

    let Line2 = result_Second.data.Line;
    let Frequency = result_Second.data.Frequency;
    this.setState({ listchart2: newData2 }, () => {
      // This callback will execute after the state has been updated
    });

    // console.log(this.state.listchart2);
    ///////////////////////////////////////////////////////////////////////////////

    this.setState({
      report: result.data.result,
      reportGraph: result.data.resultGraph,
      noData: false, // Reset the flag for no data
      Line,
      Total_Downtime,
      xAxis,
      isDisable: false,
      ////////////////////////////////////////////////////////////////////
      report2: result_Second.data.result,
      reportGraph2: result_Second.data.resultGraph,
      noData: false, // Reset the flag for no data
      Line2,
      Frequency,
      xAxis2,
      isDisable: false,
    });
    const label2 = this.state.model.label;
    const lb_startDate = this.state.startDate;
    const lb_finishDate = this.state.finishDate;

    await this.setState({
      seriesY: [
        {
          name: "Total_Downtime",
          type: "bar",
          data: Total_Downtime,
          stacked: true,
        },
      ],
      options: {
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
          text: "Downtime each line",
          align: "center",
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [0, 1],
        },
        xaxis: {
          type: "text",
          categories: xAxis,
        },
        yaxis: [
          {
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: "#ff0000",
            },
            labels: {
              formatter: (value) => parseFloat(value).toFixed(2), // Format y-axis labels to 2 decimal points
              style: {
                colors: "#ff0000",
              },
            },
            title: {
              text: "Total downtime (Hr)",
              style: {
                color: "#ff0000",
              },
            },
            tooltip: {
              fixed: {
                enabled: true,
              },
            },
          },
        ],
        animationEnabled: true,
        axisX: {
          interval: 1, // Show every data point on the x-axis
          labelAngle: -45, // Rotate labels to avoid overlapping (optional)
          labelFormatter: function (e) {
            return e.label; // Ensure all labels are shown
          },
        },
        axisY: {
          title: "Total downtime (Hr.)",
          lineColor: "#4F81BC",
          tickColor: "#4F81BC",
          labelFontColor: "#4F81BC",
          includeZero: true,
        },
        axisY2: {
          title: "Percent",
          suffix: "%",
          lineColor: "#C0504E",
          tickColor: "#C0504E",
          labelFontColor: "#C0504E",
        },

        data: [
          {
            type: "column",
            dataPoints: newData.map((point) => ({
              label: point.label,
              y: point.y,
              indexLabel: point.y.toString() + " Hr.",
              indexLabelFontColor: "#4F81BC",
            })),

            click: function (e) {
              // Add click event directly to the data series
              const label = e.dataPoint.label;

              console.log(label2);
              window.location.href = `/Importment_downtime_machine?data=${label}&process=${label2}&startDate=${lb_startDate}&finishDate=${lb_finishDate}`;
            },
          },
        ],

        colors: [
          "#3399ff", // Downtime color
          "#BEE3ED", // Additional colors if needed
          "#ff1a1a",
          "#ffff00",
          "#d24dff",
          "#ff9900",
          "#00ff00",
        ],
        fill: {
          opacity: 1,
        },
      },

      seriesY2: [
        {
          name: "Frequency",
          type: "bar",
          data: Frequency,
          stacked: true,
        },
      ],
      options2: {
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
          text: "Downtime frequency each line",
          // this.state.startDate +
          // " To " +
          // this.state.finishDate +
          // "   -  Process : " +
          // this.state.model.label,
          align: "center",
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [0, 1],
        },
        xaxis2: {
          type: "text",
          categories: xAxis2,
        },
        yaxis: [
          {
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: "#ff0000",
            },
            labels: {
              formatter: (value) => parseFloat(value).toFixed(2), // Format y-axis labels to 2 decimal points
              style: {
                colors: "#ff0000",
              },
            },
            title: {
              text: "Total (Times)",
              style: {
                color: "#ff0000",
              },
            },
            tooltip: {
              fixed: {
                enabled: true,
              },
            },
          },
        ],
        animationEnabled: true,
        axisX: {
          interval: 1, // Show every data point on the x-axis
          labelAngle: -45, // Rotate labels to avoid overlapping (optional)
          labelFormatter: function (e) {
            return e.label; // Ensure all labels are shown
          },
        },
        axisY: {
          title: "Total (Times.)",
          lineColor: "#4F81BC",
          tickColor: "#4F81BC",
          labelFontColor: "#4F81BC",
          includeZero: true,
        },
        axisY2: {
          title: "Percent",
          suffix: "%",
          lineColor: "#C0504E",
          tickColor: "#C0504E",
          labelFontColor: "#C0504E",
        },

        data: [
          {
            type: "column",
            dataPoints: newData2.map((point) => ({
              label: point.label,
              y: point.y,
              indexLabel: point.y.toString(),
              indexLabelFontColor: "#4F81BC",
            })),

            click: function (e) {
              // Add click event directly to the data series
              const label = e.dataPoint.label;

              console.log(label2);
              window.location.href = `/Importment_downtime_machine?data=${label}&process=${label2}&startDate=${lb_startDate}&finishDate=${lb_finishDate}&to_link=$("ok")`;
            },
          },
        ],

        colors: [
          "#3399ff", // Downtime color
          "#BEE3ED", // Additional colors if needed
          "#ff1a1a",
          "#ffff00",
          "#d24dff",
          "#ff9900",
          "#00ff00",
        ],
        fill: {
          opacity: 1,
        },
      },
    });
  };

  getProcess = async () => {
    const array = await httpClient.get(server.DOWNTIME_GETPROCESS);
    const options = array.data.result.map((d) => ({
      label: d.Process,
    }));

    this.setState({ listProcess: options });
  };

  getMotorType= async () => {
    const array = await httpClient.get(server.IMPORTMENT_DOWNTIME_PART_URL + "/MotorType");
    const options = array.data.result.map((d) => ({
      label: d.MotorType,
    }));

    this.setState({ listInsType: options });
  };

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
                    this.formatDay(item["Line"])}
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

  createPareto() {
    var dps = [];
    var chart = this.chart;
    var yValue,
      yTotal = 0,
      yPercent = 0;

    // Calculate the total of all y values
    for (var i = 0; i < chart.data[0].dataPoints.length; i++) {
      yTotal += chart.data[0].dataPoints[i].y;
    }

    // Calculate the cumulative percentage for each data point
    for (var i = 0; i < chart.data[0].dataPoints.length; i++) {
      yValue = chart.data[0].dataPoints[i].y;
      yPercent += (yValue / yTotal) * 100;
      yPercent = parseFloat(yPercent.toFixed(2)); // Round to 2 decimal places
      dps.push({ label: chart.data[0].dataPoints[i].label, y: yPercent });
    }

    // Add the line chart with the calculated percentages
    chart.addTo("data", {
      type: "line",
      yValueFormatString: "0.##" % "",
      dataPoints: dps,
    });

 
    // Set axis properties with minimum and maximum adjustments
    var yMax = Math.ceil(yTotal / 20) * 20; // Adjust maximum to nearest multiple of 20
    var yMin = 0; // Set minimum value, can be adjusted if needed

    chart.data[1].set("axisYType", "secondary", false);
    chart.axisY[0].set("minimum", yMin); // Set the minimum value for the primary axis
    chart.axisY[0].set("maximum", yMax); // Set the maximum value for the primary axis
    chart.axisY2[0].set("maximum", 100); // Secondary axis for the cumulative percentage
  }

  createPareto2() {
    var dps = [];
    var chart2 = this.chart2;
    var yValue,
      yTotal = 0,
      yPercent = 0;

    // Calculate the total of all y values
    for (var i = 0; i < chart2.data[0].dataPoints.length; i++) {
      yTotal += chart2.data[0].dataPoints[i].y;
    }

    // Calculate the cumulative percentage for each data point
    for (var i = 0; i < chart2.data[0].dataPoints.length; i++) {
      yValue = chart2.data[0].dataPoints[i].y;
      yPercent += (yValue / yTotal) * 100;
      yPercent = parseFloat(yPercent.toFixed(2)); // Round to 2 decimal places
      dps.push({ label: chart2.data[0].dataPoints[i].label, y: yPercent });
    }

    // Add the line chart with the calculated percentages
    chart2.addTo("data", {
      type: "line",
      yValueFormatString: "0.##" % "",
      dataPoints: dps,
    });

    // Set axis properties with minimum and maximum adjustments
    var yMax = Math.ceil(yTotal / 20) * 20; // Adjust maximum to nearest multiple of 20
    var yMin = 0; // Set minimum value, can be adjusted if needed

    chart2.data[1].set("axisYType", "secondary", false);
    chart2.axisY[0].set("minimum", yMin); // Set the minimum value for the primary axis
    chart2.axisY[0].set("maximum", yMax); // Set the maximum value for the primary axis
    chart2.axisY2[0].set("maximum", 100); // Secondary axis for the cumulative percentage
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
                  <h1>Importment downtime </h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">
                      Importment downtime{" "}
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </section>
        </div>
        {/* select Parameter */}
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
                    {/* //Select Critiria "Process PE" */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Process</label>

                        <Select
                          options={this.state.listProcess}
                          value={this.state.model}
                          onChange={async (e) => {
                            await this.setState({ model: e });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select Model"
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Motor type</label>

                        <Select
                          options={this.state.listInsType}
                          // value={this.state.model}
                          onChange={async (e) => {
                            await this.setState({ MotorType: e });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="**ALL**"
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
                                await this.createPareto();
                                await this.createPareto2();
                                // await this.doGetDataReport2();
                                // console.log(this.state.listchart2);
                                // await this.createPareto(this.chart, this.state.listchart1);
                                // await this.createPareto(this.chart2, this.state.listchart2);
                                Swal.close();
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
                    <div className="col-md-1">
                      <CSVLink
                        data={this.state.report}
                        filename={"Downtime_monthly_report.csv"}
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
              <div className="content">
                <h3 style={{ textAlign: "center" }}>
                  Downtime on (start {this.state.startDate} –{" "}
                  {this.state.finishDate}) Process: {this.state.model.label}
                </h3>
                <div className="container-fluid">
                  <div className="card card-primary">
                    <div className="row">
                      <div className="col-12">
                        <div
                          className="card-body table-responsive p-0"
                          style={{
                            height: 440,
                            zIndex: "0",
                            position: "relative",
                          }}
                        >
                          <div className="row" style={{ width: "100%" }}>
                            <div style={{ width: "1%" }}></div>
                            <div
                              className="card card-warning"
                              style={{
                                width: "99%",
                                backgroundColor: "#ff9900",
                                border: "1px solid #000000",
                                borderRadius: "10px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              <div>
                                <CanvasJSChart
                                  options={this.state.options}
                                  onRef={(ref) => (this.chart = ref)}
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

              {/* Chart2 */}
              <div className="content">
                <div className="container-fluid">
                  <div className="card card-primary">
                    <div className="row">
                      <div className="col-12">
                        <div
                          className="card-body table-responsive p-0"
                          style={{
                            height: 430,
                            zIndex: "0",
                            position: "relative",
                          }}
                        >
                          <div className="row" style={{ width: "100%" }}>
                            <div style={{ width: "1%" }}></div>
                            <div
                              className="card card-warning"
                              style={{
                                width: "99%",
                                backgroundColor: "#ff9900",
                                border: "1px solid #000000",
                                borderRadius: "10px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              <div>
                                <CanvasJSChart
                                  options={this.state.options2}
                                  onRef={(ref) => (this.chart2 = ref)}
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

export default Importment_dowtime_line;
