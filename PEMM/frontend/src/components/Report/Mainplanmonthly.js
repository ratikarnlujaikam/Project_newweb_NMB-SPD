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
      seriesY:[],
      chart: [],
      reportGraph:[],
      startDate: moment().format("yyyy-MM"), //moment().add("days", -6).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM"), //moment().format("yyyy-MM-DD"),

      listProcess: [],
      listInsType: [],



      
      optionSelected: null,
      isDisable: false,
      groupBy: 'Equipment_No.', // Default grouping criterion
      sumOfTotalTimeByGroup: {},
      SumOfTotalTimedelaytime : {}
    };

  }
  componentDidMount = async () => {
    await this.getProcess();
    // await this.getInsType();
  };

  doGetDataReport = async () => {
    const values = this.state.startDate.split('-').map(value => value.trim());
  
    // Ensure the part number is extracted correctly

    
    if( this.state.model.label === "**ALL**"){
      this.state.model.label  = " /"
      
    }const result = await httpClient.get(
      server.DOWNTIME_URL +
      "/Monthly/" +
      values[1] +
      "/" + values[0]+"/" + this.state.model.label
    );
    let xAxis = [];

    for (let index = 0; index < result.data.resultGraph.length; index++) {
      const item = result.data.resultGraph[index];
     
      await xAxis.push(item.Day_txt);
    }

    let Day_txt = result.data.Day_txt;
    let Delay_Time = result.data.Delay_Time;
    let Downtime = result.data.Downtime;
    console.log(result);
    console.log(Day_txt);
    console.log(Delay_Time);
    console.log(Downtime);

    this.setState({
      report: result.data.result,
      reportGraph: result.data.resultGraph,
      noData: false, // Reset the flag for no data
      Day_txt,
      Delay_Time,
      Downtime,
      xAxis,
      // series,
     
      isDisable: false,
    });

  
    await this.setState({
      seriesY: [
        {
          name: "Downtime",
          type: "bar",
          data: Downtime,
          stacked: true,
        },
        {
          name: "Delay_Time",
          type: "bar",
          data: Delay_Time,
        },
        
      ],
      options: {
        chart: {
          type: "line",
          height: 300,
          stacked: true,
          toolbar: {
            show: true,
          },
        },
        stroke: {
          width: 1,
          curve: "smooth",
          colors: ["#000000"], // สีของเส้นทั้งหมดในกราฟ
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
          text: "Monthly Downtime : " +this.state.startDate + " Process : " + this.state.model.label,
          align: "center",
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [0,1],
        },
        xaxis: {
          type: "date",
          categories: xAxis,
        },
          yaxis: [
          
          {
            // min: 0,
            // max: 100,
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
              text: "Total downtime (Hr)",
              style: {
                color: "#ff0000",
              },
            },
            tooltip: {
              fixed: {
                enabled: true
           
              },
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
        ],
        colors: [
          
          // Downtime
          "#3399ff",
          // Delay
          "#BEE3ED",
          // Loose_part Rej%
          "#ff1a1a",
          // Washing Rej%
          "#ffff00",
          // Whiteroom Rej%
          "#d24dff",

          "#ff9900",
          // LAR %
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
    return String(date).padStart(2, '0');
  }

  formatDay(day) {
    // Assuming day is a number (e.g., 1, 2, 11, etc.)
    return String(day).padStart(2, '0');
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
    const pivotedData = keys.map(key => {
      return (
        <tr key={key}>
          <td>{key}</td>
          {report.map((item, index) => (
            <td key={index}>
              {key === "Downtime" || key === "Delay_Time" || key === "Total" 
                ? item[key] 
                : this.formatDate(startDate) + "-" + this.formatDay(item["Day_txt"])}
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
                  <h1>Downtime monthly</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">Downtime monthly</li>
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
                              Swal.fire({
                                title: "Loading...",
                                text: "Fetching data, please wait...",
                                allowOutsideClick: false,
                                didOpen: () => {
                                  Swal.showLoading();
                                },
                              });
                              
                              try {
                                await this.doGetDataReport();

                                // รอ 2 วินาทีก่อนปิด
                                setTimeout(() => {
                                  Swal.close();
                                }, 2000);
                        
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
                                    title: "Data loading encountered an error, please try again",
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
                      <CSVLink data={this.state.report}
                        filename={'Downtime_monthly_report.csv'}
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
                          style={{ height: 400 ,
                            height: 500 ,
                            zIndex: "3",
                            position: "relative",
                            zIndex: "0"}}
                        >
                         {/* Insert Xbar Chart */}
                         <div className="row" style={{ width: "100%" }}>
                          <div style={{ width: "1%" }}></div>
                          <div
                            className="card card-warning"
                          
                            style={{
                              width: "99%",
                              backgroundColor: "#F8F6E1", // Very light blue
  
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
                                    type="bar"
                                    height={420}
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
              {/* Data table */}
              <div class="content">
                <div class="container-fluid">
                  <div className="card card-primary">
                    <div className="row">
                      <div className="col-12">
                        {/* /.card-header */}
                        <div
                          className="card-body table-responsive p-0"
                          style={{ height: 240 ,
                            backgroundColor: "#F8F5FD", 
                            zIndex: "3",
                            position: "relative",
                            zIndex: "0"}}
                        >
                          <table className="table text-nowrap table-hover table-head-fixed">
                            <thead>
                           
                              <tr>
                              <th width="175">Type</th>
                                {this.state.report.map((item, index) => (
                                  <th width="175" key={index}>
                                    {this.formatDay(item["Day_txt"])}
                                  </th>
                                ))}
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
        </div>
      </div >
    );
  }
}

export default Mainplan;
