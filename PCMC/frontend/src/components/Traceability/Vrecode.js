import React, { Component } from "react";
import { key, server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import Chart from "react-apexcharts";
import moment from "moment";
import Select from "react-select";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";

class RejectByModel extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
     
      ItemNos: [],
      Datecodes1: 'blank',
      Datecodes2: 'blank',
      Datecodes3: 'blank',
      Datecodes4: 'blank',
      Datecodes5: 'blank',
      report: [],

      Raw_Dat: [],

      listItemNos: [],
      listDatecodes1: [],
      listDatecodes2: [],
      listDatecodes3: [],
      listDatecodes4: [],
      listDatecodes5: [],

      optionSelected: null,
      isDisable: false,
    };
  }

  componentDidMount = async () => {
    await this.getItemNos();

  };

  // report with select ItemNos,date,type
  doGetDataReport = async () => {
    const result = await httpClient.get(
      server.DATECODEALL_URL +
      "/" +
      this.state.ItemNos +
      "/" +
      this.state.Datecodes1[0].label +
      "/" +
      this.state.Datecodes2[0].label +
      "/" +
      this.state.Datecodes3[0].label +
      "/" +
      this.state.Datecodes4[0].label +
      "/" +
      this.state.Datecodes5[0].label
    );

    let rawData = result.data.listRawData
    console.log(rawData)
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i])
    }
    this.setState({Raw_Dat: rawData[0]})
    console.log(this.state.Raw_Dat)

    this.setState({
      report: result.data.result,
      isDisable: false,
    });
  };

  getItemNos = async () => {
    const array = await httpClient.get(server.ITEMNOS_URL);
    const options = array.data.result.map((d) => ({
      label: d.Model_No,
    }));
    this.setState({ listItemNos: options });
  };

  getDatecodes1 = async () => {
    const array = await httpClient.get(
      server.DATECODE_URL + "/" + this.state.ItemNos
    );
    const options = array.data.result.map((d) => ({
      label: d.Datecode,
    }));
    this.setState({ listDatecodes1: options });
  };

  getDatecodes2 = async () => {
    const array = await httpClient.get(
      server.DATECODE_URL + "/" + this.state.ItemNos
    );
    const options = array.data.result.map((d) => ({
      label: d.Datecode,
    }));
    this.setState({ listDatecodes2: options });
  };
  getDatecodes3 = async () => {
    const array = await httpClient.get(
      server.DATECODE_URL + "/" + this.state.ItemNos
    );
    const options = array.data.result.map((d) => ({
      label: d.Datecode,
    }));
    this.setState({ listDatecodes3: options });
  };
  getDatecodes4 = async () => {
    const array = await httpClient.get(
      server.DATECODE_URL + "/" + this.state.ItemNos
    );
    const options = array.data.result.map((d) => ({
      label: d.Datecode,
    }));
    this.setState({ listDatecodes4: options });
  };
  getDatecodes5 = async () => {
    const array = await httpClient.get(
      server.DATECODE_URL + "/" + this.state.ItemNos
    );
    const options = array.data.result.map((d) => ({
      label: d.Datecode,
    }));
    this.setState({ listDatecodes5: options });
  };
  renderReport = () => {
    if (this.state.report != null) {
      if (this.state.report.length > 0) {
        return this.state.report.map((item) => (
          <tr>
            <td>{item["Model_No"]}</td>
            <td>{item["Model_Name"]}</td>
            <td>{item["Datecode"]}</td>
            <td>{item["Lot_QA"]}</td>
            <td>{item["Mo_number"]}</td>
            <td align="RIGHT">{Number(item["MO_QTY"]).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
            <td>{item["line"]}</td>
            <td>{item["Date"]}</td>
            <td>{item["Baseplate"]}</td>
            <td>{item["Ramp"]}</td>
            <td>{item["Crashstop"]}</td>
            <td>{item["Hub"]}</td>
            <td>{item["Diverter"]}</td>
            <td>{item["FPC"]}</td>
            <td>{item["Magnet"]}</td>
            <td>{item["Supporter"]}</td>
            <td>{item["Special_control"]}</td>
            <td>{item["SP1"]}</td>
            <td>{item["SP2"]}</td>
            <td>{item["SP3"]}</td>
            <td>{item["SP4"]}</td>
            <td>{item["SP5"]}</td>
            <td>{item["Revision"]}</td>
            <td>{item["Machine_no"]}</td>
            <td>{item["CO2_EMP"]}</td>
            <td>{item["CO2_DATE"]}</td>
            <td>{item["CO2_SP1"]}</td>
            <td>{item["CO2_SP2"]}</td>

          </tr>
        ));
      }
    }
  };

  render() {

    console.log(this.state.ItemNos);
    console.log(this.state.rawData);
    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 80 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h2> Trace back component based on production data </h2>
            
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active"> Trace back component based on production data</li>
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
                    <label>Select Item No and Date code </label>
                  </h3>
                </div>

                <div className="card-body">
                  <div className="row">
                    {/* //Select Critiria "Model" */}
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>ItemNO</label>
                        <Select
                          options={this.state.listItemNos}
                          onChange={async (e) => {
                            await this.setState({ ItemNos: e.label });
                            await this.getDatecodes1();
                            await this.setState({
                              Datecodes1: [{ label: "Select Datecode" }],
                            });
                            await this.getDatecodes2();
                            await this.setState({
                              Datecodes2: [{ label: "Select Datecode" }],
                            });
                            await this.getDatecodes3();
                            await this.setState({
                              Datecodes3: [{ label: "Select Datecode" }],
                            });
                            await this.getDatecodes4();
                            await this.setState({
                              Datecodes4: [{ label: "Select Datecode" }],
                            });
                            await this.getDatecodes5();
                            await this.setState({
                              Datecodes5: [{ label: "Select Datecode" }],
                            });                   

                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select ItemNo"
                        />
                      </div>
                    </div>
                    <div className="col-md-1"></div>
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
                              await this.doGetDataReport();
                              setTimeout (() => { Swal.close();},1000)
                             
                            },
                          }).then(() => {
                            if (this.state.report.length > 0) {
                              if (this.state.report[0].Model_No.length > 0) {
                                Swal.fire({
                                  icon: "success",
                                  title: "Success",
                                  text: "Data has been loaded successfully",
                                });
                              } else if (
                                this.state.report[0].Model_No.length == 0
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
                      <CSVLink data={this.state.Raw_Dat}
                        filename={'QA_report.csv'}
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
                    <div className="col-md-4"></div>
                    {/* //Select Critiria "Datecode 1" */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Datecode(1)</label>
                        <Select
                          options={this.state.listDatecodes1}
                          value={this.state.Datecodes1[0]}
                          onChange={async (e) => {
                            await this.setState({ Datecodes1: [] });
                            await this.getDatecodes2();
                            this.state.Datecodes1.push({ label: e.label });
                            await this.getDatecodes5();
                            await this.setState({
                              Datecodes5: [{ label: "Select Datecode" }],
                            }); 
                            
                         
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select Datecode"
                        />
                      </div>
                    </div>
                    {/* //Select Critiria "Datecode2" */}
                    <div className="col-md-2">
                      <div className="form-group">
                      <label>Datecode(2)</label>
                        <Select
                          options={this.state.listDatecodes2}
                          value={this.state.Datecodes2[0]}
                          onChange={async (e) => {
                            await this.setState({ Datecodes2: [] });
                            await this.getDatecodes3();
                        
                            this.state.Datecodes2.push({ label: e.label });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select Datecode"
                        />
                      </div>
                    </div>
                    {/* //Select Critiria "Datecode3" */}
                    <div className="col-md-2">
                      <div className="form-group">
                      <label>Datecode(3)</label>
                        <Select
                          options={this.state.listDatecodes3}
                          value={this.state.Datecodes3[0]}
                          onChange={async (e) => {
                            await this.setState({ Datecodes3: [] });
                            await this.getDatecodes4();
                      
                            this.state.Datecodes3.push({ label: e.label });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select Datecode"
                        />
                      </div>
                    </div>
                    {/* //Select Critiria "Datecode4" */}
                    <div className="col-md-2">
                      <div className="form-group">
                      <label>Datecode(4)</label>
                        <Select
                          options={this.state.listDatecodes4}
                          value={this.state.Datecodes4[0]}
                          onChange={async (e) => {
                            await this.setState({ Datecodes4: [] });
                            await this.getDatecodes5();
                            this.state.Datecodes4.push({ label: e.label });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select Datecode"
                        />
                      </div>
                    </div>
                    {/* //Select Critiria "Datecode5" */}
                    <div className="col-md-2">
                      <div className="form-group">
                      <label>Datecode(5)</label>
                        <Select
                          options={this.state.listDatecodes5}
                          value={this.state.Datecodes5[0]}
                          onChange={async (e) => {
                            await this.setState({ Datecodes5: [] });
                            this.state.Datecodes5.push({ label: e.label });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select Datecode"
                        />
                      </div>
                    </div>
                    <div className="col-md-2"></div>
                
                  </div>
                </div>
              </div>
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
                          <table className="table table-head text-nowrap table-hover">
                            <thead>
                              <tr align="Center" >
                                <th width="175">Model_No</th>
                                <th width="175">Model_Name</th>
                                <th width="175">W/W</th>
                                <th width="175">Lot_QA</th>
                                <th width="175">Mo_number</th>
                                <th width="175">MO_QTY</th>
                                <th width="175">line</th>
                                <th width="175">Date</th>
                                <th width="175">Baseplate</th>
                                <th width="175">Ramp</th>
                                <th width="175">Crashstop</th>
                                <th width="175">Hub</th>
                                <th width="175">Diverter</th>
                                <th width="175">FPC</th>
                                <th width="175">Magnet</th>
                                <th width="175">Supporter</th>
                                <th width="175">Special_control</th>
                                <th width="175">SP1</th>
                                <th width="175">SP2</th>
                                <th width="175">SP3</th>
                                <th width="175">SP4</th>
                                <th width="175">SP5</th>
                                <th width="175">Revision</th>
                                <th width="175">Machine_no</th>
                                <th width="175">CO2_EMP</th>
                                <th width="175">CO2_DATE</th>
                                <th width="175">CO2_SP1</th>
                                <th width="175">CO2_SP2</th>
                              </tr>
                            </thead>
                            <tbody>{this.renderReport()}</tbody>
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

export default RejectByModel;
