import React, { Component } from "react";
import { key, server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import moment from "moment";
import Select from "react-select";
import Swal from "sweetalert2";
import { CSVLink } from "react-apexcharts";
import ReactApexChart from "react-apexcharts";
import { Bar } from "react-chartjs-2"; // หรือใช้กราฟประเภทอื่นๆ
import "./LAR.css"; // Use './' if in the same folder

class LAR_by_team extends Component {
  constructor(pops) {
    super(pops);

    this.state = {
      startDate: moment().add("days", -6).format("yyyy-MM-DD"),
      finishDate: moment().format("YYYY-MM-DD"),
      product_type: [],
      listproduct_type: [],
      report: [],
      xAxis: [],
      PivotTable: [], // Ensure this is initialized as an empty array
      isLoading: true,
      xAxis: [],
      PivotTable: [], // Reset to initial state
      isDisable: true, // Optionally show loading state
      chartData: { labels: [], datasets: [] }, // Reset to initial state
      options: {}, // Reset options if needed
      isDisable: false,
    };
  }
  componentDidMount = async () => {
    await this.button_product_type();
  };
  doGetDataReport = async () => {
    try {
      const result = await httpClient.get(
        `${server.LAR_BY_TEAM_URL}/${this.state.product_type.label}/${this.state.startDate}/${this.state.finishDate}`
      );

      console.log("API response:", result.data); // Detailed log for debugging

      // Return the data received from the API
      return result.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      this.setState({ isDisable: false });

      // Display an error message if fetching data fails
      Swal.fire({
        icon: "error",
        title: "Error fetching data",
        text: error.message || "An unexpected error occurred.",
        confirmButtonText: "OK",
      });

      // Return an object indicating failure
      return {
        api_result: "nok",
        error: { message: error.message || "An unexpected error occurred." },
      };
    }
  };

  button_product_type = async () => {
    try {
      const response = await httpClient.get(server.DEFECPRODUCT_TYPE_URL);

      if (response.data && response.data.result) {
        const options = response.data.result.map((d) => ({
          label: d.Product_type,
          value: d.Product_type,
        }));
        this.setState({ listproduct_type: options });
      } else {
        console.error("Unexpected data structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching product types:", error.message || error);
      // Update the state to reflect the error
      this.setState({ listproduct_type: [], isDisable: true });
    }
  };
  getChartData = () => {
    const { xAxis, PivotTable } = this.state;

    const backgroundColors = [
        "rgba(75, 192, 192, 0.5)",   // Teal
        "rgba(255, 99, 132, 0.5)",   // Light Red
        "rgba(54, 162, 235, 0.5)",   // Light Blue
        "rgba(255, 206, 86, 0.5)",   // Light Yellow
        "rgba(75, 192, 192, 0.6)",   // Teal variant
        "rgba(153, 102, 255, 0.5)",  // Purple
        "rgba(255, 159, 64, 0.5)",   // Light Orange
        "rgba(255, 204, 0, 0.5)",    // Yellow
        "rgba(0, 204, 204, 0.5)",    // Cyan
        "rgba(204, 0, 204, 0.5)",    // Magenta
        "rgba(0, 204, 0, 0.5)",      // Green
        "rgba(0, 0, 204, 0.5)",      // Blue
        "rgba(204, 204, 0, 0.5)",    // Olive
        "rgba(204, 0, 0, 0.5)",      // Dark Red
        "rgba(0, 0, 0, 0.5)",        // Black
        "rgba(128, 128, 128, 0.5)",  // Gray
        "rgba(255, 105, 180, 0.5)",  // Pink
        "rgba(255, 69, 0, 0.5)",     // Orange Red
        "rgba(34, 139, 34, 0.5)",    // Forest Green
        "rgba(255, 215, 0, 0.5)",    // Gold
        "rgba(0, 191, 255, 0.5)",    // Deep Sky Blue
        "rgba(106, 90, 205, 0.5)",   // Slate Blue
        "rgba(255, 20, 147, 0.5)",   // Deep Pink
        "rgba(255, 140, 0, 0.5)",    // Dark Orange
        "rgba(154, 205, 50, 0.5)",   // Yellow Green
        "rgba(72, 61, 139, 0.5)",    // Dark Slate Blue
        "rgba(210, 105, 30, 0.5)",   // Chocolate
        "rgba(127, 255, 212, 0.5)",  // Aquamarine
        "rgba(240, 128, 128, 0.5)",  // Light Coral
        "rgba(70, 130, 180, 0.5)"    // Steel Blue
      ];
      

      const chartData = {
        labels: xAxis,
        datasets: PivotTable.map((series, index) => ({
          label: series.name,
          data: series.data,
          backgroundColor: backgroundColors[index % backgroundColors.length],
          borderColor: "rgba(0, 0, 0, 1)", // Set black border color for all bars
          borderWidth: 1,
        })),
      };
      
      const options = {
        responsive: true,
        plugins: {
          legend: {
            labels: {
                color: 'black', // เปลี่ยนสีของตัวอักษรใน legend เป็นสีดำ
            },
        },
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.raw}%`, // Show percentage in tooltip
            },
          },
        },
        scales: {
          x: {
              stacked: true,
              ticks: {
                  color: 'black', // เปลี่ยนสีของตัวอักษรแกน x เป็นสีดำ
              },
          },
          y: {
              beginAtZero: true,
              stacked: true,
              ticks: {
                  callback: (value) => `${value}%`, // Format y-axis labels as percentages
                  color: 'black', // เปลี่ยนสีของตัวอักษรแกน y เป็นสีดำ
              },
          },
          },
      };
      
      return { chartData, options };
      
  };
  render() {
    const { isDisable } = this.state;
    const { chartData, options } = this.getChartData(); // Get chart data and options

    if (isDisable) {
      return <div>Loading...</div>;
    }

    console.log("Chart Data:", chartData);

    console.log(chartData);
    console.log("xAxis:", this.state.xAxis);
    console.log("PivotTable:", this.state.PivotTable);

    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 70 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>LAR Monitoring by team</h1>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="container-fiuid">
          <div className="row">
            <div className="col-12">
              <div className="card card-primary card-outline">
                <div className="card-header">
                  <h3 className="card-title">
                    <label>Select parameter</label>
                  </h3>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Product_type</label>
                        <Select
                          options={this.state.listproduct_type}
                          value={this.state.product_type}
                          onChange={async (e) => {
                            await this.setState({ product_type: e });
                          }}
                        />
                      </div>
                    </div>

                    {/* //Select Start Date */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>By Daily Select From &nbsp;</label>
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
                    <div className="col-md-1">
                      <button
                        disabled={this.state.isDisable}
                        // type="button"
                        // className="btn btn-info btn-flat"
                        onClick={async (e) => {
                          // Validate if product_type is selected
                          if (
                            !this.state.product_type ||
                            this.state.product_type.leang === 0
                          ) {
                            Swal.fire({
                              icon: "error",
                              title: "Select Required",
                              text: "Please Select product_type",
                            });
                            return;
                          }

                          this.setState({ report: "", isDisable: true });

                          // Show loading notification
                          Swal.fire({
                            icon: "info",
                            title: "Loading Data",
                            timer: 60000,
                            allowOutsideClick: false,
                            didOpen: async () => {
                              Swal.showLoading();

                              // Fetch the report data
                              const result = await this.doGetDataReport();

                              // Ensure result is defined before accessing properties
                              if (result && result.api_result === "ok") {
                                this.setState({
                                  report: result.resultGraph || [],
                                  xAxis: result.xAxis || [],
                                  PivotTable: result.PivotTable || [],
                                  isDisable: false,
                                });
                                Swal.fire({
                                  icon: "success",
                                  title: "Data fetched successfully!",
                                  text: "The report data has been loaded.",
                                  confirmButtonText: "OK",
                                });
                              } else {
                                // Handle the error case
                                Swal.fire({
                                  icon: "error",
                                  title: "Error",
                                  text:
                                    result?.error?.message ||
                                    "Failed to fetch data.",
                                  confirmButtonText: "OK",
                                }).then(() => {
                                  // This code runs after the user clicks "OK"
                                  this.setState({ isDisable: false }); // Re-enable the button in case of error
                                  window.location.reload(); // Reload the entire page
                                });
                              }
                            },
                          });
                        }}
                        type="submit"
                        className="btn btn-primary"
                        style={{ marginTop: 30 }}
                      >
                        Submit
                      </button>
                    </div>
                  </div>

                  <div className="chart-container">
                    {chartData.datasets.length === 0 ? (
                      <div>No data available for the selected parameters.</div>
                    ) : (
                      <Bar
                        data={chartData}
                        options={options}
                        style={{ height: "100%" }} // ทำให้กราฟใช้ความสูงทั้งหมดของกรอบ
                      />
                    )}
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
export default LAR_by_team;
