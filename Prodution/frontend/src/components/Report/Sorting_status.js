import React, { Component } from "react";
import { key, server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import moment from "moment";
import Select from "react-select";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";


class Sorting_status extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      QANumber: "",
      Model:  { label: "**ALL**" },
      shift:[],
      Raw_Dat: [],
      Raw_Dat_bymodel: [],
      status:  { label: "**ALL**" },
      startDate: moment().format("yyyy-MM-DD"), //moment().add("days", -6).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"), //moment().format("yyyy-MM-DD"),
      Unpack_report: [],
      Unpack_report_BYMODEL: [],
      listModel: [],
      listInsType: [],
      listRawData: [],
      optionSelected: null,
      isDisable: false,
      selectedOption: "Model"

    };
  }

  componentDidMount = async () => {
    await this.getModel();
  };

  ReportUnpacking_QANUMBER = async () => {
    const result = await httpClient.get(
      server.UNPACK_SORTING_QANUMBER + "/" + this.state.QANumber
    );
    console.log("result:Unpacking_URL ", result);

    let rawData = result.data.list_unpacking;
    console.log("Unpack_report", rawData);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat: rawData[0] });
    console.log(this.state.Raw_Dat);

    this.setState({
      Unpack_report: result.data.result,
      isDisable: false,
    });
  };
  ReportUnpacking_MODEL = async () => {
    const modelLabel =
    this.state.Model.label === "**ALL**" ? "**ALL**" : this.state.Model.label;
    const result = await httpClient.get(
      server.UNPACK_SORTING_MODEL +
        "/" +
        modelLabel +
        "/" +
        this.state.status +
        "/" +
        this.state.startDate +
        "/" +
        this.state.finishDate
    );
    console.log("result:Unpacking_URL ", result);

    let rawData = result.data.listRawData;
    console.log("Unpack_report", rawData);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat_bymodel: rawData[0] });
    console.log(this.state.Raw_Dat);

    this.setState({
      Unpack_report_BYMODEL: result.data.result,
      isDisable: false,
    });
  };
  getModel = async () => {
    try {
      const array = await httpClient.get(server.UNPACKMODEL);
      const options = array.data.result.map((d) => ({
        label: d.Model,
      }));
  
      // Add "ALL" option to the beginning of the options array
      const optionsWithAll = [{ label: "**ALL**" }, ...options];
  
      this.setState({ listModel: optionsWithAll });
    } catch (error) {
      console.error("Error fetching model data:", error);
      // Handle error appropriately
    }
  };
  

  Unpacking = () => {
    if (this.state.Unpack_report != null) {
      if (this.state.Unpack_report.length > 0) {
        // คำนวณยอดรวมของ Qty แยกตาม Shift
        const shiftTotals = {};
  
        this.state.Unpack_report.forEach((item) => {
          const shift = item.shift;
          const qty = item.Qty;
  
          if (!shiftTotals[shift]) {
            shiftTotals[shift] = 0;
          }
  
          shiftTotals[shift] += qty;
        });
  
        // สร้าง JSX สำหรับแสดงผล
        const rows = this.state.Unpack_report.map((item) => (
          <tr key={item.Datetime + item.Model + item.QA_no}>
        
            <td> {item["MfgDate"]}</td>
            <td> {item["shift"]}</td>
            <td> {item["Model"]}</td>
            <td> {item["QA_no"]}</td>
            <td align="RIGHT">
              {Number(item["Qty"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
        
            <td> {item["Baseplate"]}</td>
            <td> {item["Ramp"]}</td>
            <td> {item["Diverter"]}</td>
            <td> {item["Emp"]}</td>
            <td> {item["Datetime"]}</td>
            <td> {item["Sorting_return"]}</td>
            <td> {item["Reason_Hold"]}</td>
  
            <td
              style={{
                color:
                  item["Sorting_Status"] === "Pending"
                    ? "red"
                    : item["Sorting_Status"] === "Completed"
                    ? "green"
                    : "black",
              }}
            >
              <span style={{ fontWeight: "bold" }}></span>{" "}
              {item["Sorting_Status"]}
            </td>
          </tr>
        ));
  
        return (
          <>
            {rows}
  
            {/* แสดงผลรวมของ Qty แยกตาม Shift */}
            {Object.keys(shiftTotals).map((shift) => (
              <tr key={shift}>
                <td colSpan="4"><strong>Total - {shift}</strong></td>
                <td align="RIGHT">
              {Number(shiftTotals[shift]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
     
                <td colSpan="9"></td>
              </tr>
            ))}
          </>
        );
      }
    }
    return null; // ถ้าไม่มีข้อมูล
  };
Unpacking_BYMODEL = () => {
  if (this.state.Unpack_report_BYMODEL != null) {
    if (this.state.Unpack_report_BYMODEL.length > 0) {
      // คำนวณยอดรวมของ Qty แยกตาม Shift
      const shiftTotals = {};

      this.state.Unpack_report_BYMODEL.forEach((item) => {
        const shift = item.shift;
        const qty = item.Qty;

        if (!shiftTotals[shift]) {
          shiftTotals[shift] = 0;
        }

        shiftTotals[shift] += qty;
      });


              // สร้าง JSX สำหรับแสดงผล
              const rows = this.state.Unpack_report_BYMODEL.map((item) => (
                <tr key={item.Datetime + item.Model + item.QA_no}>
              
                  <td> {item["MfgDate"]}</td>
                  <td> {item["shift"]}</td>
                  <td> {item["Model"]}</td>
                  <td> {item["QA_no"]}</td>
                  <td align="RIGHT">
                    {Number(item["Qty"]).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </td>
               
                  <td> {item["Baseplate"]}</td>
                  <td> {item["Ramp"]}</td>
                  <td> {item["Diverter"]}</td>
                  <td> {item["Emp"]}</td>
                  <td> {item["Datetime"]}</td>
                  <td> {item["Sorting_return"]}</td>
                  <td> {item["Reason_Hold"]}</td>
        
                  <td
                    style={{
                      color:
                        item["Sorting_Status"] === "Pending"
                          ? "red"
                          : item["Sorting_Status"] === "Completed"
                          ? "green"
                          : "black",
                    }}
                  >
                    <span style={{ fontWeight: "bold" }}></span>{" "}
                    {item["Sorting_Status"]}
                  </td>
                </tr>
              ));
        
              return (
                <>
                  {rows}
        
                  {/* แสดงผลรวมของ Qty แยกตาม Shift */}
                  {Object.keys(shiftTotals).map((shift) => (
                    <tr key={shift}>
                      <td colSpan="4"><strong>Total - {shift}</strong></td>
                      <td align="RIGHT">
                    {Number(shiftTotals[shift]).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </td>
                      <td colSpan="9"></td>
                    </tr>
                  ))}
                </>
              );
    }
  }
  return null; // ถ้าไม่มีข้อมูล
};

  
  
  
  render() {
    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 70 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-6">
                  <h1 style={{ paddingTop: 15 }}>Sorting Status</h1>
                </div>
        
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">Sorting</li>
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
                    <label>Search Data </label>
                  </h3>
                </div>

                <div className="row">
                  <div className="col-md-12">
                  <div className="col-md-2">
                      <input
                        type="radio"
                        name="QA_NUMBER"
                        checked={this.state.selectedOption === "Model"}
                        onChange={() =>
                          this.setState({ selectedOption: "Model" })
                        }
                        id="modelOption"
                      />
                      <label htmlFor="modelOption">By Model and Date</label>
                    </div>
                    <div className="col-md-2">
                      <input
                        type="radio"
                        name="QA_NUMBER"
                        checked={this.state.selectedOption === "QANumber"}
                        onChange={() =>
                          this.setState({ selectedOption: "QANumber" })
                        }
                        id="qanumberOption"
                      />
                      <label htmlFor="qanumberOption">By QANumber</label>
                    </div>
                  
                  </div>
                </div>

                <div className="card-body">
                  {this.state.selectedOption === "QANumber" && (
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
                            placeholder="QANumber"
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
                            this.setState({ Unpack_report_BYMODEL: "" });
                            this.setState({ isDisable: true });
                            // this.doGetDataReport();
                            Swal.fire({
                              icon: "info",
                              title: "Loading Data",
                              timer: 60000,
                              allowOutsideClick: false,
                              didOpen: async () => {
                                Swal.showLoading();
                                await this.ReportUnpacking_QANUMBER();
                                setTimeout(() => {Swal.close();}, 1000);
                              },
                            }).then(() => {
                              if (this.state.Unpack_report.length > 0) {
                                if (
                                  this.state.Unpack_report[0].QA_no.length > 0
                                ) {
                                  Swal.fire({
                                    icon: "success",
                                    title: "Success",
                                    text: "Data has been loaded successfully",
                                  });
                                } else if (
                                  this.state.Unpack_report[0].QA_no.length == 0
                                ) {
                                  Swal.fire({
                                    icon: "error",
                                    title: "No sorting data",
                                    text: "Please select other date",
                                  });
                                }
                              } else {
                                Swal.fire({
                                  icon: "error",
                                  title: "No sorting data",
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
                        <CSVLink
                          data={this.state.Raw_Dat}
                          filename={"reportsorting.csv"}
                        >
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
                  )}
                </div>

                <div className="card-body">
                  {this.state.selectedOption === "Model" && (
                    <div className="row">
                      {/* //Select Critiria "Model" */}
                      <div className="col-md-2">
                        <div className="form-group">
                          <div></div>
                          <label>Model group</label>
                          <Select
                            options={this.state.listModel}
                            value={this.state.Model}
                            onChange={async (e) => {
                              await this.setState({ Model: e});

                            }}
                            // type="text"
                            // className="form-control"
                            placeholder="Select Model"
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="form-group">
                          <div></div>
                          <label>Status</label>
                          <Select
                         
                            options={[
                              { label: "**ALL**", value: "**ALL**" },
                              { label: "Completed", value: "completed" },
                              { label: "Pending", value: "pending" },
                          
                            ]}
                            onChange={async (e) => {
                              await this.setState({ status: e.label });
                              // คุณอาจต้องการ setState อื่น ๆ ตามที่คุณต้องการในฟังก์ชันนี้
                            }}
                            placeholder="Select Status"
                          />
                        </div>
                      </div>
                   

                      {/* //Select Start Date */}
                      <div className="col-md-2">
                        <div className="form-group">
                          <label>
                            By Daily Select From &nbsp;
                            <a
                              class="fas fa-question-circle"
                              style={{ fontSize: 18, color: "Dodgerblue" }}
                              onClick={() => {
                                Swal.fire({
                                  icon: "info",
                                  title: "Day-to-Day Data",
                                  text: "Day-to-Day data over the course of the selected date",
                                });
                              }}
                            ></a>
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
                            this.setState({ Unpack_report: "" });

                            this.setState({ isDisable: true });
                            // this.doGetDataReport();
                            Swal.fire({
                              icon: "info",
                              title: "Loading Data",
                              timer: 60000,
                              allowOutsideClick: false,
                              didOpen: async () => {
                                Swal.showLoading();
                                await this.ReportUnpacking_MODEL();
                                setTimeout(() => {Swal.close();}, 1000);
                              },
                            }).then(() => {
                              if (this.state.Unpack_report_BYMODEL.length > 0) {
                                if (
                                  this.state.Unpack_report_BYMODEL[0].QA_no
                                    .length > 0
                                ) {
                                  Swal.fire({
                                    icon: "success",
                                    title: "Success",
                                    text: "Data has been loaded successfully",
                                  });
                                } else if (
                                  this.state.Unpack_report_BYMODEL[0].QA_no
                                    .length == 0
                                ) {
                                  Swal.fire({
                                    icon: "error",
                                    title: "No sorting data",
                                    text: "Please select other date",
                                  });
                                }
                              } else {
                                Swal.fire({
                                  icon: "error",
                                  title: "No sorting data",
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
                          data={this.state.Raw_Dat_bymodel}
                          filename={"reportsorting.csv"}
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
                  )}
                </div>
              </div>

              {/* Table*/}

              <div className="row">
                <div class="content">
                  <div class="container-fluid">
                    <div className="card card-primary">
                      <div className="col-12">
                        {/* /.card-header */}
                        <div
                          className="card-body table-responsive p-0"
                          style={{
                            height: 500,
                            zIndex: "3",
                            position: "relative",
                            zIndex: "0",
                          }}
                        >
                          <table className="table table-head-fixed text-nowrap table-hover">
                            <thead>
                              <tr>
                            
                                <th width="200">MfgDate</th>
                                <th width="200">Shift</th>
                    
                                <th width="200">Model</th>
                                <th width="200">QA no.</th>
                                <th width="200">Qty</th>
                                <th width="200">Baseplate</th>
                                <th width="200">Ramp</th>
                                <th width="200">Diverter</th>
                                <th width="200">Emp</th>
                                <th width="200">Datetime Unpack</th>
                                <th width="200">Sorting return</th>
                                <th width="200">Reason Hold</th>
                                <th width="200">Sorting Status</th>
                              </tr>
                            </thead>
                            <tbody>{this.Unpacking()}</tbody>
                            <tbody>{this.Unpacking_BYMODEL()}</tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table*/}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Sorting_status;
