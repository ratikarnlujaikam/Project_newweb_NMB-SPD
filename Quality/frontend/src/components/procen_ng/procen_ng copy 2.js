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

class Procen_ng extends Component {
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
      countdownTime: 300, // 5 นาทีในวินาที
    };
  }

  componentDidMount = async () => {
    await this.doGetDataReport();
    this.setState({ countdownEnabled: false });
    this.setState({ countdownEnabled: true }, () => {
      // Additional logic to handle the checked state
      this.startInterval();
      const currentDate = new Date().toISOString().split("T")[0];
      this.setState({ startDate: currentDate });
    });
  };
  doGetDataReport = async () => {
    try {
      const result = await httpClient.get(server.percen_ng_URL);
      console.log(result);

      let rawData = result.data.listRawData;
      console.log(rawData[0][0].NG);

      const result_1Array = result.data.result_1;
      console.log(result_1Array);

      for (let i = 1; i < rawData.length; i++) {
        rawData[0].push(...rawData[i]);
      }

      this.setState({
        Raw_Dat: rawData[0],
        report: result.data.result,
        rawData,
        result_1Array,
        isDisable: false,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
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

  handleButtonClick = (data) => {
    // Show a SweetAlert with the value of data[2].NG
    Swal.fire({
      title: "NG Value",
      text: `The NG value is: ${data[2].NG}`,
      icon: "info",
    });
  };

  render() {
    const { data } = this.props;

    const filterResultByLine = (line, result_1Array) => {
      const filteredResults = result_1Array.filter(
        (item) => item.Line.trim().toLowerCase() === line.trim().toLowerCase()
      );

      if (filteredResults.length === 0) {
        return {
          Process: "N/A",
          "Total NG": 0,
        };
      }

      // Calculate aggregated values
      const aggregatedValues = filteredResults.reduce(
        (acc, curr) => {
          acc.Process += `${curr.Process}:${curr["Total NG"]}<br>`;

          acc.TotalNG += curr["Total NG"];
          return acc;
        },
        { Process: "", TotalNG: 0 }
      );

      return {
        Process: aggregatedValues.Process.trim(), // Remove leading/trailing whitespace
        "Total NG": aggregatedValues.TotalNG,
      };
    };

    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 30 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  {/* <h2>Monthly LAR report all Model</h2> */}
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
              <div className="card">
                <div className="card-body">
                  <div className="row">{/* Select Critiria "Year" */}</div>
                </div>
                <h1>%NG Dashboard Moniting</h1>
                <div className="row">
                  <div className="col-10">
                    <div className="row" style={{ marginBottom: "5px" }}>
                      <label>Refrash Auto </label>
                      <p>
                        {Math.floor(this.state.countdownTime / 60)} :{" "}
                        {this.state.countdownTime % 60}
                      </p>
                    </div>
                    <div className="row">
                      {this.state.Raw_Dat.map((item, index) => (
                        <div key={index} className="col-md-1">
                          <button
                            className="btn btn-warning text-center"
                            style={{
                              backgroundColor: item.NG > 5 ? "red" : "green",
                              color: "white",
                              padding: "10px",
                              margin: "5px",
                              width: "100%",
                            }}
                            onClick={() => {
                              if (item.NG !== null && item.NG !== undefined) {
                                const processItem = filterResultByLine(
                                  item.Line,
                                  this.state.result_1Array
                                );

                                console.log("Clicked Item:", item);
                                console.log("Filtered Result:", processItem);

                                Swal.fire({
                                  title: "NG Line" + item.Line_NAME,
                                  html: `
                            <p>The NG value is: ${
                              item.NG !== null ? item.NG.toFixed(2) : "N/A"
                            }${"%"}</p>
                            <p>${processItem.Process}</p>
                            <p>Total NG: ${processItem["Total NG"]}</p>
                        `,
                                  title: "NG Line" + item.Line_NAME,
                                  icon: "info",
                                });
                              } else {
                                console.error("NG value is null or undefined");
                              }
                            }}
                          >
                            <h2>{item.Line}</h2>
                            <p>
                              {Number(item.NG).toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                              %
                            </p>
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Insert Xbar Chart */}
                  </div>
                </div>

                {/* Table*/}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Procen_ng;
