import React, { Component } from "react";
import { key, server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import Chart from "react-apexcharts";
import moment from "moment";
import Select from "react-select";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";


class Request_label_printing_report extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      model: { label: "**ALL**" },
      Line: [{ label: "**ALL**" }],
      confirm: [{ label: "wait_confirm" }],
      report: [],
      QANumber: "",
      report2: [],
      Raw_Dat2: [],
      Raw_Dat: [],
      startDate: moment().format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"),
      listModel: [], // Define your list of models here
      listLine: [], // Define your list of Line No. options here
      listconfirm: [], // Define your list of confirmation options here
      optionSelected: null,
      isDisable: false,
    };
  }

  componentDidMount = async () => {
    await this.getModel();
    await this.getLine();
    await this.getconfirm();
  };

  // report with select model,date,type
  doGetDataReport = async () => {
    const modelLabel =
      this.state.model.label === "**ALL**" ? "**ALL**" : this.state.model.label;
    const result = await httpClient.get(
      server.REPORTprintlabal_URL +
        "/" +
        modelLabel +
        "/" +
        this.state.Line[0].label +
        "/" +
        this.state.confirm[0].label +
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

  renderReport = () => {
    if (this.state.report != null) {
      if (this.state.report.length > 0) {
        return this.state.report.map((item) => (
          <tr key={item.id}>
            <td>{item["date"]}</td>
            <td>{item["Model_name"]}</td>
            <td>{item["Model_ID"]}</td>
            <td>{item["Line"]}</td>
            <td>{item["Motor"]}</td>
            <td>{item["Revision"]}</td>
            <td>{item["WW"]}</td>
            <td>{item["Ramp"]}</td>
            <td>{item["Ramp_ID"]}</td>
            <td>{item["CrashStop"]}</td>
            <td>{item["CrashStop_ID"]}</td>
            <td>{item["Base"]}</td>
            <td>{item["Base_ID"]}</td>
            <td>{item["CODE_Line"]}</td>

            <td>{item["MSH_name"]}</td>
            <td>{item["MSH_ID"]}</td>
            <td align="RIGHT">
              {Number(item["Qty"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>{item["TimeStamp"]}</td>
            <td>{item["Requester"]}</td>
            <td>{item["Tray"]}</td>
            <td>{item["Tray_Qty"]}</td>
            <td>{item["Status"]}</td>
            <td>{item["Diverter/Airdam"]}</td>
            <td>{item["Stack"]}</td>
            <td>{item["Temperature"]}</td>
            <td>{item["Order_Number"]}</td>
            <td>{item["Time_Alarm"]}</td>
            <td>{item["Confirmation"]}</td>
            <td>{item["User_Confirm"]}</td>
            <td>{item["Receiver"]}</td>
          </tr>
        ));
      }
    }
  };

  getModel = async () => {
    try {
      const response = await httpClient.get(server.MODELLABAL_URL);
      const options = response.data.result.map((d) => ({
        label: d.Model,
      }));
      this.setState({ listModel: options });
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  getLine = async () => {
    try {
      const modelLabel =
        this.state.model.label === "**ALL**"
          ? "**ALL**"
          : this.state.model.label;
      const response = await httpClient.get(
        server.LINELABAL_URL + "/" + modelLabel
      );
      const options = response.data.result.map((d) => ({
        label: d.Line,
      }));
      this.setState({ listLine: options });
    } catch (error) {
      console.error("Error fetching lines:", error);
    }
  };

  getconfirm = async () => {
    const array = await httpClient.get(server.CONFIRMLABAL_URL);
    const options = array.data.result.map((d) => ({
      label: d.confirm,
    }));
    this.setState({ listconfirm: options });
  };

  render() {
    console.log(this.state.model);
    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 70 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Request label printing report </h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">
                    Request label printing report{" "}
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
                    <div className="col-sm-2">
                      <div className="form-group">
                        <div></div>
                        <label>Model group</label>
                        <Select
                          options={this.state.listModel}
                          value={this.state.model}
                          onChange={async (e) => {
                            await this.setState({ model: e });
                            await this.getLine(); // เมื่อเลือก model ใหม่ จะอัปเดต line
                            await this.getconfirm(); // เมื่อเลือก model ใหม่ จะอัปเดต confirm
                            await this.setState({
                              Line: [{ label: "Select Line" }],
                              confirm: [{ label: "Select Confirm" }],
                            });
                          }}
                          placeholder="Select Model"
                        />
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Line No.</label>
                        <Select
                          options={this.state.listLine}
                          value={this.state.Line[0]}
                          onChange={async (e) => {
                            await this.setState({ Line: [e] }); // อัปเดต line ที่เลือก
                            await this.getconfirm(); // เมื่อเลือก line ใหม่ จะอัปเดต confirm
                            await this.setState({
                              confirm: [{ label: "Select Confirm" }],
                            });
                          }}
                          placeholder="Select Line No."
                        />
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Confirm</label>
                        <Select
                          options={this.state.listconfirm}
                          value={this.state.confirm[0]}
                          onChange={async (e) => {
                            await this.setState({ confirm: [e] }); // อัปเดต confirm ที่เลือก
                          }}
                          placeholder="Select Confirm"
                        />
                      </div>
                    </div>

                    <div className="col-sm-2">
                      <div className="form-group">
                        <label>By Daily Select From &nbsp;</label>
                        <input
                          value={this.state.startDate}
                          onChange={(e) => {
                            this.setState({ startDate: e.target.value });
                          }}
                          type="date"
                          className="form-control"
                          placeholder="Select Start Date"
                          // // Disable the input if confirm is 'OK'
                          // disabled={
                          //   this.state.confirm.length > 0 &&
                          //   this.state.confirm[0].label !== "OK"
                          // }
                        />
                      </div>
                    </div>

                    {/* Select Finish Date */}
                    <div className="col-sm-2">
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
                          // // Disable the input if confirm is 'OK'
                          // disabled={
                          //   this.state.confirm.length > 0 &&
                          //   this.state.confirm[0].label !== "OK"
                          // }
                        />
                      </div>
                    </div>

                    {/* Submit button */}
                    <div className="col-sm-1">
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
                              setTimeout(() => {
                                Swal.close();
                              }, 2000);
                           
                            },
                          }).then(() => {
                            if (this.state.report.length > 0) {
                              if (this.state.report[0].Model_name.length > 0) {
                                Swal.fire({
                                  icon: "success",
                                  title: "Success",
                                  text: "Data has been loaded successfully",
                                });
                              } else if (
                                this.state.report[0].Model_name.length == 0
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
                        style={{ marginTop: 30 }}
                      >
                        Submit
                      </button>
                    </div>

                    <div className="col-md-1.5">
                      <CSVLink
                        data={this.state.Raw_Dat}
                        filename={"report.csv"}
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

              {/* Table*/}
              <div class="content">
                <div class="container-fluid">
                  <div className="card card-primary">
                    <div className="row">
                      <div className="col-12">
                        {/* /.card-header */}
                        <div
                          className="card-body table-responsive p-0"
                          style={{ height: 500 ,
                            zIndex: "3",
                            position: "relative",
                            zIndex: "0"}}
                        >
                          <table className=" table  table-striped text-nowrap table-hover table-head-fixed">
                            <thead>
                                <tr  align="center">
                                  <th width="175">Date</th>
                                  <th width="175">Model_name</th>
                                  <th width="175">Model_ID</th>
                                  <th width="200">Line</th>
                                  <th width="175">Motor</th>
                                  <th width="175">Revision</th>
                                  <th width="175">WW</th>
                                  <th width="175">Ramp</th>
                                  <th width="175">Ramp_ID</th>
                                  <th width="175">CrashStop</th>
                                  <th width="175">CrashStop_ID</th>
                                  <th width="175">Base</th>
                                  <th width="175">Base_ID</th>
                                  <th width="175">CODE_Line</th>

                                  <th width="175">MSH_name</th>
                                  <th width="175">MSH_ID</th>
                                  <th width="175">Qty</th>
                                  <th width="175">TimeStamp</th>
                                  <th width="175">Requester</th>
                                  <th width="175">Tray</th>
                                  <th width="175">Tray_Qty</th>
                                  <th width="175">Status</th>
                                  <th width="175">Diverter/Airdam</th>
                                  <th width="175">Stack</th>
                                  <th width="175">Temperature</th>
                                  <th width="175">Order_Number</th>
                                  <th width="175">Time_Alarm</th>
                                  <th width="175">Confirmation</th>
                                  <th width="175">User_Confirm</th>
                                  <th width="175">Receiver</th>
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

export default Request_label_printing_report;
