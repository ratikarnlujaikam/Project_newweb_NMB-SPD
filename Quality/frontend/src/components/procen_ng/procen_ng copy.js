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
    this.setState(
      { countdownEnabled: true },
      () => {
        // Additional logic to handle the checked state
        this.startInterval();
        const currentDate = new Date().toISOString().split("T")[0];
        this.setState({ startDate: currentDate });
      }
    );
  };
  doGetDataReport = async () => {
    const result = await httpClient.get(
      server.percen_ng_URL 
    );
    console.log(result);

    let rawData = result.data.listRawData;
    console.log(rawData[0][0].NG);

    console.log(rawData.length);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat: rawData[0] });
    console.log(this.state.Raw_Dat);

    this.setState({
      report: result.data.result,
      rawData,

      isDisable: false,
    });


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

  render() {

    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 10 }}>
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
              <div className="card-body">
                <div className="row">{/* Select Critiria "Year" */}</div>
              </div>

              <div className="row">
  
                <div className="col-10">
                  <div className="row" style={{ marginBottom: "5px" }}>

                    <label>Refrash Auto</label>
                   

                    
                      <p>
                        {Math.floor(this.state.countdownTime / 60)} :{" "}
                        {this.state.countdownTime % 60}
                      </p>
                   
                  </div>

                  {this.state.rawData.map((data, index) => (
                    <div key={index} className="row">
         
                      <div className="col-md-2">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[0].NG > 5 ? "red" : "green",
                          }}
                        >
                          <h2 style={{ color: "white" }}>{data[0].Line}</h2>
                          <h2 style={{ color: "white" }}>
                            {Number(data[0].NG).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}%
                          </h2>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[1].NG > 5 ? "red" : "green",
                          }}
                        >
                          <h2 style={{ color: "white" }}>{data[1].Line}</h2>
                          <h2 style={{ color: "white" }}>
                            {Number(data[1].NG).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}%
                          </h2>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[2].NG > 5 ? "red" : "green",
                          }}
                        >
                          <h2 style={{ color: "white" }}>{data[2].Line}</h2>
                          <h2 style={{ color: "white" }}>
                            {Number(data[2].NG).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}%
                          </h2>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[3].NG > 5 ? "red" : "green",
                          }}
                        >
                          <h2 style={{ color: "white" }}>{data[3].Line}</h2>
                          <h2 style={{ color: "white" }}>
                            {Number(data[3].NG).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}%
                          </h2>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[4].NG > 5 ? "red" : "green",
                          }}
                        >
                          <h2 style={{ color: "white" }}>{data[4].Line}</h2>
                          <h2 style={{ color: "white" }}>
                            {Number(data[4].NG).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}%
                          </h2>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[5].NG > 5 ? "red" : "green",
                          }}
                        >
                          <h2 style={{ color: "white" }}>{data[5].Line}</h2>
                          <h2 style={{ color: "white" }}>
                            {Number(data[5].NG).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}%
                          </h2>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[6].NG > 5 ? "red" : "green",
                          }}
                        >
                          <h2 style={{ color: "white" }}>{data[6].Line}</h2>
                          <h2 style={{ color: "white" }}>
                            {Number(data[6].NG).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}%
                          </h2>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[7].NG > 5 ? "red" : "green",
                          }}
                        >
                          <h2 style={{ color: "white" }}>{data[7].Line}</h2>
                          <h2 style={{ color: "white" }}>
                            {Number(data[7].NG).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}%
                          </h2>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[8].NG > 5 ? "red" : "green",
                          }}
                        >
                          <h2 style={{ color: "white" }}>{data[8].Line}</h2>
                          <h2 style={{ color: "white" }}>
                            {Number(data[8].NG).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}%
                          </h2>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[9].NG > 5 ? "red" : "green",
                          }}
                        >
                          <h2 style={{ color: "white" }}>{data[9].Line}</h2>
                          <h2 style={{ color: "white" }}>
                            {Number(data[9].NG).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}%
                          </h2>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[10].NG > 5 ? "red" : "green",
                          }}
                        >
                          <h2 style={{ color: "white" }}>{data[10].Line}</h2>
                          <h2 style={{ color: "white" }}>
                            {Number(data[10].NG).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}%
                          </h2>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[11].NG > 5 ? "red" : "green",
                          }}
                        >
                          <h2 style={{ color: "white" }}>{data[11].Line}</h2>
                          <h2 style={{ color: "white" }}>
                            {Number(data[11].NG).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}%
                          </h2>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[12].NG > 5 ? "red" : "green",
                          }}
                        >
                          <h2 style={{ color: "white" }}>{data[12].Line}</h2>
                          <h2 style={{ color: "white" }}>
                            {Number(data[12].NG).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}%
                          </h2>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[13].NG > 5 ? "red" : "green",
                          }}
                        >
                          <h2 style={{ color: "white" }}>{data[13].Line}</h2>
                          <h2 style={{ color: "white" }}>
                            {Number(data[13].NG).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}%
                          </h2>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[14].NG > 5 ? "red" : "green",
                          }}
                        >
                          <h2 style={{ color: "white" }}>{data[14].Line}</h2>
                          <h2 style={{ color: "white" }}>
                            {Number(data[14].NG).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}%
                          </h2>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[15].NG > 5 ? "red" : "green",
                          }}
                        >
                          <h2 style={{ color: "white" }}>{data[15].Line}</h2>
                          <h2 style={{ color: "white" }}>
                            {Number(data[15].NG).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}%
                          </h2>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[16].NG > 5 ? "red" : "green",
                          }}
                        >
                          <h2 style={{ color: "white" }}>{data[16].Line}</h2>
                          <h2 style={{ color: "white" }}>
                            {Number(data[16].NG).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}%
                          </h2>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[17].NG > 5 ? "red" : "green",
                          }}
                        >
                          <h2 style={{ color: "white" }}>{data[17].Line}</h2>
                          <h2 style={{ color: "white" }}>
                            {Number(data[17].NG).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}%
                          </h2>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[18].NG > 5 ? "red" : "green",
                          }}
                        >
                          <h2 style={{ color: "white" }}>{data[18].Line}</h2>
                          <h2 style={{ color: "white" }}>
                            {Number(data[18].NG).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}%
                          </h2>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[19].NG > 5 ? "red" : "green",
                          }}
                        >
                          <h2 style={{ color: "white" }}>{data[19].Line}</h2>
                          <h2 style={{ color: "white" }}>
                            {Number(data[19].NG).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}%
                          </h2>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[20].NG > 5 ? "red" : "green",
                          }}
                        >
                          <h2 style={{ color: "white" }}>{data[20].Line}</h2>
                          <h2 style={{ color: "white" }}>
                            {Number(data[20].NG).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}%
                          </h2>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[21].NG > 5 ? "red" : "green",
                          }}
                        >
                          <h2 style={{ color: "white" }}>{data[21].Line}</h2>
                          <h2 style={{ color: "white" }}>
                            {Number(data[21].NG).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}%
                          </h2>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[22].NG > 5 ? "red" : "green",
                          }}
                        >
                          <h2 style={{ color: "white" }}>{data[22].Line}</h2>
                          <h2 style={{ color: "white" }}>
                            {Number(data[22].NG).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}%
                          </h2>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[23].NG > 5 ? "red" : "green",
                          }}
                        >
                          <h2 style={{ color: "white" }}>{data[23].Line}</h2>
                          <h2 style={{ color: "white" }}>
                            {Number(data[23].NG).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}%
                          </h2>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[24].NG > 5 ? "red" : "green",
                          }}
                        >
                          <h2 style={{ color: "white" }}>{data[24].Line}</h2>
                          <h2 style={{ color: "white" }}>
                            {Number(data[24].NG).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}%
                          </h2>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[25].NG > 5 ? "red" : "green",
                          }}
                        >
                          <h2 style={{ color: "white" }}>{data[25].Line}</h2>
                          <h2 style={{ color: "white" }}>
                            {Number(data[25].NG).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}%
                          </h2>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[26].NG > 5 ? "red" : "green",
                          }}
                        >
                          <h2 style={{ color: "white" }}>{data[26].Line}</h2>
                          <h2 style={{ color: "white" }}>
                            {Number(data[26].NG).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}%
                          </h2>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[27].NG > 5 ? "red" : "green",
                          }}
                        >
                          <h2 style={{ color: "white" }}>{data[27].Line}</h2>
                          <h2 style={{ color: "white" }}>
                            {Number(data[27].NG).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}%
                          </h2>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[28].NG > 5 ? "red" : "green",
                          }}
                        >
                          <h2 style={{ color: "white" }}>{data[28].Line}</h2>
                          <h2 style={{ color: "white" }}>
                            {Number(data[28].NG).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}%
                          </h2>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[29].NG > 5 ? "red" : "green",
                          }}
                        >
                          <h2 style={{ color: "white" }}>{data[29].Line}</h2>
                          <h2 style={{ color: "white" }}>
                            {Number(data[29].NG).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}%
                          </h2>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[29].NG > 5 ? "red" : "green",
                          }}
                        >
                          <h2 style={{ color: "white" }}>{data[29].Line}</h2>
                          <h2 style={{ color: "white" }}>
                            {Number(data[29].NG).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}%
                          </h2>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[30].NG > 5 ? "red" : "green",
                          }}
                        >
                          <h2 style={{ color: "white" }}>{data[30].Line}</h2>
                          <h2 style={{ color: "white" }}>
                            {Number(data[30].NG).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}%
                          </h2>
                        </div>
                      </div>
                     
                    
                    </div>
                  ))}

                  {/* Insert Xbar Chart */}
      
                </div>
              </div>

              {/* Table*/}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Procen_ng;
