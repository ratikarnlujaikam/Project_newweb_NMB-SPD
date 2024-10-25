import React, { Component } from "react";
import { key, server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import Select from "react-select";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";

class MasterSupplier extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      Supplier: [],
      ModelGroup: [],
      report: [],
      Raw_Dat: [],
      listSupplier: [],
      listModelGroup: [],
      optionSelected: null,
      isDisable: false,
      sortConfig: { key: null, direction: "ascending" }, // Ensure this is properly initialized
    };
  }

  componentDidMount = async () => {
    await this.getSupplier();
  };

  // report with select Supplier,date,type
  doGetDataReport = async () => {
    const result = await httpClient.get(
      server.MASTERSUP_URL +
        "/" +
        this.state.Supplier +
        "/" +
        this.state.ModelGroup[0].label
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

  getSupplier = async () => {
    const array = await httpClient.get(server.MASTERSUPPLIER_URL);
    const options = array.data.result.map((d) => ({
      label: d.Supplier,
    }));
    this.setState({ listSupplier: options });
  };

  getModelGroup = async () => {
    const array = await httpClient.get(
      server.MASTERMODELGROUP_URL + "/" + this.state.Supplier
    );
    const options = array.data.result.map((d) => ({
      label: d.Model_group,
    }));
    this.setState({ listModelGroup: options });
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
    // Check if listSupplier is not empty
    if (!this.state.listSupplier || this.state.listSupplier.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Missing Supplier Data",
        text: "Please make sure to select a Supplier",
      });
      return; // Stop further execution if validation fails
    }

    // Check if listModelGroup is not empty
    if (!this.state.listModelGroup || this.state.listModelGroup.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Missing ModelGroup Data",
        text: "Please make sure to select a ModelGroup",
      });
      return; // Stop further execution if validation fails
    }

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
        await new Promise((resolve) => setTimeout(resolve, 100)); // Add a short delay to ensure state update
        Swal.close();
      },
    }).then(() => {
      if (this.state.report.length > 0) {
        if (this.state.report[0].Supplier_Name.length > 0) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Data has been loaded successfully",
          });
        } else {
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
                  <h1>Supplier data Master </h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">
                      {" "}
                      Supplier data Master
                    </li>
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
                    {/* //Select Critiria "Supplier" */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Supplier</label>
                        <Select
                          options={this.state.listSupplier}
                          onChange={async (e) => {
                            await this.setState({ Supplier: e.label });
                            await this.getModelGroup();
                            await this.setState({
                              ModelGroup: [{ label: "ALL" }],
                            });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select Supplier"
                        />
                      </div>
                    </div>

                    {/* //Select Critiria "Type" */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Model group</label>
                        <Select
                          options={this.state.listModelGroup}
                          value={this.state.ModelGroup[0]}
                          onChange={async (e) => {
                            await this.setState({ ModelGroup: [] });
                            this.state.ModelGroup.push({ label: e.label });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select ModelGroup"
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
                                  "Part_Name",
                                  "Supplier_Name",
                                  "Supplier_Code",
                                  "Model_group",
                                  "Model_Name",
                                  "Remark",
                                  "Updater",
                                  "Time_stamp",
                                  "Part_number_NMB",
                                  "Part_number_Seagate",
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
                                  <td align="Left">{item["Part_Name"]}</td>
                                  <td align="Left">{item["Supplier_Name"]}</td>
                                  <td align="Left">{item["Supplier_Code"]}</td>
                                  <td align="Left">{item["Model_group"]}</td>
                                  <td align="Left">{item["Model_Name"]}</td>
                                  <td align="Left">{item["Remark"]}</td>
                                  <td align="Left">{item["Updater"]}</td>
                                  <td align="Left">{item["Time_stamp"]}</td>
                                  <td align="Left">
                                    {item["Part_number_NMB"]}
                                  </td>
                                  <td align="Left">
                                    {item["Part_number_Seagate"]}
                                  </td>
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

export default MasterSupplier;
