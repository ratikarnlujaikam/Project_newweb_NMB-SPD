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

class NGlotrecord extends Component {
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
      Type: [],
      startDate: new Date().toISOString().split("T")[0],
      finishDate: new Date().toISOString().split("T")[0],
      Raw_Dat1: [],
      Raw_Dat2: [],
      Raw_Dat3: [],

      columns: [],
      data: [],
      listyear: [],
      listMonth: [],
      listModel: [],
      listlocation: [],
      listStatus: [],

      optionSelected: null,
      isDisable: false,
    };
  }
  getModel = async () => {
    const array = await httpClient.get(server.MODELNGLOTRECORD_URL);
    const options = array.data.result.map((d) => ({
      label: d.Model,
    }));
    this.setState({ listModel: options });
  };
  doGetDataReport1 = async () => {
    const modelLabel =
      this.state.Model.label === "**ALL**" ? "**ALL**" : this.state.Model.label;
    const moLabel =
      this.state.dobyMO === undefined || this.state.dobyMO === ""
        ? "-"
        : this.state.dobyMO;

    console.log(moLabel);
    const result = await httpClient.get(
      server.SUMMARYNGLOT_URL +
        "/" +
        modelLabel +
        "/" +
        this.state.startDate +
        "/" +
        this.state.finishDate +
        "/" +
        moLabel
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
    const modelLabel =
      this.state.Model.label === "**ALL**" ? "**ALL**" : this.state.Model.label;
    const moLabel =
      this.state.dobyMO === undefined || this.state.dobyMO === ""
        ? "-"
        : this.state.dobyMO;

    const result = await httpClient.get(
      server.DETAILNGLOT_URL +
        "/" +
        modelLabel +
        "/" +
        this.state.startDate +
        "/" +
        this.state.finishDate +
        "/" +
        moLabel
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
  doGetDataReport3 = async () => {
    const modelLabel =
      this.state.Model.label === "**ALL**" ? "**ALL**" : this.state.Model.label;
    const moLabel =
      this.state.dobyMO === undefined || this.state.dobyMO === ""
        ? "-"
        : this.state.dobyMO;

    const result = await httpClient.get(
      server.TAKEOUTNGLOT_URL +
        "/" +
        modelLabel +
        "/" +
        this.state.startDate +
        "/" +
        this.state.finishDate +
        "/" +
        moLabel
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
  async updateTable(type) {
    let columns = [];
    let data = [];

    switch (type) {
      case "Summary":
        columns = [
          "Inventory_Month",
          "Date",
          "State",
          "ModelGroup",
          "Item_No",
          "Line",
          "MO",
          "Emp",
          "NG_total",
          "Actual_receive",
          "For_Other_Testing",
        ];
        await this.doGetDataReport1(); // Fetch data for "Summary"

        break;

      case "Detail_NG":
        columns = [
          "Date",
          "ModelGroup",
          "Item_No",
          "Line",
          "MO",
          "NG_Case",
          "QTY",
          "Item",
          "TimeStamp",
          "Emp",
        ];
        await this.doGetDataReport2();

        break;

      case "Take_Out":
        columns = [
          "Model",
          "Line",
          "MO",
          "Reason",
          "Motor",
          "Qty",
          "Status",
          "Section",
          "Updater",
          "Emp_IO",
          "TimeStamp",
          "MfgDate",
        ];
        await this.doGetDataReport3();
        break;

      default:
        break;
    }

    this.setState({ columns, data });
  }

  componentDidMount = async () => {
    await this.getModel();
  };
  renderreport1 = () => {
    console.log(this.state.report1);
    if (this.state.report1 != null && this.state.report1.length > 0) {
      return this.state.report1.map((item, index) => (
        <tr key={index} align="center">
         <td align="center">{item["Inventory_Month"]}</td>
          <td align="center">{item["Date"]}</td>
          <td align="center">{item["State"]}</td>
          <td align="center">{item["ModelGroup"]}</td>
          <td align="center">{item["Item_No"]}</td>
          <td align="center">{item["Line"]}</td>
          <td align="center">{item["MO"]}</td>
          <td align="center">{item["Emp"]}</td>
          <td align="center">{(item.NG_total || 0).toLocaleString()}</td>{" "}
          {/* Default value for NG_total */}
          <td align="center">
            {(item.Actual_receive || 0).toLocaleString()}
          </td>{" "}
          {/* Default value for Actual_receive */}
          <td align="center">
            {(item.For_Other_Testing || 0).toLocaleString()}
          </td>{" "}
          {/* Default value for For_Other_Testing */}
        </tr>
      ));
    }
  };

  renderreport2 = () => {
    if (this.state.report2 != null && this.state.report2.length > 0) {
      return this.state.report2.map((item, index) => (
        <tr key={index} align="center">
          {" "}
          {/* ควรใช้ key ในการวนรอบ */}
          <td align="center">{item["Date"]}</td>
          <td align="center">{item["ModelGroup"]}</td>
          <td align="center">{item["Item_No"]}</td>
          <td align="center">{item["Line"]}</td>
          <td align="center">{item["MO"]}</td>
          <td align="Left">{item["NG_Case"]}</td>
          <td align="center">{(item.QTY || 0).toLocaleString()}</td>{" "}
          {/* ใช้ค่าเริ่มต้น */}
          <td align="center">{item["Item"]}</td>
          <td align="center">{item["TimeStamp"]}</td>
          <td align="center">{item["Emp"]}</td>
        </tr>
      ));
    }
  };
  renderreport3 = () => {
    if (this.state.report3 != null && this.state.report3.length > 0) {
      return this.state.report3.map((item, index) => (
        <tr key={index} align="center">
          {" "}
          {/* ควรใช้ key ในการวนรอบ */}
          <td align="center">{item["Model"]}</td>
          <td align="center">{item["Line"]}</td>
          <td align="center">{item["MO"]}</td>
          <td align="center">{item["Reason"]}</td>
          <td align="center">{item["Motor"]}</td>
          <td align="center">{(item.Qty || 0).toLocaleString()}</td>{" "}
          {/* ใช้ค่าเริ่มต้น */}
          <td align="Left">{item["Status"]}</td>
          <td align="center">{item["Section"]}</td>
          <td align="center">{item["Updater"]}</td>
          <td align="center">{item["Emp_IO"]}</td>
          <td align="center">{item["TimeStamp"]}</td>
          <td align="center">{item["MfgDate"]}</td>
        </tr>
      ));
    }
  };
  render() {
    const { Type, columns, data } = this.state;
    console.log("Data: ", this.state.data);
    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 100 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>
                    <strong>NG QTY Process Final ass'y and Rework room</strong>
                  </h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">
                      NG QTY Process Final ass'y and Rework room
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
                          onChange={(e) =>
                            
                            this.setState({
                              Model: e,
                              report1: [],
                              report2: [],
                              report3: [],
                              Type: [],
                            })
                            
                           
                          }
                          placeholder="Select Model"
                        />
                      </div>
                    </div>
                    {/* //Select Start Date */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>By Daily Select From &nbsp;</label>
                        <input
                          value={this.state.startDate}
                          onChange={(e) => {
                            this.setState({
                              startDate: e.target.value,
                              report1: [],
                              report2: [],
                              report3: [],
                              Type: [],
                            });
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
                            this.setState({
                              finishDate: e.target.value,
                              report1: [],
                              report2: [],
                              report3: [],
                              Type: [],
                            });
                          }}
                          type="date"
                          className="form-control"
                          placeholder="Select Finish Date"
                        />
                      </div>
                    </div>
                    {/* //Select Start Date */}
                    <div className="col-md-2">
                      <label>MO_No &nbsp;</label>
                      <div className="input-group ">
                        <input
                          value={this.state.dobyMO}
                          onChange={async (e) => {
                            await this.setState({
                              dobyMO: e.target.value,
                              report1: [],
                              report2: [],
                              report3: [],
                              Type: [],
                            });
                          }}
                          type="text"
                          className="form-control"
                          placeholder="Input MO "
                        />
                      </div>
                    </div>
                    {/* <div className="col-md-1">
                      </div> */}
                    <div className="col-md-4">
                      <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">
                          Type
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-radio-buttons-group-label"
                          name="radio-buttons-group"
                          value={this.state.Type}
                          onChange={(e) => {
                            const selectedType = e.target.value;

                            // แสดง Swal.fire สำหรับการ Loading และเรียกฟังก์ชันที่ต้องการ
                            this.setState(
                              {
                                Type: selectedType,
                                report1: [],
                                report2: [],
                                report3: [],
                                data: [],
                              },
                              async () => {
                                Swal.fire({
                                  icon: "info",
                                  title: "Loading",
                                  timer: 360000, // Timeout loading
                                  allowOutsideClick: false,
                                  didOpen: async () => {
                                    Swal.showLoading();

                                    // โหลดข้อมูลที่เกี่ยวข้อง
                                    try {
                                      await this.updateTable(this.state.Type); // โหลดข้อมูลใหม่ตามประเภท
                                      await this.updateTable(this.state.Type); // โหลดข้อมูลใหม่
                                      setTimeout(() => {
                                          Swal.close(); // ปิด popup หลังจากหน่วงเวลา
                                      }, 1000); // หน่วงเวลา 1 วินาที (1000 มิลลิวินาที)

                                      // ตรวจสอบสถานะข้อมูลหลังโหลด
                                      if (
                                        this.state.report1.length > 0 ||
                                        this.state.report2.length > 0 ||
                                        this.state.report3.length > 0
                                      ) {
                                        Swal.fire({
                                          icon: "success",
                                          title: "Data successfully",
                                          text: "successfully.",
                                        });
                                      } else {
                                        Swal.fire({
                                          icon: "error",
                                          title: "No Data Found",
                                          text: "No data is available for the selected type. Please try again.",
                                        });
                                      }
                                    } catch (error) {
                                      Swal.fire({
                                        icon: "error",
                                        title: "Error",
                                        text: "An error occurred while updating the data. Please try again.",
                                      });
                                    }
                                  },
                                });
                              }
                            );
                          }}
                        >
                          <FormControlLabel
                            value="Summary"
                            control={<Radio />}
                            label="Summary"
                          />
                          <FormControlLabel
                            value="Detail_NG"
                            control={<Radio />}
                            label="Detail NG"
                          />
                          <FormControlLabel
                            value="Take_Out"
                            control={<Radio />}
                            label="Take from production line"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
                      {/* Table1*/}
                      {this.state.Type === 'Summary' && (
          <div className="content" style={{ paddingTop: 5 }}>
            <section className="content-header">
              <div className="container-fluid">
                <div className="row mb-1">
                  <div className="col-sm-6">
                    <h1>Detail by item</h1>
                  </div>
                  <div className="col-sm-6">
                    <CSVLink
                      data={this.state.Raw_Dat1}
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
            )}
            {/* Table2*/}
            {this.state.Type === 'Detail_NG' && (
          <div className="content" style={{ paddingTop: 5 }}>
            <section className="content-header">
              <div className="container-fluid">
                <div className="row mb-1">
                  <div className="col-sm-6">
                    <h1>Detail by item</h1>
                  </div>
                  <div className="col-sm-6">
                    <CSVLink
                      data={this.state.Raw_Dat2}
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
            )}

          {/* Table3*/}
          {this.state.Type === 'Take_Out' && (
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
            )}
          <div className="col-12">
            <div class="content">
              <div class="container-fluid">
                <div className="card card-primary">
                  <div
                    className="card-body table-responsive p-0"
                    style={{
                      height: 430,
                      zIndex: "3",
                      position: "relative",
                      zIndex: "0",
                    }}
                  >
                    <table className="table table-head-fixed text-nowrap table-hover">
                      <thead>
                        <tr align="center">
                          {columns.map((col, index) => (
                            <th key={index} width="50">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {this.renderreport1()}
                        {this.renderreport2()}
                        {this.renderreport3()}
                      </tbody>
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

export default NGlotrecord;
