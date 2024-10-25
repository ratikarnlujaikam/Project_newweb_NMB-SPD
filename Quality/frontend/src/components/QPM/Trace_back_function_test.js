import React, { Component } from "react";
import { key, server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import Chart from "react-apexcharts";
import moment from "moment";
import Select from "react-select";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";

class Trace_back_function_test  extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      year: [],
      Month: [],
      Model: [],
      Line: [],
      insType: [],
      report1: [],
      report2: [],
      report3: [],
      xAxis: [],
      yAxis: [],
      seriesY: [],
      seriesY2: [],
      options: {},
      options2: {},
      chart: [],
      barcodemotor: [],
      lotqa: [],
      Raw_Dat1: [],
      Raw_Dat2: [],
      Raw_Dat3: [],


      optionSelected: null,
      isDisable: false,
    };
  }
  doGetQPMbybarcodemotor = async () => {
    const result = await httpClient.get(
      server.QPMBYBARCODEMOTOR_URL + "/" + this.state.barcodemotor
    );
    let rawData = result.data.listRawData;
    console.log(rawData);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat1: rawData[0] });
    console.log(this.state.Raw_Dat1);
  
    this.setState({
      report1: result.data.result,
      isDisable: false,
    });
  };

  renderreport1 = () => {
    if (this.state.report1 != null) {
      if (this.state.report1.length > 0) {
        return this.state.report1.map((item) => (
          <tr Align="Center">
            <td align="Left">{item["Barcode"]}</td>
            <td align="Left">{item["Barcode_base"]}</td>
            <td align="Left">{item["Ramp_tray"]}</td>
            <td align="Left">{item["divertor"]}</td>
            <td align="Left">{item["Lot_QA"]}</td>
            <td align="Left">{item["keavg"]}</td>
            <td align="Left">{item["keripple"]}</td>
            <td align="Left">{item["TIRprobeA"]}</td>
            <td align="Left">{item["NRROprobeA"]}</td>
            <td align="Left">{item["TIRprobeB"]}</td>
            <td align="Left">{item["NRROprobeB"]}</td>
            <td align="Left">{item["RVA"]}</td>
            <td align="Left">{item["NRROaxFFT1"]}</td>
            <td align="Left">{item["NRROradFFT1"]}</td>
            <td align="Left">{item["Runcurrent"]}</td>
            <td align="Left">{item["brgdrag"]}</td>
            <td align="Left">{item["RUV"]}</td>
            <td align="Left">{item["RUW"]}</td>
            <td align="Left">{item["RVW"]}</td>
            <td align="Left">{item["SetDim"]}</td>
            <td align="Left">{item["Pivotheight"]}</td>
            <td align="Left">{item["Parallelism"]}</td>
            <td align="Left">{item["FlyHeight"]}</td>
            <td align="Left">{item["Ramp_Pivot"]}</td>
            <td align="Left">{item["Projection"]}</td>
            <td align="Left">{item["Heliumleak"]}</td>
            <td align="Left">{item["Axial_Play"]}</td>
            <td align="Left">{item["Oiltop"]}</td>
            <td align="Left">{item["Oilbottom"]}</td>
            <td align="Left">{item["ImbalStatic"]}</td>
            <td align="Left">{item["R_max_min"]}</td>
            <td align="Left">{item["Bemfbalance"]}</td>
          </tr>
        ));
      }
    }
  };

  render() 
  {
    console.log(this.state.report1);
    console.log(this.state.barcodemotor);
  return (

      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 70 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Trace back function test by MBA S/N</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">
                    Trace back function test by MBA S/N
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
                    <label>Input Barcode motor</label>
                  </h3>
                </div>
  
                <div className="card-body">
                  <div className="row">
                    {/* //Select Critiria "Model" */}
                    <div className="col-md-4">
                     
                      <div className="input-group ">
                        <input
                          value={this.state.barcodemotor}
                          onChange={async (e) => {
                            await this.setState({
                              barcodemotor: e.target.value,
                            });
                          }}
                          type="text"
                          className="form-control"
                          placeholder="input Barcode motor"
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
                          console.log(this.state.barcodemotor);
                          this.setState({ lotqa: ('') });
                          this.setState({ report2: ('') });
                          if (typeof this.state.barcodemotor === 'string' && this.state.barcodemotor.trim() === "") {
                            Swal.fire({
                              icon: "error",
                              title: "Not Barcode Motor",
                              text: "Please input Barcode Motor"
                            });
                            return;
                          } else if (typeof this.state.barcodemotor !== 'string') {
                            // ถ้าค่าไม่ใช่ string ให้แสดงข้อความเตือน
                            Swal.fire({
                              icon: "error",
                              title: "Invalid Barcode Motor",
                              text: "Barcode Motor should be a string"
                            });
                            return;
                          }
                          
                          

       
                          this.setState({ isDisable: true });
                          // this.doGetDataReport();
                          Swal.fire({
                            icon: "info",
                            title: "Loading Data",
                            timer: 120000,
                            allowOutsideClick: false,
                            didOpen: async () => {
                              Swal.showLoading();
                              await this. doGetQPMbybarcodemotor();
                              Swal.close();
                            },
                          }).then(() => {
                            if (this.state.report1.length > 0) {
                              if (
                                this.state.report1[0].Barcode.length > 0
                              ) {
                                Swal.fire({
                                  icon: "success",
                                  title: "Success",
                                  text: "Data has been loaded successfully",
                                });
                              } else if (
                                this.state.report1[0].Barcode.length == 0
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
                         style={{ marginTop: 1 }}
                      >
                        Submit
                      </button>
                    </div>
                    <div className="col-md-4">
                      <CSVLink
                        data={this.state.Raw_Dat1}
                        filename={"QPM report.csv"}
                      >
                        <button
                          type="button"
                          className="btn btn-primary"
                           style={{ marginTop: 1 }}
                        >
                          Download by barcode motor
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
                          style={{ height: 400 }}
                        >
                          <table className="table table-head-fixed text-nowrap table-hover">
                            <thead>
                              <tr>
                                <th width="150">Barcode</th>
                                <th width="175">Barcodebase</th>
                                <th width="175">Ramptray</th>
                                <th width="175">Divertor</th>
                                <th width="175">LotQA</th>
                                <th width="175">ke avg</th>
                                <th width="175">ke ripple</th>
                                <th width="175">TIRprobeA</th>
                                <th width="175">NRROprobeA</th>
                                <th width="175">TIRprobeB</th>
                                <th width="175">NRROprobeB</th>                                
                                <th width="175">RVA</th>
                                <th width="175">NRROaxFFT1</th>
                                <th width="175">NRROradFFT1</th>
                                <th width="175">Runcurrent</th>
                                <th width="175">Brgdrag</th>
                                <th width="175">RUV</th>
                                <th width="175">RUW</th>
                                <th width="175">RVW</th>
                                <th width="175">SetDim</th>
                                <th width="175">Pivot</th>                                 
                                <th width="175">Parallelism</th>
                                <th width="175">FlyHeight</th> 
                                <th width="175">Ramp-Pivot</th>                               
                                <th width="175">Projection</th>
                                <th width="175">Helium leak rate</th>
                                <th width="175">AxialPlay</th>
                                <th width="175">Oil Top</th>
                                <th width="175">Oil Bottom</th>
                                <th width="175">Imbalance</th>
                                <th width="175">R max-min</th>
                                <th width="175">Bemfbalance</th>
                              </tr>
                            </thead>
                            <tbody>{this.renderreport1()}</tbody>                          
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
    )
  }

}





export default Trace_back_function_test ;
