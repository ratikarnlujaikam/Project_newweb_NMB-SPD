import React, { Component } from "react";
import { key, server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import Chart from "react-apexcharts";
import Select from "react-select";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";

class MasterLine extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      ModelGroup: [],
      Line: [],
      report: [],
      Raw_Dat: [],
      listModelGroup: [],
      listLine: [],
      optionSelected: null,
      isDisable: false,
      sortConfig: { key: null, direction: "ascending" }, // Ensure this is properly initialized
    };
  }

  componentDidMount = async () => {
    await this.getModelGroup();
  };

  // report with select ModelGroup,date,type
  doGetDataReport = async () => {
    const result = await httpClient.get(
      server.MASTERLINE_URL +
        "/" +
        this.state.ModelGroup +
        "/" +
        this.state.Line[0].label
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

  getModelGroup = async () => {
    const array = await httpClient.get(server.GROUP_URL);
    const options = array.data.result.map((d) => ({
      label: d.ModelGroup,
    }));
    this.setState({ listModelGroup: options });
  };

  getLine = async () => {
    const array = await httpClient.get(
      server.LINE_URL + "/" + this.state.ModelGroup
    );
    const options = array.data.result.map((d) => ({
      label: d.Line,
    }));
    this.setState({ listLine: options });
  };
  requestSort = (key) => {
    let direction = "ascending";
    if (
      this.state.sortConfig.key === key &&
      this.state.sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    this.setState({ sortConfig: { key, direction } });
  };

  // Function to sort data
  getSortedData = () => {
    const { report, sortConfig } = this.state;
    let sortableItems = [...report];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  };

  render() {
    const sortedData = this.getSortedData();

    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 70 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Line no. Master</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">

                    <li className="breadcrumb-item active">Line no. Master</li>
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
                    {/* //Select Critiria "ModelGroup" */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Model Group</label>
                        <Select
                          options={this.state.listModelGroup}
                          onChange={async (e) => {
                            await this.setState({ ModelGroup: e.label });
                            await this.getLine();
                            await this.setState({
                              Line: [{ label: "ALL" }],
                            });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select ModelGroup"
                        />
                      </div>
                    </div>

                    {/* //Select Critiria "Type" */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Production Line</label>
                        <Select
                          options={this.state.listLine}
                          value={this.state.Line[0]}
                          onChange={async (e) => {
                            await this.setState({ Line: [] });
                            this.state.Line.push({ label: e.label });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select Line"
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
                            // Check if listSupplier and listModelGroup are not empty
      // Check if listModelGroup is not empty
      if (!this.state.listModelGroup || this.state.listModelGroup.length === 0) {
        Swal.fire({
          icon: "error",
          title: "Missing Model Data",
          text: "Please make sure to select a model group.",
        });
        return;
      }

      // Check if listLine is not empty
      if (!this.state.listLine || this.state.listLine.length === 0) {
        Swal.fire({
          icon: "error",
          title: "Missing Line Data",
          text: "Please make sure to select a line.",
        });
        return;
      }

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
                              await new Promise((resolve) =>
                                setTimeout(resolve, 100)
                              ); // Add a short delay to ensure state update
                              Swal.close();
                            },
                          }).then(() => {
                            if (this.state.report.length > 0) {
                              if (this.state.report[0].Model_Group.length > 0) {
                                Swal.fire({
                                  icon: "success",
                                  title: "Success",
                                  text: "Data has been loaded successfully",
                                });
                              } else if (
                                this.state.report[0].Model_Group.length == 0
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

                    <div className="col-md-1">
                      <CSVLink
                        data={this.state.Raw_Dat}
                        filename={"QA_report.csv"}
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

              <div className="content">
                <div className="container-fluid">
                  <div className="card card-primary">
                    <div className="row">
                      <div className="col-12">
                        <div
                          className="card-body table-responsive p-0"
                          style={{
                            height: 500,
                            zIndex: "3",
                            position: "relative",
                            zIndex: "0",
                          }}
                        >
                          <table className="table table-striped table-hover table-head-fixed">
                            <thead>
                              <tr align="center">
                                {[
                                  "Model_Group",
                                  "Item_no",
                                  "Item_Name",
                                  "Model_Name",
                                  "Line_No",
                                  "Label_Digit15",
                                  "Label_Digit23",
                                  "Updater",
                                  "Time_stamp",
                                  "Remark",
                                ].map((header, index) => (
                                  <th
                                    key={index}
                                    width="100"
                                    onClick={() =>
                                      this.requestSort(header.replace(/ /g, ""))
                                    } // Replace spaces for column keys
                                    style={{ cursor: "pointer" }}
                                  >
                                    {header}
                                    {this.state.sortConfig.key ===
                                    header.replace(/ /g, "")
                                      ? this.state.sortConfig.direction ===
                                        "ascending"
                                        ? " 🔼"
                                        : " 🔽"
                                      : null}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {sortedData.map((item, index) => (
                                <tr key={index}>
                                  <td align="left">{item.Model_Group}</td>
                                  <td align="left">{item.Item_no}</td>
                                  <td align="left">{item.Item_Name}</td>
                                  <td align="left">{item.Model_Name}</td>
                                  <td align="left">{item.Line_No}</td>
                                  <td align="left">{item.Label_Digit15}</td>
                                  <td align="left">{item.Label_Digit23}</td>
                                  <td align="left">{item.Updater}</td>
                                  <td align="left">{item.Time_stamp}</td>
                                  <td align="left">{item.Remark}</td>
                                </tr>
                              ))}
                            </tbody>
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

export default MasterLine;
