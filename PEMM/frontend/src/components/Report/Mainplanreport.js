//Update 2024/08/06
import React, { Component } from "react";
import { key, server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
// import Chart from "react-apexcharts";
import moment from "moment";
import Select from "react-select";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";

class Mainplan extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      model: [{label: "Select Process" }],
      insType: [{ label: "Select type" }],
      report: [],
      line: [{label: "All Line" }],
      Raw_Dat: [],

      startDate: moment().format("yyyy-MM-DD"), //moment().add("days", -6).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"), //moment().format("yyyy-MM-DD"),

      listProcess: [],
      listInsType: [],

      optionSelected: null,
      isDisable: false,
      groupBy: 'Equipment_No.', // Default grouping criterion
      sumOfTotalTimeByGroup: {},
      SumOfTotalTimedelaytime : {}
    };

  }


  componentDidMount = async () => {
    await this.getProcess();
    // await this.gettype();
  };
getProcess = async () => {
    const array = await httpClient.get(server.DOWNTIME_GETPROCESS);
    const options = array.data.result.map((d) => ({
     
      label: d.Process,
    }));

    this.setState({ listProcess: options });
};
gettype = async () => {
  const array = await httpClient.get(server.DOWNTIME_URL+"/request_type");
  const options = array.data.result.map((d) => ({
   
    label: d.Request,
  }));

  this.setState({ listInsType: options });
};

getline = async () => {
  const array = await httpClient.get(server.DOWNTIME_GETLINE   + "/" + this.state.process.label  );
  // console.log(array);
  const options = array.data.result.map((d) => ({
    
    label: d.Line,
   
  }));

  this.setState({ listline: options });
};



addOneDayToDate = (date) => {
  return moment(date).add(1, "day").format("YYYY-MM-DD");
};

// report with select model,date,type
// doGetDataReport = async () => {
// const result = await httpClient.get(
//       server.DOWNTIME_URL +
//       "/daily_test/" +
//       this.state.startDate +
//       "/" +
//       this.state.finishDate +
//       "/" +
//       this.state.model.label 
//     );
   

//     let rawData = result.data.listRawData2 //Data json
    
//     for (let i = 1; i < rawData.length-1; i++) {
     
//       rawData[0].push(...rawData[i])
//     }
//      //Hide data json
//      // Export CSV
//     const processedData = rawData[0].map(({ ID, Total_Downtime, Total_Delay, Line, ...rest }) => ({
//       ...rest,
//       Line : ` ${Line}`, 
//       "Sum of Total delay": rest["Sum of Total delay"].replace(/\./g, ":") // Replace dots with colons
//       ,
//       "Sum of Total time": rest["Sum of Total time"].replace(/\./g, ":") // Replace dots with colons
//     }));
//      console.log(processedData);
//     //ประกาศ
//     this.setState({ Raw_Dat:  processedData})


//     this.setState({
//       report: result.data.result,
//       isDisable: false,
//     });
//     this.calculateSumOfTotalTimeByGroup(result.data.result);
//     this.calculateSumOfTotalTimedelaytime(result.data.result);

