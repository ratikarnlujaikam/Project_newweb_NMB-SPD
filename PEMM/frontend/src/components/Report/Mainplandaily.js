//Update 2024/08/05
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
      line: [{label: "All Line" }],
      insType: [{ label: "**ALL**" }],
      report: [],
    
      Raw_Dat: [],

      startDate: moment().format("yyyy-MM-DD"), //moment().add("days", -6).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"), //moment().format("yyyy-MM-DD"),

      listProcess: [],
      listInsType: [],
      listline: [],

      optionSelected: null,
      isDisable: false,
      groupBy: 'Equipment_No.', // Default grouping criterion
      sumOfTotalTimeByGroup: {},
      SumOfTotalTimedelaytime : {}
    };

  }


  componentDidMount = async () => {
    await this.getProcess();
    // await this.getline();
  };

// report with select model,date,type
  doGetDataReport = async () => {
    if (this.state.line.label === "undefined") {
      this.setState({
        line: {
          ...this.state.line,
          label: ""
        }
      });
    }
    const result = await httpClient.get(
        server.DOWNTIME_URL +
        "/daily/" +
        this.state.startDate +
        "/" +
        this.state.finishDate +
        "/" +
        this.state.Process.label+
        "/" +
        this.state.line.label 
      );
    

  
    let rawData = result.data.listRawData2 //Data json
    
    for (let i = 1; i < rawData.length-1; i++) {
     
      rawData[0].push(...rawData[i])
    }
     //Hide data json
     // Export CSV
    const processedData = rawData[0].map(({ ID, Total_Downtime, Total_Delay, Line, ...rest }) => ({
      ...rest,
      Line : ` ${Line}`, 
      "Sum of Total delay": rest["Sum of Total delay"].replace(/\./g, ":") // Replace dots with colons
      ,
      "Sum of Total time": rest["Sum of Total time"].replace(/\./g, ":") // Replace dots with colons
    }));
     console.log(processedData);
    //ประกาศ
    this.setState({ Raw_Dat:  processedData})


    this.setState({
      report: result.data.result,
      isDisable: false,
    });
    this.calculateSumOfTotalTimeByGroup(result.data.result);
    this.calculateSumOfTotalTimedelaytime(result.data.result);

  };


// Function to calculate the sum of "Sum of Total time" for each group
calculateSumOfTotalTimeByGroup = (data) => {
    const { groupBy } = this.state;
    let sumByGroup = {};
    data.forEach(item => {
      const group = item[groupBy];
      // console.log(item["Sum of Total time"])
      const total_time = parseFloat(item["Sum of Total time"])  || 0 ;
   
      sumByGroup[group] = (sumByGroup[group] || 0) + total_time ;
    });
    this.setState({ sumOfTotalTimeByGroup: sumByGroup });
};

// Function to calculate the sum of "Sum of Total Delay time" for each group
calculateSumOfTotalTimedelaytime = (data) => {
      const { groupBy } = this.state;
      let sumByGroup = {};
      data.forEach(item => {
        const group = item[groupBy];
        // console.log(item["Sum of Total time"] , item["Equipment"])

        const total_time = parseFloat(item["Sum of Total delay"])  || 0 ;
     
        sumByGroup[group] = (sumByGroup[group] || 0) + total_time ;
      });
      this.setState({ SumOfTotalTimedelaytime: sumByGroup });
};
getProcess = async () => {
    const array = await httpClient.get(server.DOWNTIME_GETPROCESS);
    const options = array.data.result.map((d) => ({
     
      label: d.Process,
    }));

    this.setState({ listProcess: options });
};

getline = async () => {
  const array = await httpClient.get(server.DOWNTIME_GETLINE   + "/" + this.state.Process.label  );
  console.log(array);
  const options = array.data.result.map((d) => ({
    
    label: d.Line,
   
  }));

  this.setState({ listline: options });
};

 // Function to group data by a specific key
 groupData = (data, key) => {
  return data.reduce((acc, item) => {
    const groupValue = item[key];
    if (!acc[groupValue]) {
      acc[groupValue] = [];
    }
    acc[groupValue].push(item);
    return acc;
  }, {});
};


