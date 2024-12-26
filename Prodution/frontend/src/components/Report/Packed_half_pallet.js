import React, { Component } from "react";
import { key, server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import moment from "moment";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";
import ReactApexChart from "react-apexcharts";

function Refresh() {
  window.location.reload(false);
}

class Packed_half_pallet extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      year: [],
      Month: [],
      Model: [],
      Line: [],
      insType: [],
      report: [],
      report2: [],
      report3: [],
      report4: [],
      options: {},   
      chart: [],
      lotqanumber: [],
      seriesY: [],
      Raw_Dat1: [],
      Raw_Dat2: [],
      Raw_Dat3: [],
      startDate: moment().format("yyyy-MM-DD"), //moment().add("days", -6).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"), //moment().format("yyyy-MM-DD"),
      listModel: [],
      listLine: [],

      optionSelected: null,
      isDisable: false,
    };
  }

 

  componentDidMount = async () => {
    let command = await httpClient.get(server.HOLDPALLETSUM_URL);
    this.setState({ report: command.data.result });

    let rawData = command.data.listRawData;
    console.log(rawData);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat1: rawData[0] });
    console.log(this.state.Raw_Dat1);

    this.setState({
      report: command.data.result,
      isDisable: false,
    });

    let command1 = await httpClient.get(server.HOLDPALLETDETAIL_URL);
    this.setState({ report2: command1.data.result });

    let rawData1 = command1.data.listRawData;
    console.log(rawData);
    for (let i = 1; i < rawData1.length; i++) {
      rawData1[0].push(...rawData1[i]);
    }
    this.setState({ Raw_Dat2: rawData1[0] });
    console.log(this.state.Raw_Dat2);

    this.setState({
      report2: command1.data.result,
      isDisable: false,
    });

    
    let result1 = await httpClient.get(server.HOLDPALLETSUM_URL);
    let xAxis = [];
    for (let index = 0; index < result1.data.resultGraph.length; index++) {
      const item = result1.data.resultGraph[index];
      await xAxis.push(item.ModelGroup);
    }

    let yAxis = result1.data.QTY;

    this.setState({
      report3: result1.data.resultGraph,
      xAxis,
      yAxis,

      // series,

      isDisable: false,
    });

    await this.setState({
      seriesY: [
        {
          name: "ModelGroup",
          type: "column",
          data: yAxis,
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
          text: "Packed Half Pallet(Summary)",
          align: "center",
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [],
        },
        xaxis: {
          type: "date",
          categories: xAxis,
        },
        yaxis: [
          {
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: "#ff1a1a",
            },
            labels: {
              style: {
                colors: "#ff1a1a",
              },
            },
            title: {
              text: "QTY",
              style: {
                color: "#ff1a1a",
              },
            },
            tooltip: {
              enabled: true,
            },
          },
        ],
        colors: [
          // Cleanroom Rej
          "#3399ff",
          // FDB Rej%
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
        legend: {
          position: 'right',
          offsetY: 40
        },
        fill: {
          opacity: 1,
        },
      },
    });

  await this.getModel();
  };

  // componentDidMount = async () => {
  //   await this.getModel();
  // };

  doGetHoldPalletbylotqa = async () => {
    const result = await httpClient.get(
      server.HOLDPALLETBYLOTQA_URL + "/" + this.state.lotqanumber
    );
    let rawData = result.data.listRawData3;
    console.log(rawData);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat3: rawData[0] });
    console.log(this.state.Raw_Dat3);

    this.setState({
      report4: result.data.result,
      isDisable: false,
    });
  };
  // getModel = async () => {
  //   const array = await httpClient.get(server.HOLDPALLETBYMODEL_URL);
  //   const options = array.data.result.map((d) => ({
  //     label: d.ModelGroup,
  //   }));
  //   this.setState({ listModel: options });
  // };

  renderreport1 = () => {
    if (this.state.report != null) {
      if (this.state.report.length > 0) {
        return this.state.report.map((item) => (
          <tr Align="Center">
            <td align="Left">{item["ModelGroup"]}</td>
            <td align="Left">{item["ModelNumber"]}</td>
            <td align="Left">{item["LotQty"]}</td>

            <td>
              {Number(item["QTY"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
          </tr>
        ));
      }
    }
  };
  renderreport2 = () => {
    if (this.state.report2 != null) {
      if (this.state.report2.length > 0) {
        return this.state.report2.map((item) => (
          <tr Align="Center">
            <td align="Left">{item["ModelGroup"]}</td>
            <td align="Left">{item["ModelNumber"]}</td>
            <td align="Left">{item["QA_no"]}</td>
            <td align="Left">{item["MfgDate"]}</td>
            <td>
              {Number(item["MOQTY"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            
            <td align="Left">{item["Line_No"]}</td>
            <td align="Left">{item["Base"]}</td>
            <td align="Left">{item["Ramp"]}</td>
            <td align="Left">{item["Hub"]}</td>
            <td align="Left">{item["Magnet"]}</td>
            <td align="Left">{item["FPC"]}</td>
            <td align="Left">{item["Diverter"]}</td>
            <td align="Left">{item["Crash_Stop"]}</td>
           
            <td align="Left">{item["SpecialControl1"]}</td>
            <td align="Left">{item["SpecialControl2"]}</td>
            <td align="Left">{item["SpecialControl3"]}</td>
            <td align="Left">{item["SpecialControl4"]}</td>
            <td align="Left">{item["SpecialControl5"]}</td>
            <td align="Left">{item["Remark"]}</td>
            <td align="Left">{item["Time"]}</td>
            <td align="Left">{item["Lotsize"]}</td>
            <td align="Left">{item["ModelName"]}</td>
            <td align="Left">{item["Rev"]}</td>
          </tr>
        ));
      }
    }
  };
  renderreport3 = () => {
    if (this.state.report4 != null) {
      if (this.state.report4.length > 0) {
        return this.state.report4.map((item) => (
          <tr Align="Center">
        <td align="Left">{item["ModelGroup"]}</td>
            <td align="Left">{item["ModelNumber"]}</td>
            <td align="Left">{item["QA_no"]}</td>
            <td align="Left">{item["MfgDate"]}</td>
            <td>
              {Number(item["MOQTY"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td align="Left">{item["Line_No"]}</td>
            
            <td align="Left">{item["Base"]}</td>
            <td align="Left">{item["Ramp"]}</td>
            <td align="Left">{item["Hub"]}</td>
            <td align="Left">{item["Magnet"]}</td>
            <td align="Left">{item["FPC"]}</td>
            <td align="Left">{item["Diverter"]}</td>
            <td align="Left">{item["Crash_Stop"]}</td>
           
            <td align="Left">{item["SpecialControl1"]}</td>
            <td align="Left">{item["SpecialControl2"]}</td>
            <td align="Left">{item["SpecialControl3"]}</td>
            <td align="Left">{item["SpecialControl4"]}</td>
            <td align="Left">{item["SpecialControl5"]}</td>
            <td align="Left">{item["Remark"]}</td>
            <td align="Left">{item["Time"]}</td>
            <td align="Left">{item["Lotsize"]}</td>
            <td align="Left">{item["ModelName"]}</td>
            <td align="Left">{item["Rev"]}</td>
          </tr>
        ));
      }
    }
  }
  // renderreport1 = () => {
  //   if (this.state.report != null) {
  //     if (this.state.report.length > 0) {
  //       return this.state.report.map((item) => (
  //         <tr Align="Center">
  //           <td align="Left">{item["ModelGroup"]}</td>
  //           <td align="Left">{item["ModelNumber"]}</td>
  //           <td align="Left">{item["QA_no"]}</td>
  //           <td align="Left">{item["MfgDate"].toUpperCase()}</td>
  //           <td align="Left">{item["MOQTY"].toUpperCase()}</td>

  //         </tr>
  //       ));
  //     }
  //   }
  // };
  // renderreport2 = () => {
  //   if (this.state.report2 != null) {
  //     if (this.state.report2.length > 0) {
  //       return this.state.report2.map((item) => (
  //         <tr Align="Center">
  //           <td align="Left">{item["QA_no"]}</td>
  //           <td align="Left">{item["MfgDate"]}</td>
  //           <td align="Left">{item["ModelGroup"]}</td>
  //           <td align="Left">{item["ModelNumber"].toUpperCase()}</td>
  //           <td align="Left">{item["MONumber"]}</td>
  //           <td align="Left">{item["DateCode"].toUpperCase()}</td>
  //           <td align="Left">{item["MOQTY"].toUpperCase()}</td>
  //           <td align="Left">{item["Line_No"]}</td>
  //           <td align="Left">{item["SupporterName"].toUpperCase()}</td>
  //           <td align="Left">{item["Base"].toUpperCase()}</td>
  //           <td align="Left">{item["Ramp"].toUpperCase()}</td>
  //           <td align="Left">{item["Hub"].toUpperCase()}</td>
  //           <td align="Left">{item["Magnet"].toUpperCase()}</td>
  //           <td align="Left">{item["FPC"].toUpperCase()}</td>
  //           <td align="Left">{item["Diverter"].toUpperCase()}</td>
  //           <td align="Left">{item["Crash_Stop"]}</td>
  //           <td align="Left">{item["CO2"].toUpperCase()}</td>
  //           <td align="Left">{item["CO2_EMP"].toUpperCase()}</td>
  //           <td align="Left">{item["CO2_DATE"].toUpperCase()}</td>
  //           <td align="Left">{item["SpecialControl1"]}</td>
  //           <td align="Left">{item["SpecialControl2"]}</td>
  //           <td align="Left">{item["SpecialControl3"]}</td>
  //           <td align="Left">{item["SpecialControl4"]}</td>
  //           <td align="Left">{item["SpecialControl5"]}</td>
  //           <td align="Left">{item["Remark"]}</td>
  //           <td align="Left">{item["Time"]}</td>
  //           <td align="Left">{item["Lotsize"]}</td>
  //           <td align="Left">{item["ModelName"]}</td>
  //           <td align="Left">{item["Rev"]}</td>
  //         </tr>
  //       ));
  //     }
  //   }
  // };
  getModel = async () => {
    const array = await httpClient.get(server.MODELPACKPALLET_URL);
    const options = array.data.result.map((d) => ({
      label: d.Model_group,
    }));
    this.setState({ listModel: options });
  };

  render() {
    console.log(this.state.report);
    console.log(this.state.report2);
    console.log(this.state.xAxis);

    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 80 }}>
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-3">
                <h2>Packing Pallet in progress</h2>
              </div>
              <div className="col-sm-4">
                <button
                  onClick={Refresh}
                  type="button"
                  className="btn btn-primary"
                >
                  <i className="fas fa-sync" />
                  Refresh
                </button>
              </div>

              <div className="col-sm-5">
                <section className="content-header">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">
                    Packing Pallet in progress
                    </li>
                  </ol>
                </section>
              </div>
            </div>
          </div>
        </div>
        <div class="container-fluid">
          <div className="row">
            <div className="col-12">
              {/* <div className="card card-primary card-outline">
                <div className="card-header">
                  <h3 className="card-title">
                    <h3>Hold Final ass’y</h3>
                  </h3>
                </div>
              </div> */}
              <div className="content" style={{ paddingTop: 5 }}>
                <section className="content-header">
                  <div className="container-fluid">
                    <div className="row mb-1">
                      <div className="col-sm-4">
                        <h1>Packed Half Pallet(Summary)</h1>
                      </div>
                      <div className="col-sm-2">
                        <CSVLink
                          data={this.state.Raw_Dat1}
                          filename={"Packed Half Pallet(Summary).csv"}
                        >
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ marginTop: 1 }}
                          >
                            Download
                          </button>
                        </CSVLink>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
              <div className="row mb-2">
                <div className="col-sm-6">
                  <div className="row"></div>
                </div>
              </div>

              <div className="row">
                <div className="col-6">
                  <div class="content">
                    <div class="container-fluid">
                      <div className="card card-primary">
                        <div
                          className="card-body table-responsive p-0"
                          style={{ height: 400 }}
                        >
                          <table className="table table-head-fixed text-nowrap table-hover">
                            <thead>
                              <tr align="center">
                                <th width="120">Model Group</th>
                                <th width="120">Model Number</th>
                                <th width="120">LotQty</th>
                                <th width="120">MO Qty</th>
                              </tr>
                            </thead>
                            <tbody>{this.renderreport1()}</tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="row" style={{ width: "100%" }}>
                    <div style={{ width: "1%" }}></div>
                    <div className="card card-warning" style={{ width: "99%" }}>
                      <div className="card-body">
                        <div className="row">
                          <div style={{ width: "100%" }}>
                            <ReactApexChart
                              options={this.state.options}
                              series={this.state.seriesY}
                              type="bar"
                              height={350}
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
          <div class="container-fluid" style={{ paddingTop: 30 }}>
        <h3>Packed Half Pallet by Lot QA  </h3>
          <div className="row">
            <div className="col-12">
            <div className="card card-primary card-outline">
                <div className="card-header">
                  <h3 className="card-title">
                    <label>Input Lot QA</label>
                  </h3>
                </div>
                {/* select model */}
                <div className="card-body">
                  <div className="row">
                    {/* //Select Critiria "Model" */}
                    <div className="col-md-4">
                      <div style={{ marginTop: 10 }} className="input-group ">
                        <input
                          value={this.state.lotqanumber}
                          onChange={async (e) => {
                            await this.setState({
                              lotqanumber: e.target.value,
                            });
                          }}
                          type="text"
                          className="form-control"
                          placeholder="Input lotqanumber hear"
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
                              await this.doGetHoldPalletbylotqa();
                              setTimeout(() => {
                                Swal.close();
                              },1000)
                             
                            },
                          }).then(() => {
                            if (this.state.report4.length > 0) {
                              if (this.state.report4[0].QA_no.length > 0) {
                                Swal.fire({
                                  icon: "success",
                                  title: "Success",
                                  text: "Data has been loaded successfully",
                                });
                              } else if (
                                this.state.report4[0].Model.length == 0
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
                        style={{ marginTop: 10 }}
                      >
                        Submit
                      </button>
                    </div>
                    <div style={{ marginTop: 10 }} className="col-md-1">
                      <a
                        href="/Home"
                        class="btn btn-primary"
                        role="button"
                        aria-pressed="true"
                      >
                        Back
                      </a>
                    </div>
                    <div style={{ marginTop: 10 }} className="col-md-2">
                      <CSVLink
                        data={this.state.Raw_Dat3}
                        filename={"Shipment data by Lot QA.csv"}
                      >
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ marginTop: 1 }}
                        >
                          Download by Lot QA
                        </button>
                      </CSVLink>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div class="content">
                    <div class="container-fluid">
                      <div className="card card-primary">
                        <div
                          className="card-body table-responsive p-0"
                          style={{ height: 400 }}
                        >
                          <table className="table table-fixed text-nowrap table-hover">
                            <thead>
                              <tr align="center">
                              <th width="120">Model Group</th>
                                <th width="120">Model Number</th>
                                <th width="120">QA No.</th>
                                <th width="120">Mfg Date</th>
                                <th width="120">Mo Qty</th>
                                <th width="120">Line No.</th>
                                
                                <th width="120">Base</th>
                                <th width="120">Ramp</th>
                                <th width="120">Hub</th>
                                <th width="120">Magnet</th>
                                <th width="120">FPC</th>
                                <th width="120">Diverter</th>
                                <th width="120">Crashstop</th>
                                
                                <th width="120">SP1</th>
                                <th width="120">SP2</th>
                                <th width="120">SP3</th>
                                <th width="120">SP4</th>
                                <th width="120">SP5</th>
                                <th width="120">Remark</th>
                                <th width="120">Time</th>
                                <th width="120">Lot size</th>
                                <th width="120">Model Name</th>
                                <th width="120">Rev</th>
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
            </div>
          </div>
        </div>

          <div className="content" style={{ paddingTop: 5 }}>
            <section className="content-header">
              <div className="container-fluid">
                <div className="row mb-1">
                  <div className="col-sm-3">
                    <h1>Packed Half Pallet (Detail)</h1>
                  </div>
                  <div className="col-sm-6">
                    <CSVLink
                      data={this.state.Raw_Dat2}
                      filename={"Packed Half Pallet Detail.csv"}
                    >
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ marginTop: 1 }}
                      >
                        Download
                      </button>
                    </CSVLink>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div class="content">
            <div class="container-fluid">
              <div className="row">
                <div className="col-12">
                  <div class="content">
                    <div class="container-fluid">
                      <div className="card card-primary">
                        <div
                          className="card-body table-responsive p-0"
                          style={{ height: 400 }}
                        >
                          <table className="table table-head-fixed text-nowrap table-hover">
                            <thead>
                              <tr align="center">
                                <th width="120">Model Group</th>
                                <th width="120">Model Number</th>
                                <th width="120">QA No.</th>
                                <th width="120">Mfg Date</th>
                                <th width="120">Mo Qty</th>
                                <th width="120">Line No.</th>
                                
                                <th width="120">Base</th>
                                <th width="120">Ramp</th>
                                <th width="120">Hub</th>
                                <th width="120">Magnet</th>
                                <th width="120">FPC</th>
                                <th width="120">Diverter</th>
                                <th width="120">Crashstop</th>
                                
                                <th width="120">SP1</th>
                                <th width="120">SP2</th>
                                <th width="120">SP3</th>
                                <th width="120">SP4</th>
                                <th width="120">SP5</th>
                                <th width="120">Remark</th>
                                <th width="120">Time</th>
                                <th width="120">Lot size</th>
                                <th width="120">Model Name</th>
                                <th width="120">Rev</th>
                              </tr>
                            </thead>
                            <tbody>{this.renderreport2()}</tbody>
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

export default Packed_half_pallet;
