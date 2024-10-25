import React, { Component } from "react";
import { key, server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import moment from "moment";
import Select from "react-select";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";

class QAInspection extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      model: { label: "**ALL**" },
      insType: [{ label: "**ALL**" }],
      report: [],
      QANumber: "",
      report2: [],

      Raw_Dat2: [],

      Raw_Dat: [],

      startDate: moment().format("yyyy-MM-DD"), //moment().add("days", -6).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"), //moment().format("yyyy-MM-DD"),

      listModel: [],
      listInsType: [],

      optionSelected: null,
      isDisable: false,
    };
  }

  componentDidMount = async () => {
    await this.getModel();

  };

  // report with select model,date,type
  doGetDataReport = async () => {
    const modelLabel =
      this.state.model.label === "**ALL**" ? "**ALL**" : this.state.model.label;
    const result = await httpClient.get(
      server.REPORT_URL +
        "/" +
        modelLabel +
        "/" +
        this.state.insType[0].label +
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
    this.setState({ Raw_Dat: rawData[0] });
    console.log(this.state.Raw_Dat);

    this.setState({
      report: result.data.result,
      isDisable: false,
    });
  };
  doGetDataReport2 = async () => {
    const result = await httpClient.get(
      server.REPORT2_URL + "/" + this.state.QANumber
    );

    let rawData = result.data.listRawData2;
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



  getModel = async () => {
    const array = await httpClient.get(server.MODELQA_URL);
    const options = array.data.result.map((d) => ({
      label: d.Model_group,
    }));
    this.setState({ listModel: options });
  };

  getInsType = async () => {
    const modelLabel =
    this.state.model.label === "**ALL**"
      ? "**ALL**"
      : this.state.model.label;
    const array = await httpClient.get(
      server.INSTYPE_URL + "/" + modelLabel
    );
    const options = array.data.result.map((d) => ({
      label: d.InspectionType,
    }));
    this.setState({ listInsType: options });
  };

  renderReport = () => {
    if (this.state.report != null) {
      if (this.state.report.length > 0) {
        return this.state.report.map((item,index) => (
          <tr key={item.id || index}>
            <td>{item["Date"]}</td>
            <td>{item["Shift"]}</td>
            <td>{item["Model_NO"]}</td>
            <td>{item["Model_group"]}</td>
            <td>{item["Model_Name"]}</td>
            <td>{item["Line"]}</td>
            <td>{item["QA_Number"]}</td>
            <td align="right">
              {Number(item["QA_QTY"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>{item["MO_Number"]}</td>
            <td>{item["Date_Code"]}</td>
            <td align="right">
              {Number(item["MO_QTY"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>{item["Inspection_Type"]}</td>
            <td>{item["Inspection_Round"]}</td>
            <td>{item["Inspection_Result"]}</td>
            <td>{item["Sampling_Level"]}</td>
            <td>{item["Sampling_QTY"]}</td>
            <td>{item["Base"]}</td>
            <td>{item["Ramp"]}</td>
            <td>{item["Hub"]}</td>
            <td>{item["Magnet"]}</td>
            <td>{item["FPC"]}</td>
            <td>{item["Diverter"]}</td>
            <td>{item["Crash_Stop"]}</td>
            <td>{item["Supporter_Name"]}</td>
            <td>{item["Record_By"]}</td>
            <td>{item["Visual_Name"]}</td>
            <td>{item["Visual_Time"]}</td>
            <td>{item["MC_CO2"]}</td>
            <td>{item["Emp_CO2"]}</td>
            <td>{item["SpecialControl1"]}</td>
            <td>{item["SpecialControl2"]}</td>
            <td>{item["SpecialControl3"]}</td>
            <td>{item["SpecialControl4"]}</td>
            <td>{item["SpecialControl5"]}</td>
            <td>{item["Inspection_Number"]}</td>
            <td>{item["Location"]}</td>
            <td>{item["Defect_NG"]}</td>
            <td>{item["Detail"]}</td>
            <td>{item["QTY"]}</td>
            <td>{item["Step"]}</td>
            <td>{item["Reject_level"]}</td>
            <td>{item["Major_Category"]}</td>
            <td>{item["Sorting_criteria"]}</td>
            <td>{item["Time_VMI"]}</td>
            <td>{item["Remark_VMI"]}</td>
            <td>{item["REV"]}</td>
            <td>{item["Remark"]}</td>
            <td>{item["Remark2_QA"]}</td>
    
          </tr>
        ));
      }
    }
  };
  renderReport2 = () => {
    if (this.state.report2 != null) {
      if (this.state.report2.length > 0) {
        return this.state.report2.map((item,index) => (
          <tr key={item.id || index}>
            <td>{item["Date"]}</td>
            <td>{item["Shift"]}</td>
            <td>{item["Model_NO"]}</td>
            <td>{item["Model_group"]}</td>
            <td>{item["Model_Name"]}</td>
            <td>{item["Line"]}</td>
            <td>{item["QA_Number"]}</td>
            <td align="right">
              {Number(item["QA_QTY"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>{item["MO_Number"]}</td>
            <td>{item["Date_Code"]}</td>
            <td align="right">
              {Number(item["MO_QTY"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>{item["Inspection_Type"]}</td>
            <td>{item["Inspection_Round"]}</td>
            <td>{item["Inspection_Result"]}</td>
            <td>{item["Sampling_Level"]}</td>
            <td>{item["Sampling_QTY"]}</td>
            <td>{item["Base"]}</td>
            <td>{item["Ramp"]}</td>
            <td>{item["Hub"]}</td>
            <td>{item["Magnet"]}</td>
            <td>{item["FPC"]}</td>
            <td>{item["Diverter"]}</td>
            <td>{item["Crash_Stop"]}</td>
            <td>{item["Supporter_Name"]}</td>
            <td>{item["Record_By"]}</td>
            <td>{item["Visual_Name"]}</td>
            <td>{item["Visual_Time"]}</td>
            <td>{item["MC_CO2"]}</td>
            <td>{item["Emp_CO2"]}</td>
            <td>{item["SpecialControl1"]}</td>
            <td>{item["SpecialControl2"]}</td>
            <td>{item["SpecialControl3"]}</td>
            <td>{item["SpecialControl4"]}</td>
            <td>{item["SpecialControl5"]}</td>
            <td>{item["Inspection_Number"]}</td>
            <td>{item["Location"]}</td>
            <td>{item["Defect_NG"]}</td>
            <td>{item["Detail"]}</td>
            <td>{item["QTY"]}</td>
            <td>{item["Step"]}</td>
            <td>{item["Reject_level"]}</td>
            <td>{item["Major_Category"]}</td>
            <td>{item["Sorting_criteria"]}</td>
            <td>{item["Time_VMI"]}</td>
            <td>{item["Remark_VMI"]}</td>
            <td>{item["REV"]}</td>
            <td>{item["Remark"]}</td>
            <td>{item["Remark2_QA"]}</td>
    
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
                  <h1>QA by Model & Number </h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
      
                    <li className="breadcrumb-item active">QA By Model </li>
                  </ol>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="container-fluid">
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
                        <div></div>
                        <label>Model group</label>
                        <Select
                          options={this.state.listModel}
                          value={this.state.model}
                          onChange={async (e) => {
                            await this.setState({ model: e });
                            await this.getInsType();
                            await this.setState({
                              insType: [{ label: "Select Type" }],
                            });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select Model"
                         
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
                            await this.setState({ insType: [] });
                            this.state.insType.push({ label: e.label });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select Type"
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
                          this.setState({ QANumber: "" });
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
                              await this.doGetDataReport();
                              await new Promise((resolve)=>
                              setTimeout(resolve,100)
                              );
                              Swal.close();
                            },
                          }).then(() => {
                            if (this.state.report.length > 0) {
                              if (this.state.report[0].Model_group.length > 0) {
                                Swal.fire({
                                  icon: "success",
                                  title: "Success",
                                  text: "Data has been loaded successfully",
                                });
                              } else if (
                                this.state.report[0].Model.length == 0
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

                    <div className="col-md-3">
                      <CSVLink
                        data={this.state.Raw_Dat}
                        filename={"QA_report.csv"}
                      >
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ marginTop: 30 }}
                        >
                          Download by Model
                        </button>
                      </CSVLink>
                    </div>


                  </div>
                </div>
              </div>
              
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

                            await this.setState({
                              insType: [{ label: "Select Type" }],
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
                     
                          if (!this.state.QANumber ||this.state.QANumber.trim()===""){
                            Swal.fire({
                              icon:"error",
                              title:"Input Required",
                              text:"Please input QAnumber"
                            })
                            return;
                          }
                          this.setState({ report: "" });
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
                              await new Promise((resolve)=>
                                setTimeout(resolve,100)
                              
                              )
                              Swal.close();
                            },
                          }).then(() => {
                            if (this.state.report2.length > 0) {
                              if (
                                this.state.report2[0].Model_group.length > 0
                              ) {
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
                                }).then(() => {
                                  // รีเฟรชหน้าใหม่
                                window.location.reload();
                                });
                              }
                            } else {
                              Swal.fire({
                                icon: "error",
                                title: "No production data",
                                text: "Please select other date",
                              }).then(() => {
                                // รีเฟรชหน้าใหม่
                                window.location.reload();
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
                    <div className="col-md-3">
                      <CSVLink
                        data={this.state.Raw_Dat2}
                        filename={"QA_report.csv"}
                      >
                        <button
                          type="button"
                          className="btn btn-primary"
                          // style={{ marginTop: 30 }}
                        >
                          Download by Lot QA
                        </button>
                      </CSVLink>
                    </div>
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
                          style={{ height: 500 ,
                            zIndex: "3",
                            position: "relative",
                            zIndex: "0",}}
                     
                        >
                          <table className=" table  text-nowrap table-hover table-head-fixed">
                            <thead>
                              <tr align="center">
                                <th width="175">Date</th>
                                <th width="175">Shift</th>
                                <th width="175">Model NO.</th>
                                <th width="175">Model group</th>
                                <th width="175">Model Name</th>
                                <th width="175">Line</th>
                                <th width="175">QA Number</th>
                                <th width="175">QA QTY</th>
                                <th width="175">MO Number</th>
                                <th width="175">Date Code</th>
                                <th width="175">MO QTY</th>
                                <th width="175">Inspection Type</th>
                                <th width="175">Inspection Round</th>
                                <th width="175">Inspection Result</th>
                                <th width="175">Sampling Level</th>
                                <th width="175">Sampling QTY</th>
                                <th width="175">Base</th>
                                <th width="175">Ramp</th>
                                <th width="175">Hub</th>
                                <th width="175">Magnet</th>
                                <th width="175">FPC</th>
                                <th width="175">Diverter</th>
                                <th width="175">Crash Stop</th>
                                <th width="175">Supporter Name</th>
                                <th width="175">Record By</th>
                                <th width="175">Visual Name</th>
                                <th width="175">Visual Time</th>
                                <th width="175">MC CO2</th>
                                <th width="175">Emp CO2</th>
                                <th width="175">SpecialControl1</th>
                                <th width="175">SpecialControl2</th>
                                <th width="175">SpecialControl3</th>
                                <th width="175">SpecialControl4</th>
                                <th width="175">SpecialControl5</th>
                                <th width="175">Inspection Number</th>
                                <th width="175">Location </th>
                                <th width="175">Defect NG </th>
                                <th width="175">Detail </th>
                                <th width="175">QTY </th>
                                <th width="175">Step </th>
                                <th width="175">Reject level </th>
                                <th width="175">Major Category </th>
                                <th width="175">Sorting criteria</th>
                                <th width="175">Time VMI</th>
                                <th width="175">Remark VMI</th>
                                <th width="175">REV</th>
                                <th width="175">QA Remark 1</th>
                                <th width="175">QA Remark 2</th>
                              </tr>
                            </thead>
                            <tbody>{this.renderReport()}</tbody>
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

export default QAInspection;
