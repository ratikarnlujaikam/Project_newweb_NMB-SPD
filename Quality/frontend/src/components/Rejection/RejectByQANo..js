import React, { Component } from "react";
import { key, server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import Chart from "react-apexcharts";
import moment from "moment";
import Select from "react-select";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";

class REJECTBYQANO extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      QANumber: "",
      report2: [],

      Raw_Dat: [],

      startDate: moment().format("yyyy-MM-DD"), //moment().add("days", -6).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"), //moment().format("yyyy-MM-DD"),

      listModel: [],
      listInsType: [],

      optionSelected: null,
      isDisable: false,
    };
  }

  doGetDataReport2 = async () => {
    const result = await httpClient.get(
      server.REJECTBYQA_URL + "/" + this.state.QANumber
    );

    let rawData = result.data.listRawData;
    console.log(rawData);
    console.log(rawData.length);
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

  renderReport2 = () => {
    if (this.state.report2 != null) {
      if (this.state.report2.length > 0) {
        return this.state.report2.map((item) => (
          <tr>
             <td>{item["Type"]}</td>
            <td>{item["Date"]}</td>
            <td>{item["Shift"]}</td>
            <td>{item["Model_NO"]}</td>
            <td>{item["Model_group"]}</td>
            <td>{item["Model_Name"]}</td>
            <td>{item["Line"]}</td>
            <td>{item["QA_No"]}</td>
            <td>{item["Vis_Round"]}</td>
            <td>{item["Level"]}</td>
            <td>{item["Result"]}</td>
            <td align="RIGHT">{Number(item["SamplingQTY"]).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
            <td>{item["NG"]}</td>
            <td>{item["Detail"]}</td>
            <td align="RIGHT">{Number(item["QTY"]).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
            <td>{item["Location"]}</td>
            <td>{item["CO2"]}</td>
            <td>{item["Emp_CO2"]}</td>
            <td>{item["RecordBy"]}</td>
            <td>{item["VisualTime"]}</td>
            <td>{item["VisualName"]}</td>
            <td>{item["InsNumber"]}</td>
            
          </tr>
        ));
      }
    }
  };

  render() {
    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 50 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Reject by QA Number</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">Reject by QA Number</li>
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
                    <label>Scan QA Number</label>
                  </h3>
                </div>

                <div className="card-body">
                  <div className="row">
                    {/* //Select Critiria "Model" */}
                    <div className="col-md-3">
                      <div className="input-group ">
                        <input
                          value={this.state.QANumber}
                          onChange={async (e) => {
                            await this.setState({
                              QANumber: e.target.value,
                            });
                          }}
                          type="text"
                          className="form-control"
                          placeholder="Scan QANumber here"
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
                              await this.doGetDataReport2();
                              Swal.close();
                            },
                          }).then(() => {
                            if (this.state.report2.length > 0) {
                              if (this.state.report2[0].Model_group.length > 0) {
                                Swal.fire({
                                  icon: "success",
                                  title: "Success",
                                  text: "Data has been loaded successfully",
                                });
                              } else if (
                                this.state.report2[0].Model_group.length == 0
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
                        // style={{ marginTop: 30 }}
                      >
                        Submit
                      </button>
                    </div>
                    <div className="col-md-1">
                      <CSVLink data={this.state.Raw_Dat}
                      filename={'QA_report.csv'}>
                        <button
                          type="button"
                          className="btn btn-primary"
                          // style={{ marginTop: 30 }}
                        >
                          Download
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
                          style={{ height: 400 }}
                        >
                          <table className="table table-head-fixed text-nowrap table-hover">
                            <thead>
                              <tr>
                              <th width="150">Type</th>
                                <th width="175">Date</th>
                                <th width="175">Shift</th>
                                <th width="175">Model_NO</th>
                                <th width="175">Model_group</th>
                                <th width="175">Model_Name</th>
                                <th width="175">Line</th>
                                <th width="175">QA_No</th>
                                <th width="175">Vis_Round</th>
                                <th width="175">Level</th>
                                <th width="175">Result</th>
                                <th width="175">SamplingQTY</th>
                                <th width="175">NG</th>
                                <th width="175">Detail</th>
                                <th width="175">QTY</th>
                                <th width="175">Location</th>
                                <th width="175">CO2</th>
                                <th width="175">Emp_CO2</th>
                                <th width="175">RecordBy</th>
                                <th width="175">VisualTime</th>
                                <th width="175">VisualName</th>
                                <th width="175">InsNumber</th>
                           
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

export default REJECTBYQANO;
