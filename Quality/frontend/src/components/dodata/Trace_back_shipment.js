import React, { Component } from "react";
import { key, server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import Chart from "react-apexcharts";
import moment from "moment";
import Select from "react-select";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";

class Trace_back_shipment extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      year: [],
      Month: [],
      Model: [],
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
      barcodemotor: [],
      lotqa: [],
      Raw_Dat1: [],
      Raw_Dat2: [],
      Raw_Dat3: [],


      optionSelected: null,
      isDisable: false,
    };
  }
  doGetdodatabylotqa = async () => {
    const result = await httpClient.get(
      server.DODATABYLOTQA_URL + "/" + this.state.dobylotqa
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

  doGetdodatabyinvoid = async () => {
    const result = await httpClient.get(
      server.DODATABYINVOID_URL + "/" + this.state.dobyinvoid
    );
    let rawData = result.data.listRawData2;
    console.log(rawData);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat2: rawData[0] });
    console.log(this.state.Raw_Dat1);
  
    this.setState({
      report2: result.data.result,
      isDisable: false,
    });
  };

  renderreport1 = () => {
    if (this.state.report1 != null) {
      if (this.state.report1.length > 0) {
        return this.state.report1.map((item) => (
          <tr Align="Center">
            <td align="Left">{item["LotQA"]}</td>
            <td align="Left">{item["DO_Num"]}</td>
            <td align="Left">{item["Part_Num"]}</td>
            <td align="Left">{item["Part_Rev"]}</td>
            <td align="Left">{item["Lot_num"]}</td>
            <td align="Left">{item["Lot_Qty"]}</td>
            <td align="Left">{item["DO_Qty"]}</td>
            <td align="Left">{item["Ship_date"]}</td>           
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
            <td align="Left">{item["LotQA"]}</td>
            <td align="Left">{item["DO_Num"]}</td>
            <td align="Left">{item["Part_Num"]}</td>
            <td align="Left">{item["Part_Rev"]}</td>
            <td align="Left">{item["Lot_num"]}</td>
            <td align="Left">{item["Lot_Qty"]}</td>
            <td align="Left">{item["DO_Qty"]}</td>
            <td align="Left">{item["Ship_date"]}</td>           
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
                  <h1>Trace back shipment</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">
                    Trace back shipment
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
                    <label>Input Data</label>
                  </h3>
                </div>
  
                <div className="card-body">
                  <div className="row">
                    {/* //Select Critiria "Model" */}
                    <div className="col-md-4">
                    <label>Search by Lot QA</label>
                      <div className="input-group ">
                        <input
                          value={this.state.dobylotqa}
                          onChange={async (e) => {
                            await this.setState({
                              dobylotqa: e.target.value,
                            });
                          }}
                          type="text"
                          className="form-control"
                          placeholder="Input lot QA"
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
                          this.setState({ dobyinvoid : ('') });                     
                          this.setState({ report2: ('') });
                          const dobylotqa = this.state.dobylotqa;

                          if (!dobylotqa) {
                            Swal.fire({
                              icon: "error",
                              title: "Missing QA",
                              text: "Please input lot QA.",
                            });
                            return; // Stop execution if lot QA is missing
                          }
                          
                          // Continue with the rest of the logic here                          
                          this.setState({ isDisable: true });
                          // this.doGetDataReport();
                          Swal.fire({
                            icon: "info",
                            title: "Loading Data",
                            timer: 120000,
                            allowOutsideClick: false,
                            didOpen: async () => {
                              Swal.showLoading();
                              await this. doGetdodatabylotqa();
                              await new Promise((resolve) =>
                              setTimeout(resolve,100)
                              )
                              Swal.close();
                            },
                          }).then(() => {
                            if (this.state.report1.length > 0) {
                              if (
                                this.state.report1[0].LotQA.length > 0
                              ) {
                                Swal.fire({
                                  icon: "success",
                                  title: "Success",
                                  text: "Data has been loaded successfully",
                                });
                              } else if (
                                this.state.report1[0].LotQA.length == 0
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
                                title: "No production data",
                                text: "Please select other date",
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
                    <div className="col-md-4">
                      <CSVLink
                        data={this.state.Raw_Dat1}
                        filename={"DO Data report.csv"}
                      >
                        <button
                          type="button"
                          className="btn btn-primary"
                           style={{ marginTop: 30 }}
                        >
                          Download by LotQA
                        </button>
                      </CSVLink>
                    </div>
                  </div> 
                  <div className="row"  style={{ marginTop: 30 }}>
                    {/* //Select Critiria "Model" */}
                    <div className="col-md-4">
                    <label>Search by Invoice id</label>
                      <div className="input-group ">
                        <input
                          value={this.state.dobyinvoid}
                          onChange={async (e) => {
                            await this.setState({
                              dobyinvoid: e.target.value,
                            });
                          }}
                          type="text"
                          className="form-control"
                          placeholder="Input Invoice id "
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
                          this.setState({ dobylotqa : ('') });             
                          this.setState({ report1: ('') });
                          const dobyinvoid = this.state.dobyinvoid;

                          if (!dobyinvoid) {
                            Swal.fire({
                              icon: "error",
                              title: "Missing invoid",
                              text: "Please input invoid.",
                            });
                            return; // Stop execution if lot QA is missing
                          }
                          this.setState({ isDisable: true });
                          // this.doGetDataReport();
                          Swal.fire({
                            icon: "info",
                            title: "Loading Data",
                            timer: 120000,
                            allowOutsideClick: false,
                            didOpen: async () => {
                              Swal.showLoading();
                              await this. doGetdodatabyinvoid();
                              await new Promise((resolve) =>
                                setTimeout(resolve,100)
                                )
                              Swal.close();
                            },
                          }).then(() => {
                            if (this.state.report2.length > 0) {
                              if (
                                this.state.report2[0].DO_Num.length > 0
                              ) {
                                Swal.fire({
                                  icon: "success",
                                  title: "Success",
                                  text: "Data has been loaded successfully",
                                });
                              } else if (
                                this.state.report1[0].DO_Num.length == 0
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
                                title: "No production data",
                                text: "Please select other date",
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
                    <div className="col-md-4">
                      <CSVLink
                        data={this.state.Raw_Dat2}
                        filename={"DO Data report.csv"}
                      >
                        <button
                          type="button"
                          className="btn btn-primary"
                           style={{ marginTop: 30 }}
                        >
                          Download by Invoice
                        </button>
                      </CSVLink>
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
                          style={{ height: 500 }}
                        >
                          <table className="table table-head-fixed text-nowrap table-hover">
                            <thead>
                              <tr>
                                <th width="150">LotQA</th>
                                <th width="175">DO Num</th>
                                <th width="175">Part Num</th>
                                <th width="175">Part Rev</th>
                                <th width="175">Lot num(Datecode)</th>
                                <th width="175">Lot Qty</th>
                                <th width="175">DO Qty</th>
                                <th width="175">Ship date</th>                            
                              </tr>
                            </thead>
                            <tbody>{this.renderreport1()}</tbody>   
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
    )
  }
}

export default Trace_back_shipment;
