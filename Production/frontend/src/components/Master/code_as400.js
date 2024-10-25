import React, { Component } from "react";
import { key, server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import moment from "moment";
import Select from "react-select";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";

class code_as400 extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      model: { label: "**ALL**" },
      Line: [{ label: "**ALL**" }],
      confirm: [{ label: "**ALL**" }],
      report: [],
      QANumber: "",
      report2: [],
      Raw_Dat2: [],
      Raw_Dat: [],
      startDate: moment().format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"),
      listModel: [],
      listLine: [], 
      listconfirm: [], 
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
      server.CODE_AS400_URL +
        "/" +
        modelLabel +
        "/" +
        this.state.Line[0].label +
        "/" +
        this.state.confirm[0].label 
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
            <td>{item["Component_name"]}</td>
            <td>{item["VendorName"]}</td>
            <td>{item["MotorSerialCode"]}</td>
            <td>{item["AS400Code"]}</td>


          </tr>
        ));
      }
    }
  };

  getModel = async () => {
    try {
      const response = await httpClient.get(server.CODE_AS_400_Component_name__URL);
      const options = response.data.result.map((d) => ({
        label: d.Component_Part,
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
        server.CODE_AS_400_Vendor_Name_URL + "/" + modelLabel
      );
      const options = response.data.result.map((d) => ({
        label: d.VendorName,
      }));
      this.setState({ listLine: options });
    } catch (error) {
      console.error("Error fetching lines:", error);
    }
  };

  getconfirm = async () => {
    const array = await httpClient.get(server.CODE_AS_400_URL +"/"+ this.state.Line[0].label);
    const options = array.data.result.map((d) => ({
      label: d.AS400Code,
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
                  <h1>AS400 code for QA Movement </h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">
                    AS400 code for QA Movement{" "}
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
                    {/* //Select Critiria "Model" */}
                    <div className="col-sm-2">
                      <div className="form-group">
                        <div></div>
                        <label>Component name</label>
                        <Select
                          options={this.state.listModel}
                          value={this.state.model}
                          onChange={async (e) => {
                            await this.setState({ model: e });
                            await this.getLine(); // เมื่อเลือก model ใหม่ จะอัปเดต line
                            await this.getconfirm(); // เมื่อเลือก model ใหม่ จะอัปเดต confirm
                            await this.setState({
                              Line: [{ label: "**ALL**" }],
                              confirm: [{ label: "**ALL**" }],
                            });
                          }}
                          placeholder="Select Model"
                        />
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Vendor Name</label>
                        <Select
                          options={this.state.listLine}
                          value={this.state.Line[0]}
                          onChange={async (e) => {
                            await this.setState({ Line: [e] }); // อัปเดต line ที่เลือก
                            await this.getconfirm(); // เมื่อเลือก line ใหม่ จะอัปเดต confirm
                            await this.setState({
                              confirm: [{ label: "**ALL**" }],
                            });
                          }}
                          placeholder="**ALL**"
                        />
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="form-group">
                        <label>AS400 Code</label>
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
                              await new Promise((resolve) => setTimeout(resolve,100))
                              Swal.close();
                            },
                          }).then(() => {
                            if (this.state.report.length > 0) {
                              if (this.state.report[0].Component_name.length > 0) {
                                Swal.fire({
                                  icon: "success",
                                  title: "Success",
                                  text: "Data has been loaded successfully",
                                });
                              } else if (
                                this.state.report[0].Component_name.length == 0
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
                                // window.location.reload();
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
              <div className="content">
                <div className="container-fluid">
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
                                  <th width="175">Component name </th>
                                  <th width="175">Vendor Name</th>
                                  <th width="175">MotorSerialCode</th>
                                  <th width="200">AS400Code</th>
                    
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

export default code_as400;
