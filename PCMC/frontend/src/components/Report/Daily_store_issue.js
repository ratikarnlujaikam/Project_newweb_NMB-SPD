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

class Daily_store_issue extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      model: { label: "**ALL**" },
      ItemNo: [{ label: "**ALL**" }],
      report: [],
      reportGraph: [],
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
      listItemNo: [],
      listModelName: [],
      listmodel: [],
      headers: [],

      optionSelected: null,
      isDisable: false,
    };
  }

  componentDidMount = async () => {
    await this.getmodel();
    await this.getItemNO();
  };

  doGetDataReport = async () => {
    try {
      const modelLabel =
        this.state.model.label === "**ALL**"
          ? "**ALL**"
          : this.state.model.label;
      const result = await httpClient.get(
        server.STORE_ISSUE_URL +
          "/" +
          modelLabel +
          "/" +
          this.state.ItemNo[0].label +
          "/" +
          this.state.startDate +
          "/" +
          this.state.finishDate
      );

      // console.log(result);

      if (
        result.data &&
        result.data.listRawData &&
        result.data.listRawData[0]
      ) {
        const headers = Object.keys(result.data.listRawData[0][0]);
        // console.log(headers);

        let rawData = result.data.listRawData;
        // console.log(rawData);

        // Ensure that each item in rawData has the same structure
        rawData = rawData.map((item) =>
          headers.reduce((acc, header) => {
            acc[header] = item[header] || null;
            return acc;
          }, {})
        );

        let rawData1 = result.data.listRawData;
        // console.log(rawData1);
        for (let i = 1; i < rawData1.length; i++) {
          rawData1[0].push(...rawData1[i]);
        }
        this.setState({ Raw_Dat: rawData1[0] });
        // console.log(this.state.Raw_Dat);

        this.setState({
          report: result.data.result,
          headers: headers, // Ensure that headers are set in the state
          isDisable: false,
        });
      } else {
        console.error("Invalid data structure in the API response.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  getmodel = async () => {
    const array = await httpClient.get(server.MODEL_NAME_STORE_ISSUE_URL);
    const options = array.data.result.map((d) => ({
      label: d.ModelGroup,
    }));
    this.setState({ listmodel: options });
  };

  getItemNO = async () => {
    const modelLabel =
      this.state.model.label === "**ALL**" ? "**ALL**" : this.state.model.label;
    const array = await httpClient.get(
      server.ITEMNO__NAME_STORE_ISSUE_URL + "/" + modelLabel
    );
    const options = array.data.result.map((d) => ({
      label: d.ItemNo,
    }));
    this.setState({ listItemNo: options });
  };

  renderreport1 = () => {
    const { headers, report } = this.state;
    // console.log(headers);
    // console.log(report);
    if (report != null && report.length > 0) {
      return report.map((item, index) => (
        <tr key={index} align="center">
        {headers.map((header, headerIndex) => (
          <React.Fragment key={headerIndex}>
            {header != "Model_Name" && header != "Part_Name" && header != "Item_No" && header != "MO_Number" && header != "IQC_lot" && header != "Emp" && header != "MfgDate" && header != "DateTime_store" && header != "Mold"? (
              <td align="right">
                {Number(item[header]).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </td>
            ) : (
              <td align="left" style={{ fontWeight: item[header] === "TOTAL" ? 'bold' : 'normal' }}>
  {item[header]}
</td>
            )}
          </React.Fragment>
        ))}
      </tr>
      ));
    } else {
      return null;
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
                  <h1>Daily Store Issue</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">Daily Store Issue</li>
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
                    {/* //Select Critiria "model" */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Model Name </label>
                        <Select
                          options={this.state.listmodel}
                          value={this.state.model}
                          onChange={async (e) => {
                            await this.setState({ model: e });
                            await this.getItemNO();
                            await this.setState({
                              ItemNo: [{ label: "**ALL**", value: "**ALL**" }],
                            });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select model"
                        />
                      </div>
                    </div>

                    {/* //Select Critiria "ItemNo" */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Item No</label>
                        <Select
                          options={this.state.listItemNo}
                          value={this.state.ItemNo[0]}
                          onChange={async (e) => {
                            await this.setState({ ItemNo: [e] }); // อัปเดต line ที่เลือก
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select ItemNo"
                        />
                      </div>
                    </div>

                    <div className="col-sm-2">
                      <div className="form-group">
                        <label> Select MfgDate &nbsp;</label>
                        <input
                          value={this.state.startDate}
                          onChange={(e) => {
                            this.setState({ startDate: e.target.value });
                          }}
                          type="date"
                          className="form-control"
                          placeholder="Select Start Date"
                          // Disable the input if confirm is 'OK'
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
                              setTimeout(() => {Swal.close();}, 1000);
                              
                            },
                          }).then(() => {
                            if (this.state.report.length > 0) {
                              if (this.state.report[0].Model_Name.length > 0) {
                                Swal.fire({
                                  icon: "success",
                                  title: "Success",
                                  text: "Data has been loaded successfully",
                                });
                              } else if (
                                this.state.report[0].Model_Name.length == 0
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
                      <CSVLink
                        data={this.state.Raw_Dat}
                        filename={"store_issue_"+this.state.startDate +'to'+ this.state.startDate +".csv"}
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
                        href="/Home"
                        className="btn btn-primary"
                        role="button"
                        aria-pressed="true"
                      >
                        Back
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content">
                <div className="container-fluid">
                  <div className="card card-primary">
                    <div className="row">
                      <div className="col-12">
                        {/* /.card-header */}
                        <div
                          className="card-body table-responsive p-0"
                   
                          style={{ height: 600 ,
                            zIndex: "3",
                            position: "relative",
                            zIndex: "0",}}
                        >
                          <table className=" table  text-nowrap table-hover table-head-fixed">
                            <thead>
                              <tr align="center">
                                {this.state.headers.map((header, index) => (
                                  <th key={index} width="100">
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>{this.renderreport1()}</tbody>
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

export default Daily_store_issue;
