import React, { Component } from "react";
import { key, server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import Chart from "react-apexcharts";
import moment from "moment";
import Select from "react-select";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";
import { IconName } from "react-icons/tb";
import { Icon } from "@material-ui/core";

class For_Inspection_tags_status extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      QANumber: "",
      ReportPRINT: [],
      ReportCo2: [],
      ReportQA: [],
      Tray_Record: [],
      IntoPallet: [],
      PCMC: [],
      Hold: [],
      Raw_Dat: [],
      Unpack_report:[],
      startDate: moment().format("yyyy-MM-DD"), //moment().add("days", -6).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"), //moment().format("yyyy-MM-DD"),

      listModel: [],
      listInsType: [],

      optionSelected: null,
      isDisable: false,
    };
  }

  ReportPRINT = async () => {
    const result = await httpClient.get(
      server.PRINTFOR_URL + "/" + this.state.QANumber
    );

    let rawData = result.data.listRawData;
    console.log(rawData);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat: rawData[0] });
    console.log(this.state.Raw_Dat);

    this.setState({
      ReportPRINT: result.data.result,
      isDisable: false,
    });
  };
  ReportCo2 = async () => {
    const result = await httpClient.get(
      server.OUTPUTCO2_URL + "/" + this.state.QANumber
    );

    let rawData = result.data.listRawData1;
    console.log(rawData);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat: rawData[0] });
    console.log(this.state.Raw_Dat);

    this.setState({
      ReportCo2: result.data.result,
      isDisable: false,
    });
  };

  ReportQA = async () => {
    const result = await httpClient.get(
      server.QA_URL + "/" + this.state.QANumber
    );

    let rawData = result.data.listRawData1;
    console.log(rawData);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat: rawData[0] });
    console.log(this.state.Raw_Dat);

    this.setState({
      ReportQA: result.data.result,
      isDisable: false,
    });
  };

  ReportTray_Record = async () => {
    const result = await httpClient.get(
      server.Tray_Record_URL + "/" + this.state.QANumber
    );

    let rawData = result.data.listRawData1;
    console.log(rawData);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat: rawData[0] });
    console.log(this.state.Raw_Dat);

    this.setState({
      Tray_Record: result.data.result,
      isDisable: false,
    });
  };

  ReportUnpacking = async () => {
    const result = await httpClient.get(
      server.Unpacking_URL + "/" + this.state.QANumber
    );
    console.log("result:Unpacking_URL " ,result);

    let rawData = result.data.list_unpacking;
    console.log("Unpack_report",rawData);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }

    this.setState({
      Unpack_report: result.data.result,
      isDisable: false,
    });
  };
  ReportTRAY_PACKING = async () => {
    const result = await httpClient.get(
      server.TRAY_PACKING_URL + "/" + this.state.QANumber
    );

    let rawData = result.data.listRawData1;
    console.log(rawData);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat: rawData[0] });
    console.log(this.state.Raw_Dat);

    this.setState({
      TRAY_PACKING: result.data.result,
      isDisable: false,
    });
  };
  //IntoPallet
  ReportIntoPallet = async () => {
    const result = await httpClient.get(
      server.INTOPALLET_URL + "/" + this.state.QANumber
    );

    let rawData = result.data.listRawData1;
    console.log(rawData);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat: rawData[0] });
    console.log(this.state.Raw_Dat);

    this.setState({
      IntoPallet: result.data.result,
      isDisable: false,
    });
  };
  ReportPCMC = async () => {
    const result = await httpClient.get(
      server.PCMC_URL + "/" + this.state.QANumber
    );

    let rawData = result.data.listRawData1;
    console.log(rawData);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat: rawData[0] });
    console.log(this.state.Raw_Dat);

    this.setState({
      PCMC: result.data.result,
      isDisable: false,
    });
  };
  ReportHold = async () => {
    const result = await httpClient.get(
      server.QAHOLD_STATUS_URL + "/" + this.state.QANumber
    );

    let rawData = result.data.listRawData2;
    console.log(rawData);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat2: rawData[0] });
    console.log(this.state.Raw_Dat2);

    this.setState({
      Hold: result.data.result,
      isDisable: false,
    });
  };

  Print_QA = () => {
    if (this.state.ReportPRINT != null) {
      if (this.state.ReportPRINT.length > 0) {
        return this.state.ReportPRINT.map((item) => (
          <tr>
            <i class="fas fa-angle-double-down"></i>

            <img
              id="target"
              src="Print_forsetlot.png"
              style={{ width: "80%" }}
            />
            <td style={{ fontWeight: "bold" }}>{item["Print_forsetlot"]}</td>
       
            <td>{item["DateTime"]}</td>
            <td><span style={{ fontWeight: "bold" }}>Qty :</span> {item["Qty"]}</td>
            <td>{item["Mo_number"]}</td>
            <td>{item["Model"]}</td>
            <td>{item["Model_No"]}</td>
            <td>{item["Line"]}</td>
            <td>{item["Special_control"]}</td>
            <td>{item["Supporter_name"]}</td>
            <td>{item["W/W"]}</td>
            <td>{item["Baseplate"]}</td>
            <td>{item["Ramp"]}</td>
            <td>{item["Crashstop"]}</td>
            <td>{item["Hub"]}</td>
            <td>{item["Magnet"]}</td>
            <td>{item["Diverter"]}</td>
            <td>{item["FPC"]}</td>
            <td>{item["Stack"]}</td>
          
            <td>{item["Machine_no"]}</td>
            <td>{item["CO2_EMP"]}</td>
            <td>{item["CO2_DATE"]}</td>
            <td>{item["CO2_SP1"]}</td>
            <td>{item["CO2_SP2"]}</td>
            <td>{item["SP1"]}</td>
            <td>{item["SP2"]}</td>
            <td>{item["SP3"]}</td>
            <td>{item["SP4"]}</td>
            <td>{item["SP5"]}</td>
            <td>{item["Revision"]}</td>
          </tr>
        ));
      }
    }
  };
  Co2 = () => {
    if (this.state.ReportCo2 != null) {
      if (this.state.ReportCo2.length > 0) {
        return this.state.ReportCo2.map((item) => (
          <tr>
            <i class="fas fa-angle-double-down"></i>
            <img id="target" src="Co2.png" style={{ width: "80%" }} />
            <td style={{ fontWeight: "bold" }}>{item["CO2"]}</td>
          
            <td>{item["DateTime"]}</td>
            <td><span style={{ fontWeight: "bold" }}>Qty :</span>  {item["Qty"]}</td>
            <td><span style={{ fontWeight: "bold" }}>Updater :</span> {item["Updater"]} </td>
            <td> <span style={{ fontWeight: "bold" }}>Remark :</span> {item["Remark"]} </td>
            <td> <span style={{ fontWeight: "bold" }}>Shift :</span> {item["Shift"]}</td>
          </tr>
        ));
      }
    }
  };
  QA = () => {
    if (this.state.ReportQA != null) {
      if (this.state.ReportQA.length > 0) {
        return this.state.ReportQA.map((item) => (
          <tr>
            <i class="fas fa-angle-double-down"></i>

            <img id="target" src="qa.png" style={{ width: "80%" }} />
            <td style={{ fontWeight: "bold" }}>{item["QA_Visual"]}</td>
      
            <td> {item["Time_VMI"]}</td>
            <td> <span style={{ fontWeight: "bold" }}>Qty :</span> {item["MOQTY"]}</td>
            <td> <span style={{ fontWeight: "bold" }}>InspectionType :</span> {item["InspectionType"]}</td>
            <td   
            style={{
                color:
                  item["InspectionResult"] === "REJECT"
                    ? "red" // หรือใช้ "rgb(255, 69, 0)"
                    : item["InspectionResult"] === "ACCEPT"
                    ? "green"
                    : "black",
              }}> <span style={{ fontWeight: "bold" }}>InspectionResult :</span> {item["InspectionResult"]}</td>
            <td> <span style={{ fontWeight: "bold" }}>Vis_Round :</span> {item["Vis_Round"]}</td>
          </tr>
        ));
      }
    }
  };

  TRAY_PACKING = () => {
    if (this.state.TRAY_PACKING != null) {
      if (this.state.TRAY_PACKING.length > 0) {
        return this.state.TRAY_PACKING.map((item) => (
          <tr>
            <i class="fas fa-angle-double-down"></i>
            <img id="target" src="Tray_Record.png" style={{ width: "80%" }} />
            <td style={{ fontWeight: "bold" }}>{item["Packing_IN_Cleanroom"]}</td>

            <td> <span style={{ fontWeight: "bold" }}></span> {item["TimeStamp"]}</td>
   
            <td>  <span style={{ fontWeight: "bold" }}>Qty :</span> {item["QTY"]}</td>
            <td>  <span style={{ fontWeight: "bold" }}>Count Tray :</span> {item["Count_Tray"]}</td>
            <td> <span style={{ fontWeight: "bold" }}>Remark :</span> {item["Remark"]}</td>
            <td>  <span style={{ fontWeight: "bold" }}>Round no. :</span> {item["Round_no"]}</td>
            <td> <span style={{ fontWeight: "bold" }}>EMP_Bag1 :</span> {item["EMP_Bag1"]}</td>
            <td>  <span style={{ fontWeight: "bold" }}>EMP_Pack1 :</span>  {item["EMP_Pack1"]}</td>
            <td>  <span style={{ fontWeight: "bold" }}>EMP_Pack2 :</span> {item["EMP_Pack2"]}</td>
            <td>  <span style={{ fontWeight: "bold" }}>EMP_Supporter :</span> {item["EMP_Supporter"]}</td>
            <td> <span style={{ fontWeight: "bold" }}>Station :</span> {item["Station"]}</td>
            <td><span style={{ fontWeight: "bold" }}>FinishTime :</span> {item["FinishTime"]}</td>
            <td> <span style={{ fontWeight: "bold" }}>Produc :</span> {item["Produc"]}</td>
            <td> <span style={{ fontWeight: "bold" }}>Shift :</span> {item["Shift"]}</td>
           
          </tr>
        ));
      }
    }
  };
  Tray_Record = () => {
    if (this.state.Tray_Record != null) {
      if (this.state.Tray_Record.length > 0) {
        return this.state.Tray_Record.map((item) => (
          <tr>
            <i class="fas fa-angle-double-down"></i>
            <img id="target" src="tray.png" style={{ width: "80%" }} />
            <td style={{ fontWeight: "bold" }}>{item["Tray_Record1"]}</td>
       
            <td> {item["TimeStamp"]}</td>
          </tr>
        ));
      }
    }
  };
  Unpacking = () => {
    if (this.state.Unpack_report != null) {
      if (this.state.Unpack_report.length > 0) {
        return this.state.Unpack_report.map((item) => (
          <tr >
            <i class="fas fa-angle-double-down"></i>
            <img id="target" src="icons8-box-64.png" style={{ width: "80%" }} />
            <td style={{ fontWeight: "bold" }}>{item["status"]}</td>
       
            <td> {item["TimeStamp"]}</td>
            <td> <span style={{ fontWeight: "bold" }}>Qty :</span>   {item["Qty"]}</td>
            <td style={{
            color:
              item["status_sort"] === "Pending"
                ? "orange"
                : item["status_sort"] === "Completed"
                ? "green"
                : "black",
          }}> <span style={{ fontWeight: "bold" }}>Status :</span>   {item["status_sort"]}</td>
                      <td> <span style={{ fontWeight: "bold" }}>Datetime_return :</span>  {item["sorting_return"]}</td>
            <td> <span style={{ fontWeight: "bold" }}>Baseplate :</span>  {item["Baseplate"]}</td>
            <td> <span style={{ fontWeight: "bold" }}>Ramp :</span> {item["Ramp"]}</td>
            <td> <span style={{ fontWeight: "bold" }}>Diverter :</span> {item["Diverter"]}</td>
            <td> <span style={{ fontWeight: "bold" }}>Emp Unpacking:</span>   {item["Emp"]}</td>

            <td>  <span style={{ fontWeight: "bold" }}>Reason_Hold :</span>{item["Reason_Hold"]}</td>
          </tr>
        ));
      }
    }
  }

  IntoPallet = () => {
    if (this.state.IntoPallet != null) {
      if (this.state.IntoPallet.length > 0) {
        return this.state.IntoPallet.map((item) => (
          <tr>
            <i class="fas fa-angle-double-down"></i>
            <img id="target" src="INTO_Pallet.png" style={{ width: "80%" }} />

            <td style={{ fontWeight: "bold" }}>{item["Pallet"]}</td>
    
            <td> {item["TimeStamp"]}</td>
            <td> <span style={{ fontWeight: "bold" }}>Pallet_Number :</span>  :{item["Pallet_Number"]}</td>
          </tr>
        ));
      }
    }
  };
  PCMC = () => {
    if (this.state.PCMC != null) {
      if (this.state.PCMC.length > 0) {
        return this.state.PCMC.map((item) => (
          <tr>
            <i class="fas fa-angle-double-down"></i>
            <img id="target" src="ship.png" style={{ width: "80%" }} />
            <td style={{ fontWeight: "bold" }}>{item["PCMC"]}</td>
          
            <td> {item["Timpstamp"]}</td>
            <td> <span style={{ fontWeight: "bold" }}>Invoie ID :</span> {item["Invoie_ID"]}</td>
            <td>  <span style={{ fontWeight: "bold" }}>Item no :</span> {item["Item_no"]}</td>
          </tr>
        ));
      }
    }
  };
  renderHold = () => {
    if (this.state.Hold != null) {
      if (this.state.Hold.length > 0) {
        return this.state.Hold.map((item) => (
          <tr  style={{
            color:
              item["Status"] === "Hold"
                ? "red"
                : item["Status"] === "Accept"
                ? "green"
                : "black",
          }}>
            <i class="fas fa-angle-double-down"></i>
            <img id="target" src="HOLD_LOCK.png" style={{ width: "80%" }} />
            <td style={{ fontWeight: "bold" }}>{item["process"]}</td>
    
            <td>{item["DateTime"]}</td>
            <td><spen style={{ fontWeight: "bold" }}>Hold Number :</spen>{item["Hold_index"]}</td>
            
            <td
            
             
            >
      Status :
             {item["Status"]}
            </td>

            <td>
              <span style={{ fontWeight: "bold" }}>Hold by :</span>
              {item["Hold_by"]}/{item["Access_by"]}
            </td>
            <td>
              <span style={{ fontWeight: "bold" }}>Hold detail :</span>
              {item["Hold_detail"]}
            </td>
            <td>
              <span style={{ fontWeight: "bold" }}>Disposition :</span>
              {item["Disposition"]}
            </td>
            <td>
              <span style={{ fontWeight: "bold" }}>Hold Date :</span>
              {item["Hold_Date"]}
            </td>
            <td>
              <span style={{ fontWeight: "bold" }}>Remark :</span>
              {item["Remark"]}
            </td>
            <td
            
            >
              <span style={{ fontWeight: "bold" }}>Control Ship :</span>
              {item["Control_Ship"]}
            </td>

            <td
              style={{
                color:
                  item["Status_Hold"] === "Hold"
                    ? "red" // หรือใช้ "rgb(255, 69, 0)"
                    : item["Status_Hold"] === "Accept"
                    ? "green"
                    : "black",
              }}
            >
              {item["Status_Hold"]}
            </td>
          </tr>
        ));
      }
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
                  <h1>For Inspection tags status</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">For Inspection tags status</li>
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
                    <label>Scan QA Number</label>
                  </h3>
                </div>

                <div className="card-body">
                  <div className="row">
                    {/* //Select Critiria "Model" */}
                    <div className="col-md-3">
                      <div className="input-group ">
                        <input
                          value={this.state.QANumber}
                          onChange={async (e) => {
                            await this.setState({
                              QANumber: e.target.value,
                            });
                          }}
                          type="text"
                          className="form-control"
                          placeholder="Scan QANumber here"
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
                              await this.ReportPRINT();
                              await this.ReportCo2();
                              await this.ReportQA();
                              await this.ReportHold();
                              await this.ReportTRAY_PACKING();
                              await this.ReportUnpacking();
                              await this.ReportTray_Record();
                              await this.ReportIntoPallet();
                              await this.ReportPCMC();

                              Swal.close();
                            },
                          }).then(() => {
                            if (this.state.ReportPRINT.length > 0) {
                              if (
                                this.state.ReportPRINT[0].Print_forsetlot
                                  .length > 0
                              ) {
                                Swal.fire({
                                  icon: "success",
                                  title: "Success",
                                  text: "Data has been loaded successfully",
                                });
                              } else if (
                                this.state.ReportPRINT[0].Print_forsetlot
                                  .length == 0
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
                        // style={{ marginTop: 30 }}
                      >
                        Submit
                      </button>
                    </div>
           
                  </div>
                </div>
              </div>

              {/* Table*/}

              <div className="row">
                <div className="content">
                  <div className="container-fluid">
                    <div className="card card-primary">
                      <div className="col-12">
                        {/* /.card-header */}
                        <div
                          className="card-body table-responsive p-0"
                          style={{ height: 800 }}
                        >
                          <table className="table table-head-fixed text-nowrap table-hover">
                            <thead>
                              <tr>
                              <th width="200">...</th>
                                <th width="200">Status</th>
                                <th width="40">DateTime</th>
                                <th width="40">Qty</th>
                                <th width="40">Mo number</th>
                                <th width="40">Model</th>
                                <th width="40">Model No</th>

                                <th width="40">Line</th>
                                <th width="40">Special control</th>
                                <th width="40">Supporter name</th>
                                <th width="40">W/W</th>
                                <th width="40">Baseplate</th>
                                <th width="40">Ramp</th>
                                <th width="40">Crashstop</th>
                                <th width="40">Hub</th>
                                <th width="40">Magnet</th>
                                <th width="40">Diverter</th>
                                <th width="40">FPC</th>
                                <th width="40">Stack</th>
                              
                                <th width="40">Machine no</th>
                                <th width="40">CO2 EMP</th>
                                <th width="40">CO2 DATE</th>
                                <th width="40">CO2 SP1</th>
                                <th width="40">CO2 SP2</th>
                                <th width="40">SP1</th>
                                <th width="40">SP2</th>
                                <th width="40">SP3</th>
                                <th width="40">SP4</th>
                                <th width="40">SP5</th>
                                <th width="40">Revision</th>
                              </tr>
                            </thead>
                            <tbody>{this.Print_QA()}</tbody>
                            <tbody>{this.Co2()}</tbody>
                            <tbody>{this.QA()}</tbody>

                            <tbody>{this.TRAY_PACKING()}</tbody>
                            <tbody>{this.Tray_Record()}</tbody>
                          
                            <tbody>{this.IntoPallet()}</tbody>
                            <tbody>{this.PCMC()}</tbody>
                            <tbody>{this.Unpacking()}</tbody>
                            <tbody>{this.renderHold()}</tbody>
                         
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table*/}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default For_Inspection_tags_status;
