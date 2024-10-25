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
      seriesCleanroom: [],
      options: {},
      options2: {},
      chart: [],

      Raw_Dat: [],

      startDate: moment().format("yyyy-MM-DD"), //moment().add("days", -6).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"), //moment().format("yyyy-MM-DD"),
      listyear: [],
      listMonth: [],
      listModel: [],

      listYear: [],
      listMonth: [],
      selectedMaxYear: '',
      selectedMaxMonth: '',

      optionSelected: null,
      isDisable: false,
    };
  }

  componentDidMount = async () => {
    await this.getyear();
    await this.getMonth();

  };
  doGetDataReport = async () => {
    const result = await httpClient.get(
      server.LAR_URL +
      "/" +
      this.state.year+
      "/" +
      this.state.Month [0].label
    
    );

    let xAxis = [];

    for (let index = 0; index < result.data.resultGraph.length; index++) {
      const item = result.data.resultGraph[index];
      await xAxis.push(item.Model_Name);
    }

    let yAxis6 = result.data.LAR;
    let yInput = result.data.Input;
    let yReject = result.data.Reject;
    let yRejectPP = result.data.Reject_Percent;


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
      xAxis,
      yAxis6,
      yReject,
      yInput,
      yRejectPP,

      // series,

      isDisable: false,
    });

    await this.setState({
      // let yAxis6 = result.data.LAR;
      // let yInput = result.data.Input;
      // let yReject = result.data.Reject;
      seriesY: [
        {
          name: "LAR %",
          type: "column",
          data: yAxis6,
        },
        {
          name: "Reject %",
          type: 'line',
          data: yRejectPP,
        },
      ],
      options: {
        chart: {
          height: 350,
          type: 'line',
          stacked: false
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: [1, 5]
        },
        title: {
          text: 'Monthly LAR report all Model',
          align: 'left',
          offsetX: 110
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1],
         
        },
        xaxis: {
          categories: xAxis,
        },
        yaxis: [
          {
            min: 0.00,
            max: 100.00,
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: '#33cc33'
            },
            labels: {
              style: {
                colors: '#33cc33',
              }
            },
            title: {
              text: "LAR%",
              style: {
                color: '#33cc33',
              }
            },
            tooltip: {
              enabled: true
            }
          },
          {
            seriesName: 'Income',
            opposite: true,
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: '#ff1a1a'
            },
            labels: {
              style: {
                colors: '#ff1a1a',
              }
            },
            title: {
              text: "Reject%",
              style: {
                color: '#ff1a1a',
              },
            },
          },
        ],
        colors: [
          "#33cc33",
          "#ff1a1a",
        ],
        tooltip: {
          fixed: {
            enabled: true,
            position: 'topLeft',
            offsetY: 30,
            offsetX: 60
          },
        },
        legend: {
          horizontalAlign: 'left',
          offsetX: 40
        },
        legend: {
          position: 'right',
          offsetY: 40
        }
      }
      
      
    });
  };

  //     server.LAR_URL +
  //       "/" +
  //       this.state.Month +
  //       "/" +
  //       this.state.year
  //   );

  //     let xAxis = [];

  //     for (let index = 0; index < result.data.resultGraph.length; index++) {
  //       const item = result.data.resultGraph[index];
  //       await xAxis.push(item.Date);
  //     }


  //     let yAxis6 = result.data.LAR;

  //     let rawData = result.data.listRawData;
  //     console.log(rawData);
  //     console.log(rawData.length);
  //     for (let i = 1; i < rawData.length; i++) {
  //       rawData[0].push(...rawData[i]);
  //     }
  //     this.setState({ Raw_Dat: rawData[0] });
  //     console.log(this.state.Raw_Dat);

  //     this.setState({
  //       report: result.data.result,
  //       xAxis,
  //       yAxis6,


  //       // series,

  //       isDisable: false,
  //     });

  //   await this.setState({

  //     seriesY: [
  //       {
  //         name: "Cleanroom Rej%",
  //         type: "line",
  //         data: yAxis6,
  //       },

  //     ],
  //     options: {
  //       chart: {
  //         type: "line",
  //         height: 300,
  //         stacked: true,

  //       },

  //       responsive: [
  //         {
  //           breakpoint: 480,
  //           options: {
  //             legend: {
  //               position: "bottom",
  //               offsetX: -10,
  //               offsetY: 0,
  //             },
  //           },
  //         },
  //       ],
  //       title: {
  //         text: "Daily VMI LAR Trend ",
  //         align: "center",
  //       },
  //       dataLabels: {
  //         enabled: true,
  //         enabledOnSeries: [0],
  //       },
  //       xAxis: {
  //         type: "date",
  //         categories: xAxis,
  //       },
  //       yaxis: [{
  //         title: {
  //           text: 'Reject QTY by Location(%)',
  //         },

  //       }],
  //       colors: [
  //         // Cleanroom Rej
  //         "#AFADDE",
  //         // FDB Rej%
  //         "#C0EEE4",
  //         // Loose_part Rej%
  //         "#F595B2",
  //         // Washing Rej%
  //         "#FFF1BA",
  //         // Whiteroom Rej%
  //         "#BEE3ED",

  //         "#ff9900",
  //         // LAR %
  //         "#39F10F",
  //       ],
  //       // legend: {
  //       //   position: 'right',
  //       //   offsetY: 40
  //       // },
  //       fill: {
  //         opacity: 1,
  //       },
  //     },
  //   });
  // };
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

  getYear = async () => {
    const array = await httpClient.get(server.LARYEAR_URL);
    const options = array.data.result.map((d) => ({
      label: d.year,
    }));
    this.setState({ listYear: options });

    const maxYearOption = this.getMaxValue(options);
    if (maxYearOption) {
      this.setState({ selectedMaxYear: maxYearOption.label });
    }
  };

  getMonth = async () => {
    const array = await httpClient.get(server.LARMONTH_URL);
    const options = array.data.result.map((d) => ({
      label: d.Month,
    }));
    this.setState({ listMonth: options });

    const maxMonthOption = this.getMaxValue(options);
    if (maxMonthOption) {
      this.setState({ selectedMaxMonth: maxMonthOption.label });
    }
  };
  
  getyear = async () => {
    const array = await httpClient.get(server.LARYEAR_URL);
    const options = array.data.result.map((d) => ({
      label: d.year,
    }));
    this.setState({ listyear: options });
  };

  getMonth = async () => {
    const array = await httpClient.get(server.LARMONTH_URL);
    const options = array.data.result.map((d) => ({
      label: d.Month,
    }));
    this.setState({ listMonth: options });
  };

  renderreport = () => {

    if (this.state.report != null) {
      if (this.state.report.length > 0) {
        return this.state.report.map((item) => (
          <tr Align="right">
            <td Align="left">{item["ModelName"]}</td>
            <td>{item["TOTAL"]}</td>
            <td>{item["DAY1"]}</td>
            <td>{item["DAY2"]}</td>
            <td>{item["DAY3"]}</td>
            <td>{item["DAY4"]}</td>
            <td>{item["DAY5"]}</td>
            <td>{item["DAY6"]}</td>
            <td>{item["DAY7"]}</td>
            <td>{item["DAY8"]}</td>
            <td>{item["DAY9"]}</td>
            <td>{item["DAY10"]}</td>
            <td>{item["DAY11"]}</td>
            <td>{item["DAY12"]}</td>
            <td>{item["DAY13"]}</td>
            <td>{item["DAY14"]}</td>
            <td>{item["DAY15"]}</td>
            <td>{item["DAY16"]}</td>
            <td>{item["DAY17"]}</td>
            <td>{item["DAY18"]}</td>
            <td>{item["DAY19"]}</td>
            <td>{item["DAY20"]}</td>
            <td>{item["DAY21"]}</td>
            <td>{item["DAY22"]}</td>
            <td>{item["DAY23"]}</td>
            <td>{item["DAY24"]}</td>
            <td>{item["DAY25"]}</td>
            <td>{item["DAY26"]}</td>
            <td>{item["DAY27"]}</td>
            <td>{item["DAY28"]}</td>
            <td>{item["DAY29"]}</td>
            <td>{item["DAY30"]}</td>
            <td>{item["DAY31"]}</td>
          </tr>
        ));
      }
    }
  };


  render() {
    console.log(this.state.yAxis6)
    console.log(this.state.xAxis)
    console.log(this.state.yInput)
    console.log(this.state.yReject)

    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 70 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Monthly LAR report all Model</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">
                    Monthly LAR report all Model
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
                        {/* //Select Critiria "Year" */}
                        <div className="col-md-2">
                      <div className="form-group">
                        <label>Year</label>
                        <Select
                          options={this.state.listyear}
                          onChange={async (e) => {
                            await this.setState({ year: e.label });
                            await this.getMonth();
                            await this.setState({
                              Month: [
                                { label: "Select Month" },
                              ],
                            });
                          }}
                          
                          // type="text"
                          // className="form-control"
                          placeholder="Select year"
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
                              Swal.close();
                            },
                          }).then(() => {
                            if (this.state.report.length > 0) {
                              if (this.state.report[0].ModelName.length > 0) {
                                Swal.fire({
                                  icon: "success",
                                  title: "Success",
                                  text: "Data has been loaded successfully",
                                });
                              } else if (
                                this.state.report[0].ModelName.length == 0
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
                    <div className="col-md-2">
                      <a style={{ marginTop: 30 }}  href="/defectNG" className="fas fa-angle-double-left"  class="btn btn-primary"   role="button" aria-pressed="true">Back</a>
                    </div>
                    {/* <nav aria-label="Page navigation example">
                      <ul class="pagination">
                        <li class="page-item">
                          <a class="page-link" href="#" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                            <span class="sr-only">Previous</span>
                          </a>
                        </li>
                        <li class="page-item"><a class="page-link" href="/defectNG">1</a></li>
                        <li class="page-item"><a class="page-link" href="/LAR">2</a></li>
                        <li class="page-item">
                          <a class="page-link" href="/LAR" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                            <span class="sr-only">Next</span>
                          </a>
                        </li>
                      </ul>
                    </nav> */}

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
                            style={{ width: "99%" }}
                          >
                            <div className="card-body">
                              <div className="row">
                                <div style={{ width: "100%" }}>
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
                                <th width="100">Model_Name</th>
                                <th width="120">LAR</th>
                                <th width="120">01</th>
                                <th width="120">02</th>
                                <th width="120">03</th>
                                <th width="120">04</th>
                                <th width="120">05</th>
                                <th width="120">06</th>
                                <th width="120">07</th>
                                <th width="120">08</th>
                                <th width="120">09</th>
                                <th width="120">10</th>
                                <th width="120">11</th>
                                <th width="120">12</th>
                                <th width="120">13</th>
                                <th width="120">14</th>
                                <th width="120">15</th>
                                <th width="120">16</th>
                                <th width="120">17</th>
                                <th width="120">18</th>
                                <th width="120">19</th>
                                <th width="120">20</th>
                                <th width="120">21</th>
                                <th width="120">22</th>
                                <th width="120">23</th>
                                <th width="120">24</th>
                                <th width="120">25</th>
                                <th width="120">26</th>
                                <th width="120">27</th>
                                <th width="120">28</th>
                                <th width="120">29</th>
                                <th width="120">30</th>
                                <th width="120">31</th>

                              </tr>
                            </thead>
                            <tbody>{this.renderreport()}</tbody>
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

export default Monthly_LAR_report_all_Model;
