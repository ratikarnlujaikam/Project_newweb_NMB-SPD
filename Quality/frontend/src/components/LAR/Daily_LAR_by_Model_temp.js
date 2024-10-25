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

class Daily_LAR_by_Model extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      year: [],
      Month: [],
      Model: { label: "**ALL**" },
      insType: [{ label: "**ALL**" }],
      Line: [{ label: "**ALL**" }],
      report: [],
      xAxis: [],
      yAxis: [],
      seriesY: [],
      series2: [],
      seriesCleanroom: [],
      options: {},
      options2: {},
      chart: [],
      result:[],
      Raw_Dat: [],

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

    await this.getModel();
    await this.getInsType();
    await this.getLine();
    await this.getMonth();
    await this.getyear();
  };

  doGetDataReport = async () => {
    const modelLabel =
    this.state.Model.label === "**ALL**" ? "**ALL**" : this.state.Model.label;
    const result = await httpClient.get(
      server.DEFECTNG_URL +
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
      xAxis,
      yAxis,
      yAxis1,
      yAxis2,
      yAxis3,
      yAxis4,
      yAxis5,
      yAxis6,

      // series,

      isDisable: false,
    });

    await this.setState({
      seriesY: [
        {
          name: "Cleanroom Rej%",
          type: "column",
          data: yAxis,
        },
        {
          name: "FDB Rej%",
          type: "column",
          data: yAxis1,
        },
        {
          name: "Loose_part Rej%",
          type: "column",
          data: yAxis2,
        },
        {
          name: "Washing Rej%",
          type: "column",
          data: yAxis3,
        },
        {
          name: "Whiteroom Rej%",
          type: "column",
          data: yAxis4,
        },
        {
          name: "FAC2 Rej%",
          type: "column",
          data: yAxis5,
        },
        {
          name: "LAR %",
          type: "line",
          data: yAxis6,
        },
      ],
      options: {
        chart: {
          type: "bar",
          height: 300,
          stacked: true,
          toolbar: {
            show: true,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false, // เปลี่ยนเป็น true ถ้าคุณต้องการกราฟแนวนอน
            columnWidth: '70%', // ปรับเปอร์เซ็นต์ตามต้องการ
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
          text: "Daily VMI LAR Trend ",
          align: "center",
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [6],
        },
        xaxis: {
          type: "date",
          categories: xAxis,
        },
          yaxis: [
          
          {
            min: 0,
            max: 100,
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
              text: "Reject QTY By Location (%)",
              style: {
                color: "#ff0000",
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
        // legend: {
        //   position: 'right',
        //   offsetY: 40
        // },
        fill: {
          opacity: 1,
        },
      },
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
  getModel = async () => {
    const array = await httpClient.get(server.DEFECTMODEL_URL);
    const options = array.data.result.map((d) => ({
      label: d.Model_Name,
    }));
    this.setState({ listModel: options });
  };
  getLine = async () => {
    const modelLabel =
    this.state.Model.label === "**ALL**"
      ? "**ALL**"
      : this.state.Model.label;
    const array = await httpClient.get(server.DFFECTMLINE_URL + "/" + modelLabel);
    const options = array.data.result.map((d) => ({
      label: d.Line_No,
    }));
    this.setState({ listLine: options });
  };
  getInsType = async () => {
    const modelLabel =
    this.state.Model.label === "**ALL**"
      ? "**ALL**"
      : this.state.Model.label;
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
        return this.state.report.map((item ,index) => (
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
        return this.state.report.map((item,index) => (
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
        return this.state.report.map((item , index) => (
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
        return this.state.report.map((item , index) => (
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
        return this.state.report.map((item , index) => (
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
        return this.state.report.map((item , index) => (
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
    console.log(this.state.Model);
    console.log(this.state.report);

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
                    <li className="breadcrumb-item active">Daily LAR by Model
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
                    {/* //Select Critiria "Model" */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Model</label>
                        <Select
                          options={this.state.listModel}
                          value={this.state.Model}
                          onChange={async (e) => {
                            await this.setState({ Model: e });
                            await this.getInsType();
                            await this.getyear();
                            await this.getMonth();
                            await this.getLine();
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
                          placeholder="Select Model"
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Line</label>
                        <Select
                          options={this.state.listLine}
                          value={this.state.Line[0]}
                          onChange={async (e) => {
                            // await this.setState({ insType: e.label });
                            await this.setState({ Line: [] });
                            this.state.Line.push({ label: e.label });
                          }}
                          // type="text"
                          // className="form-control"
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
                              setTimeout(resolve,300)
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
                                    height={300}
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
