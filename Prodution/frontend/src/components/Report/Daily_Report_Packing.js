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

class Daily_Report_Packing extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      year: [],
      Month: [],
      Model: { label: "**ALL**" },
      insType: [],
      report1: [],
      report2: [],
      report3: [],
      xAxis: [],
      yAxis: [],
      seriesY: [],
      seriesY2: [],
      seriesCleanroom: [],
      options: {},
      options2: {},
      chart: [],

      Raw_Dat1: [],
      Raw_Dat2: [],
      Raw_Dat3: [],

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
    this.handleSubmit(); // เรียกใช้ฟังก์ชันเมื่อโหลดหน้าเสร็จ

  };
  handleSubmit = () => {
    this.setState({ isDisable: true });

    Swal.fire({
      icon: "info",
      title: "Loading Data",
      timer: 60000,
      allowOutsideClick: false,
      didOpen: async () => {
        Swal.showLoading();
        await this.doGetDataReport1();
        await this.doGetDataReport2();
        await this.doGetDataReport3();
        Swal.close();
      },
    }).then(() => {
      if (this.state.report1.length > 0) {
        if (this.state.report1[0].MotorType.length > 0) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Data has been loaded successfully",
          });
        } else if (this.state.report1[0].MotorType.length === 0) {
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
  };

  doGetDataReport1 = async () => {
    const modelLabel =
      this.state.Model.label === "**ALL**" ? "**ALL**" : this.state.Model.label;
    const result = await httpClient.get(
      server.PACKINGT1_URL + "/" + modelLabel + "/" + this.state.startDate
    );
    let xAxis = [];

    for (let index = 0; index < result.data.result.length; index++) {
      const item = result.data.result[index];
      await xAxis.push(item.MotorType);
    }

    let yA = result.data.SHIFT_A;
    let yB = result.data.SHIFT_B;
    let yC = result.data.SHIFT_C;
    let yM = result.data.SHIFT_M;
    let yN = result.data.SHIFT_N;
    let yTOTAL = result.data.TOTAL;

    let rawData = result.data.listRawData1;
    console.log(rawData);
    console.log(rawData.length);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat1: rawData[0] });
    console.log(this.state.Raw_Dat1);

    this.setState({
      report1: result.data.result,
      xAxis,
      yA,
      yB,
      yC,
      yM,
      yN,
      yTOTAL,
      // series,

      isDisable: false,
    });

    await this.setState({
      seriesY: [
        {
          name: "SHIFT A",
          type: "column",
          data: yA,
        },
        {
          name: "SHIFT B",
          type: "column",
          data: yB,
        },
        {
          name: "SHIFT C",
          type: "column",
          data: yC,
        },
        {
          name: "SHIFT M",
          type: "column",
          data: yM,
        },
        {
          name: "SHIFT N",
          type: "column",
          data: yN,
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
          text: "Output Packing By Type",
          align: "center",
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [4],
        },
        xaxis: {
          type: "date",
          categories: xAxis,
        },
        yaxis: [
          {
            title: {
              text: "Sum QTY by Type",
            },
          },
        ],
        colors: [
          // Cleanroom Rej
          "#AB46D2",
          // FDB Rej%
          "#FF6FB5",
          // Loose_part Rej%
          "#55D8C1",
          // Washing Rej%
          "#F8CB2E",
          // Whiteroom Rej%
          "#006E7F",

          "#4B7BE5",
          // LAR %
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
  doGetDataReport2 = async () => {
    const modelLabel =
      this.state.Model.label === "**ALL**" ? "**ALL**" : this.state.Model.label;
    const result = await httpClient.get(
      server.PACKINGT2_URL + "/" + modelLabel + "/" + this.state.startDate
    );

    let xAxis = [];

    for (let index = 0; index < result.data.result.length; index++) {
      const item = result.data.result[index];
      await xAxis.push(item.Model);
    }

    let yA = result.data.SHIFT_A;
    let yB = result.data.SHIFT_B;
    let yC = result.data.SHIFT_C;
    let yM = result.data.SHIFT_M;
    let yN = result.data.SHIFT_N;

    let rawData = result.data.listRawData2;
    console.log(rawData);
    console.log(rawData.length);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat2: rawData[0] });
    console.log(this.state.Raw_Dat2);

    this.setState({
      report2: result.data.result,
      xAxis,
      yA,
      yB,
      yC,
      yM,
      yN,

      // series,

      isDisable: false,
    });

    await this.setState({
      seriesY2: [
        {
          name: "SHIFT A",
          type: "column",
          data: yA,
        },
        {
          name: "SHIFT B",
          type: "column",
          data: yB,
        },
        {
          name: "SHIFT C",
          type: "column",
          data: yC,
        },
        {
          name: "SHIFT M",
          type: "column",
          data: yM,
        },
        {
          name: "SHIFT N",
          type: "column",
          data: yN,
        },
      ],
      options2: {
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
          text: "Output Packing By Model",
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
            title: {
              text: "Sum QTY by Model",
            },
          },
        ],
        colors: [
          // Cleanroom Rej
          "#AB46D2",
          // FDB Rej%
          "#FF6FB5",
          // Loose_part Rej%
          "#55D8C1",
          // Washing Rej%
          "#F8CB2E",
          // Whiteroom Rej%
          "#006E7F",

          "#4B7BE5",
          // LAR %
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
  doGetDataReport3 = async () => {
    const modelLabel =
      this.state.Model.label === "**ALL**" ? "**ALL**" : this.state.Model.label;
    const result = await httpClient.get(
      server.PACKINGT3_URL + "/" + modelLabel + "/" + this.state.startDate
    );
    let rawData = result.data.listRawData3;
    console.log(rawData);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat3: rawData[0] });
    console.log(this.state.Raw_Dat3);

    this.setState({
      report3: result.data.result,
      isDisable: false,
    });
  };

  getModel = async () => {
    const array = await httpClient.get(server.PACKINGMODEL_URL);
    const options = array.data.result.map((d) => ({
      label: d.ModelGroup,
    }));
    this.setState({ listModel: options });
  };

  renderreport1 = () => {
    if (this.state.report1 != null) {
      if (this.state.report1.length > 0) {
        return this.state.report1.map((item) => (
          <tr Align="Center">
            <td align="Left">{item["MfgDate"]}</td>
            <td align="Left">{item["MotorType"]}</td>
            <td>
              {Number(item["SHIFT_A"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["SHIFT_B"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["SHIFT_C"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["SHIFT_M"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["SHIFT_N"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["TOTAL"]).toLocaleString(undefined, {
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
            <td align="Left">{item["MfgDate"]}</td>
            <td align="Left">{item["MotorType"]}</td>
            <td align="Left">{item["Model"]}</td>
            <td align="Left">{item["Model_No"]}</td>

            <td>
              {Number(item["SHIFT_A"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["SHIFT_B"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["SHIFT_C"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["SHIFT_M"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["SHIFT_N"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["TOTAL"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
          </tr>
        ));
      }
    }
  };
  renderreport3 = () => {
    if (this.state.report3 != null) {
      if (this.state.report3.length > 0) {
        return this.state.report3.map((item) => (
          <tr Align="Center">
            <td align="Left">{item["MfgDate"]}</td>
            <td align="Left">{item["MotorType"]}</td>
            <td align="Left">{item["Model"]}</td>
            <td align="Left">{item["Model_No"]}</td>
            <td align="Left">{item["QANumber"]}</td>
            <td align="Left">{item["Pallet_Number"]}</td>

            <td>
              {Number(item["SHIFT_A"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["SHIFT_B"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["SHIFT_C"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["SHIFT_M"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["SHIFT_N"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>
              {Number(item["TOTAL"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
          </tr>
        ));
      }
    }
  };

  render() {
    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 70 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Daily packing report</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">
                      Daily packing report
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
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select Model"
                        />
                      </div>
                    </div>

                    {/* //Select Start Date */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>
                          By Daily Select From &nbsp;

                        </label>
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
                              await this.doGetDataReport1();
                              await this.doGetDataReport2();
                              await this.doGetDataReport3();
                              Swal.close();
                            },
                          }).then(() => {
                            if (this.state.report1.length > 0) {
                              if (this.state.report1[0].MotorType.length > 0) {
                                Swal.fire({
                                  icon: "success",
                                  title: "Success",
                                  text: "Data has been loaded successfully",
                                });
                              } else if (
                                this.state.report1[0].MotorType.length == 0
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
                    <div style={{ marginTop: 30 }} className="col-md-2">
                      <a
                        href="/Home"
                        class="btn btn-primary"
                        role="button"
                        aria-pressed="true"
                      >
                        Back
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content" style={{ paddingTop: 5 }}>
                <section className="content-header">
                  <div className="container-fluid">
                    <div className="row mb-1">
                      <div className="col-sm-6">
                        <h1>Output Packing By Type</h1>
                      </div>
                      <div className="col-sm-6">
                        <CSVLink
                          data={this.state.Raw_Dat1}
                          filename={"report By Type.csv"}
                        >
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ marginTop: 3 }}
                          >
                            Download By Type
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
                <div className="col-8">
                  <div class="content">
                    <div class="container-fluid">
                      <div className="card card-primary">
                        <div
                          className="card-body table-responsive p-0"
                          style={{ height: 400 }}
                        >
                          <table className="table  text-nowrap table-hover">
                            <thead>
                              <tr align="center">
                                <th width="120">DATE</th>
                                <th width="120">Motor Type</th>
                                <th width="120">SHIFT A</th>
                                <th width="120">SHIFT B</th>
                                <th width="120">SHIFT C</th>
                                <th width="120">SHIFT M</th>
                                <th width="120">SHIFT N</th>
                                <th width="120">TOTAL</th>
                              </tr>
                            </thead>
                            <tbody>{this.renderreport1()}</tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="card card-primary card-outline">
                    {/* Chart Title */}
                    <div className="card-header">
                      <h3 className="card-title">
                        <div className="col-sd-10"></div>
                      </h3>
                    </div>

                    {/* Insert Xbar Chart */}
                    <div className="row" style={{ width: "100%" }}>
                      <div style={{ width: "2%" }}></div>
                      <div
    className="card card-warning"
    style={{
      width: "98%",
      background: "linear-gradient(to bottom, rgba(56, 162, 189, 0.8), rgba(223, 226, 233, 0.8))", // สีโปร่งใสเล็กน้อย
    }}
                      >
                        <div className="card-body">
                          <div className="row">
                            <div style={{ width: "100%" }}>
                              <ReactApexChart
                                options={this.state.options}
                                series={this.state.seriesY}
                                type="bar"
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
          <div className="content" style={{ paddingTop: 5 }}>
            <section className="content-header">
              <div className="container-fluid">
                <div className="row mb-1">
                  <div className="col-sm-6">
                    <h1>Output Packing By Model</h1>
                  </div>
                  <div className="col-sm-6">
                    <CSVLink
                      data={this.state.Raw_Dat2}
                      filename={"report By Model.csv"}
                    >
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ marginTop: 5 }}
                      >
                        Download BY Model
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
                <div className="col-8">
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
                                <th width="50">DATE</th>
                                <th width="50">Motor Type</th>
                                <th width="50">Model</th>
                                <th width="50">Model No</th>
                                <th width="50">SHIFT A</th>
                                <th width="50">SHIFT B</th>
                                <th width="50">SHIFT C</th>
                                <th width="50">SHIFT M</th>
                                <th width="50">SHIFT N</th>
                                <th width="50">TOTAL</th>
                              </tr>
                            </thead>
                            <tbody>{this.renderreport2()}</tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="card card-primary card-outline">
                    {/* Chart Title */}
                    <div className="card-header">
                      <h3 className="card-title"></h3>
                    </div>

                    {/* Insert Xbar Chart */}
                    <div
  className="row"
  // style={{
  //   width: "100%",
  //   background: "linear-gradient(to right, #ff7e5f, #feb47b)", // ไล่สีจากซ้ายไปขวา
  // }}
>
  <div style={{ width: "2%" }}></div>
  <div
    className="card card-warning"
    style={{
      width: "96%",
      background: "linear-gradient(to bottom, rgba(56, 162, 189, 0.8), rgba(223, 226, 233, 0.8))", // สีโปร่งใสเล็กน้อย
    }}
    
  >
    <div className="card-body">
      <div className="row">
        <div style={{ width: "100%" }}>
          <ReactApexChart
            options={this.state.options2}
            series={this.state.seriesY2}
            type="bar"
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
          {/* Table3*/}
          <div className="content" style={{ paddingTop: 5 }}>
            <section className="content-header">
              <div className="container-fluid">
                <div className="row mb-1">
                  <div className="col-sm-6">
                    <h1>Output Packing Details</h1>
                  </div>
                  <div className="col-sm-6">
                    <CSVLink
                      data={this.state.Raw_Dat3}
                      filename={"report By Type.csv"}
                    >
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ marginTop: 3 }}
                      >
                        Download Details
                      </button>
                    </CSVLink>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div className="col-12">
            <div class="content">
              <div class="container-fluid">
                <div className="card card-primary">
                  <div
                    className="card-body table-responsive p-0"
                    style={{ height: 430 }}
                  >
                    <table className="table table-head-fixed text-nowrap table-hover">
                      <thead>
                        <tr align="center">
                          <th width="50">DATE</th>
                          <th width="50">Motor Type</th>
                          <th width="50">Model</th>
                          <th width="50">Model No</th>
                          <th width="50">QANumber</th>
                          <th width="50">Pallet Number</th>
                          <th width="50">SHIFT A</th>
                          <th width="50">SHIFT B</th>
                          <th width="50">SHIFT C</th>
                          <th width="50">SHIFT M</th>
                          <th width="50">SHIFT N</th>
                          <th width="50">TOTAL</th>
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
    );
  }
}

export default Daily_Report_Packing;
