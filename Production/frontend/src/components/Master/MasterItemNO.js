import React, { Component } from "react";
import { key, server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import Select from "react-select";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";

class MasterItemNO extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      ItemNo: [],
      ModelGroup: [],
      report: [],
      reportGraph: [],

      Raw_Dat: [],
      listItemNo: [],
      listModelName: [],
      listModelGroup: [],

      optionSelected: null,
      isDisable: false,
      sortConfig: { key: null, direction: "ascending" }, // Ensure this is properly initialized
    };
  }

  componentDidMount = async () => {
    try {
      await this.getModelGroup();
    } catch (error) {
      console.error("Error in componentDidMount:", error);
      // ทำการจัดการข้อผิดพลาดที่นี่
    }
  };

  doGetDataReport = async () => {
    try {
      const result = await httpClient.get(
        `${server.MASTER_URL}/${this.state.ModelGroup}/${this.state.ItemNo[0].label}`
      );

      let rawData = result.data.listRawData;
      console.log("Raw data:", rawData);
      console.log("Raw data length:", rawData.length);

      // If rawData is an array with one element that's an array of data
      for (let i = 1; i < rawData.length; i++) {
        rawData[0].push(...rawData[i]);
      }
      this.setState({ Raw_Dat: rawData[0] });

      this.setState({ report: result.data.result });

      this.setState({ isDisable: false });
    } catch (error) {
      console.error("Error fetching data:", error);
      this.setState({ isDisable: false });
    }
  };

  getModelGroup = async () => {
    const array = await httpClient.get(server.MASTERGROUP_URL);
    const options = array.data.result.map((d) => ({
      label: d.ModelGroup,
    }));
    this.setState({ listModelGroup: options });
  };

  getItemNO = async () => {
    const array = await httpClient.get(
      server.MASTERITEMNO_URL + "/" + this.state.ModelGroup
    );
    const options = array.data.result.map((d) => ({
      label: d.ItemNo,
    }));
    this.setState({ listItemNo: options });
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
  handleSubmit = async () => {
    this.setState({ isDisable: true });

    // Show loading alert
    Swal.fire({
      icon: "info",
      title: "Loading Data",
      timer: 60000,
      allowOutsideClick: false,
      didOpen: async () => {
        Swal.showLoading();
        await this.doGetDataReport();
        await new Promise((resolve) => setTimeout(resolve, 100)); // Short delay to ensure state update
        Swal.close();
      },
    }).then(() => {
      // Check if listModelGroup is not empty
      if (!this.state.listModelGroup || this.state.listModelGroup.length === 0) {
        Swal.fire({
          icon: "error",
          title: "Missing Model Data",
          text: "Please make sure to select a model group.",
        });
        return;
      }

      // Check if listItemNo is not empty
      if (!this.state.listItemNo || this.state.listItemNo.length === 0) {
        Swal.fire({
          icon: "error",
          title: "Missing ItemNo Data",
          text: "Please make sure to select an ItemNo.",
        });
        return;
      }

      // Check if report is not empty
      if (this.state.report.length > 0) {
        // Check if Item_No exists and is not empty
        if (this.state.report[0].Item_No && this.state.report[0].Item_No.length > 0) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Data has been loaded successfully",
          });
        } else if (this.state.report[0].Item_No && this.state.report[0].Item_No.length === 0) {
          Swal.fire({
            icon: "error",
            title: "No production data",
            text: "Please select another date",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Data loading has encountered an error",
          text: "Please try again",
        });
      }
    });
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
                  <h1>Item no. Master</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item active">Item no. Master</li>
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
                    {/* Select Critiria "ModelGroup" */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Model Group</label>
                        <Select
                          options={this.state.listModelGroup}
                          onChange={async (e) => {
                            await this.setState({ ModelGroup: e.label });
                            await this.getItemNO();
                            await this.setState({
                              ItemNo: [{ label: "**ALL**" }],
                            });
                          }}
                          placeholder="Select ModelGroup"
                        />
                      </div>
                    </div>

                    {/* Select Critiria "ItemNo" */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Item No</label>
                        <Select
                          options={this.state.listItemNo}
                          value={this.state.ItemNo[0]}
                          onChange={async (e) => {
                            await this.setState({ ItemNo: [] });
                            this.state.ItemNo.push({ label: e.label });
                          }}
                          placeholder="Select ItemNo"
                        />
                      </div>
                    </div>

                    {/* Submit button */}
                    <div className="col-md-1">
        <button
          disabled={this.state.isDisable}
          onClick={this.handleSubmit}
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
                        filename={"MasteritemNO.csv"}
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
                                  "Customer_Code",
                                  "Model_Group",
                                  "Item_No",
                                  "Item_Name",
                                  "Model_Name",
                                  "WC_Code",
                                  "Lot_Size_Final",
                                  "Lot_Size_QA",
                                  "QA_Code",
                                  "Tray_Per_QA",
                                  "Updater",
                                  "Time_stamp",
                                  "Bag_Color",
                                  "End_Of_Life",
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
                                <tr key={index} align="center">
                                  <td align="Left">{item.Customer_Code}</td>
                                  <td align="Left">{item.Model_Group}</td>
                                  <td align="Left">{item.Item_No}</td>
                                  <td align="Left">{item.Item_Name}</td>
                                  <td align="Left">{item.Model_Name}</td>
                                  <td align="Left">{item.WC_Code}</td>
                                  <td align="RIGHT">
                                    {Number(item.Lot_Size_Final).toLocaleString(
                                      undefined,
                                      {
                                        maximumFractionDigits: 2,
                                      }
                                    )}
                                  </td>
                                  <td align="RIGHT">
                                    {Number(item.Lot_Size_QA).toLocaleString(
                                      undefined,
                                      {
                                        maximumFractionDigits: 2,
                                      }
                                    )}
                                  </td>
                                  <td>{item.QA_Code}</td>
                                  <td align="RIGHT">
                                    {Number(item.Tray_Per_QA).toLocaleString(
                                      undefined,
                                      {
                                        maximumFractionDigits: 2,
                                      }
                                    )}
                                  </td>
                                  <td>{item.Updater}</td>
                                  <td>{item.Time_stamp}</td>
                                  <td>{item.Bag_Color}</td>
                                  <td>{item.End_Of_Life}</td>
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

export default MasterItemNO;
