import React, { Component } from "react";
import { server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import Swal from "sweetalert2";
import { Url } from "../../constants/index.js";
import Select from "react-select";
import { loadIcons } from '../sidemenu/loadIcons';
class add_sidemenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      Division: [],
      listdivition: [],
      Details: [],
      listdetails: [],
      path: "",
      name: "",
      updateby: "",
      isAdmin: false, // New state to check if 'Admin' is entered
      adminInput: "", // State to track input for admin check
      isDisable: false,
      iconOptions: loadIcons(),
      selectedIcon: null, // Track selected icon
    };
  }

  componentDidMount = async () => {
    try {
      await this.getdropdown();
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
  getdropdown = async () => {
    try {
      const response = await httpClient.get(server.DROPDOWN_DIVISION_URL);
      console.log("API Response:", response); // ตรวจสอบการตอบกลับจาก API

      const options = response.data.Division.map((d) => ({
        label: d.Division,
        value: d.Division, // เพิ่มค่า value ถ้าต้องการ
      }));
      console.log("options", options);

      this.setState({ listdivition: options });
      const options_details = response.data.Details.map((d) => ({
        label: d.Details,
        value: d.Details,
      }));
      this.setState({ listdetails: options_details });
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
  sentdata_to_insert = async () => {
    try {
      const dataToSend = {
        Division: this.state.Division ? this.state.Division.label : null,
        Details: this.state.Details ? this.state.Details.label : null,
        path: this.state.path,
        name: this.state.name,
        Icon: this.state.selectedIcon ? this.state.selectedIcon.value : null,
        updateby: this.state.updateby,
      };
      console.log(dataToSend);

      // Send data to the server
      let result = await httpClient.post(
        server.INSERT_SIDEMENU_URL,
        dataToSend
      );
      console.log(result);
      

      // Show success message
      Swal.fire({
        title: "Success!",
        text: "Data has been inserted successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });

      // Optionally reset state or clear form
      this.setState({
        Division: null,
        Details: null,
        path: "",
        name: "",
        Icon: "",
      });

      console.log(result.data);
    } catch (error) {
      // Handle and display error
      Swal.fire({
        title: "Error!",
        text:
          error.response?.data?.message ||
          "There was an error inserting the data.",
        icon: "error",
        confirmButtonText: "OK",
      });

      console.error("Error inserting data:", error);
    }
  };
  handleAdminInput = (e) => {
    const value = e.target.value;
    this.setState({
      adminInput: value,
      isAdmin: value === "Admin", // Check if the input is 'Admin'
    });
  };

  render() {
    const { selectedIcon, iconOptions, Division, Details, path, name, updateby, isAdmin } = this.state;
    console.log(this.state.Division);
    return (
      <div className="content-wrapper" style={{ border: "1px solid #e6f7ff" }}>
        <div className="content" style={{ paddingTop: 80 }}>
          {!this.state.isAdmin ? ( // Show this input field if 'Admin' is not entered
            <div className="row">
              <div
                className="col-md-1.8"
                style={{
                  border: "2px solid #4CAF50",
                  borderRadius: "8px",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                <label>Update by</label>
                <div className="form-group">
                  <input
                    type="text"
                    value={this.state.updateby}
                    onChange={(e) =>
                      this.setState({ updateby: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
              </div>
              <div
                className="col-md-12"
                style={{
                  border: "2px solid #4CAF50",
                  borderRadius: "8px",
                  padding: "10px",
                  marginTop: "10px",
                }}
              >
                <div className="form-group">
                  <label>Input password:</label>
                  <input
                    type="text"
                    value={this.state.adminInput}
                    onChange={this.handleAdminInput}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="row">
              <ol className="breadcrumb-item">
                <a></a>
              </ol>
              <div className="col-md-12">
                <div
                  className="card card-primary card-outline"
                  style={{
                    width: "100%",
                    height: "200%",
                    backgroundColor: "#e6f7ff",
                  }}
                >
                  Add details sidemenu
                  <div className="row">
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Select Division</label>
                        <Select
                          value={this.state.Division}
                          onChange={(e) => {
                            this.setState({ Division: e });
                          }}
                          placeholder="Select Division"
                          options={this.state.listdivition}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Select Group</label>
                        <Select
                          value={this.state.Details}
                          onChange={(e) => {
                            this.setState({ Details: e });
                          }}
                          placeholder="Select Group"
                          options={this.state.listdetails}
                        />
                      </div>
                    </div>
                    <div className="col-md-1.8">
                      <label>Input path</label>
                      <div className="form-group" style={{ paddingTop: 2 }}>
                        <input
                          type="text"
                          value={this.state.path}
                          onChange={(e) =>
                            this.setState({ path: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-1.8">
                      <label>Input name</label>
                      <div className="form-group" style={{ paddingTop: 2 }}>
                        <input
                          type="text"
                          value={this.state.name}
                          onChange={(e) =>
                            this.setState({ name: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group" style={{ paddingTop: 2 }}>
                        <label>Select Icon</label>
                        <Select
                          value={selectedIcon}
                          onChange={(e) => this.setState({ selectedIcon: e })}
                          placeholder="Select Icon"
                          options={iconOptions}
                        />
                        {selectedIcon && (
                          <div style={{ marginTop: '10px' }}>
                            <img src={`/${selectedIcon.value}`} alt="Selected Icon" style={{ width: 50, height: 50 }} />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-1.8">
                      <label>Update by</label>
                      <div className="form-group" style={{ paddingTop: 2 }}>
                        <input
                          type="text"
                          value={this.state.updateby}
                          onChange={(e) =>
                            this.setState({ updateby: e.target.value })
                          }
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="form-group" style={{ paddingTop: 25 }}>
                        <button
                          className="btn btn-primary"
                          disabled={this.state.isDisable}
                          onClick={this.sentdata_to_insert} // Pass function reference
                        >
                          Insert to Database
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default add_sidemenu;
