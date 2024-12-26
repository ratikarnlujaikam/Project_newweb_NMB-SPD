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
      Raw_Dat1: [],
      yAxisIndex: [],

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
        server.percen_error_URL + "/" + this.state.startDate
      );
      console.log(result);

      let rawData = result.data.listRawData;
      console.log(rawData[0][0].NG);

      const result_1Array = result.data.result_1;
      console.log(result_1Array);

      for (let i = 1; i < rawData.length; i++) {
        rawData[0].push(...rawData[i]);
      }
      console.log(rawData);

      let flattenedData = rawData.flat();  // This will make it a single array if it's nested

      let lineNGData = flattenedData.map(row => ({
        'Line Number': 'L' + String(row.Line),  // Changes column name to 'Line Number'
        '%Cho-ko-tei': String(row.NG)              // Changes column name to 'Non-Good'
      }));


      this.setState({
        Raw_Dat: rawData[0],
        Raw_Dat1: lineNGData,
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
      // acc.Process += `
      // <span style="color: black; font-weight: bold;">
      //   ${curr.Process ? curr.Process.padEnd(20) : "0".padEnd(20)}

      // </span>

      // acc.Process += `
      // <a href="/Auto_machine_by_process?process=${encodeURIComponent(curr.Process)}&line=${encodeURIComponent(curr.Line)}&startDate=${encodeURIComponent(this.state.startDate)}&to_link=${encodeURIComponent("ok")}">
      //   <span style="color: bule; font-weight: bold;">
      //     ${curr.Process ? curr.Process.padEnd(20) : "0".padEnd(20)}
      //   </span>

      // </a>

      const aggregatedValues = sortedResults.reduce(
        (acc, curr) => {
          if (curr["Error"] !== null) {
            acc.TotalNG += curr["Error"];
            acc.Input_process += curr["Input_process"];
            acc.TotalPercent += curr["Percent"];
            acc.Total += `<span style="color: red; font-weight: bold;">${curr["Error"]}</span>`;
          }

          acc.Process += `
  <a href="/Auto_machine_by_process?process=${encodeURIComponent(
    curr.Process
  )}&line=${encodeURIComponent(curr.Line)}&startDate=${encodeURIComponent(
            this.state.startDate
          )}&to_link=${encodeURIComponent("ok")}">
    <span style="color: bule; font-weight: bold;">
      ${curr.Process ? curr.Process.padEnd(20) : "0".padEnd(20)}
    </span>

  </a>


      <span style="color: red; font-weight: bold;">
        ${
          curr["Error"] !== null
            ? curr["Error"].toString().padEnd(10)
            : "0".padEnd(10)
        }
      </span>
      <span style="color: black; font-weight: bold;"> time</span>
      <span style="color: red; font-weight: bold;">
        ${curr["Percent"] !== null ? curr["Percent"].toFixed(2) + "%" : "0%"}
      </span>
      <br>`;

          return acc;
        },
        {
          Process: "",
          TotalNG: 0,
          Total: "",
          TotalPercent: 0,
          Input_process: 0,
        }
      );

      console.log("Aggregated Values:", aggregatedValues);

      return {
        Process: aggregatedValues.Process.trim(),
        "Total NG": aggregatedValues.TotalNG,
        Total: aggregatedValues.Total,
        TotalPercent: aggregatedValues.TotalPercent,
        Input_process: aggregatedValues.Input_process,
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
                          Swal.close();
                        } catch (error) {
                          Swal.fire({
                            icon: "error",
                            title: "No production data",
                            text: "Please select another date", // แสดงข้อความของ error เป็นข้อความใน Swal
                          }).then(() => {
                            // รีเฟรชหน้าใหม่
                            window.location.reload();
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
                <CSVLink data={this.state.Raw_Dat1} filename={"report.csv"}>
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

        <div class="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="row">{/* Select Critiria "Year" */}</div>
                </div>
                <h1>Cho-ko-tei Dashboard Monitoring {this.state.startDate}</h1>
                <div className="row">
                  <div className="card-body">
                    {/* <div className="col-10">
                      <div className="row" style={{ marginBottom: "5px" }}>
                        <label>Refrash Auto </label>
                        <p>
                          {Math.floor(this.state.countdownTime / 60)} :{" "}
                          {this.state.countdownTime % 60}
                        </p>
                      </div>
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
                          ZONE 1
                        </label>
                      </div>
                      {this.state.Raw_Dat.filter(
                        (item) => item.Line.substring(0, 1) === "1"
                      ) // Filter items for ZONE 1
                        .map((item, index) => {
                          // Extract the substring from the Line property
                          const lineSubstring = item.Line.substring(0, 5); // Adjust the index as needed

                          return (
                            <div key={index} className="col-md-1">
                              <button
                                className="btn btn-warning text-center"
                                style={{
                                  backgroundColor:
                                    item.NG === null
                                      ? "#555555"
                                      : item.NG > 3
                                      ? "red"
                                      : "green",
                                  color: "white",
                                  padding: "10px",
                                  margin: "8px",
                                  width: "100px", // Set a fixed width for the button
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
                                      title: "Error Line " + item.Line,
                                      html: `
                                        <div>
                                          <div>
                                          <style>
                                          .blue-text {
                                            color: blue;
                                          }
                                        </style>
                                        
                                     

                                         
                                          <div>
                                          <span  style="color: black;font-weight: bold;">Actual Input: </span>
                                
                                          <span style="color: green;font-weight: bold;">${
                                            item["Actual&NG"]
                                          }</span>
                                          <span  style="color: black;font-weight: bold;">Qty </span>
                                        </div>
                                            <span   style="color: black;font-weight: bold;">Cho-ko-tei:</span>

                                            <span  style="color: red; font-weight: bold;">
                                            ${
                                              processItem.TotalPercent !== null
                                                ? processItem.TotalPercent.toFixed(
                                                    2
                                                  )
                                                : "0"
                                            }%
                                          </span>
                                          
                                          </div>
                           
                                          <div>
                                            <p>${processItem.Process} </p>
                                          </div>
                                          <div>
                                            <span style="color: black;font-weight: bold;">Total error:</span>
                                            <span style="color: red;font-weight: bold;">${
                                              processItem["Total NG"]
                                            }</span>
                                            <span style="color: black; font-weight: bold;">time</span>
                                          </div>
                                        </div>
                                      `,
                                      icon: "info",
                                      showCloseButton: true,
                                      showConfirmButton: true,
                                      confirmButtonText: "Cho-ko-tei",
                                      showCancelButton: true,
                                      cancelButtonText: "Close",
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                        onClose(
                                          this.props.history,
                                          item,
                                          this.state.startDate
                                        );
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
                                <h2>{lineSubstring}</h2>
                                <p>
                                  {Number(item.NG).toLocaleString(undefined, {
                                    maximumFractionDigits: 2,
                                  })}
                                  %
                                </p>
                              </button>
                            </div>
                          );
                        })}
                    </div>
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
                          ZONE 2
                        </label>
                      </div>
                      {this.state.Raw_Dat.filter(
                        (item) => item.Line.substring(0, 1) === "2"
                      ) // Filter items for ZONE 1
                        .map((item, index) => {
                          // Extract the substring from the Line property
                          const lineSubstring = item.Line.substring(0, 5); // Adjust the index as needed

                          return (
                            <div key={index} className="col-md-1">
                              <button
                                className="btn btn-warning text-center"
                                style={{
                                  backgroundColor:
                                    item.NG === null
                                      ? "#555555"
                                      : item.NG > 3
                                      ? "red"
                                      : "green",
                                  color: "white",
                                  padding: "10px",
                                  margin: "8px",
                                  width: "100px", // Set a fixed width for the button
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
                                      title: "Error Line " + item.Line,
                                      html: `
                                        <div>
                                          <div>

                                         
                                          <div>
                                          <span  style="color: black;font-weight: bold;">Actual Input: </span>
                                          <span style="color: green;font-weight: bold;">${
                                            item["Actual&NG"]
                                          }</span>
                                          <span  style="color: black;font-weight: bold;">Qty </span>
                                        </div>
                                            <span   style="color: black;font-weight: bold;">Cho-ko-tei:</span>

                                            <span  style="color: red; font-weight: bold;">
                                            ${
                                              processItem.TotalPercent !== null
                                                ? processItem.TotalPercent.toFixed(
                                                    2
                                                  )
                                                : "0"
                                            }%
                                          </span>
                                          
                                          </div>
                                          <div>
                                            <p>${processItem.Process}</p>
                                          </div>
                                          <div>
                                            <span style="color: black;font-weight: bold;">Total error:</span>
                                            <span style="color: red;font-weight: bold;">${
                                              processItem["Total NG"]
                                            }</span>
                                            <span style="color: black; font-weight: bold;">time</span>
                                          </div>
                                        </div>
                                      `,
                                      icon: "info",
                                      showCloseButton: true,
                                      showConfirmButton: true,
                                      confirmButtonText: "Cho-ko-tei",
                                      showCancelButton: true,
                                      cancelButtonText: "Close",
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                        onClose(
                                          this.props.history,
                                          item,
                                          this.state.startDate
                                        );
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
                                <h2>{lineSubstring}</h2>
                                <p>
                                  {Number(item.NG).toLocaleString(undefined, {
                                    maximumFractionDigits: 2,
                                  })}
                                  %
                                </p>
                              </button>
                            </div>
                          );
                        })}
                    </div>
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
                          ZONE 3
                        </label>
                      </div>
                      {this.state.Raw_Dat.filter(
                        (item) => item.Line.substring(0, 1) === "3"
                      ) // Filter items for ZONE 1
                        .map((item, index) => {
                          // Extract the substring from the Line property
                          const lineSubstring = item.Line.substring(0, 5); // Adjust the index as needed

                          return (
                            <div key={index} className="col-md-1">
                              <button
                                className="btn btn-warning text-center"
                                style={{
                                  backgroundColor:
                                    item.NG === null
                                      ? "#555555"
                                      : item.NG > 3
                                      ? "red"
                                      : "green",
                                  color: "white",
                                  padding: "10px",
                                  margin: "8px",
                                  width: "100px", // Set a fixed width for the button
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
                                      title: "Error Line " + item.Line,
                                      html: `
                                        <div>
                                          <div>

                                         
                                          <div>
                                          <span  style="color: black;font-weight: bold;">Actual Input: </span>
                                          <span style="color: green;font-weight: bold;">${
                                            item["Actual&NG"]
                                          }</span>
                                          <span  style="color: black;font-weight: bold;">Qty </span>
                                        </div>
                                            <span   style="color: black;font-weight: bold;">Cho-ko-tei:</span>

                                            <span  style="color: red; font-weight: bold;">
                                            ${
                                              processItem.TotalPercent !== null
                                                ? processItem.TotalPercent.toFixed(
                                                    2
                                                  )
                                                : "0"
                                            }%
                                          </span>
                                          
                                          </div>
                                          <div>
                                            <p>${processItem.Process}</p>
                                          </div>
                                          <div>
                                            <span style="color: black;font-weight: bold;">Total error:</span>
                                            <span style="color: red;font-weight: bold;">${
                                              processItem["Total NG"]
                                            }</span>
                                            <span style="color: black; font-weight: bold;">time</span>
                                          </div>
                                        </div>
                                      `,
                                      icon: "info",
                                      showCloseButton: true,
                                      showConfirmButton: true,
                                      confirmButtonText: "Cho-ko-tei",
                                      showCancelButton: true,
                                      cancelButtonText: "Close",
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                        onClose(
                                          this.props.history,
                                          item,
                                          this.state.startDate
                                        );
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
                                <h2>{lineSubstring}</h2>
                                <p>
                                  {Number(item.NG).toLocaleString(undefined, {
                                    maximumFractionDigits: 2,
                                  })}
                                  %
                                </p>
                              </button>
                            </div>
                          );
                        })}
                    </div>
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
                          ZONE 4
                        </label>
                      </div>
                      {this.state.Raw_Dat.filter(
                        (item) => item.Line.substring(0, 1) === "4"
                      ) // Filter items for ZONE 1
                        .map((item, index) => {
                          // Extract the substring from the Line property
                          const lineSubstring = item.Line.substring(0, 5); // Adjust the index as needed

                          return (
                            <div key={index} className="col-md-1">
                              <button
                                className="btn btn-warning text-center"
                                style={{
                                  backgroundColor:
                                    item.NG === null
                                      ? "#555555"
                                      : item.NG > 3
                                      ? "red"
                                      : "green",
                                  color: "white",
                                  padding: "10px",
                                  margin: "8px",
                                  width: "100px", // Set a fixed width for the button
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
                                      title: "Error Line " + item.Line,
                                      html: `
                                        <div>
                                          <div>

                                         
                                          <div>
                                          <span  style="color: black;font-weight: bold;">Actual Input: </span>
                                          <span style="color: green;font-weight: bold;">${
                                            item["Actual&NG"]
                                          }</span>
                                          <span  style="color: black;font-weight: bold;">Qty </span>
                                        </div>
                                            <span   style="color: black;font-weight: bold;">Cho-ko-tei:</span>

                                            <span  style="color: red; font-weight: bold;">
                                            ${
                                              processItem.TotalPercent !== null
                                                ? processItem.TotalPercent.toFixed(
                                                    2
                                                  )
                                                : "0"
                                            }%
                                          </span>
                                          
                                          </div>
                                          <div>
                                            <p>${processItem.Process}</p>
                                          </div>
                                          <div>
                                            <span style="color: black;font-weight: bold;">Total error:</span>
                                            <span style="color: red;font-weight: bold;">${
                                              processItem["Total NG"]
                                            }</span>
                                            <span style="color: black; font-weight: bold;">time</span>
                                          </div>
                                        </div>
                                      `,
                                      icon: "info",
                                      showCloseButton: true,
                                      showConfirmButton: true,
                                      confirmButtonText: "Cho-ko-tei",
                                      showCancelButton: true,
                                      cancelButtonText: "Close",
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                        onClose(
                                          this.props.history,
                                          item,
                                          this.state.startDate
                                        );
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
                                <h2>{lineSubstring}</h2>
                                <p>
                                  {Number(item.NG).toLocaleString(undefined, {
                                    maximumFractionDigits: 2,
                                  })}
                                  %
                                </p>
                              </button>
                            </div>
                          );
                        })}
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

export default percen_ng;