// };
doGetDataReport = async () => {
  const adjustedFinishDate = this.addOneDayToDate(this.state.finishDate); // Adjust finishDate by adding one day

  // console.log( this.state.line.label );
  const result = await httpClient.get(
    server.DOWNTIME_URL +
    "/all_report/" 
    +
    this.state.startDate +
    "/" +
    adjustedFinishDate +
    "/" +
    this.state.process.label
  
    +"/" +
    this.state.line.label
  );
 

  // console.log(result)
  let rawData = result.data.listRawData
  console.log(rawData);
  
  for (let i = 1; i < rawData.length; i++) {
    rawData[0].push(...rawData[i])
  }
  const processedData = rawData[0].map(({ Priority, "Equipment type": _ ,Process, "Action(Adj)": actionAdj,"Cause details" : Adjcause, ...item }) =>({ 
    ...item,
    Line: ` ${item.Line}`,  "Cause details": Adjcause ? Adjcause.replace(/"/g, '').replace(/\r\n/g, '').trim() : '',
    "Action(Adj)": actionAdj ? actionAdj.replace(/\r\n/g, '').trim() : '', // Remove \r\n and trim spaces if not null,
  }));
  // console.log(processedData);
  this.setState({ Raw_Dat: processedData })
  

  this.setState({
    report: result.data.result,
    isDisable: false,
  });
  
};


// Function to render grouped data
renderReport = () => {
  if (this.state.report != null && this.state.report.length > 0) {
    // Grouping data by Equipment no.
    let groupedData = {};
    this.state.report.forEach((item) => {
      let equipmentNo = item["Equipment no."];
      if (!groupedData[equipmentNo]) {
        groupedData[equipmentNo] = {
          items: [],
          sumOfTotalTime: 0,
        };
      }
      // console.log(item["Total time"]);
      groupedData[equipmentNo].items.push(item);
      groupedData[equipmentNo].sumOfTotalTime += parseFloat(item["Total time"]);
    });

    // Rendering grouped data
    return Object.keys(groupedData).map((equipmentNo) => (
      <React.Fragment key={equipmentNo}>
        {groupedData[equipmentNo].items.map((item, index) => (
          <tr key={index}>
            <td style={{ fontSize: "13px" }}>{item["Date"]}</td>
            <td style={{ fontSize: "13px" }}>{item["Equipment no."]}</td>
            <td style={{ fontSize: "13px" }}>{item["Equipment"]}</td>
            <td style={{ fontSize: "13px" }}>{item["Model"]}</td>
            <td style={{ fontSize: "13px" }}>{item["Line"]}</td>
            <td style={{ fontSize: "13px" }}>{item["Action(Adj)"]}</td>
            <td style={{ fontSize: "13px" }}>{item["Request time"]}</td>
            <td style={{ fontSize: "13px" }}>{item["Start time(Adj)"]}</td>
            <td style={{ fontSize: "13px" }}>{item["Finished time(Adj)"]}</td>
            <td style={{ fontSize: "13px" }}>{item["Total delay"]}</td>
            <td style={{ fontSize: "13px" }}>{item["Total downtime"]}</td>
            <td style={{ fontSize: "13px" }}>{item["Total time"]}</td>
            <td style={{ fontSize: "13px" }}>{item["Author"]}</td>
            {/* <td style={{ fontSize: "15px" }}>{item["Work type"]}</td> */}
            <td style={{ fontSize: "13px" }}>{item["Request"]}</td>
            {/* <td>{item["Priority"]}</td> */}
            <td style={{ fontSize: "13px" }}>{item["Cause details"]}</td>
            <td style={{ fontSize: "13px" }}>{item["Worker"]}</td>

          </tr>
        ))}
     
        <tr>
          <td colSpan="17"  style={{ fontSize: "14px", fontWeight: "bold", backgroundColor: '#f0f0f0'}}>{equipmentNo} </td>
          {/* <td colSpan="17"  style={{ fontSize: "13px", fontWeight: "bold", backgroundColor: '#f0f0f0' }}>Total time : {groupedData[equipmentNo].sumOfTotalTime}</td> */}
        </tr>
      </React.Fragment>
    ));
  } else {
    return (
      <tr>
        <td colSpan="17" style={{ textAlign: "center" }}>
       
        </td>
      </tr>
    );
  }
};




  render() {
    return (
      
      //Hander 
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 70 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Downtime all request </h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">Downtime all request</li>
                  </ol>
                </div>
              </div>
            </div>
          </section>
        </div>
        {/* select Parameter */}
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
                    {/* //Select Critiria "Process PE" */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Process</label>
                        
                        <Select
                              options={this.state.listProcess}
                              // value={this.state.model}
                                onChange={async (e) => {
                                  await this.setState({ process: e });
                                  await this.getline();
                                }}
                                type="text"
                                // className="form-control"
                                placeholder="Select Process"
                              />
                            </div>
                    </div>  
                    {/* //Select Line "Process PE" */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Line</label>
                        
                        <Select
                              options={this.state.listline}
                              value={this.state.line}
                                onChange={async (e) => {
                                  await this.setState({  line : e });
                                }}
                                // type="text"
                                // className="form-control"
                                placeholder="All line"
                              />
                            </div>
                    </div>
                    {/* <div className="col-md-2">
                      <div className="form-group">
                        <label>Request type</label>
                        
                        <Select
                              
                              options={this.state.listInsType}
                              // value={this.state.listInsType}
                                onChange={async (e) => {
                                  await this.setState({ type: e });
                                }}
                              //   type="text"
                              //   className="form-control"
                                placeholder="Select type"
                              />
                            </div>
                    </div> */}

                    {/* //Select Start Date */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>
                          By Daily Select From &nbsp;
                          <a
                            className="fas fa-question-circle"
                            style={{ fontSize: 18, color: "Dodgerblue" }}
                            onClick={() => {
                              Swal.fire({
                                icon: "info",
                                title: "Day-to-Day Data",
                                text:
                                  "Day-to-Day data over the course of the selected date",
                              });
                            }}
                          ></a>
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
                              setTimeout(() => {Swal.close()},1000)
                              // Swal.close();
                              console.log(this.state.report);
                            },
                           
                            
                          }).then(() => {
                            if (this.state.report.length > 0) {
                              // console.log(this.state.report[0]);
                              if (this.state.report[0].ID != 0) {
                                Swal.fire({
                                  icon: "success",
                                  title: "Success",
                                  text: "Data has been loaded successfully",
                                });
                              }
                            } else {
                              Swal.fire({
                                icon: "error",
                                title: "No downtime data",
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
                      <CSVLink data={this.state.Raw_Dat}
                     
                        filename={'Downtime_report.csv'}
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
                        {/* /.card-header */}
                        <div
                          className="card-body table-responsive p-0"
                          style={{ height: 240 ,
                            height: 500 ,
                            zIndex: "3",
                            position: "relative",
                            zIndex: "0"
                            }}
                        >
                        <table className="table table w-auto"  >
                        {/* <table className="table text-nowrap table-hover table-head-fixed"> */}
                              <thead className="bg-light sticky-top">
                                <tr>
                                <th width="20" style={{ fontSize: "15px" }}>Date</th>
                                  <th width="20" style={{ fontSize: "15px" }}>Equipment no.</th>
                                  <th width="20" style={{ fontSize: "15px" }}>Equipment</th>
                                  <th width="20" style={{ fontSize: "15px" }}>Model</th>
                                  <th width="20" style={{ fontSize: "15px" }}>Line</th>
                                  <th width="20" style={{ fontSize: "15px" }}>Action(Adj)</th>
                                  <th width="20" style={{ fontSize: "15px" }}>Request time</th>
                                  <th width="20" style={{ fontSize: "15px" }}>Start time(Adj)</th>
                                  <th width="20" style={{ fontSize: "15px" }}>Finished time(Adj)</th>
                                  <th width="20" style={{ fontSize: "15px" }}>Total delay</th>
                                  <th width="20" style={{ fontSize: "15px" }}>Total downtime</th>
                                  <th width="20" style={{ fontSize: "15px" }}>Total time</th>
                                  <th width="20" style={{ fontSize: "15px" }}>Author</th>
                                  {/* <th width="20" style={{ fontSize: "15px" }}>Work type</th> */}
                                  <th width="20" style={{ fontSize: "15px" }}>Request</th>
                                  <th width="20" style={{ fontSize: "15px" }}>Cause details</th>
                                  <th width="20" style={{ fontSize: "15px" }}>Worker</th>
                                 
                                </tr>
                              </thead>
                              <tbody>
                                {this.renderReport()}
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
      </div >
    );
  }
}

export default Mainplan;
