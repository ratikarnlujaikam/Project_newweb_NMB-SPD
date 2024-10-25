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

class Trace_Dynamic_Parallelism extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      model: [],
      Line: [],

      Line_1: [],
      process: [],
      report: [],
      report1: [],
      xAxis: [],
      yAxis1: [],
      seriesY: [],
      series2: [],
      seriesCleanroom: [],
      options: {},
      options2: {},
      chart: [],

      Raw_Dat: [],
      Raw_Dat_moter: [],
      startDate:moment().format("YYYY-MM-DD HH:mm:00"),
      finishDate: moment().format("YYYY-MM-DD HH:mm:00"),
      listItemNo: [],
      listModelName: [],
      listmodel: [],
      listLine: [],
      listprocess: [],
      list_and_model: [],
      headers: [],

      optionSelected: null,
      isDisable: false,
    };
  }

  componentDidMount = async () => {
    await this.getLine();
    await this.getprocess();
    await this.getmodel();
    await this.getLine_and_model();
  };

  doGetDataReport = async () => {
    try {
      const formattedStartDate = this.state.startDate
        ? this.state.startDate.replace("T", " ")
        : "";
      const formattedFinishDate = this.state.finishDate
        ? this.state.finishDate.replace("T", " ")
        : "";
      const result = await httpClient.get(
        server.Trace_Dynamic_URL +
          "/" +
          this.state.Line.label +
          "/" +
          formattedStartDate +
          "/" +
          formattedFinishDate
      );

      console.log("result", result);

      // Check if result.data is defined and it has the expected structure
      if (result.data && result.data.listRawData && result.data.result) {
        const headers = Object.keys(result.data.listRawData[0][0]);
        console.log(headers);

        let rawData = result.data.listRawData;
        console.log(rawData);

        // Ensure each item in rawData has the same structure
        rawData = rawData.map((item) =>
          headers.reduce((acc, header) => {
            acc[header] = item[header] || null;
            return acc;
          }, {})
        );

        let rawData1 = result.data.listRawData;
        console.log(rawData1);

        // Check if rawData1 is an array with at least one element
        if (rawData1.length > 0) {
          for (let i = 1; i < rawData1.length; i++) {
            rawData1[0].push(...rawData1[i]);
          }
          this.setState({ Raw_Dat: rawData1[0] });
          console.log(this.state.Raw_Dat);

          this.setState({
            report: result.data.result,
            headers: headers,
            isDisable: false,
          });
        } else {
          console.error("rawData1 is an empty array.");
        }
      } else {
        console.error("Invalid data structure in the API response.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  doGetDataReport_moter = async () => {
    try {
      const formattedStartDate = this.state.startDate
        ? this.state.startDate.replace("T", " ")
        : "";
      const formattedFinishDate = this.state.finishDate
        ? this.state.finishDate.replace("T", " ")
        : "";
      const lineLabel =
        this.state.Line_1.length > 0 ? this.state.Line_1[0].label : "undefined";

      const result = await httpClient.get(
        `${server.Trace_Dynamic_moter_URL}/${this.state.process.label}/${this.state.model.label}/${lineLabel}/${formattedStartDate}/${formattedFinishDate}`
      );

      console.log("result", result);

      // Check if result.data is defined and it has the expected structure
      if (result.data && result.data.listRawData && result.data.result) {
        const headers = Object.keys(result.data.listRawData[0][0]);
        console.log(headers);

        let rawData = result.data.listRawData;
        console.log(rawData);

        // Ensure each item in rawData has the same structure
        rawData = rawData.map((item) =>
          headers.reduce((acc, header) => {
            acc[header] = item[header] || null;
            return acc;
          }, {})
        );

        let rawData1 = result.data.listRawData;
        console.log(rawData1);

        // Check if rawData1 is an array with at least one element
        if (rawData1.length > 0) {
          for (let i = 1; i < rawData1.length; i++) {
            rawData1[0].push(...rawData1[i]);
          }
          this.setState({ Raw_Dat_moter: rawData1[0] });
          console.log(this.state.Raw_Dat_moter);

          this.setState({
            report1: result.data.result,
            headers: headers,
            isDisable: false,
          });
        } else {
          console.error("rawData1 is an empty array.");
        }
      } else {
        console.error("Invalid data structure in the API response.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  getLine = async () => {
    const array = await httpClient.get(server.LINE_TRACE_DYNAMIC_URL);
    const options = array.data.result.map((d) => ({
      label: d.Line,
    }));
    this.setState({ listLine: options });
  };

  getprocess = async () => {
    const array = await httpClient.get(server.Trace_Dynamic_process_URL);
    const options = array.data.result.map((d) => ({
      label: d.process,
    }));
    this.setState({ listprocess: options });
  };
  getmodel = async () => {
    const array = await httpClient.get(server.Trace_Dynamic_model_URL);
    const options = array.data.result.map((d) => ({
      label: d.model,
    }));
    this.setState({ listmodel: options });
  };

  getLine_and_model = async () => {
    const modelLabel = this.state.model.label === "**ALL**" ? "**ALL**" : this.state.model.label;
    console.log(modelLabel);

    
    console.log("Process value:", this.state.process); // Print the value of this.state.process

    try {
        const array = await httpClient.get(
            server.GETLINE_TRACE_DYNAMIC_URL +
            "/" +
            modelLabel +
            "/" +
            this.state.process.label
        );

        // Check if the response contains valid data
        if (!array.data || !array.data.result || !Array.isArray(array.data.result)) {
            throw new Error("Invalid data format received from server");
        }

        const options = array.data.result.map((d) => ({
            label: d.Line_1,
        }));

        this.setState({ list_and_model: options });
    } catch (error) {
        console.error("Error fetching line data:", error);
        // Handle error here
    }
};




  renderreport1() {
    return this.state.report.map((row, rowIndex) => (
      <tr key={rowIndex} align="center">
        {this.state.headers.map((header, colIndex) => (
          <td key={colIndex}>{row[header]}</td>
        ))}
      </tr>
    ));
  }

  render() {
    function filterColumns(data) {
      return data.map((item) => {
        const { Line, Line_IP, ...rest } = item;
        return rest;
      });
    }
    const modifiedData = this.state.Raw_Dat_moter.map((item) => {
      const modifiedItem = {};
    
      for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          modifiedItem[key] = item[key].toString();
    
          if (key === "Line" || key === "Line_IP") {
            modifiedItem[key] = modifiedItem[key].toString();
          }
        }
      }
    
      return modifiedItem;
    });
    console.log(this.state.process);
    console.log(this.state.model);
    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 70 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Trace back Dynamic</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">
                      Trace back Dynamic
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
                    <label>Trace back Dynamic</label>
                  </h3>
                </div>

                <div className="card-body">
                  <div className="row">
                    {/* //Select Critiria "model" */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Line </label>
                        <Select
                          options={this.state.listLine}
                          value={this.state.Line}
                          onChange={async (e) => {
                            await this.setState({ Line: e });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select line"
                        />
                      </div>
                    </div>

                    <div className="col-sm-2">
                      <div className="form-group">
                        <label>Select Datetime &nbsp;</label>
                        <input
                          value={this.state.startDate}
                          onChange={(e) => {
                            this.setState({ startDate: e.target.value });
                          }}
                          type="datetime-local" // Use datetime-local for both date and time
                          className="form-control"
                          placeholder="Select Start Date and Time"
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
                          type="datetime-local"
                          className="form-control"
                          placeholder="Select Finish Date"
                          // Disable the input if confirm is 'OK'
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
                              await this.doGetDataReport();
                              Swal.close();
                            },
                          }).then(() => {
                          
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
                        data={this.state.Raw_Dat.map((item) => {
                          const modifiedItem = {};

                          for (const key in item) {
                            if (
                              Object.prototype.hasOwnProperty.call(item, key)
                            ) {
                              modifiedItem[key] =
                                key === "Line"
                                  ? "L" + String(item[key])
                                  : String(item[key]);
                            }
                          }

                          return modifiedItem;
                        })}
                        filename={
                          "Trace_back_" +
                          this.state.startDate +
                          "to" +
                          this.state.startDate +
                          ".csv"
                        }
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
            </div>
          </div>
        </div>
        <div class="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card card-primary card-outline">
                <div className="card-header">
                  <h3 className="card-title">
                    <label>Trace back Data</label>
                  </h3>
                </div>

                <div className="card-body">
                  <div className="row">
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Process </label>
                        <Select
                          options={this.state.listprocess}
                          value={this.state.process}
                          onChange={async (e) => {
                            await this.setState({ process: e });
                            await this.setState({
                              model: [{ label: "Select model" }],
                            });
                            await this.setState({
                              Line_1: [{ label: "Select line" }],
                            });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select Process"
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Model </label>
                        <Select
                          options={this.state.listmodel}
                          value={this.state.model}
                          onChange={async (e) => {
                            await this.setState({ model: e });
                            await this.setState({
                              Line_1: [{ label: "Select line" }],
                            });
                   
                            await this.getLine_and_model()
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select Model"
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Line</label>
                        <Select
                          options={this.state.list_and_model || []} // ตรวจสอบและใช้ค่า default เป็น array ถ้าไม่มีค่า
                          value={this.state.Line_1[0]}
                          onChange={async (e) => {
                            await this.setState({ Line_1: [] });
                            this.state.Line_1.push({ label: e.label });
                          }}
                          placeholder="Select Line"
                        />
                      </div>
                    </div>

                    <div className="col-sm-2">
                      <div className="form-group">
                        <label>Select Datetime &nbsp;</label>
                        <input
                          value={this.state.startDate}
                          onChange={(e) => {
                            this.setState({ startDate: e.target.value });
                          }}
                          type="datetime-local" // Use datetime-local for both date and time
                          className="form-control"
                          placeholder="Select Start Date and Time"
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
                          type="datetime-local"
                          className="form-control"
                          placeholder="Select Finish Date"
                          // Disable the input if confirm is 'OK'
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
                              await this.doGetDataReport_moter();
                              Swal.close();
                            },
                          }).then(() => {});
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
                       data={this.state.Raw_Dat_moter.map((item) => {
                        const modifiedItem = {};
                      
                        for (const key in item) {
                          if (Object.prototype.hasOwnProperty.call(item, key)) {
                            // แปลงค่าให้เป็น string โดยใช้ toString() method
                            modifiedItem[key] = item[key].toString();
                            // หรือแปลงค่าให้เป็น string โดยใช้ String() function
                            // modifiedItem[key] = String(item[key]);
                      
                            if (key === "Line" || key === "Line_IP") {
                              modifiedItem[key] = modifiedItem[key].toString();
                            }
                          }
                        }
                      
                        return modifiedItem;
                      })}
                      
                      
                        filename={
                          "Trace_back_" +
                          this.state.startDate +
                          "to" +
                          this.state.startDate +
                          ".csv"
                        }
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Trace_Dynamic_Parallelism;
