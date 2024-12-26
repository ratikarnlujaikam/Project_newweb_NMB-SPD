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
import Table from "react-bootstrap/Table";
import "./Monthly_Operator.css";

class Monthly_Operator extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      year: [],
      Month: [],
      GroupName: [],
      line: [{ label: "**ALL**" }],
      report: [],
      xAxis: [],
      yAxis1: [],
      seriesY: [],
      series2: [],
      seriesCleanroom: [],
      options: {},
      options2: {},
      chart: [],

      Raw_Dat: [],

      startDate: moment().format("yyyy-MM-DD"), //moment().add("days", -6).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"), //moment().format("yyyy-MM-DD"),
      listyear: [],
      listMonth: [],
      listModel: [],
      listGroupName: [],
      listline: [],
      selectedMaxYear: "",
      selectedMaxMonth: "",

      optionSelected: null,
      isDisable: false,
      headers: [],
    };
  }

  componentDidMount = async () => {
    await this.getyear();
    await this.getMonth();
    await this.getGroupName();
    await this.getline();
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    this.setState({ year: [currentYear], Month: [currentMonth] });
    console.log("Year:", this.state.year);
    console.log("Month:", this.state.Month);
  };

  doGetDataReport = async () => {
    const result = await httpClient.get(
      server.Monthly_Operator_URL +
        "/" +
        this.state.year +
        "/" +
        this.state.Month +
        "/" +
        this.state.GroupName[0].label +
        "/" +
        this.state.line[0].label
    );

    let xAxis = [];

    let rawData = result.data.listRawData;
    console.log(rawData);
    console.log(rawData.length);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat: rawData[0] });
    console.log(this.state.Raw_Dat);
    // Assuming result.data.result is an array of objects
    const data = result.data.result;

    let headers; // ประกาศตัวแปรนอกส่วนของ if

    if (data && data.length > 0 && data[0]) {
      headers = Object.keys(data[0]);
      // ต่อไปคุณสามารถใช้ headers ต่อไปได้
    } else {
      // กรณี data ไม่มีค่าหรือ data[0] ไม่มีค่า
      console.error("Data is empty or does not have the expected structure.");
    }

    // ทำสิ่งที่คุณต้องการทำกับ headers ต่อไปนอกจาก if

    // Logging or using the column headers as needed
    console.log("headers", headers);

    console.log("result.data.result", result.data.result);
    this.setState({
      report: result.data.result,
      headers: headers,
      // series,

      isDisable: false,
    });
  };
  getyear = async () => {
    const array = await httpClient.get(server.Monthly_Operator_YEAR_URL);
    const options = array.data.result.map((d) => ({
      label: d.year,
    }));
    this.setState({ listyear: options });
  };

  getMonth = async () => {
    const array = await httpClient.get(server.Monthly_Operator_MONTH_URL);
    const options = array.data.result.map((d) => ({
      label: d.Month,
    }));
    this.setState({ listMonth: options });
  };
  getGroupName = async () => {
    const array = await httpClient.get(server.Operator_GroupName_URL);
    const options = array.data.result.map((d) => ({
      label: d.GroupName,
    }));
    this.setState({ listGroupName: options });
  };

  getline = async () => {
    const array = await httpClient.get(server.Operator_line_URL);
    const options = array.data.result.map((d) => ({
      label: d.Line_No,
    }));
    this.setState({ listline: options });
  };

  getColumnIndexMapping = () => {
    const columnOrder = [
      "item_Name",
      "Area",
      "Line_No",
      "MODEL",
      "ItemNo",
      "Line_No",
      "shift",
    ];

    const columnIndexMapping = {};
    columnOrder.forEach((column, index) => {
      columnIndexMapping[column] = index;
    });

    return columnIndexMapping;
  };

  renderreport = () => {
    const { headers, report } = this.state;
    if (this.state.report != null && this.state.report.length > 0) {
      const headers = Object.keys(this.state.report[0]);

      const columnIndexMapping = this.getColumnIndexMapping();

      return (
        <>
          {this.state.report.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header, colIndex) => (
                <td
                  key={colIndex}
                  className={["Line_No"].includes(header) ? "fixed-column" : ""}
                  style={{
                    textAlign: ["Line_No"].includes(header) ? "left" : "right",
                  }}
                >
                  {item[header]}
                </td>
              ))}
            </tr>
          ))}
        </>
      );
    } else {
      return null; // or return a message for an empty report
    }
  };

  render() {
    console.log(this.state.yAxis6);
    console.log(this.state.xAxis);
    console.log(this.state.yInput);
    console.log(this.state.yReject);
    const defaultHeader = "default";

    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 70 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Monthly Operator Tracking Record</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">
                      Monthly Operator Tracking Record
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
                    {/* //Select Critiria "Year" */}
   
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Year</label>
                        <Select
                          options={this.state.listyear}
                          onChange={(selectedOption) => {
                            const selectedyear = selectedOption
                              ? selectedOption.label
                              : "";
                            this.setState({ year: selectedyear });
                          }}
                          value={{
                            label: this.state.year,
                            value: this.state.year,
                          }}
                          placeholder="Select Month"
                        />
                      </div>
                    </div>

                    {/* Select Criteria "Month" */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Month</label>
                        <Select
                          options={this.state.listMonth}
                          onChange={(selectedOption) => {
                            const selectedMonth = selectedOption
                              ? selectedOption.label
                              : "";
                            this.setState({ Month: selectedMonth });
                          }}
                          value={{
                            label: this.state.Month,
                            value: this.state.Month,
                          }}
                          placeholder="Select Month"
                        />
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Area.</label>
                        <Select
                          options={this.state.listGroupName}
                          value={this.state.GroupName[0]}
                          onChange={async (e) => {
                            // await this.setState({ Month: e.label });
                            await this.setState({ GroupName: [] });
                            this.state.GroupName.push({ label: e.label });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select Area"
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Line No.</label>
                        <Select
                          options={this.state.listline}
                          value={this.state.line[0]}
                          onChange={async (e) => {
                            // await this.setState({ Month: e.label });
                            await this.setState({ line: [] });
                            this.state.line.push({ label: e.label });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select Line No."
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
                          if (
                            !this.state.GroupName ||
                            !this.state.GroupName[0] ||
                            !this.state.GroupName[0].label
                          ) {
                            // Check if GroupName is not selected
                            Swal.fire({
                              icon: "error",
                              title: "Please Select Area",
                              text: "Please select an Area before submitting.",
                            });
                            return; // Exit the function if GroupName is not selected
                          }
                          this.setState({ isDisable: true });
                          Swal.fire({
                            icon: "info",
                            title: "Loading Data",
                            timer: 60000,
                            allowOutsideClick: false,
                            didOpen: async () => {
                              Swal.showLoading();
                              await this.doGetDataReport();
                              setTimeout(() => { Swal.close();}, 200);
                             
                            },
                          })
                            .then(() => {
                              if (
                                this.state.report.length > 0 &&
                                this.state.report[0].Area &&
                                this.state.report[0].Area.length > 0
                              ) {
                                // กรณี Area เป็น array ที่ไม่ว่าง
                                Swal.fire({
                                  icon: "success",
                                  title: "Success",
                                  text: "Data has been loaded successfully",
                                });
                              } else {
                                // กรณี Area เป็น array ว่างหรือไม่เป็น array
                                Swal.fire({
                                  icon: "error",
                                  title: "No production data",
                                  text: "Please select other date",
                                });
                              }
                            })
                            .catch((error) => {
                              console.error("An error occurred:", error);
                              Swal.fire({
                                icon: "error",
                                title: "Error",
                                text: "An error occurred while loading data. Please try again.",
                              });
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
                      <CSVLink
                        data={this.state.Raw_Dat}
                        filename={"Reject_report.csv"}
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
                    <div className="col-md-2">
                      <a
                        style={{ marginTop: 30 }}
                        href="/defectNG"
                        className="fas fa-angle-double-left"
                        class="btn btn-primary"
                        role="button"
                        aria-pressed="true"
                      >
                        Back
                      </a>
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
                        <div
                          className="card-body table-responsive p-0"
                          style={{
                            height: 600,
                            zIndex: "3",
                            position: "relative",
                            zIndex: "0",
                          }}
                        >
                          <Table className=" table  text-nowrap table-hover table-head-fixed">
                            <thead>
                              <tr align="center">
                                {this.state.headers &&
                                  this.state.headers.length > 0 &&
                                  this.state.headers.map((header, index) => (
                                    <th
                                      key={index}
                                      className={
                                        ["Line_No"].includes(header)
                                          ? "fixed-column"
                                          : ""
                                      }
                                    >
                                      {header}
                                    </th>
                                  ))}
                              </tr>
                            </thead>
                            <tbody>{this.renderreport()}</tbody>
                          </Table>
                        </div>
                      </div>
                    </div>
                    );
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

export default Monthly_Operator;
