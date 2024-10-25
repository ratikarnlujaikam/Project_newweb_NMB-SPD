import React, { Component } from "react";
import { server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import moment from "moment";
import Select from "react-select";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";

class Product_hold_control extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: "",
      checkboxChecked: false,
      checkboxHoldNumber: false,
      checkboxbyModel: false,
      Download_Hold_ALL: false,
      Hold_ALL_PC: false,
      isDisable: false,
      report: "",
      report1: "",
      report2: "",
      report3: "",
      HoldNumber: "",
      QANumber: "",
      CHECKBOXALL: "",
      isLoadingCheckboxAll: false, // Add separate isLoading state for "ALL Hold Report" radio button
      isLoadingHoldAll: false, // Add separate isLoading state for "Balance ALL" radio button
      Raw_Dat: [],
    };
    //set state
    this.state = {
      model: [],
      Line: [],
      Status: [],
      Access_by: [],
      report: [],
      QANumber: "",
      Holdnumber: "",

      report2: [],
      report3: [],
      CHECKBOXALL: [],
      HOLDFORPC: [],

      Raw_Dat2: [],
      Raw_Dat3: [],

      Raw_Dat: [],
      startDate: moment().format("yyyy-MM-DD"), //moment().add("days", -6).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"), //moment().format("yyyy-MM-DD"),

      listModel: [],
      listLine_No: [],
      listStatus: [],
      listAccess_by: [],

      optionSelected: null,
      isDisable: false,
    };
  }

  componentDidMount = async () => {
    await this.getModel();
  };

  state = {
    showData: false, // สถานะเริ่มต้นเป็น false (ไม่แสดงข้อมูล)
  };

  handleDateOptionChange = (event) => {
    this.setState({ selectedDateOption: event.target.value });
  };

  // report with select model,date,type
  doGetDataReport = async () => {
    const result = await httpClient.get(
      server.REPORTHOLD_URL +
        "/" +
        this.state.model +
        "/" +
        this.state.Line[0].label +
        "/" +
        this.state.Status[0].label +
        "/" +
        this.state.Access_by[0].label +
        "/" +
        this.state.startDate +
        "/" +
        this.state.finishDate +
        "/" +
        this.state.selectedDateOption
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
  doGetDataReport2 = async () => {
    const result = await httpClient.get(
      server.QAHOLD_URL + "/" + this.state.QANumber
    );

    let rawData = result.data.listRawData2;
    console.log(rawData);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat2: rawData[0] });
    console.log(this.state.Raw_Dat2);

    this.setState({
      report2: result.data.result,
      isDisable: false,
    });
  };

  doGetDataReport3 = async () => {
    const result = await httpClient.get(
      server.HOLDNUMBER_URL + "/" + this.state.Holdnumber
    );

    let rawData = result.data.listRawData3;
    console.log(rawData);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat3: rawData[0] });
    console.log(this.state.Raw_Dat3);

    this.setState({
      report3: result.data.result,
      isDisable: false,
    });
  };
  DoGetAll = async () => {
    try {
      this.setState({ isLoadingCheckboxAll: true }); // Set isLoadingCheckboxAll to true before fetching data
      const result = await httpClient.get(server.CHECKBOXALL_URL);

      let rawData = result.data.listRawData;
      console.log(rawData);
      for (let i = 1; i < rawData.length; i++) {
        rawData[0].push(...rawData[i]);
      }
      this.setState({ Raw_Dat: rawData[0] });
      console.log(this.state.Raw_Dat);

      this.setState({
        CHECKBOXALL: result.data.result,
        isDisable: true,
        isLoadingCheckboxAll: false, // Set isLoadingCheckboxAll back to false after data is fetched
      });
    } catch (error) {
      console.error("Error while fetching data:", error);
      this.setState({ isLoadingCheckboxAll: false }); // Ensure isLoadingCheckboxAll is reset even on error
    }
  };
  DoGetAllFORPC = async () => {
    try {
      this.setState({ isLoadingHoldAll: true }); // Set isLoadingHoldAll to true before fetching data
      const result = await httpClient.get(server.HOLDFORPC_URL);

      let rawData = result.data.listRawData;
      console.log(rawData);
      for (let i = 1; i < rawData.length; i++) {
        rawData[0].push(...rawData[i]);
      }
      this.setState({ Raw_Dat: rawData[0] });
      console.log(this.state.Raw_Dat);

      this.setState({
        HOLDFORPC: result.data.result,
        isDisable: true,
        isLoadingHoldAll: false, // Set isLoadingHoldAll back to false after data is fetched
      });
    } catch (error) {
      console.error("Error while fetching data:", error);
      this.setState({ isLoadingHoldAll: false }); // Ensure isLoadingHoldAll is reset even on error
    }
  };

  getModel = async () => {
    const array = await httpClient.get(server.ModelHoldQA_URL);
    const options = array.data.result.map((d) => ({
      label: d.ModelGroup,
    }));
    this.setState({ listModel: options });
  };

  getLine_No = async () => {
    const array = await httpClient.get(
      server.LINEQAHOLD_URL + "/" + this.state.model
    );
    const options = array.data.result.map((d) => ({
      label: d.Line_No,
    }));
    this.setState({ listLine_No: options });
  };
  getStatus = async () => {
    const array = await httpClient.get(server.StatusQAHOLD_URL);
    const options = array.data.result.map((d) => ({
      label: d.Status,
    }));
    this.setState({ listStatus: options });
  };

  getAccess_by = async () => {
    const array = await httpClient.get(
      server.Access_byHOLD_URL + "/" + this.state.Status
    );
    const options = array.data.result.map((d) => ({
      label: d.Access_by,
    }));
    this.setState({ listAccess_by: options });
  };

  renderReport = () => {
    if (this.state.report != null) {
      if (this.state.report.length > 0) {
        return this.state.report.map((item,index) => (
          <tr key={item.id || index}> 
            <td>{item["Setlot_Date"]}</td>
            <td>{item["Setlot_Datetime"]}</td>
            <td>{item["Qa_insp_date"]}</td>
            <td>{item["Qa_insp_Datetime"]}</td>

            <td>{item["Hold_Date_Mfg"]}</td>
            <td>{item["Hold_Date"]}</td>
            <td>{item["Hold_DateTime"]}</td>

            <td>{item["Model_group"]}</td>
            <td>{item["ModelNumber"]}</td>
            <td>{item["Line_No"]}</td>
            <td>{item["Hold_index"]}</td>
            <td>{item["Lot_QA"]}</td>
            <td>{item["DateCode"]}</td>
            <td align="RIGHT">
              {Number(item["QTY"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>{item["Hold_detail"]}</td>
            <td>{item["Remark"]}</td>
            <td>{item["Disposition"]}</td>
            <td>{item["Hold_by"]}</td>
            <td>{item["Access_by"]}</td>
            <td
              style={{
                color:
                  item["QA_result"] === "REJECT"
                    ? "red"
                    : item["QA_result"] === "ACCEPT"
                    ? "green"
                    : "black",
              }}
            >
              {item["QA_result"]}
            </td>

            <td
              style={{
                color:
                  item["Status_Hold"] === "Hold"
                    ? "#FF8C00" // หรือใช้ "rgb(255, 69, 0)"
                    : item["Status_Hold"] === "Accept"
                    ? "green"
                    : "black",
              }}
            >
              {item["Status_Hold"]}
            </td>
            <td>{item["Unpack_datetime"]}</td>
            <td>{item["Sorting_Status"]}</td>
            <td>{item["Status_Shipped"]}</td>
            <td>{item["Control_Ship"]}</td>
            <td>{item["Hold_Period"]}</td>
            <td>{item["SpecialControl5"]}</td>
            <td>{item["Release_Date"]}</td>
            <td>{item["Reason_to_Release"]}</td>
          </tr>
        ));
      }
    }
  };
  renderReport2 = () => {
    if (this.state.report2 != null) {
      if (this.state.report2.length > 0) {
        return this.state.report2.map((item,index) => (
          <tr key={item.id || index}> 
            <td>{item["Setlot_Date"]}</td>
            <td>{item["Setlot_Datetime"]}</td>
            <td>{item["Qa_insp_date"]}</td>
            <td>{item["Qa_insp_Datetime"]}</td>

            <td>{item["Hold_Date_Mfg"]}</td>
            <td>{item["Hold_Date"]}</td>
            <td>{item["Hold_DateTime"]}</td>

            <td>{item["Model_group"]}</td>
            <td>{item["ModelNumber"]}</td>
            <td>{item["Line_No"]}</td>
            <td>{item["Hold_index"]}</td>
            <td>{item["Lot_QA"]}</td>
            <td>{item["DateCode"]}</td>
            <td align="RIGHT">
              {Number(item["QTY"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>{item["Hold_detail"]}</td>
            <td>{item["Remark"]}</td>
            <td>{item["Disposition"]}</td>
            <td>{item["Hold_by"]}</td>
            <td>{item["Access_by"]}</td>
            <td
              style={{
                color:
                  item["QA_result"] === "REJECT"
                    ? "red"
                    : item["QA_result"] === "ACCEPT"
                    ? "green"
                    : "black",
              }}
            >
              {item["QA_result"]}
            </td>

            <td
              style={{
                color:
                  item["Status_Hold"] === "Hold"
                    ? "#FF8C00" // หรือใช้ "rgb(255, 69, 0)"
                    : item["Status_Hold"] === "Accept"
                    ? "green"
                    : "black",
              }}
            >
              {item["Status_Hold"]}
            </td>
            <td>{item["Unpack_datetime"]}</td>
            <td>{item["Sorting_Status"]}</td>
            <td>{item["Status_Shipped"]}</td>
            <td>{item["Control_Ship"]}</td>
            <td>{item["Hold_Period"]}</td>
            <td>{item["SpecialControl5"]}</td>
            <td>{item["Release_Date"]}</td>
            <td>{item["Reason_to_Release"]}</td>
          </tr>
        ));
      }
    }
  };

  renderReport3 = () => {
    if (this.state.report3 != null) {
      if (this.state.report3.length > 0) {
        return this.state.report3.map((item,index) => (
          <tr key={item.id || index}> 
            <td>{item["Setlot_Date"]}</td>
            <td>{item["Setlot_Datetime"]}</td>
            <td>{item["Qa_insp_date"]}</td>
            <td>{item["Qa_insp_Datetime"]}</td>

            <td>{item["Hold_Date_Mfg"]}</td>
            <td>{item["Hold_Date"]}</td>
            <td>{item["Hold_DateTime"]}</td>

            <td>{item["Model_group"]}</td>
            <td>{item["ModelNumber"]}</td>
            <td>{item["Line_No"]}</td>
            <td>{item["Hold_index"]}</td>
            <td>{item["Lot_QA"]}</td>
            <td>{item["DateCode"]}</td>
            <td align="RIGHT">
              {Number(item["QTY"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>{item["Hold_detail"]}</td>
            <td>{item["Remark"]}</td>
            <td>{item["Disposition"]}</td>
            <td>{item["Hold_by"]}</td>
            <td>{item["Access_by"]}</td>
            <td
              style={{
                color:
                  item["QA_result"] === "REJECT"
                    ? "red"
                    : item["QA_result"] === "ACCEPT"
                    ? "green"
                    : "black",
              }}
            >
              {item["QA_result"]}
            </td>

            <td
              style={{
                color:
                  item["Status_Hold"] === "Hold"
                    ? "#FF8C00" // หรือใช้ "rgb(255, 69, 0)"
                    : item["Status_Hold"] === "Accept"
                    ? "green"
                    : "black",
              }}
            >
              {item["Status_Hold"]}
            </td>
            <td>{item["Unpack_datetime"]}</td>
            <td>{item["Sorting_Status"]}</td>
            <td>{item["Status_Shipped"]}</td>
            <td>{item["Control_Ship"]}</td>
            <td>{item["Hold_Period"]}</td>
            <td>{item["SpecialControl5"]}</td>
            <td>{item["Release_Date"]}</td>
            <td>{item["Reason_to_Release"]}</td>
          </tr>
        ));
      }
    }
  };
  renderAll = () => {
    if (this.state.CHECKBOXALL != null) {
      if (this.state.CHECKBOXALL.length > 0) {
        return this.state.CHECKBOXALL.map((item, index) => (
          <tr key={item.id || index}> 
            <td>{item["Setlot_Date"]}</td>
            <td>{item["Setlot_Datetime"]}</td>
            <td>{item["Qa_insp_date"]}</td>
            <td>{item["Qa_insp_Datetime"]}</td>

            <td>{item["Hold_Date_Mfg"]}</td>
            <td>{item["Hold_Date"]}</td>
            <td>{item["Hold_DateTime"]}</td>

            <td>{item["Model_group"]}</td>
            <td>{item["ModelNumber"]}</td>
            <td>{item["Line_No"]}</td>
            <td>{item["Hold_index"]}</td>
            <td>{item["Lot_QA"]}</td>
            <td>{item["DateCode"]}</td>
            <td align="RIGHT">
              {Number(item["QTY"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>{item["Hold_detail"]}</td>
            <td>{item["Remark"]}</td>
            <td>{item["Disposition"]}</td>
            <td>{item["Hold_by"]}</td>
            <td>{item["Access_by"]}</td>
            <td
              style={{
                color:
                  item["QA_result"] === "REJECT"
                    ? "red"
                    : item["QA_result"] === "ACCEPT"
                    ? "green"
                    : "black",
              }}
            >
              {item["QA_result"]}
            </td>

            <td
              style={{
                color:
                  item["Status_Hold"] === "Hold"
                    ? "#FF8C00" // หรือใช้ "rgb(255, 69, 0)"
                    : item["Status_Hold"] === "Accept"
                    ? "green"
                    : "black",
              }}
            >
              {item["Status_Hold"]}
            </td>
            <td>{item["Unpack_datetime"]}</td>
            <td>{item["Sorting_Status"]}</td>
            <td>{item["Status_Shipped"]}</td>
            <td>{item["Control_Ship"]}</td>
            <td>{item["Hold_Period"]}</td>
            <td>{item["SpecialControl5"]}</td>
            <td>{item["Release_Date"]}</td>
            <td>{item["Reason_to_Release"]}</td>
          </tr>
        ));
      }
    }
  };
  renderforpc = () => {
    if (this.state.HOLDFORPC != null) {
      if (this.state.HOLDFORPC.length > 0) {
        return this.state.HOLDFORPC.map((item, index) => (
          <tr key={item["id"] || index}>  
            <td>{item["Setlot_Date"]}</td>
            <td>{item["Setlot_Datetime"]}</td>
            <td>{item["Qa_insp_date"]}</td>
            <td>{item["Qa_insp_Datetime"]}</td>

            <td>{item["Hold_Date_Mfg"]}</td>
            <td>{item["Hold_Date"]}</td>
            <td>{item["Hold_DateTime"]}</td>

            <td>{item["Model_group"]}</td>
            <td>{item["ModelNumber"]}</td>
            <td>{item["Line_No"]}</td>
            <td>{item["Hold_index"]}</td>
            <td>{item["Lot_QA"]}</td>
            <td>{item["DateCode"]}</td>
            <td align="RIGHT">
              {Number(item["QTY"]).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td>{item["Hold_detail"]}</td>
            <td>{item["Remark"]}</td>
            <td>{item["Disposition"]}</td>
            <td>{item["Hold_by"]}</td>
            <td>{item["Access_by"]}</td>
            <td
              style={{
                color:
                  item["QA_result"] === "REJECT"
                    ? "red"
                    : item["QA_result"] === "ACCEPT"
                    ? "green"
                    : "black",
              }}
            >
              {item["QA_result"]}
            </td>

            <td
              style={{
                color:
                  item["Status_Hold"] === "Hold"
                    ? "#FF8C00" // หรือใช้ "rgb(255, 69, 0)"
                    : item["Status_Hold"] === "Accept"
                    ? "green"
                    : "black",
              }}
            >
              {item["Status_Hold"]}
            </td>
            <td>{item["Unpack_datetime"]}</td>
            <td>{item["Sorting_Status"]}</td>
            <td>{item["Status_Shipped"]}</td>
            <td>{item["Control_Ship"]}</td>
            <td>{item["Hold_Period"]}</td>
            <td>{item["SpecialControl5"]}</td>
            <td>{item["Release_Date"]}</td>
            <td>{item["Reason_to_Release"]}</td>
          </tr>
        ));
      }
    }
  };

  async resetHoldnumber() {
    await this.setState({
      Holdnumber: "", // ตั้งค่า input ให้เป็นค่าว่างตามที่คุณต้องการ
    });
  }
  async resetQanumber() {
    await this.setState({
      QANumber: "", // ตั้งค่า input ให้เป็นค่าว่างตามที่คุณต้องการ
    });
  }
  handleSubmit = () => {
    this.DoGetAll(); // เรียกใช้ฟังก์ชัน DoGetAll เพื่อดึงข้อมูล
  };

  handleCheckboxChange = () => {
    this.setState((prevState) => ({
      checkboxChecked: !prevState.checkboxChecked,
      checkboxHoldNumber: false,
      showData: false, // รีเซ็ตค่า showData เป็น false เมื่อมีการเปลี่ยนแปลง checkbox
    }));
  };

  handleCheckHoldNumber = () => {
    this.setState((prevState) => ({
      checkboxChecked: false,
      checkboxHoldNumber: !prevState.checkboxHoldNumber,
      showData: false, // รีเซ็ตค่า showData เป็น false เมื่อมีการเปลี่ยนแปลง checkbox
    }));
  };

  render() {
    const { isLoadingCheckboxAll, isLoadingHoldAll } = this.state;
    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 70 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Product hold control </h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">
                      Product hold control{" "}
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
                    <label>Search Report By</label>
                  </h3>
                  <div className="row">
                    <div className="col-1"></div>
                    <div className="col-sm-1">
                      <label>
                        <input
                          type="radio"
                          checked={
                            this.state.selectedOption === "checkboxbyModel"
                          }
                          onChange={() =>
                            this.setState({
                              selectedOption: "checkboxbyModel",
                              checkboxChecked: false,
                              checkboxHoldNumber: false,
                              checkboxbyModel: true,
                              CHECKBOXALL: false,
                              Download_Hold_ALL: false,
                              isDisable: false,
                              //by model
                              report: "",
                              // by QA
                              report2: "",
                              // by index
                              report3: "",
                              //All hold Pc
                              HOLDFORPC: "",

                              Hold_ALL_PC: "",
                            })
                          }
                        />
                        Model
                      </label>
                    </div>

                    <div className="col-sm-2">
                      <label>
                        <input
                          type="radio"
                          checked={
                            this.state.selectedOption === "checkboxChecked"
                          }
                          onChange={() =>
                            this.setState({
                              selectedOption: "checkboxChecked",
                              checkboxChecked: true,
                              checkboxHoldNumber: false,
                              Download_Hold_ALL: false,
                              checkboxbyModel: false,
                              isDisable: false,
                              //by model
                              report: "",
                              // by QA
                              report2: "",
                              // by index
                              report3: "",
                              //All Hold
                              CHECKBOXALL: "",
                              //All hold Pc
                              HOLDFORPC: "",

                              Hold_ALL_PC: "",
                            })
                          }
                        />
                        QA Number
                      </label>
                    </div>
                    <div className="col-sm-2">
                      <label>
                        <input
                          type="radio"
                          checked={
                            this.state.selectedOption === "checkboxHoldNumber"
                          }
                          onChange={() =>
                            this.setState({
                              selectedOption: "checkboxHoldNumber",
                              checkboxChecked: false,
                              checkboxHoldNumber: true,
                              Download_Hold_ALL: false,
                              checkboxbyModel: false,
                              isDisable: false,
                              //by model
                              report: "",
                              // by QA
                              report2: "",
                              // by index
                              report3: "",
                              //All Hold
                              CHECKBOXALL: "",
                              //All hold Pc
                              HOLDFORPC: "",

                              Hold_ALL_PC: "",
                            })
                          }
                        />
                        Hold Number
                      </label>
                    </div>
                    <div className="col-sm-2">
                      {isLoadingCheckboxAll ? (
                        <span>Loading...</span>
                      ) : (
                        <label>
                          <input
                            type="radio"
                            checked={
                              this.state.selectedOption === "CHECKBOXALL"
                            }
                            onChange={async () => {
                              await this.DoGetAll();
                              this.setState({
                                selectedOption: "CHECKBOXALL",
                                checkboxChecked: false,
                                checkboxHoldNumber: false,
                                checkboxbyModel: false,
                                Download_Hold_ALL: true,
                                isDisable: false,
                                report: "",
                                report1: "",
                                report2: "",
                                report3: "",
                                HoldNumber: "",
                                QANumber: "",
                                Hold_ALL_PC: "",
                                HOLDFORPC: "",
                              });
                            }}
                          />
                          ALL Hold Report
                        </label>
                      )}
                    </div>

                    <div className="col-md-2">
                      {isLoadingHoldAll ? (
                        <span>Loading...</span>
                      ) : (
                        <label>
                          <input
                            type="radio"
                            checked={
                              this.state.selectedOption === "Hold_ALL_PC"
                            }
                            onChange={async () => {
                              await this.DoGetAllFORPC();
                              this.setState({
                                selectedOption: "Hold_ALL_PC",
                                checkboxChecked: false,
                                checkboxHoldNumber: false,
                                checkboxbyModel: false,
                                Download_Hold_ALL: false,
                                Hold_ALL_PC: true,
                                isDisable: false,
                                report: "",
                                report1: "",
                                report2: "",
                                report3: "",
                                HoldNumber: "",
                                QANumber: "",
                                CHECKBOXALL: "",
                              });
                            }}
                          />
                          Balance ALL
                        </label>
                      )}
                    </div>
                    <div>{/* Rest of your component's content */}</div>
                    {this.state.Download_Hold_ALL && (
                      <div className="col-md-1">
                        <CSVLink
                          data={this.state.Raw_Dat}
                          filename={"ALL Hold Report.csv"}
                        >
                          <button type="button" className="btn btn-primary">
                            Download
                          </button>
                        </CSVLink>
                      </div>
                    )}

                    {this.state.Hold_ALL_PC && (
                      <div className="col-md-1">
                        <CSVLink
                          data={this.state.Raw_Dat}
                          filename={"Balance ALL.csv"}
                        >
                          <button type="button" className="btn btn-primary">
                            Download
                          </button>
                        </CSVLink>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {this.state.checkboxChecked && (
                <div className="card-body">
                  <div className="row">
                    <label>QA Number</label>
                    {/* //Select Critiria "Model" */}
                    <div className="col-md-3">
                      <div className="input-group ">
                        <input
                          value={this.state.QANumber}
                          onChange={async (e) => {
                            await this.setState({
                              QANumber: e.target.value,
                            });
                            await this.resetHoldnumber();
                            this.setState({
                              model: [{ label: "Select Model" }],
                            });
                            this.setState({ Line: [{ label: "Select Line" }] });
                            this.setState({
                              Status: [{ label: "Select Status" }],
                            });
                            this.setState({
                              Access_by: [{ label: "Select Hold_by" }],
                            });
                            this.setState({
                              report: "",
                              report1: "",
                              report2: "",
                              report3: "",
                              HoldNumber: "",
                              CHECKBOXALL: "",
                              isDisable: false,
                              selectedOption: "", // เพิ่มการตั้งค่าเริ่มต้นของ select
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
                          this.setState({ report: "" });
                          this.setState({ isDisable: true });
                          // this.doGetDataReport();
                          Swal.fire({
                            icon: "info",
                            title: "Loading Data",
                            timer: 60000,
                            allowOutsideClick: false,
                            didOpen: async () => {
                              Swal.showLoading();
                              await this.doGetDataReport2();
                              await new Promise((resolve) =>
                                setTimeout(resolve, 100)
                              );
                              Swal.close();
                            },
                          }).then(() => {
                            if (this.state.report2.length > 0) {
                              if (this.state.report2[0].Lot_QA.length > 0) {
                                Swal.fire({
                                  icon: "success",
                                  title: "Success",
                                  text: "Data has been loaded successfully",
                                });
                              } else if (
                                this.state.report2[0].Lot_QA.length === 0
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
                    <div className="col-md-3">
                      <CSVLink
                        data={this.state.Raw_Dat2}
                        filename={"QA_report.csv"}
                      >
                        <button
                          type="button"
                          className="btn btn-primary"
                          // style={{ marginTop: 30 }}
                        >
                          Download
                        </button>
                      </CSVLink>
                    </div>
                  </div>
                </div>
              )}
              {this.state.checkboxHoldNumber && (
                <div className="card-body">
                  <div className="row">
                    <label>Hold number</label>
                    {/* //Select Critiria "Model" */}
                    <div className="col-md-3">
                      <div className="input-group ">
                        <input
                          value={this.state.Holdnumber}
                          onChange={async (e) => {
                            await this.setState({
                              Holdnumber: e.target.value,
                            });
                            await this.setState({
                              model: [{ label: "Select Model" }],
                            });
                            await this.setState({
                              Line: [{ label: "Select Line" }],
                            });
                            await this.setState({
                              Status: [{ label: "Select Status" }],
                            });

                            await this.setState({
                              Access_by: [{ label: "Select Hold_by" }],
                            });
                            await this.resetQanumber();

                            // this.resetHoldnumber();
                            this.setState({
                              report: "",
                              report1: "",
                              report2: "",
                              report3: "",
                              HoldNumber: "",
                              isDisable: false,
                              selectedOption: "", // เพิ่มการตั้งค่าเริ่มต้นของ select
                            });
                            // await this.setState({
                            //   Holdnumber: [{ label: "Select Line" }],
                            // });
                          }}
                          type="text"
                          className="form-control"
                          placeholder="Hold_number"
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
                          this.setState({ report: "" });
                          this.setState({ isDisable: true });

                          // this.doGetDataReport();
                          Swal.fire({
                            icon: "info",
                            title: "Loading Data",
                            timer: 60000,
                            allowOutsideClick: false,
                            didOpen: async () => {
                              Swal.showLoading();
                              await this.doGetDataReport3();
                              Swal.close();
                            },
                          }).then(() => {
                            if (this.state.report3.length > 0) {
                              if (this.state.report3[0].Lot_QA.length > 0) {
                                Swal.fire({
                                  icon: "success",
                                  title: "Success",
                                  text: "Data has been loaded successfully",
                                });
                              } else if (
                                this.state.report3[0].Lot_QA.length === 0
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
                    <div className="col-md-3">
                      <CSVLink
                        data={this.state.Raw_Dat3}
                        filename={"Hold_number.csv"}
                      >
                        <button
                          type="button"
                          className="btn btn-primary"
                          // style={{ marginTop: 30 }}
                        >
                          Download
                        </button>
                      </CSVLink>
                    </div>
                  </div>
                </div>
              )}
              {this.state.checkboxbyModel && (
                <div className="card-body">
                  <div className="row">
                    {/* //Select Critiria "Model" */}
                    <div className="col-sm-2">
                      <div className="form-group">
                        <div></div>
                        <label>Model group</label>
                        <Select
                          options={this.state.listModel}
                          onChange={async (e) => {
                            await this.setState({ model: e.label });
                            await this.getLine_No();

                            await this.setState({
                              Line: [{ label: "Select Line" }],
                            });
                            await this.setState({
                              Status: [{ label: "Select Status" }],
                            });

                            await this.setState({
                              Access_by: [{ label: "Select Hold_by" }],
                            });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select Model"
                        />
                      </div>
                    </div>
                    {/* //Select Critiria "Line_No" */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Line_No</label>
                        <Select
                          options={this.state.listLine_No}
                          value={this.state.Line[0]}
                          onChange={async (e) => {
                            await this.setState({ Line: [] });
                            this.state.Line.push({ label: e.label });
                            await this.getStatus();
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select Line_No"
                        />
                      </div>
                    </div>

                    <div className="col-2">
                      <div className="form-group">
                        <label>Status</label>
                        <Select
                          options={this.state.listStatus}
                          value={this.state.Status[0]}
                          onChange={async (e) => {
                            await this.setState({ Status: [] });
                            this.state.Status.push({ label: e.label });
                            await this.getAccess_by();
                            // if (e.label === "ACCEPT") {
                            //   await this.setState({
                            //     Access_by: "--", // กำหนดให้ Access_by เป็นค่าว่างหรือไม่มีตัวเลือกเลย
                            //   });
                            // } else {
                            //   await this.setState({
                            //     Access_by: [{ label: "Select Hold_by" }],
                            //   });
                            //   await this.getAccess_by();
                            // }
                          }}
                          placeholder="Select Status"
                        />
                      </div>
                    </div>

                    <div className="col-2">
                      <div className="form-group">
                        <label>Access by</label>
                        <Select
                          options={this.state.listAccess_by}
                          value={this.state.Access_by[0]}
                          onChange={async (e) => {
                            await this.setState({ Access_by: [] });
                            this.state.Access_by.push({ label: e.label });
                          }}
                          placeholder="Select Hold_by"
                          // isDisabled={this.state.Status[0]?.label === "ACCEPT"} // กำหนดให้เป็น true เมื่อ Status เป็น "ACCEPT" เพื่อปิดการเลือก
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div>
                        <label>
                          <input
                            type="radio"
                            value="Hold_Date"
                            checked={
                              this.state.selectedDateOption === "Hold_Date"
                            }
                            onChange={this.handleDateOptionChange}
                          />
                          Date (Hold)
                        </label>
                      </div>
                      <div>
                        <label>
                          <input
                            type="radio"
                            value="Setlot_Date"
                            checked={
                              this.state.selectedDateOption === "Setlot_Date"
                            }
                            onChange={this.handleDateOptionChange}
                          />
                          Date (Setlot)
                        </label>
                      </div>
                      {/* //Select Start Date */}
                      <div className="col-2">
                        <div className="form-group">
                          <label>Select Date &nbsp;</label>
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
                      <div className="col-2">
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
                    </div>

                    {/* Submit button */}
                    <div className="col-md-1">
                      <button
                        disabled={this.state.isDisable}
                        // type="button"
                        // className="btn btn-info btn-flat"
                        onClick={(e) => {
                          this.setState({
                            report: "",
                            report1: "",
                            report2: "",
                            report3: "",

                            HoldNumber: "",
                            CHECKBOXALL: "",
                            isDisable: false,
                            selectedOption: "", // เพิ่มการตั้งค่าเริ่มต้นของ select
                          });
                          if (!this.state.selectedDateOption) {
                            Swal.fire({
                              icon: "error",
                              title: "Select Date",
                              text: "Please select a date option before submitting.",
                            });
                            return; // Stop further execution
                          }
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
                              );
                              Swal.close();
                            },
                          }).then(() => {
                            if (this.state.report.length > 0) {
                              if (this.state.report[0].Lot_QA.length > 0) {
                                Swal.fire({
                                  icon: "success",
                                  title: "Success",
                                  text: "Data has been loaded successfully",
                                });
                              } else if (
                                this.state.report[0].Lot_QA.length === 0
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
                        filename={"Hold system.csv"}
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
              )}

              {/* Table*/}
              <div className="content">
                <div className="container-fluid">
                  <div className="card card-primary">
                    <div className="row">
                      <div className="col-12">
                        {/* /.card-header */}
                        <div
                          className="card-body table-responsive p-0"
                          style={{
                            height: 500,
                            position: "relative",
                            zIndex: "0",
                          }}
                        >
                          <table className="table text-nowrap table-hover table-head-fixed">
                            <thead
                              style={{
                                backgroundColor: "black",
                                color: "black",
                              }}
                            >
                              <tr>
                                <th width="50">Setlot Date</th>
                                <th width="50">Setlot Datetime</th>
                                <th width="50">Qa ins'p Date</th>
                                <th width="50">Qa ins'p Datetime</th>
                                <th width="50">Hold Mfg Date </th>
                                <th width="50">Hold Date</th>
                                <th width="50">Hold DateTime</th>
                                <th width="50">Model group</th>
                                <th width="50">Model Number</th>
                                <th width="50">Line No</th>
                                <th width="50">Hold Number</th>
                                <th width="50">Lot QA</th>
                                <th width="50">DateCode</th>
                                <th width="50">QTY</th>
                                <th width="50">Hold detail</th>
                                <th width="50">Remark</th>
                                <th width="50">Disposition</th>
                                <th width="50">Hold by</th>
                                <th width="50">Access by</th>
                                <th width="50">QA result</th>
                                <th width="50">Status Hold</th>
                                <th width="50">Unpack datetime</th>
                                <th width="50">Sorting Status</th>
                                <th width="50">Status Shipped</th>
                                <th width="50">Control_Ship</th>
                                <th width="50">Hold_Period</th>
                                <th width="50">SpecialControl5</th>
                                <th width="50">Release Date</th>
                                <th width="50">Reason to Release</th>
                              </tr>
                            </thead>
                            <tbody>{this.renderReport()}</tbody>
                            <tbody>{this.renderReport2()}</tbody>
                            <tbody>{this.renderReport3()}</tbody>
                            <tbody>{this.renderAll()}</tbody>
                            <tbody>{this.renderforpc()}</tbody>
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

export default Product_hold_control;
