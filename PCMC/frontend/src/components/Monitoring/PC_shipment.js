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
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

class PC_shpiment extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      year: [],
      Month: [],
      Model: { label: "**ALL**" },
      Location: { label: "**ALL**" },
      Status: { label: "**ALL**" },
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
      Type: [],

      Raw_Dat1: [],
      Raw_Dat2: [],
      Raw_Dat3: [],

      listyear: [],
      listMonth: [],
      listModel: [],
      listlocation: [],
      listStatus: [],

      optionSelected: null,
      isDisable: false,
    };
  }

  componentDidMount = async () => {
    // await this.getModel();
    // await this.getLocation();
    await this.getStatus();
    await this.doGetDataReport2();
    // await this.doGetDataReport3();
  };

  //   const modelLabel =
  //   this.state.Model.label === "**ALL**" ? "**ALL**" : this.state.Model.label;
  //   const LocationLabel =
  //   this.state.Location.label === "**ALL**" ? "**ALL**" : this.state.Location.label;
  //   const result = await httpClient.get(
  //     server.PACKINGT1_URL + "/" + modelLabel + "/" + this.state.startDate
  //   );
  //   let xAxis = [];

  //   for (let index = 0; index < result.data.result.length; index++) {
  //     const item = result.data.result[index];
  //     await xAxis.push(item.Location);
  //   }

  //   let yA = result.data.SHIFT_A;
  //   let yB = result.data.SHIFT_B;
  //   let yC = result.data.SHIFT_C;
  //   let yM = result.data.SHIFT_M;
  //   let yN = result.data.SHIFT_N;
  //   let yTOTAL = result.data.TOTAL;

  //   let rawData = result.data.listRawData1;
  //   console.log(rawData);
  //   console.log(rawData.length);
  //   for (let i = 1; i < rawData.length; i++) {
  //     rawData[0].push(...rawData[i]);
  //   }
  //   this.setState({ Raw_Dat1: rawData[0] });
  //   console.log(this.state.Raw_Dat1);

  //   this.setState({
  //     report1: result.data.result,
  //     xAxis,
  //     yA,
  //     yB,
  //     yC,
  //     yM,
  //     yN,
  //     yTOTAL,
  //     // series,

  //     isDisable: false,
  //   });

  //   await this.setState({
  //     seriesY: [
  //       {
  //         name: "SHIFT A",
  //         type: "column",
  //         data: yA,
  //       },
  //       {
  //         name: "SHIFT B",
  //         type: "column",
  //         data: yB,
  //       },
  //       {
  //         name: "SHIFT C",
  //         type: "column",
  //         data: yC,
  //       },
  //       {
  //         name: "SHIFT M",
  //         type: "column",
  //         data: yM,
  //       },
  //       {
  //         name: "SHIFT N",
  //         type: "column",
  //         data: yN,
  //       },
  //     ],
  //     options: {
  //       chart: {
  //         type: "line",
  //         height: 300,
  //         stacked: true,
  //         toolbar: {
  //           show: true,
  //         },
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
  //         text: "S",
  //         align: "center",
  //       },
  //       dataLabels: {
  //         enabled: true,
  //         enabledOnSeries: [4],
  //       },
  //       xaxis: {
  //         type: "date",
  //         categories: xAxis,
  //       },
  //       yaxis: [
  //         {
  //           title: {
  //             text: "Sum QTY by Type",
  //           },
  //         },
  //       ],
  //       colors: [
  //         // Cleanroom Rej
  //         "#AB46D2",
  //         // FDB Rej%
  //         "#FF6FB5",
  //         // Loose_part Rej%
  //         "#55D8C1",
  //         // Washing Rej%
  //         "#F8CB2E",
  //         // Whiteroom Rej%
  //         "#006E7F",

  //         "#4B7BE5",
  //         // LAR %
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

  doGetDataReport1 = async () => {
    const modelLabel =
      this.state.Model.label === "**ALL**" ? "**ALL**" : this.state.Model.label;
    const LocationLabel =
      this.state.Location.label === "**ALL**"
        ? "**ALL**"
        : this.state.Location.label;
    const StatusLabel =
      this.state.Status.label === "**ALL**"
        ? "**ALL**"
        : this.state.Status.label;

    const result = await httpClient.get(
      server.SUMMARYPC_URL +
        "/" +
        modelLabel +
        "/" +
        LocationLabel +
        "/" +
        StatusLabel +
        "/" +
        this.state.Type
    );
    let rawData = result.data.listRawData1;
    console.log(rawData);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat1: rawData[0] });
    console.log(this.state.Raw_Dat1);

    this.setState({
      report1: result.data.result,
      isDisable: false,
    });
  };
  doGetDataReport2 = async () => {
    const result = await httpClient.get(server.MBAFG_URL);
    let rawData2 = result.data.listRawData2;
    // console.log(rawData2);
    for (let i = 1; i < rawData2.length; i++) {
      rawData2[0].push(...rawData2[i]);
    }
    this.setState({ Raw_Dat2: rawData2[0] });
    // console.log(this.state.Raw_Dat2);

    this.setState({
      report2: result.data.result,
      isDisable: false,
    });
  };
  doGetDataReport3 = async () => {
    const modelLabel =
      this.state.Model.label === "**ALL**" ? "**ALL**" : this.state.Model.label;
    const LocationLabel =
      this.state.Location.label === "**ALL**"
        ? "**ALL**"
        : this.state.Location.label;
    const StatusLabel =
      this.state.Status.label === "**ALL**"
        ? "**ALL**"
        : this.state.Status.label;
    const result = await httpClient.get(
      server.SUMMARYPCDETAIL_URL +
        "/" +
        modelLabel +
        "/" +
        LocationLabel +
        "/" +
        StatusLabel +
        "/" +
        this.state.Type
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
    const array = await httpClient.get(
      server.MODELPC_URL + "/" + this.state.Type
    );
    const options = array.data.result.map((d) => ({
      label: d.Model,
    }));
    this.setState({ listModel: options });
  };
  getLocation = async () => {
    const array = await httpClient.get(
      server.LOCATIONPC_URL + "/" + this.state.Type
    );
    const options = array.data.result.map((d) => ({
      label: d.Result,
    }));
    this.setState({ listlocation: options });
    // console.log(this.state.listlocation);
    // console.log(array.data.result);
  };
  getStatus = async () => {
    const array = await httpClient.get(server.STATUSPC_URL);
    const options = array.data.result.map((d) => ({
      label: d.Status,
    }));
    this.setState({ listStatus: options });
  };

  renderreport1 = () => {
    if (this.state.report1 != null && this.state.report1.length > 0) {
      return this.state.report1.map((item, index) => (
        <tr key={index} align="center">
          <td align="center">{item["Location"]}</td>
          <td align="center">{(item.OK || 0).toLocaleString()}</td>
          <td align="center">{(item.HOLD || 0).toLocaleString()}</td>
          <td align="center">{(item.QTY || 0).toLocaleString()}</td>
        </tr>
      ));
    }
  };
  
  renderreport2 = () => {
    if (this.state.report2 != null && this.state.report2.length > 0) {
      return this.state.report2.map((item, index) => (
        <tr key={index} align="center">
          <td align="center">{item["Location"]}</td>
          <td align="center">{(item.Lot_QA || 0).toLocaleString()}</td>
          <td align="center">{(item.OK || 0).toLocaleString()}</td>
          <td align="center">{(item.HOLD || 0).toLocaleString()}</td>
          <td align="center">{(item.QTY || 0).toLocaleString()}</td>
        </tr>
      ));
    }
  };
  
  renderreport3 = () => {
    if (this.state.report3 != null && this.state.report3.length > 0) {
      return this.state.report3.map((item, index) => (
        <tr key={index} align="center">
          <td align="center">{item["Location"]}</td>
          <td align="center">{item["Item_No"]}</td>
          <td align="center">{item["Item_Name"]}</td>
          <td align="center">{item["Temp_DO"]}</td>
          <td align="center">{item["invoice_id"]}</td>
          <td align="center">{item["WH"]}</td>
          <td align="center">{item["LOC"]}</td>
          <td align="center">{item["Vendor"]}</td>
          <td align="center">{item["QA_No"]}</td>
          <td align="center">{item["Status"]}</td>
          <td align="center">{item["Hold_NO"]}</td>
          <td align="center">{item["Hold_detail"]}</td>
          <td align="center">{(item.QTY || 0).toLocaleString()}</td>
          <td align="center">{item["W/W"]}</td>
          <td align="center">{item["Baseplate"]}</td>
          <td align="center">{item["Ramp"]}</td>
          <td align="center">{item["Crashstop"]}</td>
          <td align="center">{item["Hub"]}</td>
          <td align="center">{item["Magnet"]}</td>
          <td align="center">{item["Diverter"]}</td>
          <td align="center">{item["FPC"]}</td>
          <td align="center">{item["SP1"]}</td>
          <td align="center">{item["SP2"]}</td>
          <td align="center">{item["SP3"]}</td>
          <td align="center">{item["SP4"]}</td>
          <td align="center">{item["SP5"]}</td>
        </tr>
      ));
    }
  };
  

  // renderreport3 = () => {
  //   if (this.state.report3 != null) {
  //     if (this.state.report3.length > 0) {
  //       return this.state.report3.map((item) => (
  //         <tr Align="Center">
  //           <td align="Left">{item["MfgDate"]}</td>
  //           <td align="Left">{item["MotorType"]}</td>
  //           <td align="Left">{item["Model"]}</td>
  //           <td align="Left">{item["Model_No"]}</td>
  //           <td align="Left">{item["QANumber"]}</td>
  //           <td align="Left">{item["Pallet_Number"]}</td>

  //           <td>
  //             {Number(item["SHIFT_A"]).toLocaleString(undefined, {
  //               maximumFractionDigits: 2,
  //             })}
  //           </td>
  //           <td>
  //             {Number(item["SHIFT_B"]).toLocaleString(undefined, {
  //               maximumFractionDigits: 2,
  //             })}
  //           </td>
  //           <td>
  //             {Number(item["SHIFT_C"]).toLocaleString(undefined, {
  //               maximumFractionDigits: 2,
  //             })}
  //           </td>
  //           <td>
  //             {Number(item["SHIFT_M"]).toLocaleString(undefined, {
  //               maximumFractionDigits: 2,
  //             })}
  //           </td>
  //           <td>
  //             {Number(item["SHIFT_N"]).toLocaleString(undefined, {
  //               maximumFractionDigits: 2,
  //             })}
  //           </td>
  //           <td>
  //             {Number(item["TOTAL"]).toLocaleString(undefined, {
  //               maximumFractionDigits: 2,
  //             })}
  //           </td>
  //         </tr>
  //       ));
  //     }
  //   }
  // };

  render() {
    // console.log(this.state.Type);
    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 100 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>
                    <strong>Inventory Control</strong>
                  </h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">
                      Inventory Control
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
              <div className="content" style={{ paddingTop: 5 }}>
                <section className="content-header">
                  <div className="container-fluid">
                    <div className="row mb-1">
                      <div className="col-sm-6">
                        <h1>Finish good for Shipment</h1>
                      </div>
                      <div className="col-sm-6">
                        <CSVLink
                          data={this.state.Raw_Dat1}
                          filename={"Summary_Inventory_Shipment.csv"}
                        >
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ marginTop: 3 }}
                          >
                            Finish good for Shipment
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
                <div className="col-12">
                  <div className="content">
                    <div className="container-fluid">
                      <div className="card card-primary">
                        <div
                          className="card-body table-responsive p-0"
                          style={{ height: 400 }}
                        >
                          <table className="table  text-nowrap table-hover">
                            <thead>
                              <tr align="center">
                                <th width="120">Location</th>
                                <th width="120">Lot_QA</th>
                                <th width="120">OK</th>
                                <th width="120">HOLD</th>
                                <th width="120">QTY</th>
                              </tr>
                            </thead>
                            <tbody>{this.renderreport2()}</tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-4"></div>
              </div>
            </div>
            <div className="col-12">
              <div className="card card-primary card-outline">
                <div className="card-header">
                  <h3 className="card-title">
                    <label>Select Parameter</label>
                  </h3>
                </div>

                <div className="card-body">
                  <div className="row">
                    <FormControl>
                      <FormLabel id="demo-row-radio-buttons-group-label">
                        Type
                      </FormLabel>
                      <RadioGroup
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={this.state.Type}
                        onChange={async (e) => {
                          this.setState({ Type: e.target.value }, async () => {
                            // Callback function จะถูกเรียกหลังจากที่ state ถูกอัปเดตแล้ว
                            await this.getModel();
                            await this.getLocation();
                          });
                        }}
                      >
                        <FormControlLabel
                          value="WIP"
                          control={<Radio />}
                          label="WIP"
                        />
                        <FormControlLabel
                          value="Shipment"
                          control={<Radio />}
                          label="Finish good"
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <div className="row">
                    {/* //Select Critiria "Model" */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Model</label>
                        <Select
                          options={this.state.listModel}
                          value={this.state.Model}
                          onChange={(e) => this.setState({ Model: e })}
                          placeholder="Select Model"
                        />
                      </div>
                    </div>

                    {/* //Select Start Date */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Location</label>
                        <Select
                          options={this.state.listlocation}
                          value={this.state.Location}
                          onChange={async (e) => {
                            await this.setState({ Location: e });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select location"
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Status</label>
                        <Select
                          options={this.state.listStatus}
                          value={this.state.Status}
                          onChange={async (e) => {
                            await this.setState({ Status: e });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select Status"
                        />
                      </div>
                    </div>

                    {/* //Select Finish Date */}
                    {/* <div className="col-md-2">
                      <div className="form-group">
                        <label>To</label>
                        <input
                          value={this.state.finishDate}
                          onChange={(e) => {
                            this.setState({ finishDate: e.target.value });
                          }}
                          type="date"
                          className="form-control"
                          placeholder="Select Finish Date"
                        />
                      </div>
                    </div> */}

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
                            timer: 360000,
                            allowOutsideClick: false,
                            didOpen: async () => {
                              Swal.showLoading();
                              await this.doGetDataReport3();
                              await this.doGetDataReport1();
                            setTimeout(() => { Swal.close();},1000)
                       
                            },
                          }).then(() => {
                            if (this.state.report1.length > 0) {
                              if (this.state.report1[0].Location.length > 0) {
                                Swal.fire({
                                  icon: "success",
                                  title: "Success",
                                  text: "Data has been loaded successfully",
                                });
                              } else if (
                                this.state.report1[0].Location.length == 0
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
                        className="btn btn-primary"
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
                        <h1>Summary Inventory</h1>
                      </div>
                      <div className="col-sm-6">
                        <CSVLink
                          data={this.state.Raw_Dat1}
                          filename={"Summary_Inventory_Shipment.csv"}
                        >
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ marginTop: 3 }}
                          >
                            Summary Inventory
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
                  <div className="content">
                    <div className="container-fluid">
                      <div className="card card-primary">
                        <div
                          className="card-body table-responsive p-0"
                          style={{ height: 400 }}
                        >
                          <table className="table  text-nowrap table-hover">
                            <thead>
                              <tr align="center">
                                <th width="120">LOCATION</th>
                                <th width="120">OK</th>
                                <th width="120">HOLD</th>
                                <th width="120">QTY</th>
                              </tr>
                            </thead>
                            <tbody>{this.renderreport1()}</tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-4"></div>
              </div>
            </div>
          </div>

          {/* Table3*/}
          <div className="content" style={{ paddingTop: 5 }}>
            <section className="content-header">
              <div className="container-fluid">
                <div className="row mb-1">
                  <div className="col-sm-6">
                    <h1>Detail by item</h1>
                  </div>
                  <div className="col-sm-6">
                    <CSVLink
                      data={this.state.Raw_Dat3}
                      filename={"report_inventory_shipment.csv"}
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
            <div className="content">
              <div className="container-fluid">
                <div className="card card-primary">
                  <div
                    className="card-body table-responsive p-0"
                    style={{ height: 430 }}
                  >
                    <table className="table table-head-fixed text-nowrap table-hover">
                      <thead>
                        <tr align="center">
                          <th width="50">Location</th>
                          <th width="50">Item_No</th>
                          <th width="50">Item_Name</th>
                          <th width="50">Temp_DO</th>
                          <th width="50">Invoice_No</th>
                          <th width="50">WH</th>
                          <th width="50">LOC</th>
                          <th width="50">Vendor</th>
                          <th width="50">QA_Number</th>
                          <th width="50">Status</th>
                          <th width="50">Hold_NO</th>
                          <th width="50">Hold_detail</th>
                          <th width="50">QTY</th>
                          <th width="50">W/W</th>
                          <th width="50">Baseplate</th>
                          <th width="50">Ramp</th>
                          <th width="50">Crashstop</th>
                          <th width="50">Hub</th>
                          <th width="50">Magnet</th>
                          <th width="50">Diverter</th>
                          <th width="50">FPC</th>
                          <th width="50">SP1</th>
                          <th width="50">SP2</th>
                          <th width="50">SP3</th>
                          <th width="50">SP4</th>
                          <th width="50">SP5</th>
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

export default PC_shpiment;
