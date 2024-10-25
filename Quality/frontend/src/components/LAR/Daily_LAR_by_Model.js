import React, { Component } from "react";
import { key, server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";

import moment from "moment";
import Select from "react-select";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";
import ReactDOM from "react-dom";
import ReactApexChart from "react-apexcharts";
import ApexCharts from "apexcharts";
import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(...registerables);
Chart.register(ChartDataLabels);

const MyChartComponent = ({
  xAxis,
  yAxis,
  yAxis1,
  yAxis2,
  yAxis3,
  yAxis4,
  yAxis5,
  yAxis6,
}) => {
  const chartRef = useRef(null); // Create a reference for the canvas element

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d"); // Get the canvas context
    const config = {
      type: "bar",
      data: {
        labels: xAxis, // Labels for x-axis
        datasets: [
          {
            label: "LAR %", // Line chart label
            data: yAxis6,
            type: "line", // Specify as line chart
            backgroundColor: "rgba(0, 0, 0, 0)", // Background color of line
            borderColor: "#41B3A2", // Line color
            borderWidth: 5,
            fill: false, // No fill under the line
            stack: null,
            pointRadius: 5, // Increase point size for clarity
            pointHoverRadius: 7, // Expand size on hover
            yAxisID: "y2", // Use secondary y-axis
            datalabels: {
              enabled: true, // Enable data labels for this dataset
              anchor: "end", // Positioning of the labels
              align: "end", // Alignment of the labels
              formatter: (value) =>
                value !== 0 ? value.toFixed(2) + "%" : null, // Formatting the label to hide 0
              color: "rgba(0, 0, 0, 0.8)", // Change label color to green
              font: {
                weight: "bold", // Font weight for labels
                size: 12, // Font size for labels
              },
              // Adding background and border
              backgroundColor: "#41B3A2", // Line color
              borderColor: "rgba(0, 0, 0, 0.8)", // Black border color
              borderWidth: 1, // Border width
              borderRadius: 4, // Rounded corners
              padding: 6, // Padding around the text
            },
          },

          {
            label: "Cleanroom Rej%",
            data: yAxis,
            backgroundColor: "#6FDCE3",
            borderColor: "#000",
            borderWidth: 2,
            stack: "Stack 0",
            datalabels: {
              display: true,
              anchor: "botton", // Positioning of the labels
              align: "botton", // Alignment of the labels
              formatter: (value) =>
                value !== 0 ? value.toFixed(2) + "%" : null,
              color: "#000",
              font: {
                weight: "bold",
                size: 12,
              },
            },
          },
          {
            label: "FDB Rej%",
            data: yAxis1,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "#000",
            borderWidth: 2,
            stack: "Stack 0",
            datalabels: {
              display: true,
              anchor: "botton", // Positioning of the labels
              align: "botton", // Alignment of the labels
              formatter: (value) =>
                value !== 0 ? value.toFixed(2) + "%" : null,
              color: "#000",
              font: {
                weight: "bold",
                size: 12,
              },
            },
          },
          {
            label: "Loose_part Rej%",
            data: yAxis2,
            backgroundColor: "rgba(255, 206, 86, 0.6)",
            borderColor: "#000",
            borderWidth: 2,
            stack: "Stack 0",
            datalabels: {
              display: true,
              anchor: "botton", // Positioning of the labels
              align: "botton", // Alignment of the labels
              formatter: (value) =>
                value !== 0 ? value.toFixed(2) + "%" : null,
              color: "#000",
              font: {
                weight: "bold",
                size: 12,
              },
            },
          },
          {
            label: "Washing Rej%",
            data: yAxis3,
            backgroundColor: "rgba(255, 99, 132, 0.6)",
            borderColor: "#000",
            borderWidth: 2,
            stack: "Stack 0",
            datalabels: {
              display: true,
              anchor: "botton", // Positioning of the labels
              align: "botton", // Alignment of the labels
              formatter: (value) =>
                value !== 0 ? value.toFixed(2) + "%" : null,
              color: "#000",
              font: {
                weight: "bold",
                size: 12,
              },
            },
          },
          {
            label: "Whiteroom Rej%",
            data: yAxis4,
            backgroundColor: "rgba(153, 102, 255, 0.6)",
            borderColor: "#000",
            borderWidth: 2,
            stack: "Stack 0",
            datalabels: {
              display: true,
              anchor: "botton", // Positioning of the labels
              align: "botton", // Alignment of the labels
              formatter: (value) =>
                value !== 0 ? value.toFixed(2) + "%" : null,
              color: "#000",
              font: {
                weight: "bold",
                size: 12,
              },
            },
          },
          {
            label: "FAC2 Rej%",
            data: yAxis5,
            backgroundColor: "rgba(255, 159, 64, 0.6)",
            borderColor: "#000",
            borderWidth: 2,
            stack: "Stack 0",
            datalabels: {
              display: true,
              anchor: "botton", // Positioning of the labels
              align: "botton", // Alignment of the labels
              formatter: (value) =>
                value !== 0 ? value.toFixed(2) + "%" : null,
              color: "#000",
              font: {
                weight: "bold",
                size: 12,
              },
            },
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: "category",
            title: {
              display: true,
              text: "Date / Month",
            },
          },
          y: {
            max: 100,
            min: 0,
            title: {
              display: true,
              text: "%Reject",
              color: "red", // Set the title color to red
            },
            beginAtZero: true,
            grid: {
              color: "rgba(255, 0, 0, 0.2)", // Optional: Set grid color for y-axis to red
            },
            ticks: {
              color: "red", // Set tick labels color to red
              callback: function (value) {
                return value + "%"; // Append '%' to the tick labels
              },
            },
          },
          y2: {
            // Secondary Y-axis for "LAR %"
            max: 100,
            min: 0,
            position: "right", // Place this y-axis on the right
            title: {
              display: true,
              text: "LAR %",
              color: "green", // Set the title color to green
            },
            beginAtZero: true,
            grid: {
              drawOnChartArea: false, // Prevent grid lines from overlapping with the primary Y-axis
            },
            ticks: {
              color: "green", // Set tick labels color to green
              callback: function (value) {
                return value + "%"; // Append '%' to the tick labels
              },
            },
          },
        },
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Daily VMI LAR Trend",
            align: "center",
          },
          legend: {
            position: "bottom",
          },
          datalabels: {
            display: true,
          },
        },
      },
    };

    const myChart = new Chart(ctx, config); // Create Chart.js chart

    // Clean up when component unmounts
    return () => {
      myChart.destroy();
    };
  }, [xAxis, yAxis, yAxis1, yAxis2, yAxis3, yAxis4, yAxis5, yAxis6]); // Re-render chart when data changes

  return (
    <div>
      <canvas
        ref={chartRef}
        style={{ height: "70px", width: "100%" }} // Set desired height
      ></canvas>
    </div>
  );
};

