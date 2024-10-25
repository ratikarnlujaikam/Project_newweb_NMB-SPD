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
import { colors } from "@material-ui/core";

class Daily_LAR_by_Model_G extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      year: [],
      Month: [],
      Model: { label: "**ALL**" },
      insType: [{ label: "**ALL**" }],
      report: [],
      xAxis: [],
      yAxis: [],
      seriesY: [],
      series2: [],
      seriesCleanroom: [],
      options: {},
      options2: {},
      chart: [],
      result: [],
      Raw_Dat: [],
      columnHeader:[],
      startDate: moment().format("yyyy-MM-DD"), //moment().add("days", -6).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"), //moment().format("yyyy-MM-DD"),
      listyear: [],
      listMonth: [],
      listModel: [],

      optionSelected: null,
      isDisable: false,
    };
  }

  componentDidMount = async () => {
    await this.getyear();
    await this.getMonth();
    
  };

  doGetDataReport = async () => {
    const modelLabel =
      this.state.Model.label === "**ALL**" ? "**ALL**" : this.state.Model.label;
    const result = await httpClient.get(
      server.LAR_UPDATE_URL +
        "/" +
        this.state.year[0].label +
        "/" +
        this.state.Month[0].label
    );
    let xAxis = [];

    for (let index = 0; index < result.data.resultGraph.length; index++) {
      const item = result.data.resultGraph[index];
      await xAxis.push(item.Date);
    }
    let PivotTable = result.data.PivotTable;
    let seriesData_LAR = result.data.seriesData;

    let rawData = result.data.listRawData;


    console.log(seriesData_LAR);

    const columnHeader = Object.keys(rawData[0][0]);
    console.log("Head", columnHeader);

    console.log(rawData.length);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat: rawData[0] });
    console.log(this.state.Raw_Dat);

    this.setState({
      report: result.data.result,
      PivotTable,
      columnHeader,
      xAxis,
      seriesData_LAR,
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

    let mappedSeriesData_LAR = seriesData_LAR.map(item => ({
      name: "%LAR",
      type: "line",
      data: item.data.map(dataItem => dataItem.y), // สร้าง array ของ data จากค่า y ของทุก data item
    }));
    
    // เพิ่ม mappedSeriesData_LAR เข้าไปใน seriesData
    let updatedSeriesData = [...seriesData, ...mappedSeriesData_LAR];
    
    console.log("updatedSeriesData", updatedSeriesData);

    // Assuming seriesData is your array
    const names = seriesData.map((item) => item.name);

    console.log(names);
    const seriesName = names[0];
    console.log(seriesName);

    let numColumns = 0;

    // Loop through the sortedData array
    for (const item of seriesData) {
      // Check if the type is 'column'
      if (item.type === "column") {
        numColumns++;
      }
    }

    

    console.log("Number of Columns:", numColumns);

    // Define y-axis configurations
    let yaxisConfig = [];

    // Loop for each column
    for (let i = 0; i < numColumns; i++) {
      yaxisConfig.push({
        seriesName: seriesName,
        min: 0,
        max:25,
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
          text: "lot",
          style: {
            color: i === 0 ? "#d62728" : "#3399ff", // Different color for the first column
          },
        },
        tooltip: {
          show: i === 0 && updatedSeriesData[i].data !== 0,
          enabled: true,
          position: 'bottom'
      },
      
        show: i === 0,
        yAxisIndex: 0,
      });
    }
    
    yaxisConfig.push(
      {
          seriesName: "Income",
          min: 0,
       
          opposite: true,
          axisTicks: {
              show: true,
          },
          axisBorder: {
              show: true,
              color: "#1f77b4",
          },
          labels: {
              style: {
                  colors: "#1f77b4",
              },
          },
          title: {
              text: "Qty(Output & Target)",
              style: {
                  color: "#1f77b4",
              },
          },
          yAxisIndex: 1,
          grouping: true,
      },
    
  );
console.log("updatedSeriesData",updatedSeriesData);
    await this.setState({
      // Existing code...
      seriesY: updatedSeriesData,
      options: {
        chart: {
          height: 350,
          type: "bar",
          stacked: true,
        },

        title: {
          text: "Daily LAR Monitoring",
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
        },
        yaxis: yaxisConfig,
        tooltip: {
          position: 'bottom', // Set the tooltip position to bottom
          followCursor: true, // Enable followCursor to have the tooltip follow the mouse position
          offsetY: 20,
          offsetX: 30,
          custom: function({ series, seriesIndex, dataPointIndex, w }) {
            // Get the value of the current data point
            const value = series[seriesIndex][dataPointIndex];
            // Check if the value is 0 and return an empty string if so
            if (value === 0) return '';
        
            // Collect non-zero values for the entire row
            let tooltipContent = '<div style="padding: 10px; font-size: 14px; background: #F5F5F5; color: #000000; border-radius: 5px; box-shadow: 0 0 5px rgba(0,0,0,0.5); border: 1px solid #000000;">';
            w.config.series.forEach((serie, index) => {
              const dataPointValue = serie.data[dataPointIndex];
              if (dataPointValue !== 0) {
                const seriesName = serie.name;
                const seriesColor = w.config.colors[index]; // Get the color for each series
                // Conditionally format the value
                const formattedValue = dataPointValue <= 50 ? `${dataPointValue} lot` : `${dataPointValue}%`;
                tooltipContent += `
                  <div style="margin-bottom: 5px; color: #000000; display: flex; align-items: center;">
                    <div style="width: 10px; height: 10px; background-color: ${seriesColor}; border-radius: 50%; margin-right: 8px;"></div>
                    ${seriesName} : ${formattedValue}
                  </div>`;
              }
            });
            tooltipContent += '</div>';
        
            return tooltipContent;
          }
        }
        
      
,      
      
      
      
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
          width: 1,
          colors:["#000000"],
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
  // getModel = async () => {
  //   const array = await httpClient.get(server.DEFECTMODEL_URL);
  //   const options = array.data.result.map((d) => ({
  //     label: d.Model_Name,
  //   }));
  //   this.setState({ listModel: options });
  // };
  // getInsType = async () => {
  //   const modelLabel =
  //   this.state.Model.label === "**ALL**"
  //     ? "**ALL**"
  //     : this.state.Model.label;
  //   const array = await httpClient.get(
  //     server.DEFECTMTYPE_URL + "/" + modelLabel
  //   );
  //   const options = array.data.result.map((d) => ({
  //     label: d.InspectionType,
  //   }));
  //   this.setState({ listInsType: options });
  // };

  renderreport1 = () => {
    if (this.state.report != null && this.state.report.length > 0) {
      const columnHeader = Object.keys(this.state.report[0]);

      return (
        <tbody>
          <tr>
            {columnHeader.map((column, index) => (
              <th key={index} align="center">
                {column}
              </th>
            ))}
          </tr>
          {this.state.report.map((item, rowIndex) => (
            <tr key={rowIndex} align="center">
              {columnHeader.map((column, colIndex) => (
                <td key={colIndex}>{item[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      );
    }
  };

  render() {
    console.log(this.state.Model);
    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 70 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Daily LAR Monitoring</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">
                    Daily LAR Monitoring
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
                            if (this.state.report.length > 0) {
                              if (this.state.report[0].Details.length > 0) {
                                Swal.fire({
                                  icon: "success",
                                  title: "Success",
                                  text: "Data has been loaded successfully",
                                });
                              } else if (
                                this.state.report[0].Details.length == 0
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
              <div class="content">
                <div class="container-fluid">
                  <div className="row">
                    <div className="col-12">
                      <div className="card card-primary card-outline">
                        {/* Chart Title */}
                        <div className="card-header">
                          <h3 className="card-title">
                            <i className="far fa-chart-bar" />
                          </h3>
                        </div>

                        {/* Insert Xbar Chart */}
                        <div className="row" style={{ width: "100%" }}>
                          <div style={{ width: "1%" }}></div>
                          <div
                            className="card card-warning"
                            style={{ 
                              width: "99%", 
                              backgroundColor: "#FEF9D9",
                              border: "2px solid black" // Add this line for black border
                            }}
                          >
                            <div className="card-body">
                              <div className="row">
                                <div style={{ width: "100%" }}>
                                  <ReactApexChart
                                    options={this.state.options}
                                    series={this.state.seriesY}
                                    type="line"
                                    height={400}
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
                              
                            </thead>
                            <tbody>{this.renderreport1()}</tbody>
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
      </div>
    );
  }
}

export default Daily_LAR_by_Model_G;
