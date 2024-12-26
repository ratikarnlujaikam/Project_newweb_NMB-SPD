import React, { Component } from "react";
import { key, server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
// import Chart from "react-apexcharts";
import moment from "moment";
import Select from "react-select";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";

class Shipmentdata extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      year: [],
      Month: [],
      Model: {label:"**ALL**"},
      Line: [],
      insType: [],
      report1: [],
      report2: [],
      report3: [],
      xAxis: [],
      yAxis: [],
      seriesY: [],
      seriesY2: [],
      options: {},
      options2: {},
      chart: [],
      Invoidid: [],
      lotqanumber: [],
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
    await this.getModel();
    await this.doGetShipmentbymodel();
  };
  doGetShipmentbymodel = async () => {
    const modelLabel =
    this.state.Model.label === "**ALL**" ? "**ALL**" : this.state.Model.label;
    const result = await httpClient.get(
      server.SHIPMENTBYMODEL_URL +
        "/" +
        modelLabel +
        "/" +
        this.state.startDate +
        "/" +
        this.state.finishDate
    );
    let rawData = result.data.listRawData;
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
  doGetShipmentbyinvoidid = async () => {
    const result = await httpClient.get(
      server.SHIPMENTBYINVOIDID_URL + "/" + this.state.Invoidid
    );
    let rawData = result.data.listRawData1;
    console.log(rawData);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat2: rawData[0] });
    console.log(this.state.Raw_Dat2);

    this.setState({
      report2: result.data.result,
      isDisable: false,
    });
  };
  doGetShipmentbylotqanumber = async () => {
    const result = await httpClient.get(
      server.SHIPMENTBYLOTQA_URL + "/" + this.state.lotqanumber
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
  renderreport1 = () => {
    if (this.state.report1 != null) {
      if (this.state.report1.length > 0) {
        return this.state.report1.map((item) => (
          <tr Align="Center">
            <td align="Left">{item["Invoice_ID"].toUpperCase()}</td>
            <td align="Left">{item["Lot_No"].toUpperCase()}</td>
            <td align="Left">{item["status"].toUpperCase()}</td>
            <td align="Left">{item["Model"].toUpperCase()}</td>
            <td align="Left">{item["Item_no"].toUpperCase()}</td>
            <td align="Left">{item["Ramp"].toUpperCase()}</td>
            <td align="Left">{item["Base"].toUpperCase()}</td>
            <td align="Left">{item["Diverter"].toUpperCase()}</td>
            <td align="Left">{item["Special_control"]}</td>
            <td align="RIGHT">
              {Number(item["QTY"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td align="Left">{item["Date"].toUpperCase()}</td>
            <td align="Left">{item["Timpstamp"].toUpperCase()}</td>
          </tr>
        ));
      }
    }
  };
  renderreport2 = () => {
    if (this.state.report2 != null) {
      if (this.state.report2.length > 0) {
        return this.state.report2.map((item) => (
          <tr align="Center">
            <td align="Left">{item["Invoice_ID"].toUpperCase()}</td>
            <td align="Left">{item["Lot_No"].toUpperCase()}</td>
            <td align="Left">{item["status"].toUpperCase()}</td>
            <td align="Left">{item["Model"].toUpperCase()}</td>
            <td align="Left">{item["Item_no"].toUpperCase()}</td>
            <td align="Left">{item["Ramp"].toUpperCase()}</td>
            <td align="Left">{item["Base"].toUpperCase()}</td>
            <td align="Left">{item["Diverter"].toUpperCase()}</td>
            <td align="Left">{item["Special_control"]}</td>
            <td align="RIGHT">
              {Number(item["QTY"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td align="Left">{item["Date"].toUpperCase()}</td>
            <td align="Left">{item["Timpstamp"].toUpperCase()}</td>
          </tr>
        ));
      }
    }
  };
  renderreport3 = () => {
    if (this.state.report3 != null) {
      if (this.state.report3.length > 0) {
        return this.state.report3.map((item) => (
          <tr align="Center">
            <td align="Left">{item["Invoice_ID"].toUpperCase()}</td>
            <td align="Left">{item["Lot_No"].toUpperCase()}</td>
            <td align="Left">{item["status"].toUpperCase()}</td>
            <td align="Left">{item["Model"].toUpperCase()}</td>
            <td align="Left">{item["Item_no"].toUpperCase()}</td>
            <td align="Left">{item["Ramp"].toUpperCase()}</td>
            <td align="Left">{item["Base"].toUpperCase()}</td>
            <td align="Left">{item["Diverter"].toUpperCase()}</td>
            <td align="Left">{item["Special_control"]}</td>
            <td align="RIGHT">
              {Number(item["QTY"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td align="Left">{item["Date"].toUpperCase()}</td>
            <td align="Left">{item["Timpstamp"].toUpperCase()}</td>
          </tr>
        ));
      }
    }
  };
  getModel = async () => {
    const array = await httpClient.get(server.MODELSHIPMENTDATA_URL);
    const options = array.data.result.map((d) => ({
      label: d.Model_Name,
    }));
    this.setState({ listModel: options });
  };
  render() {
    console.log(this.state.report2);
    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 80 }}>
          <div className="container-fluid">
            <div className="row ">
              <div className="col-10">
                <h2>Shipment status</h2>
              </div>
              <div className="col-2">
                <section className="content-header">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">Shipment status</li>
                  </ol>
                </section>
              </div>
            </div>
          </div>
        </div>
        <div class="container-fluid" style={{ paddingTop: 10}}>
          <div className="row">
            <div className="col-12">
              <div className="card card-primary card-outline">
                <div className="card-header">
                  <h3 className="card-title">
                    <label>Select Parameter</label>
                  </h3>
                </div>
                {/* select model */}
              
                <div className="card-body"  >
                  <div className="row" >
                    
                    {/* //Select Critiria "Model" */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Model group</label>
                        <Select
                          options={this.state.listModel}
                          value={this.state.Model}
                          onChange={async (e) => {
                            await this.setState({ Model: e.label });
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
                        <label>Select Date &nbsp;</label>
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

                    {/* //Select Finish Date */}
                    <div className="col-md-2">
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
                    </div>

                    {/* Submit button */}
                    <div className="col-md-1">
                      <button
                        disabled={this.state.isDisable}
                        // type="button"
                        // className="btn btn-info btn-flat"
                        onClick={(e) => {
                          this.setState({ lotqanumber: "" });
                          this.setState({ Invoidid: "" });
                          this.setState({ report3: "" });
                          this.setState({ report2: "" });
                          this.setState({ isDisable: true });

                          // this.doGetDataReport();
                          Swal.fire({
                            icon: "info",
                            title: "Loading Data",
                            timer: 60000,
                            allowOutsideClick: false,
                            didOpen: async () => {
                              Swal.showLoading();
                              await this.doGetShipmentbymodel();
                              setTimeout(() => {
                                Swal.close();
                              }, 1000);
                     
                            },
                          }).then(() => {
                            if (this.state.report1.length > 0) {
                              if (this.state.report1[0].Model.length > 0) {
                                Swal.fire({
                                  icon: "success",
                                  title: "Success",
                                  text: "Data has been loaded successfully",
                                });
                              } else if (
                                this.state.report1[0].Model.length == 0
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
                    <div style={{ marginTop: 30 }} className="col-md-1">
                      <a
                        href="/Home"
                        class="btn btn-primary"
                        role="button"
                        aria-pressed="true"
                      >
                        Back
                      </a>
                    </div>
                    <div style={{ marginTop: 30 }} className="col-md-2">
                      <CSVLink
                        data={this.state.Raw_Dat1}
                        filename={"Shipment data by model.csv"}
                      >
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ marginTop: 1 }}
                        >
                          Download by model
                        </button>
                      </CSVLink>
                    </div>
                  </div>
                </div>
         
                
              
                    {/* select model */}
                   
                    <div className="card-body"  style={{ paddingTop: 1}}>
                      <label>Search by Lot QA</label>
                      <div className="row">
                        <div className="col-md-12">
                          <div
                            style={{ marginTop: 10 }}
                            className="input-group "
                          >
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
                            <div className="col-md-1">
                              <button
                                disabled={this.state.isDisable}
                                // type="button"
                                // className="btn btn-info btn-flat"
                                onClick={(e) => {
                                  this.setState({ Invoidid: "" });
                                  this.setState({ report1: "" });
                                  this.setState({ report2: "" });
                                  this.setState({ isDisable: true });

                                  // this.doGetDataReport();
                                  Swal.fire({
                                    icon: "info",
                                    title: "Loading Data",
                                    timer: 60000,
                                    allowOutsideClick: false,
                                    didOpen: async () => {
                                      Swal.showLoading();

                                      await this.doGetShipmentbylotqanumber();
                                      setTimeout(() => {
                                        Swal.close();
                                      }, 1000);
                                    },
                                  }).then(() => {
                                    if (this.state.report3.length > 0) {
                                      if (
                                        this.state.report3[0].Lot_No.length > 0
                                      ) {
                                        Swal.fire({
                                          icon: "success",
                                          title: "Success",
                                          text: "Data has been loaded successfully",
                                        });
                                      } else if (
                                        this.state.report3[0].Model.length == 0
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
                              >
                                Submit
                              </button>
                            </div>

                            <div className="col-md-7">
                              <CSVLink
                                data={this.state.Raw_Dat3}
                                filename={"Shipment data by Lot QA.csv"}
                              >
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                >
                                  Download by Lot QA
                                </button>
                              </CSVLink>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
               
             
      
                {/* select model */}
              
                  <div className="card-body"  style={{ paddingTop: 1}}>
                    <label >Search by Invoice ID</label>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="input-group ">
                          <input
                            value={this.state.Invoidid}
                            onChange={async (e) => {
                              await this.setState({
                                Invoidid: e.target.value,
                              });
                            }}
                            type="text"
                            className="form-control"
                            placeholder="Input Invoice ID hear"
                          />
                          <div className="col-md-1">
                            <button
                              disabled={this.state.isDisable}
                              // type="button"
                              // className="btn btn-info btn-flat"
                              onClick={(e) => {
                                this.setState({ lotqanumber: "" });
                                this.setState({ report1: "" });
                                this.setState({ report3: "" });
                                this.setState({ isDisable: true });

                                // this.doGetDataReport();
                                Swal.fire({
                                  icon: "info",
                                  title: "Loading Data",
                                  timer: 60000,
                                  allowOutsideClick: false,
                                  didOpen: async () => {
                                    Swal.showLoading();
                                    await this.doGetShipmentbyinvoidid();
                                    setTimeout(() => {
                                      Swal.close();
                                    }, 1000);
                                  },
                                }).then(() => {
                                  if (this.state.report2.length > 0) {
                                    if (
                                      this.state.report2[0].Model.length > 0
                                    ) {
                                      Swal.fire({
                                        icon: "success",
                                        title: "Success",
                                        text: "Data has been loaded successfully",
                                      });
                                    } else if (
                                      this.state.report2[0].Model.length == 0
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
                            >
                              Submit
                            </button>
                          </div>
                          <div className="col-md-7 ">
                            <CSVLink
                              data={this.state.Raw_Dat2}
                              filename={"Shipment data by invoice.csv"}
                            >
                              <button
                                type="button"
                                className="btn btn-primary"
                                style={{ marginTop: 1 }}
                              >
                                Download by Invoice ID
                              </button>
                            </CSVLink>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
          
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="content">
                    <div className="container-fluid">
                      <div className="card card-primary">
                        <div
                          className="card-body table-responsive p-0"
                          style={{ height: 400 ,
                            zIndex: "3",
                            position: "relative",
                            zIndex: "0",}}
                        >
                          <table className=" table  text-nowrap table-hover table-head-fixed">
                            <thead>
                              <tr align="center">
                                <th width="120">Invoice ID</th>
                                <th width="120">Lot No</th>
                                <th width="120">Status</th>
                                <th width="120">Model</th>
                                <th width="120">Item No</th>
                                <th width="120">Ramp </th>
                                <th width="120">Base</th>
                                <th width="120">Diverter</th>
                                <th width="120">Special control</th>
                                <th width="120">QTY</th>
                                <th width="120">Date</th>
                                <th width="120">Timpstamp</th>
                              </tr>
                            </thead>
                            <tbody>{this.renderreport1()}</tbody>
                            <tbody>{this.renderreport3()}</tbody>
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

export default Shipmentdata;