class Daily_LAR_by_Model extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      year: [],
      Month: [],
      product_type: [],
      Model: { label: "**ALL**" },
      insType: [{ label: "**ALL**" }],
      Line: [{ label: "**ALL**" }],
      report: [],
      xAxis: [],
      yAxis: [],
      yAxis1: [],
      yAxis2: [],
      yAxis3: [],
      yAxis4: [],
      yAxis5: [],
      yAxis6: [],
      seriesY: [],
      series2: [],
      seriesCleanroom: [],
      options: {},
      options2: {},
      chart: [],
      result: [],
      Raw_Dat: [],
      startDate: moment().format("yyyy-MM-DD"), //moment().add("days", -6).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"), //moment().format("yyyy-MM-DD"),
      listyear: [],
      listMonth: [],
      listModel: [],
      listproduct_type: [],
      optionSelected: null,
      isDisable: false,
    };
  }

  componentDidMount = async () => {
    await this.getproduct_type();
    await this.getModel();
    await this.getyear();
    await this.getMonth();
    await this.getInsType();
  };

  doGetDataReport = async () => {
    const modelLabel =
    this.state.Model?.[0]?.label === "**ALL**"
      ? "**ALL**"
      : this.state.Model?.[0]?.label; // Access the first item if Model is an array
  if (!modelLabel) {
    console.warn("Model is not selected");
    return;
  }
    const result = await httpClient.get(
      server.DEFECTNG_URL +
      "/" +
      this.state.product_type.label+
        "/" +
        modelLabel +
        "/" +
        this.state.insType[0].label +
        "/" +
        this.state.year[0].label +
        "/" +
        this.state.Month[0].label +
        "/" +
        this.state.Line[0].label
    );
    let xAxis = [];

    for (let index = 0; index < result.data.result.length; index++) {
      const item = result.data.result[index];
      await xAxis.push(item.DATE);
    }

    let yAxis = result.data.Cleanroom_Percent;
    let yAxis1 = result.data.FDB_Percent;
    let yAxis2 = result.data.Loose_part_Percent;
    let yAxis3 = result.data.Washing_Percent;
    let yAxis4 = result.data.Whiteroom_Percent;
    let yAxis5 = result.data.FAC2_Percent;
    let yAxis6 = result.data.LAR_Percent;

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
      xAxis: xAxis.length ? xAxis : [], // Ensure it's not empty
      yAxis: yAxis.length ? yAxis : [], // Same for yAxis and others
      yAxis1,
      yAxis2,
      yAxis3,
      yAxis4,
      yAxis5,
      yAxis6,
      isDisable: false,
    });
  };

  getyear = async () => {
    const array = await httpClient.get(server.DEFECTYEAR_URL);
    const options = array.data.result.map((d) => ({
      label: d.year,
    }));
    this.setState({ listyear: options });
  };

  getMonth = async () => {
    const array = await httpClient.get(server.DEFECTMONTH_URL);
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

  getModel = async () => {
    try {
      // Assuming `this.state.product_type.label` holds the selected product type
      const response = await httpClient.get(
        `${server.DEFECTMODEL_URL}/${this.state.product_type.label}`
      );
      const options = response.data.result.map((d) => ({
        label: d.ModelShortName,
      }));

      // Update the listModel state with fetched model options
      this.setState({ listModel: options });
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  getLine = async () => {
    try {
      const modelLabel =
        this.state.Model?.[0]?.label === "**ALL**"
          ? "**ALL**"
          : this.state.Model?.[0]?.label; // Access the first item if Model is an array
      if (!modelLabel) {
        console.warn("Model is not selected");
        return;
      }

      const response = await httpClient.get(
        `${server.DFFECTMLINE_URL}/${modelLabel}`
      );
      console.log(modelLabel);

      const options = response.data.result.map((d) => ({
        label: d.Line_No,
      }));
      this.setState({ listLine: options });
    } catch (error) {
      console.error("Error fetching lines:", error);
    }
  };

  getInsType = async () => {
    const modelLabel =
    this.state.Model?.[0]?.label === "**ALL**"
      ? "**ALL**"
      : this.state.Model?.[0]?.label; // Access the first item if Model is an array
    const array = await httpClient.get(
      server.DEFECTMTYPE_URL + "/" + modelLabel
    );
    const options = array.data.result.map((d) => ({
      label: d.InspectionType,
    }));
    this.setState({ listInsType: options });
  };

  renderreport1 = () => {
    if (this.state.report != null) {
      if (this.state.report.length > 0) {
        return this.state.report.map((item, index) => (
          <tr key={index} align="Center">
            <td>{item["DATE"]}</td>
            <td>
              {Number(item["INPUT"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["OUTPUT"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>{item["REJECT_LOT"]}</td>
            <td>{item["REJECT_Percent"]}</td>
            <td>{item["LAR_Percent"]}</td>
            <td>
              {Number(item["TOTAL_inspection"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["TOTAL_sampling"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["defect_QTY"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["DPPM"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
          </tr>
        ));
      }
    }
  };
  renderreport2 = () => {
    if (this.state.report != null) {
      if (this.state.report.length > 0) {
        return this.state.report.map((item, index) => (
          <tr key={index} align="Center">
            <td>{item["DATE"]}</td>
            <td>{item["Cleanroom_Percent"]}</td>
            <td>{item["FDB_Percent"]}</td>
            <td>{item["Washing_Percent"]}</td>
            <td>{item["Whiteroom_Percent"]}</td>
            <td>{item["Loose_part_Percent"]}</td>
            <td>{item["FAC2_Percent"]}</td>
          </tr>
        ));
      }
    }
  };
  renderreport3 = () => {
    if (this.state.report != null) {
      if (this.state.report.length > 0) {
        return this.state.report.map((item, index) => (
          <tr key={index} align="Center">
            <td>{item["DATE"]}</td>
            <td>
              {Number(item["Cleanroom_QTY"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["FDB_QTY"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["Washing_QTY"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["Whiteroom_QTY"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["Loose_part_QTY"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["FAC2_QTY"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
          </tr>
        ));
      }
    }
  };
  renderreport4 = () => {
    if (this.state.report != null) {
      if (this.state.report.length > 0) {
        return this.state.report.map((item, index) => (
          <tr key={index} align="Center">
            <td>{item["DATE"]}</td>
            <td>{item["REJECT_SHIFT_A"]}</td>
            <td>{item["REJECT_SHIFT_B"]}</td>
            <td>{item["REJECT_SHIFT_C"]}</td>
            <td>{item["REJECT_SHIFT_M"]}</td>
            <td>{item["REJECT_SHIFT_N"]}</td>
          </tr>
        ));
      }
    }
  };
  renderreport6 = () => {
    if (this.state.report != null) {
      if (this.state.report.length > 0) {
        return this.state.report.map((item, index) => (
          <tr key={index} align="Center">
            <td>{item["DATE"]}</td>
            <td>{item["Cleanroom_defect_QTY"]}</td>
            <td>{item["FDB_defect_QTY"]}</td>
            <td>{item["Washing_defect_QTY"]}</td>
            <td>{item["Whiteroom_defect_QTY"]}</td>
            <td>{item["Loose_part_defect_QTY"]}</td>
            <td>{item["FAC2_defect_QTY"]}</td>
          </tr>
        ));
      }
    }
  };
  renderreport5 = () => {
    if (this.state.report != null) {
      if (this.state.report.length > 0) {
        return this.state.report.map((item, index) => (
          <tr key={index} align="Center">
            <td>{item["DATE"]}</td>
            <td>
              {Number(item["Cleanroom_DPPM"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["FDB_DPPM"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["Washing_DPPM"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["Whiteroom_DPPM"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["Loose_part_DPPM"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["FAC2_DPPM"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
          </tr>
        ));
      }
    }
  };

  render() {
    console.log(this.state.product_type);
    console.log(this.state.Model);    

    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 70 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1> Daily LAR by Model</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">
                      Daily LAR by Model
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
                            await this.getModel();
                            await this.getLine();
                            await this.getInsType();
                            await this.setState({
                              Model: [{ label: "**ALL**" }],
                            });
                            await this.setState({
                              Line: [{ label: "**ALL**" }],
                            });
                            await this.setState({
                              insType: [{ label: "**ALL**" }],
                            });
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
                    {/* //Select Critiria "Model" */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Model</label>
                        <Select
                          options={this.state.listModel}
                          value={this.state.Model[0] || null} // Fallback if no model selected
                          onChange={async (e) => {
                            // Set the selected model and fetch related lines
                            await this.setState({
                              Model: [{ label: e.label }],
                            });

                            // Fetch lines based on the selected model
                            await this.getLine();

                            // Reset other fields after model selection
                            await this.setState({
                              Line: [{ label: "**ALL**" }],
                              insType: [{ label: "**ALL**" }],
                     
                            });
                          }}
                          placeholder="**ALL**"
                        />
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Line</label>
                        <Select
                          options={this.state.listLine}
                          value={this.state.Line[0] || null} // Fallback if no line selected
                          onChange={async (e) => {
                            // Set the selected line
                            await this.setState({ Line: [{ label: e.label }] });
                    
                          }}
                          placeholder="Select Line"
                        />
                      </div>
                    </div>

                    {/* //Select Critiria "Type" */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Type</label>
                        <Select
                          options={this.state.listInsType}
                          value={this.state.insType[0]}
                          onChange={async (e) => {
                            // await this.setState({ insType: e.label });
                            await this.setState({ insType: [] });
                            this.state.insType.push({ label: e.label });
                     
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select Type"
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
                          this.setState({ isDisable: true });
                          // this.doGetDataReport();
                          Swal.fire({
                            icon: "info",
                            title: "Loading Data",
                            timer: 100000,
                            allowOutsideClick: false,
                            didOpen: async () => {
                              Swal.showLoading();
                              await this.doGetDataReport();
                              await new Promise((resolve) =>
                                setTimeout(resolve, 300)
                              );
                              Swal.close();
                            },
                          }).then(() => {
                            if (this.state.report.length > 0) {
                              if (this.state.report[0].DATE.length > 0) {
                                Swal.fire({
                                  icon: "success",
                                  title: "Success",
                                  text: "Data has been loaded successfully",
                                });
                              } else if (
                                this.state.report[0].DATE.length == 0
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
                  </div>
                </div>
              </div>
              <div className="content">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-12">
                      <div
                        className={`card card-primary card-outline custom-card-height`}
                        style={{
                          width: "100%",
                          minHeight: "200px", // Adjust this value to your desired minimum height
                        }}
                      >
                        {/* Chart Title */}
                        <div className="card-header">
                          <h3 className="card-title">
                            <i className="far fa-chart-bar" /> My Chart
                          </h3>
                        </div>

                        {/* Chart Body */}
                        <div className="card-body">
                          {/* Pass ข้อมูลเข้าไปใน MyChartComponent */}
                          <MyChartComponent
                            xAxis={this.state.xAxis}
                            yAxis={this.state.yAxis}
                            yAxis1={this.state.yAxis1}
                            yAxis2={this.state.yAxis2}
                            yAxis3={this.state.yAxis3}
                            yAxis4={this.state.yAxis4}
                            yAxis5={this.state.yAxis5}
                            yAxis6={this.state.yAxis6}
                            style={{ width: "50%", height: "200px" }} // Ensure the chart fills the card with a fixed height
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table*/}
              <div class="content">
                <div class="container-fluid">
                  <div className="card card-primary">
                    <div className="row">
                      <div className="col-12">
                        {/* /.card-header */}
                        <div
                          className="card-body table-responsive p-0"
                          style={{ height: 400 }}
                        >
                          <table className="table table-head-fixed text-nowrap table-hover">
                            <thead>
                              <tr align="center">
                                <th width="120">Month</th>
                                <th width="120">Input(lot)</th>
                                <th width="120">Output(lot)</th>
                                <th width="120">Reject(lot)</th>
                                <th width="120">Reject (%)</th>
                                <th width="120">LAR (%)</th>
                                <th width="120">Total inspection(QTY)</th>
                                <th width="120">Total sampling (QTY)</th>
                                <th width="120">Total defect (QTY)</th>
                                <th width="120">DPPM</th>
                              </tr>
                            </thead>
                            <tbody>{this.renderreport1()}</tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <h3>Reject QTY by Location(%) </h3>
                </div>
                <div className="col-sm-2"></div>
                <div className="col-sm-3">
                  <h3>Reject by Location (QTY) </h3>
                </div>
              </div>
              <div class="content">
                <div class="container-fluid">
                  <div className="card card-primary">
                    <div className="row">
                      <div className="col-6">
                        <div
                          className="card-body table-responsive p-0"
                          style={{ height: 400 }}
                        >
                          <table className="table table-head-fixed text-nowrap table-hover">
                            <thead>
                              <tr align="center">
                                <th width="120">Month</th>
                                <th width="120">Cleanroom</th>
                                <th width="120">FDB</th>
                                <th width="120">Washing</th>
                                <th width="120">Whiteroom</th>
                                <th width="120">Loose part</th>
                                <th width="120">FAC2</th>
                              </tr>
                            </thead>
                            <tbody>{this.renderreport2()}</tbody>
                          </table>
                        </div>
                      </div>
                      <div className="col-6">
                        <div
                          className="card-body table-responsive p-0"
                          style={{ height: 400 }}
                        >
                          <table className="table table-head-fixed text-nowrap table-hover">
                            <thead>
                              <tr align="center">
                                <th width="120">Month</th>
                                <th width="120">Cleanroom</th>
                                <th width="120">FDB</th>
                                <th width="120">Washing</th>
                                <th width="120">Whiteroom</th>
                                <th width="120">Loose part</th>
                                <th width="120">FAC2</th>
                              </tr>
                            </thead>
                            <tbody>{this.renderreport3()}</tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-3">
                  <h3> Defect NG (Qty) : by Location </h3>
                </div>
                <div className="col-sm-3"></div>
                <div className="col-sm-3">
                  <h3>DPPM : by Location </h3>
                </div>
              </div>
              <div class="content">
                <div class="container-fluid">
                  <div className="card card-primary">
                    <div className="row">
                      <div className="col-6">
                        <div
                          className="card-body table-responsive p-0"
                          style={{ height: 400 }}
                        >
                          <table className="table table-head-fixed text-nowrap table-hover">
                            <thead>
                              <tr align="center">
                                <th width="100">Month</th>
                                <th width="120">Cleanroom</th>
                                <th width="120">FDB</th>
                                <th width="120">Washing</th>
                                <th width="120">Whiteroom</th>
                                <th width="120">Loose part</th>
                                <th width="120">FAC2</th>
                              </tr>
                            </thead>
                            <tbody>{this.renderreport6()}</tbody>
                          </table>
                        </div>
                      </div>

                      <div className="col-6">
                        <div
                          className="card-body table-responsive p-0"
                          style={{ height: 400 }}
                        >
                          <table className="table table-head-fixed text-nowrap table-hover">
                            <thead>
                              <tr align="center">
                                <th width="100">Month</th>
                                <th width="120">Cleanroom</th>
                                <th width="120">FDB</th>
                                <th width="120">Washing</th>
                                <th width="120">Whiteroom</th>
                                <th width="120">Loose part</th>
                                <th width="120">FAC2</th>
                              </tr>
                            </thead>
                            <tbody>{this.renderreport5()}</tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-3">
                  <h3> Reject QTY : by shift </h3>
                </div>
              </div>
              <div class="content">
                <div class="container-fluid">
                  <div className="card card-primary">
                    <div className="col-6">
                      <div
                        className="card-body table-responsive p-0"
                        style={{ height: 400 }}
                      >
                        <table className="table table-head-fixed text-nowrap table-hover">
                          <thead>
                            <tr align="center">
                              <th width="100">Month</th>
                              <th width="100">SHIFT A</th>
                              <th width="100">SHIFT B</th>
                              <th width="100">SHIFT C</th>
                              <th width="100">SHIFT M</th>
                              <th width="100">SHIFT N</th>
                            </tr>
                          </thead>
                          <tbody>{this.renderreport4()}</tbody>
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
    );
  }
}

export default Daily_LAR_by_Model;
