import React, { Component } from "react";
import { key, server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import moment from "moment";
import Select from "react-select";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";



class ReportOJT extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {

      model: { label: "**ALL**" },
      Line: [{ label: "**ALL**" }],
      report: [],
      QANumber: "",
      report2: [],
      report3: [],
      EmpNo : [],
      Raw_Dat3: [],
      Raw_Dat2: [],
      Raw_Dat1 : [],
      Raw_Dat: [],

      listModel: [],
      listLine: [],
      startDate: moment().add("days", -7).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"),
      optionSelected: null,
      isDisable: false,
    };
  }

  componentDidMount = async () => {
    await this.getModel();
    await this.getLine();
    await this.doGetAlarmtraining();

  };


  doGetAlarmtraining = async () => {
    const modelLabel =
    this.state.model.label === "**ALL**" ? "**ALL**" : this.state.model.label;
    const result = await httpClient.get(
      server.REPORTTRAININGMODEL +
        "/" +
        modelLabel +
        "/" +
        this.state.Line[0].label +
        "/" +
        this.state.startDate +
        "/" +
        this.state.finishDate
    
    );
    console.log(result);
  
    let rawData2 = result.data.listRawData;
    console.log(rawData2);
    for (let i = 1; i < rawData2.length; i++) {
      rawData2[0].push(...rawData2[i]);
    }
    this.setState({ Raw_Dat2: rawData2[0] });
    console.log(this.state.Raw_Dat2);

    this.setState({
      report2: result.data.result,
      isDisable: false,
    });
  }



  getModel = async () => {
    const array = await httpClient.get(server.MODELREPORTTRAINING);
    const options = array.data.result.map((d) => ({
      label: d.Model,
    }));
    this.setState({ listModel: options });
  };

  getLine = async () => {
    const modelLabel =
    this.state.model.label === "**ALL**"
      ? "**ALL**"
      : this.state.model.label;
    const array = await httpClient.get(
      server.LINEREPORTTRAINING + "/" + modelLabel
    );
    const options = array.data.result.map((d) => ({
      label: d.Line,
    }));
    this.setState({ listLine: options });
  };



  renderReport2 = () => {
    if (this.state.report2 != null) {
      if (this.state.report2.length > 0) {
        return this.state.report2.map((item) => (
          <tr
          
        >
            <td>{item["EmpNo"]}</td>
            <td>{item["Name"]}</td>
            <td>{item["Model"]}</td>
            <td>{item["Line"]}</td>
            <td>{item["Document_No"]}</td>
            <td>{item["Process"]}</td>
            <td>{item["Detail_WI"]}</td>
            <td>{item["Detail_5S"]}</td>
            <td>{item["Detail_WIP"]}</td>
            <td>{item["Detail_Handling"]}</td>
            <td>{item["Detail_Confirmmaster"]}</td>
            <td>{item["Detail_Spec"]}</td>
            <td>{item["Detail_Criticalparameter"]}</td>         
            <td>{item["Detail_effectNG"]}</td>
            <td>{item["EmpTrainner"]}</td>         
            <td>{item["QCName"]}</td>
            <td>{item["Date_QCpassed"]}</td>            

           
    
          </tr>
        ));
      }
    }
  };



  render() {
    console.log(this.state.model);
    console.log(this.state.Line);
    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 70 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Training record report</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">Training record report </li>
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
                        <div></div>
                        <label>Model group</label>
                        <Select
                          options={this.state.listModel}
                          value={this.state.model}
                          onChange={async (e) => {
                            await this.setState({ model: e });
                            await this.getLine();
                            await this.setState({
                              Line: [{ label: "Select Line" }],
                            });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select Model"
                         
                        />
                      </div>
                    </div>

                    {/* //Select Critiria "Type" */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Line</label>
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
                       {/* //Select Start Date */}
                       <div className="col-md-2">
                      <div className="form-group">
                        <label>
                          By Daily Select From &nbsp;
                 
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
                          // this.setState({ QANumber: "" });
                          this.setState({ isDisable: true });
                          //this.doGetAlarmtraining();
                          Swal.fire({
                            icon: "info",
                            title: "Loading Data",
                            timer: 60000,
                            allowOutsideClick: false,
                            didOpen: async () => {
                              Swal.showLoading();
                              await this.doGetAlarmtraining();
                              setTimeout(() => {
                                Swal.close();
                              }, 1000);
                      
                            },
                          }).then(() => {
                            if (this.state.report2.length > 0) {
                              if (this.state.report2[0].EmpNo.length > 0) {
                                Swal.fire({
                                  icon: "success",
                                  title: "Success",
                                  text: "Data has been loaded successfully",
                                });
                              } else if (
                                this.state.report2[0].EmpNo.length == 0
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
                    <div className="col-md-3">
                      <CSVLink
                        data={this.state.Raw_Dat2}
                        filename={"training_report.csv"}
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
              <div class="content">
                <div class="container-fluid">
                  <div className="card card-primary">
                    <div className="row">
                      <div className="col-12">
                        {/* /.card-header */}
                        <div
                          className="card-body table-responsive p-0"
                          style={{ height: 500 ,
                            zIndex: "3",
                            position: "relative",
                            zIndex: "0",}}
                     
                        >
                          <table className=" table  text-nowrap table-hover table-head-fixed">
                            <thead>
                              <tr Align="Center">
                                <th width="175">EmpNo</th>
                                <th width="175">Name</th>
                                <th width="175">Model</th>
                                <th width="175">Line</th>
                                <th width="175">Document_No</th>
                                <th width="175">Process</th>
                                <th width="175">Detail_WI</th>
                                <th width="175">Detail_5S</th>
                                <th width="175">Detail_WIP</th>
                                <th width="175">Detail_Handling</th>
                                <th width="175">Detail_Confirmmaster</th>
                                <th width="175">Detail_Spec</th>
                                <th width="175">Detail_Criticalparameter</th>
                                <th width="175">Detail_effectNG</th>
                                <th width="175">EmpTrainner</th>
                                <th width="175">QCName</th>
                                <th width="175">Date_QCpassed</th>
                                
                              </tr>
                            </thead>
                           
                            <tbody>{this.renderReport2()}</tbody>

                          
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


export default ReportOJT;
