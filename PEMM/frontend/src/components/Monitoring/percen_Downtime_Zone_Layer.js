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

const onClose = (history, item, startDate) => {
  history.push({
    pathname: "/mc_percen_error",
    state: {
      lineName: item.Line,
      startDate: startDate,
    },
  });
};

class percen_ng extends Component {
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
      rawData_2: [],
      startDate: moment().format("yyyy-MM-DD"), //moment().add("days", -6).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"), //moment().format("yyyy-MM-DD"),
      listyear: [],
      listMonth: [],
      listModel: [],
      onClose: [],
      listYear: [],
      listMonth: [],
      selectedMaxYear: "",
      selectedMaxMonth: "",

      Table: [],
      Line: [],

      optionSelected: null,
      isDisable: false,
      countdownEnabled: false, // เพิ่ม state สำหรับการเปิด/ปิด countdown
      intervalId: null, // เพิ่ม state สำหรับเก็บ ID ของ interval
      countdownTime: 300, // 5 นาทีในวินาที
    };
  }

  componentDidMount = async () => {
    this.setState({ countdownEnabled: false });
    this.setState({ countdownEnabled: true }, () => {
      // Additional logic to handle the checked state
      this.startInterval();
      const currentDate = new Date().toISOString().split("T")[0];
      this.setState({ startDate: currentDate });
    });
    await this.doGetDataReport();
  };
  doGetDataReport = async () => {
    try {
      const result = await httpClient.get(
        server.percen_Downtime_URL + "_Zone/" + this.state.startDate + "/Layer"
      );
      console.log(result);

      let rawData = result.data.listRawData;
      let rawData_2 = result.data.listRawData_2;
      console.log(rawData[0][0].NG);

      const result_1Array = result.data.result_1;
      console.log(result_1Array);

      for (let i = 1; i < rawData.length; i++) {
        rawData[0].push(...rawData[i]);
      }
    console.log(rawData[0]);
      this.setState({
        Raw_Dat: rawData[0],
        rawData_2: rawData_2[0],
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

  showRequest(request) {
    // แสดง SweetAlert
    Swal.fire({
      title: "Request",
      html: request,
      icon: "info",
      confirmButtonText: "OK",
    });
  }

  render() {
    const { data } = this.props;

    const filterResultByLine = (line, result_1Array) => {
      console.log("Input Line:", line);
      console.log("Input Data:", result_1Array);

      const filteredResults = result_1Array.filter((item) => {
        console.log(item.Line); // Move this line inside the filter function
        return item.Line.trim().toLowerCase() === line.trim().toLowerCase();
      });

      const sortedResults = filteredResults.sort(
        (a, b) => b["Percent"] - a["Percent"]
      );

      console.log("Filtered and Sorted Results:", sortedResults);

      if (filteredResults.length === 0) {
        return {
          Process: "N/A",
          "Total NG": 0,
        };
      }

      const aggregatedValues = sortedResults.reduce(
        (acc, curr) => {
          if (curr["Error"] !== null) {
            acc.TotalNG += curr["Error"];
            acc.Input_process += curr["Input_process"];
            acc.TotalPercent += curr["Percent"];
            acc.Total += `<span style="color: red; font-weight: bold;">${curr["Error"]}</span>`;
          }

          acc.Process += `
          <span style="color: black; font-weight: bold;">${curr["RowNum"]}. </span>
          <span style="color: #8000ff; font-weight: bold;">${curr["Equipment_No."]}</span>
          <span style="color: black; font-weight: bold;"> time</span>
          <span style="color: #8000ff; font-weight: bold;">${curr["NG"]}</span>
          <span style="color: black; font-weight: bold;"> Minutes</span>
          <br/>
          <span style="color: black; font-weight: bold;">Request</span>
          <span style="color: red; font-weight: bold;">${curr["Request"]}</span>
          <br/>
          <span style="color: black; font-weight: bold;">Equipment</span>
          <span style="color: #8000ff; font-weight: bold;">${curr["Equipment"]}</span>
          <br/>
          <br/>`;

          // เพิ่มข้อมูลอื่นๆตามต้องการ

          return acc;
        },
        {
          Process: "",

          Total: "",
          TotalPercent: 0,
          Input_process: 0,
        }
      );

      console.log("Aggregated Values:", aggregatedValues);

      return {
        Process: aggregatedValues.Process.trim(),
        Total: aggregatedValues.Total,
        TotalPercent: aggregatedValues.TotalPercent,
        Input_process: aggregatedValues.Input_process,
      };
    };
    const totalDT =
      this.state.rawData_2.length > 0 ? this.state.rawData_2[0].Total_DT : 0;
    const Second_perPcs =
      this.state.rawData_2.length > 0
        ? this.state.rawData_2[0].Second_perPcs
        : 0;
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

                <div className="row" style={{ marginBottom: "5px" }}>
                  <h1>
                    Downtime Dashboard Monitoring (Layer zone) {" "}
                    {this.state.startDate}
                  </h1>
                  <div className="col-5"></div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span>Refresh Auto</span>
                    <span>
                      {Math.floor(this.state.countdownTime / 60)} :{" "}
                      {this.state.countdownTime % 60}
                    </span>
                  </div>
                </div>
                <div className="row">
                  <div className="card-body">
                    <div className="col-12"></div>
                    {/* <div className="row">
                    <h3>Total Downtime/day  <span style={{ color: 'red' }}>{Number(totalDT).toLocaleString(undefined, {maximumFractionDigits: 2,})}</span>  Hrs</h3> 
                    <div className="col-12"> </div>
                    <h3>AVG Downtime Ratio <span style={{ color: 'red' }}>{Number(Second_perPcs).toLocaleString(undefined, {maximumFractionDigits: 2,})}</span> sec/pc.</h3> 
                   
                    
                    </div> */}
                    <div className="row">
                      <div className="col-md-1">
                        <label
                          className="btn btn-warning text-center"
                          style={{
                            padding: "10px",
                            margin: "5px",
                            width: "100%",
                          }}
                        >
                           Layer ZONE
                        </label>
                      </div>
                      {this.state.Raw_Dat.filter(
                        (item) => item.Line.includes("FB")
                      ) // Filter items for ZONE 1
                        .map((item, index) => {
                          // Extract the substring from the Line property
                          const lineSubstring = item.Line; // Adjust the index as needed
                        console.log(item);
                          return (
                            <div key={index} className="col-md-1">
                              <button
                                className="btn btn-warning text-center"
                                style={{
                                  backgroundColor:
                                    item.NG === null
                                      ? "green"
                                      : item.NG > 20
                                      ? "red"
                                      : "#ff9800",
                                  color:
                                    item.NG === null
                                      ? "white"
                                      : item.NG > 20
                                      ? "white"
                                      : "black",
                                  padding: "10px",
                                  margin: "8px",
                                  width: "100px", // Set a fixed width for the button
                                  fontSize: "16px", // Add text size here
                                }}
                                onClick={() => {
                                  const processItem = filterResultByLine(
                                    item.Line,
                                    this.state.result_1Array
                                  );

                                  if (
                                    processItem.TotalPercent !== null &&
                                    processItem.TotalPercent !== undefined
                                  ) {
                                    console.log("Clicked Item:", item);
                                    console.log(
                                      "Filtered Result:",
                                      processItem
                                    );

                                    Swal.fire({
                                      title: "Line " + item.Line,
                                      html: `
                                        <div style="width: 500px; text-align: left;"> <!-- ปรับขนาดและจัดวางตามที่ต้องการ -->
                                          <div>
                                            <style>
                                              .blue-text {
                                                color: blue;
                                              }
                                            </style>
                                            <div>
                                            </div>
                                            <div>
                                              <p>${processItem.Process} </p>
                                            </div>
                                            <div>
                                            </div>
                                          </div>
                                        </div>
                                      `,
                                      icon: "info",
                                      cancelButtonText: "Close",
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                      } else {
                                        // Additional logic if needed
                                      }
                                    });
                                  } else {
                                    console.error(
                                      "Total Percent value is null or undefined"
                                    );
                                  }
                                }}
                              >
                                <h9>{lineSubstring}</h9>
                                <p>
                                  {Number(item.NG).toLocaleString(undefined, {
                                    maximumFractionDigits: 2,
                                  })}
                                  Min
                                </p>
                              </button>
                            </div>
                          );
                        })}
                    </div>
                
                 
              

             
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

export default percen_ng;
