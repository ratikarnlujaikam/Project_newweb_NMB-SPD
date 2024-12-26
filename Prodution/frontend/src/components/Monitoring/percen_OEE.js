import React, { Component } from "react";
import { key, server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import moment from "moment";
import Swal from "sweetalert2";


//npm install @mui/material @emotion/react @emotion/styled

class percen_OEE extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      Raw_Dat: [],
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
      const result = await httpClient.get(server.percen_OEE_URL);
      //console.log(result);

      let rawData = result.data.listRawData;
      //console.log(rawData[0][0].NG);

      const result_1Array = result.data.result_1;
      //console.log(result_1Array);

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
      //console.log("Input Line:", line);
      //console.log("Input Data:", result_1Array);

      const filteredResults = result_1Array.filter(
        (item) => item.Line.trim().toLowerCase() === line.trim().toLowerCase()
      );

      const sortedResults = filteredResults.sort((a, b) => b["%NG"] - a["%NG"]);

      //console.log("Filtered and Sorted Results:", sortedResults);

      if (sortedResults.length === 0) {
        return {
          Process: "N/A",
          "Total NG": 0,
        };
      }

      const aggregatedValues = sortedResults.reduce(
        (acc, curr) => {
          acc.Total += (
            <span style="color: red; font-weight: bold;">${curr["Total"]}</span>
          );

          acc.Process += `
            <span style="color: black; font-weight: bold;">${curr.Process.padEnd(
              20
            )}:</span>
            <span style="color: red; font-weight: bold;">${curr["Total NG"]
              .toString()
              .padEnd(10)} </span>
            <span style="color: black; font-weight: bold;"> Qty</span>
            <span style="color: red; font-weight: bold;">${curr["%NG"].toFixed(
              2
            )}%</span>
            <br>`;

          acc.TotalNG += curr["Total NG"];
          return acc;
        },
        { Process: "", TotalNG: 0, Total: "" }
      );

      //console.log("Aggregated Values:", aggregatedValues);

      return {
        Process: aggregatedValues.Process.trim(),
        "Total NG": aggregatedValues.TotalNG,
        Total: aggregatedValues.Total,
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

        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="row">{/* Select Critiria "Year" */}</div>
                </div>
                <h1>Realtime OEE Dashboard Monitoring</h1>
                <div className="row">
                  <div className="card-body">
                    <div className="col-10">
                      <div className="row" style={{ marginBottom: "5px" }}>
                        <label>Refresh Auto </label>
                        <p>
                          {Math.floor(this.state.countdownTime / 60)} :{" "}
                          {this.state.countdownTime % 60}
                        </p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-1">
                        <label
                          className="btn btn-warning text-center"
                          style={{
                            padding: "10px",
                            margin: "10px",
                            width: "100%", // Set a fixed width for the button
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
                                  backgroundColor: item.Plan_Percentage === null ? "#555555" :
                                                   (item.Design === '3.5 inch SP' && item.Plan_Percentage > 85) ? "green" : 
                                                   (item.Design === '2.5 inch' || item.Design === '3.5 inch FCC') && item.Plan_Percentage > 90 ? "green" :
                                                   "red",
                                  color: "white",
                                  padding: "10px",
                                  margin: "8px",
                                  width: "100px", // Set a fixed width for the button
                              }}
                              
                                onClick={() => {
                                  if (item.Plan_Percentage !== null && item.Plan_Percentage !== undefined) {
                                    const processItem = filterResultByLine(item.Line, this.state.result_1Array);
                          
                                    //console.log("Clicked Item:", item);
                                    //console.log("Filtered Result:", processItem);
                          
                                    Swal.fire({
                                      title: `<a href="/Test_graph?&line=${encodeURIComponent(item.Line)}&startDate=${encodeURIComponent(this.state.startDate)}&to_link=${encodeURIComponent("OEE")}" title="link to Production Report's Traceability Web Page"><span style="color: blue; font-weight: bold;">Line ${item.Line}</span><br>`,

                                      html: `
                                      <span style="font-weight: bold; text-align: center; color: ${
                                        item.Plan_Percentage != null &&
                                        parseFloat (item.Design === '3.5 inch SP' && item.Plan_Percentage > 85) ? "green" : 
                                        (item.Design === '2.5 inch' || item.Design === '3.5 inch FCC') && item.Plan_Percentage > 90 ? "green" :
                                        "red"
                                      };">
                                        OEE ${
                                          item.Plan_Percentage != null
                                            ? parseFloat(item.Plan_Percentage).toFixed(2) +
                                              " %"
                                            : "N/A"
                                        }
                                      </span><br>
                                        <div>
                                          You can click to see details.
                                          <span style="margin-left: 5px;">🔍</span> <!-- Using emoji as icon -->
                                        </div>
                                        <div>
                                          <div>
                
                     
                                            <a href="/Compare_Output_Day?&line=${encodeURIComponent(item.Line)}&startDate=${encodeURIComponent(this.state.startDate)}&to_link=${encodeURIComponent("ok")}" title="link to %NG Daily's Summary Web Page">
                                              <span style="color: blue; font-weight: bold;">
                                                NG ${item.NG_Percentage != null ? parseFloat(item.NG_Percentage).toFixed(2) + '%' : 'N/A'}
                                              </span><br>
                                            </a>
                                            <a href="/graph_downtime_daily?&line=${encodeURIComponent(item.Line)}&startDate=${encodeURIComponent(this.state.startDate)}&to_link=${encodeURIComponent("ok")}" title="link to %NG Daily's Summary Web Page">
                                              <span style="color: blue; font-weight: bold;">
                                              DT ${item.DT_Percentage != null ? parseFloat(item.DT_Percentage).toFixed(2) + '%' : 'N/A'}
                                              </span><br>
                                            </a>

                                            <a href="/mc_percen_error?&line=${encodeURIComponent(item.Line)}&startDate=${encodeURIComponent(this.state.startDate)}&to_link=${encodeURIComponent("ok")}"title="Link to M/C Error Checking Web Page">
                                              <span style="color: blue; font-weight: bold;">
                                                CKT ${item.CKT_Percentage != null ? parseFloat(item.CKT_Percentage).toFixed(2) + '%' : 'N/A'}
                                              </span>
                                            </a><br>
                                            <span style="color: black; font-weight: bold; text-align: center;">
                                              Loss time ${item.Losstime_Percentage != null ? parseFloat(item.Losstime_Percentage).toFixed(2) + ' %' : 'N/A'}
                                            </span><br>
                                            <span style="color: black; font-weight: bold; text-align: center;">
                                              CT Loss ${item.CTLoss_Percentage != null ? parseFloat(item.CTLoss_Percentage).toFixed(2) + ' %' : 'N/A'}
                                            </span><br>
                                          </div>
                                        </div>
                                      `,
                                    }).then((result) => {
                                      if (result.dismiss !== Swal.DismissReason.cancel) {
                                        // "Close" button is clicked
                                        // Add your logic here if needed
                                        //console.log("Close button is clicked");
                                      }
                                    });
                                  } else {
                                    console.error("NG value is null or undefined");
                                  }
                                }}
                              >
                                <h2>{lineSubstring}</h2>{" "}
                                {/* Display the extracted substring */}
                                <p>
                                  {Number(item.Plan_Percentage).toLocaleString(undefined, {
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
                                  backgroundColor: item.Plan_Percentage === null ? "#555555" :
                                                   (item.Design === '3.5 inch SP' && item.Plan_Percentage > 85) ? "green" : 
                                                   (item.Design === '2.5 inch' || item.Design === '3.5 inch FCC') && item.Plan_Percentage > 90 ? "green" :
                                                   "red",
                                  color: "white",
                                  padding: "10px",
                                  margin: "8px",
                                  width: "100px", // Set a fixed width for the button
                              }}
                              
                                onClick={() => {
                                  if (item.Plan_Percentage !== null && item.Plan_Percentage !== undefined) {
                                    const processItem = filterResultByLine(item.Line, this.state.result_1Array);
                          
                                    //console.log("Clicked Item:", item);
                                    //console.log("Filtered Result:", processItem);
                          
                                    Swal.fire({
                                      title: `<a href="/Test_graph?&line=${encodeURIComponent(item.Line)}&startDate=${encodeURIComponent(this.state.startDate)}&to_link=${encodeURIComponent("OEE")}" title="link to Production Report's Traceability Web Page"><span style="color: blue; font-weight: bold;">Line ${item.Line}</span><br>`,

                                      html: `
                                      <span style="font-weight: bold; text-align: center; color: ${
                                        item.Plan_Percentage != null &&
                                        parseFloat (item.Design === '3.5 inch SP' && item.Plan_Percentage > 85) ? "green" : 
                                        (item.Design === '2.5 inch' || item.Design === '3.5 inch FCC') && item.Plan_Percentage > 90 ? "green" :
                                        "red"
                                      };">
                                        OEE ${
                                          item.Plan_Percentage != null
                                            ? parseFloat(item.Plan_Percentage).toFixed(2) +
                                              " %"
                                            : "N/A"
                                        }
                                      </span><br>
                                        <div>
                                          You can click to see details.
                                          <span style="margin-left: 5px;">🔍</span> <!-- Using emoji as icon -->
                                        </div>
                                        <div>
                                          <div>
                
                     
                                            <a href="/Compare_Output_Day?&line=${encodeURIComponent(item.Line)}&startDate=${encodeURIComponent(this.state.startDate)}&to_link=${encodeURIComponent("ok")}" title="link to %NG Daily's Summary Web Page">
                                              <span style="color: blue; font-weight: bold;">
                                                NG ${item.NG_Percentage != null ? parseFloat(item.NG_Percentage).toFixed(2) + '%' : 'N/A'}
                                              </span><br>
                                            </a>
                                            <a href="/graph_downtime_daily?&line=${encodeURIComponent(item.Line)}&startDate=${encodeURIComponent(this.state.startDate)}&to_link=${encodeURIComponent("ok")}" title="link to %NG Daily's Summary Web Page">
                                              <span style="color: blue; font-weight: bold;">
                                              DT ${item.DT_Percentage != null ? parseFloat(item.DT_Percentage).toFixed(2) + '%' : 'N/A'}
                                              </span><br>
                                            </a>

                                            <a href="/mc_percen_error?&line=${encodeURIComponent(item.Line)}&startDate=${encodeURIComponent(this.state.startDate)}&to_link=${encodeURIComponent("ok")}"title="Link to M/C Error Checking Web Page">
                                              <span style="color: blue; font-weight: bold;">
                                                CKT ${item.CKT_Percentage != null ? parseFloat(item.CKT_Percentage).toFixed(2) + '%' : 'N/A'}
                                              </span>
                                            </a><br>
                                            <span style="color: black; font-weight: bold; text-align: center;">
                                              Loss time ${item.Losstime_Percentage != null ? parseFloat(item.Losstime_Percentage).toFixed(2) + ' %' : 'N/A'}
                                            </span><br>
                                            <span style="color: black; font-weight: bold; text-align: center;">
                                              CT Loss ${item.CTLoss_Percentage != null ? parseFloat(item.CTLoss_Percentage).toFixed(2) + ' %' : 'N/A'}
                                            </span><br>
                                          </div>
                                        </div>
                                      `,
                                    }).then((result) => {
                                      if (result.dismiss !== Swal.DismissReason.cancel) {
                                        // "Close" button is clicked
                                        // Add your logic here if needed
                                        //console.log("Close button is clicked");
                                      }
                                    });
                                  } else {
                                    console.error("NG value is null or undefined");
                                  }
                                }}
                              >
                                <h2>{lineSubstring}</h2>{" "}
                                {/* Display the extracted substring */}
                                <p>
                                  {Number(item.Plan_Percentage).toLocaleString(undefined, {
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
                                  backgroundColor: item.Plan_Percentage === null ? "#555555" :
                                                   (item.Design === '3.5 inch SP' && item.Plan_Percentage > 85) ? "green" : 
                                                   (item.Design === '2.5 inch' || item.Design === '3.5 inch FCC') && item.Plan_Percentage > 90 ? "green" :
                                                   "red",
                                  color: "white",
                                  padding: "10px",
                                  margin: "8px",
                                  width: "100px", // Set a fixed width for the button
                              }}
                              
                                onClick={() => {
                                  if (item.Plan_Percentage !== null && item.Plan_Percentage !== undefined) {
                                    const processItem = filterResultByLine(item.Line, this.state.result_1Array);
                          
                                    //console.log("Clicked Item:", item);
                                    //console.log("Filtered Result:", processItem);
                          
                                    Swal.fire({
                                      title: `<a href="/Test_graph?&line=${encodeURIComponent(item.Line)}&startDate=${encodeURIComponent(this.state.startDate)}&to_link=${encodeURIComponent("OEE")}" title="link to Production Report's Traceability Web Page"><span style="color: blue; font-weight: bold;">Line ${item.Line}</span><br>`,

                                      html: `
                                      <span style="font-weight: bold; text-align: center; color: ${
                                        item.Plan_Percentage != null &&
                                        parseFloat (item.Design === '3.5 inch SP' && item.Plan_Percentage > 85) ? "green" : 
                                        (item.Design === '2.5 inch' || item.Design === '3.5 inch FCC') && item.Plan_Percentage > 90 ? "green" :
                                        "red"
                                      };">
                                        OEE ${
                                          item.Plan_Percentage != null
                                            ? parseFloat(item.Plan_Percentage).toFixed(2) +
                                              " %"
                                            : "N/A"
                                        }
                                      </span><br>
                                        <div>
                                          You can click to see details.
                                          <span style="margin-left: 5px;">🔍</span> <!-- Using emoji as icon -->
                                        </div>
                                        <div>
                                          <div>
                
                     
                                            <a href="/Compare_Output_Day?&line=${encodeURIComponent(item.Line)}&startDate=${encodeURIComponent(this.state.startDate)}&to_link=${encodeURIComponent("ok")}" title="link to %NG Daily's Summary Web Page">
                                              <span style="color: blue; font-weight: bold;">
                                                NG ${item.NG_Percentage != null ? parseFloat(item.NG_Percentage).toFixed(2) + '%' : 'N/A'}
                                              </span><br>
                                            </a>
                                            <a href="/graph_downtime_daily?&line=${encodeURIComponent(item.Line)}&startDate=${encodeURIComponent(this.state.startDate)}&to_link=${encodeURIComponent("ok")}" title="link to %NG Daily's Summary Web Page">
                                              <span style="color: blue; font-weight: bold;">
                                              DT ${item.DT_Percentage != null ? parseFloat(item.DT_Percentage).toFixed(2) + '%' : 'N/A'}
                                              </span><br>
                                            </a>

                                            <a href="/mc_percen_error?&line=${encodeURIComponent(item.Line)}&startDate=${encodeURIComponent(this.state.startDate)}&to_link=${encodeURIComponent("ok")}"title="Link to M/C Error Checking Web Page">
                                              <span style="color: blue; font-weight: bold;">
                                                CKT ${item.CKT_Percentage != null ? parseFloat(item.CKT_Percentage).toFixed(2) + '%' : 'N/A'}
                                              </span>
                                            </a><br>
                                            <span style="color: black; font-weight: bold; text-align: center;">
                                              Loss time ${item.Losstime_Percentage != null ? parseFloat(item.Losstime_Percentage).toFixed(2) + ' %' : 'N/A'}
                                            </span><br>
                                            <span style="color: black; font-weight: bold; text-align: center;">
                                              CT Loss ${item.CTLoss_Percentage != null ? parseFloat(item.CTLoss_Percentage).toFixed(2) + ' %' : 'N/A'}
                                            </span><br>
                                          </div>
                                        </div>
                                      `,
                                    }).then((result) => {
                                      if (result.dismiss !== Swal.DismissReason.cancel) {
                                        // "Close" button is clicked
                                        // Add your logic here if needed
                                        //console.log("Close button is clicked");
                                      }
                                    });
                                  } else {
                                    console.error("NG value is null or undefined");
                                  }
                                }}
                              >
                                <h2>{lineSubstring}</h2>{" "}
                                {/* Display the extracted substring */}
                                <p>
                                  {Number(item.Plan_Percentage).toLocaleString(undefined, {
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
                                  backgroundColor: item.Plan_Percentage === null ? "#555555" :
                                                   (item.Design === '3.5 inch SP' && item.Plan_Percentage > 85) ? "green" : 
                                                   (item.Design === '2.5 inch' || item.Design === '3.5 inch FCC') && item.Plan_Percentage > 90 ? "green" :
                                                   "red",
                                  color: "white",
                                  padding: "10px",
                                  margin: "8px",
                                  width: "100px", // Set a fixed width for the button
                              }}
                              
                                onClick={() => {
                                  if (item.Plan_Percentage !== null && item.Plan_Percentage !== undefined) {
                                    const processItem = filterResultByLine(item.Line, this.state.result_1Array);
                          
                                    //console.log("Clicked Item:", item);
                                    //console.log("Filtered Result:", processItem);
                          
                                    Swal.fire({
                                      title: `<a href="/Test_graph?&line=${encodeURIComponent(item.Line)}&startDate=${encodeURIComponent(this.state.startDate)}&to_link=${encodeURIComponent("OEE")}" title="link to Production Report's Traceability Web Page"><span style="color: blue; font-weight: bold;">Line ${item.Line}</span><br>`,

                                      html: `
                                      <span style="font-weight: bold; text-align: center; color: ${
                                        item.Plan_Percentage != null &&
                                        parseFloat (item.Design === '3.5 inch SP' && item.Plan_Percentage > 85) ? "green" : 
                                        (item.Design === '2.5 inch' || item.Design === '3.5 inch FCC') && item.Plan_Percentage > 90 ? "green" :
                                        "red"
                                      };">
                                        OEE ${
                                          item.Plan_Percentage != null
                                            ? parseFloat(item.Plan_Percentage).toFixed(2) +
                                              " %"
                                            : "N/A"
                                        }
                                      </span><br>
                                        <div>
                                          You can click to see details.
                                          <span style="margin-left: 5px;">🔍</span> <!-- Using emoji as icon -->
                                        </div>
                                        <div>
                                          <div>
                
                     
                                            <a href="/Compare_Output_Day?&line=${encodeURIComponent(item.Line)}&startDate=${encodeURIComponent(this.state.startDate)}&to_link=${encodeURIComponent("ok")}" title="link to %NG Daily's Summary Web Page">
                                              <span style="color: blue; font-weight: bold;">
                                                NG ${item.NG_Percentage != null ? parseFloat(item.NG_Percentage).toFixed(2) + '%' : 'N/A'}
                                              </span><br>
                                            </a>
                                            <a href="/graph_downtime_daily?&line=${encodeURIComponent(item.Line)}&startDate=${encodeURIComponent(this.state.startDate)}&to_link=${encodeURIComponent("ok")}" title="link to %NG Daily's Summary Web Page">
                                              <span style="color: blue; font-weight: bold;">
                                              DT ${item.DT_Percentage != null ? parseFloat(item.DT_Percentage).toFixed(2) + '%' : 'N/A'}
                                              </span><br>
                                            </a>

                                            <a href="/mc_percen_error?&line=${encodeURIComponent(item.Line)}&startDate=${encodeURIComponent(this.state.startDate)}&to_link=${encodeURIComponent("ok")}"title="Link to M/C Error Checking Web Page">
                                              <span style="color: blue; font-weight: bold;">
                                                CKT ${item.CKT_Percentage != null ? parseFloat(item.CKT_Percentage).toFixed(2) + '%' : 'N/A'}
                                              </span>
                                            </a>
                                            <br>
                                            <span style="color: black; font-weight: bold; text-align: center;">
                                              Loss time ${item.Losstime_Percentage != null ? parseFloat(item.Losstime_Percentage).toFixed(2) + ' %' : 'N/A'}
                                            </span><br>
                                            <span style="color: black; font-weight: bold; text-align: center;">
                                              CT Loss ${item.CTLoss_Percentage != null ? parseFloat(item.CTLoss_Percentage).toFixed(2) + ' %' : 'N/A'}
                                            </span><br>
                                          </div>
                                        </div>
                                      `,
                                    }).then((result) => {
                                      if (result.dismiss !== Swal.DismissReason.cancel) {
                                        // "Close" button is clicked
                                        // Add your logic here if needed
                                        //console.log("Close button is clicked");
                                      }
                                    });
                                  } else {
                                    console.error("NG value is null or undefined");
                                  }
                                }}
                              >
                                <h2>{lineSubstring}</h2>{" "}
                                {/* Display the extracted substring */}
                                <p>
                                  {Number(item.Plan_Percentage).toLocaleString(undefined, {
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

export default percen_OEE;
