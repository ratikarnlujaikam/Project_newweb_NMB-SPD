import React, { Component } from "react";
import { key, server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import moment from "moment";

import Swal from "sweetalert2";
import { CSVLink } from "react-csv";


class QA_lots_status extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      QANumber1: '',
      QANumber2: '* * * *',
      QANumber3: '* * * *',
      QANumber4: '* * * *',
      QANumber5: '* * * *',
      QANumber6: '* * * *',
      QANumber7: '* * * *',
      QANumber8: '* * * *',
      QANumber9: '* * * *',
      QANumber10: '* * * *',
      stc: " ",
      newDate: [],
      report1: [],
      report2: [],

      Raw_Dat: [],

      startDate: moment().format("yyyy-MM-DD"), //moment().add("days", -6).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"), //moment().format("yyyy-MM-DD"),

      listresult: [],
      listInsType: [],

      optionSelected: null,
      isDisable: false,
    };
  }
  componentDidMount = async () => {
   

  };

  doGetDataReport2 = async () => {
    const result = await httpClient.get(
      server.MOVEMENTQA_URL +
      "/" + (this.state.QANumber1 !== null ? this.state.QANumber1 : "") +
      "/" + (this.state.QANumber2 !== null ? this.state.QANumber2 : "") +
      "/" + (this.state.QANumber3 !== null ? this.state.QANumber3 : "") +
      "/" + (this.state.QANumber4 !== null ? this.state.QANumber4 : "") +
      "/" + (this.state.QANumber5 !== null ? this.state.QANumber5 : "") +
      "/" + (this.state.QANumber6 !== null ? this.state.QANumber6 : "") +
      "/" + (this.state.QANumber7 !== null ? this.state.QANumber7 : "") +
      "/" + (this.state.QANumber8 !== null ? this.state.QANumber8 : "") +
      "/" + (this.state.QANumber9 !== null ? this.state.QANumber9 : "") +
      "/" + (this.state.QANumber10 !== null ? this.state.QANumber10 : "")
      


    );
    let rawData = result.data.listRawData;
    console.log(rawData);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat: rawData[0] });
    console.log(this.state.Raw_Dat);

    this.setState({
      report2: result.data.result,
      isDisable: false,
    });
  };
  getresult = async () => {
    const array = await httpClient.get(server.RESULT_URL);
    const options = array.data.result.map((d) => ({
      label: d.InspectionResult,
    }));
    this.setState({ listresult: options });
  };

  renderReport1 = () => {
    if (this.state.report2 != null) {
      if (this.state.report2.length > 0) {
        return this.state.report1.map((item) => (
          <tr>
            <td>{item["QA_Number"]}</td>
          </tr>
        ));
      }
    }
  };
  renderReport2 = () => {
    if (this.state.report2 != null) {
      if (this.state.report2.length > 0) {
        return this.state.report2.map((item) => (
          <tr>
            <td>{item["QA_Number"]}</td>
            <td>{item["Date"]}</td>
            <td>{item["Item_Number"]}</td>
            <td>{item["Model_Name"]}</td>
            <td>{item["MONumber"]}</td>
            <td>{item["QA_QTY"]}</td>
            <td>{item["DateCode"]}</td>
            <td>{item["Inspection_Round"]}</td>
            <td>{item["Inspection_Type"]}</td>
          <td
  style={{
    color: item["Inspection_Result"] === "ACCEPT" ? "green" : "red"
  }}
>
  {item["Inspection_Result"]}
</td>


          </tr>
        ));
      }
    }
  };

  render() {
    console.log(this.state.QANumber1);
    console.log(this.state.QANumber2);
    console.log(this.state.QANumber3);
    console.log(this.state.QANumber4);
    console.log(this.state.QANumber5);
    console.log(this.state.QANumber6);
    console.log(this.state.QANumber7);
    console.log(this.state.QANumber8);
    console.log(this.state.QANumber9);
    console.log(this.state.report2);
    console.log(this.state.stc);
    return (

      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 70 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-9">
                  <h1>QA lots status</h1>
                </div>
                <div className="col-sm-3">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">QA lots status</li>
                  </ol>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="row">
          <div className="col-sm-12">
            <div className="card card-primary card-outline">
              <div className="card-header">
                <h3 className="card-title">
                  <label>Please scan QA number from QA movement Tag</label>
                </h3>
              </div>


              <div className="card-body">
                <div className="row">

                  {/* //Select Critiria "Qanumber1" */}                  
                  <div className="col-md-2" >
                  <label style={{ marginTop: 5 }} >(1.)   </label>
                    <div className="form-group">
                      <input
                        value={this.state.QANumber1}
                        onChange={async (e) => {
                          await this.setState({
                            QANumber1: e.target.value,
                          });
                        }}

                        type="text"
                        className="form-control"
                        placeholder="Scan QANumber"
                      />
                    </div>
                    <div className="col-md-2">
                    </div>
                    <label style={{ color: "blue" }}><span>{this.state.QANumber1.substring(18, 29)}  {this.state.QANumber1.substring(8, 12)}</span></label>
                  </div>

                  {/* //Select Critiria "Qanumber2" */}                  
                  <div className="col-md-2" >
                  <label style={{ marginTop: 5 }} >(2.)   </label>
                    <div className="form-group">
                      <input
                        value={this.state.QANumber2}
                        onChange={async (e) => {
                          await this.setState({
                            QANumber2: e.target.value,
                          });
                        }}

                        type="text"
                        className="form-control"
                        placeholder="Scan QANumber"
                      />
                    </div>
                    <div className="col-md-2">
                    </div>
                    <label style={{ color: "blue" }}><span>{this.state.QANumber2.substring(18, 29)}  {this.state.QANumber2.substring(8, 12)}</span></label>
                  </div>

                  {/* //Select Critiria "Qanumber3" */}                  
                  <div className="col-md-2" >
                  <label style={{ marginTop: 5 }} >(3.)   </label>
                    <div className="form-group">
                      <input
                        value={this.state.QANumber3}
                        onChange={async (e) => {
                          await this.setState({
                            QANumber3: e.target.value,
                          });
                        }}

                        type="text"
                        className="form-control"
                        placeholder="Scan QANumber"
                      />
                    </div>
                    <div className="col-md-2">
                    </div>
                    <label style={{ color: "blue" }} ><span>{this.state.QANumber3.substring(18, 29)}  {this.state.QANumber3.substring(8, 12)}</span></label>
                  </div>

                  {/* //Select Critiria "Qanumber4" */}                  
                  <div className="col-md-2" >
                  <label style={{ marginTop: 5 }} >(4.)   </label>
                    <div className="form-group">
                      <input
                        value={this.state.QANumber4}
                        onChange={async (e) => {
                          await this.setState({
                            QANumber4: e.target.value,
                          });
                        }}

                        type="text"
                        className="form-control"
                        placeholder="Scan QANumber"
                      />
                    </div>
                    <div className="col-md-2">
                    </div>
                    <label style={{ color: "blue" }}><span>{this.state.QANumber4.substring(18, 29)}  {this.state.QANumber4.substring(8, 12)}</span></label>
                  </div>

                  {/* //Select Critiria "Qanumber4" */}                  
                  <div className="col-md-2" >
                  <label style={{ marginTop: 5 }} >(5.)   </label>
                    <div className="form-group">
                      <input
                        value={this.state.QANumber5}
                        onChange={async (e) => {
                          await this.setState({
                            QANumber5: e.target.value,
                          });
                        }}

                        type="text"
                        className="form-control"
                        placeholder="Scan QANumber"
                      />
                    </div>
                    <div className="col-md-2">
                    </div>
                    <label style={{ color: "blue" }} ><span>{this.state.QANumber5.substring(18, 29)}  {this.state.QANumber5.substring(8, 12)}</span></label>
                  </div>

                  <div className="col-md-2" ></div>

                  {/* //Select Critiria "Qanumber6" */}                  
                  <div className="col-md-2" >
                  <label style={{ marginTop: 5 }} >(6.)   </label>
                    <div className="form-group">
                      <input
                        value={this.state.QANumber6}
                        onChange={async (e) => {
                          await this.setState({
                            QANumber6: e.target.value,
                          });
                        }}

                        type="text"
                        className="form-control"
                        placeholder="Scan QANumber"
                      />
                    </div>
                    <div className="col-md-2">
                    </div>
                    <label style={{ color: "blue" }} ><span>{this.state.QANumber6.substring(18, 29)}  {this.state.QANumber6.substring(8, 12)}</span></label>
                  </div>

                  {/* //Select Critiria "Qanumber7" */}                  
                  <div className="col-md-2" >
                  <label style={{ marginTop: 5 }} >(7.)   </label>
                    <div className="form-group">
                      <input
                        value={this.state.QANumber7}
                        onChange={async (e) => {
                          await this.setState({
                            QANumber7: e.target.value,
                          });
                        }}

                        type="text"
                        className="form-control"
                        placeholder="Scan QANumber"
                      />
                    </div>
                    <div className="col-md-2">
                    </div>
                    <label style={{ color: "blue" }} ><span>{this.state.QANumber7.substring(18, 29)}  {this.state.QANumber7.substring(8, 12)}</span></label>
                  </div>

                  {/* //Select Critiria "Qanumber4" */}                  
                  <div className="col-md-2" >
                  <label style={{ marginTop: 5 }} >(8.)   </label>
                    <div className="form-group">
                      <input
                        value={this.state.QANumber8}
                        onChange={async (e) => {
                          await this.setState({
                            QANumber8: e.target.value,
                          });
                        }}

                        type="text"
                        className="form-control"
                        placeholder="Scan QANumber"
                      />
                    </div>
                    <div className="col-md-2">
                    </div>
                    <label style={{ color: "blue" }}><span>{this.state.QANumber8.substring(18, 29)}  {this.state.QANumber8.substring(8, 12)}</span></label>
                  </div>

                  {/* //Select Critiria "Qanumber9" */}                  
                  <div className="col-md-2" >
                  <label style={{ marginTop: 5 }} >(9.)   </label>
                    <div className="form-group">
                      <input
                        value={this.state.QANumber9}
                        onChange={async (e) => {
                          await this.setState({
                            QANumber9: e.target.value,
                          });
                        }}

                        type="text"
                        className="form-control"
                        placeholder="Scan QANumber"
                      />
                    </div>
                    <div className="col-md-2">
                    </div>
                    <label style={{ color: "blue" }}><span>{this.state.QANumber9.substring(18, 29)}  {this.state.QANumber9.substring(8, 12)}</span></label>
                  </div>

                  {/* //Select Critiria "Qanumber10" */}                  
                  <div className="col-md-2" >
                  <label style={{ marginTop: 5 }} >(10.)   </label>
                    <div className="form-group">
                      <input
                        value={this.state.QANumber10}
                        onChange={async (e) => {
                          await this.setState({
                            QANumber10: e.target.value,
                          });
                        }}

                        type="text"
                        className="form-control"
                        placeholder="Scan QANumber"
                      />
                    </div>
                    <div className="col-md-2"></div>
                    <label style={{ color: "blue" }}><span>{this.state.QANumber10.substring(18, 29)}
                      {this.state.QANumber10.substring(8, 12)}</span></label>
                  </div>

                  <div className="col-md-2" ></div>

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
                            await this.doGetDataReport2();
                            await new Promise((resolve) => {
                              setTimeout(resolve, 100);
                            });
                            Swal.close();
                          },
                        }).then(() => {
                          if (this.state.report2.length > 0) {
                            if (this.state.report2[0].QA_Number.length > 0) {
                              Swal.fire({
                                icon: "success",
                                title: "Success",
                                text: "Data has been loaded successfully",
                              });
                            } else if (
                              this.state.report2[0].QA_Number.length == 0
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
          


                    // style={{ marginTop: 30 }}
                    >
                      Submit
                    </button>
                    </div>

                  {/* Submit Download */}
                  <div className="col-md-1">
                    <CSVLink data={this.state.Raw_Dat}
                      filename={'QA_report.csv'}>

                      <button
                        type="submit"
                        className="btn btn-primary"
           

                      >
                        Download
                      </button>
                    </CSVLink>

                  </div>

                  <div className="col-md-2">
                    {/* Submit reset */}
                    <button
                      disabled={this.state.isDisable}
                      // type="button"
                      // className="btn btn-info btn-flat"
                      onClick={(e) => {
                        this.setState({ QANumber1: ('') });
                        this.setState({ QANumber2: ('* * * *') });
                        this.setState({ QANumber3: ('* * * *') });
                        this.setState({ QANumber4: ('* * * *') });
                        this.setState({ QANumber5: ('* * * *') });
                        this.setState({ QANumber6: ('* * * *') });
                        this.setState({ QANumber7: ('* * * *') });
                        this.setState({ QANumber8: ('* * * *') });
                        this.setState({ QANumber9: ('* * * *') });
                        this.setState({ QANumber10: ('* * * *') });
                        this.setState({ report2: ('') });
                      }}
                      type="submit"
                      className="btn btn-primary"
         
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
              {/* Table*/}
              <div className="content">
                <div className="container-fluid">
                  <div className="card card-primary">
                    <div className="row">
                      <div className="col-12">
                        {/* /.card-header */}
                        <div
                          className="card-body table-responsive p-0"
                          style={{ height: 800 }}
                        >
                          <table className="table table-head-fixed text-nowrap table-hover"  >
                            <thead>
                              <tr >

                                <th width="175">QA_Number</th>
                                <th width="175">Date</th>
                                <th width="175">Item_Number</th>
                                <th width="175">Model_Name</th>
                                <th width="175">MONumber</th>
                                <th width="175">QA_QTY</th>
                                <th width="175">DateCode</th>
                                <th width="175">Inspection_Round</th>
                                <th width="175">Inspection_Type</th>
                                <th width="175">Inspection_Result</th>
                              </tr>
                            </thead>
                            <tbody>{this.renderReport2()}</tbody>
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

export default QA_lots_status;