// Function to render grouped data
renderReport = () => {
  const { report, groupBy, sumOfTotalTimeByGroup ,SumOfTotalTimedelaytime } = this.state;
  const groupedData = this.groupData(report, groupBy);

  return Object.keys(groupedData).map((group, groupIndex) => (
    <React.Fragment key={groupIndex}>
      
      {groupedData[group].map((item, rowIndex) => (
        <tr key={rowIndex}>
          <td>{item["Date"]}</td>
          <td>{item["Equipment_No."]}</td>
          <td>{item["Equipment"]}</td>
          <td>{item["Model"]}</td>
          <td>{item["Line"]}</td>
          <td>{item["Cause details"]}</td>
          <td>{item["Action(Adj)"]}</td>
          <td>{item["Request time"]}</td>
          <td>{item["Start time(Adj)"]}</td>
          <td>{item["Finished time(Adj)"]}</td>
          <td>{item["Sum of Total delay"].replace(".",":")}</td>
          <td>{item["Sum of Total time"].replace(".",":")}</td>
          <td>{item["Worker"]}</td>
        </tr>
      ))}
      <tr>
        <td colSpan="15" style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
        Equipment No : {group}  
       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        Total Delay time :  
       {this.formatTotalTime(SumOfTotalTimedelaytime[group]) } 
       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        Total Downtime :  
       {this.formatTotalTime(sumOfTotalTimeByGroup [group]) } 
      
       
        </td>
      </tr>
    
    </React.Fragment>
  ));
};

handleGroupByChange = (event) => {
  this.setState({ groupBy : event.target.value });
};


// Function to format total time in 'hh.mm' format
formatTotalTime = (sumOfMinutes) => {
  // Calculate hours and minutes
  const totalHours = Math.floor(sumOfMinutes);

  const remainingMinutes =  ((sumOfMinutes)-totalHours)*100;
  const Totaltime = totalHours + parseInt(remainingMinutes/60) + (remainingMinutes%60 *0.01)


  // Convert remaining minutes to 2 decimal places
  
  return `${Totaltime.toFixed(2).replace(".",":")}`;
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
                  <h1>Downtime daily</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">Downtime daily</li>
                  </ol>
                </div>
              </div>
            </div>
          </section>
        </div>
        {/* select Parameter */}
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
                    {/* //Select Critiria "Process PE" */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Process</label>
                        
                        <Select
                              options={this.state.listProcess}
                              value={this.state.Process}
                                onChange={async (e) => {
                                  await this.setState({ Process: e });
                                  await this.getline();
                                }}
                                // type="text"
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

                    {/* //Select Start Date */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>
                          By Daily Select From &nbsp;
                          <a
                            class="fas fa-question-circle"
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
                              setTimeout(() => {Swal.close();}, 1000);
                        
                            },
                          }).then(() => {
                            if (this.state.report.length > 0) {
                              console.log(this.state.report[0]);
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
              
              <div class="content">
                <div class="container-fluid">
                  <div className="card card-primary">
                    <div className="row">
                      <div className="col-12">
                        {/* /.card-header */}
                        <div
                          className="card-body table-responsive p-0"
                          style={{ height: 400 ,
                            height: 500 ,
                            zIndex: "3",
                            position: "relative",
                            zIndex: "0"}}
                        >
                          <table className="table  text-nowrap table-hover table-head-fixed">
                            <thead>
                              <tr>
                                <th width="175">Date</th>
                                <th width="175">Equipment_No.</th>
                                <th width="175">Equipment</th>
                                <th width="175">Model</th>
                                <th width="175">Line</th>
                                <th width="175">Cause details</th>
                                <th width="175">Action(Adj)</th>
                                <th width="175">Request time</th>
                                <th width="175">Start time(Adj)</th>
                                <th width="175">Finished time(Adj)</th>
                                <th width="175">Sum of delay</th>
                                <th width="175">Sum of Total time</th>
                                {/* <th width="175">Total_Downtime</th> */}
                                {/* <th width="175">Total_Delay</th> */}
                                <th width="175">Worker</th>
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
      </div >
    );
  }
}

export default Mainplan;
