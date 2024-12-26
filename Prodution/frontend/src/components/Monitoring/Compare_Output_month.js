import React, { Component } from "react";
import { key, server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import moment from "moment";
import Select from "react-select";
import Swal from "sweetalert2";
import ReactApexChart from "react-apexcharts";
import "react-datepicker/dist/react-datepicker.css";
import swal from "sweetalert";

//npm install @mui/material @emotion/react @emotion/styled

class Compare_Output_month extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      Lines: [],
      selectedOption: "line",
      selectedDesign: [],
      Month: [],
      process: [],
      report: [],
      xAxis: [],
      yAxis1: [],
      seriesY: [],
      series2: [],
      series_: [],
      seriesCleanroom: [],
      options: {},
      options_pp: {},
      options2: {},
      chart: [],
      rawData: [],
      lineName: "",

      Raw_Dat: [],
      yAxisIndex: [],

      startDate: moment().format("yyyy"), //moment().add("days", -6).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"), //moment().format("yyyy-MM-DD"),
      listLines: [],
      listMonth: [],
      listModel: [],

      listYear: [],
      listMonth: [],
      listprocess: [],
      selectedMaxYear: "",
      selectedMaxMonth: "",

      optionSelected: null,
      isDisable: false,
      countdownEnabled: false, // เพิ่ม state สำหรับการเปิด/ปิด countdown
      intervalId: null, // เพิ่ม state สำหรับเก็บ ID ของ interval
      countdownTime: 150, // 5 นาทีในวินาที
    };
  }
  componentDidMount = async () => {
    await this.getline();
    this.setState({ countdownEnabled: false });

  };
  handleSweetAlertConfirm = () => {
    // Additional actions to perform after the user clicks "OK" in SweetAlert
    // For example, you can reload the page:
    window.location.reload();
  };

  doGetDataReport = async () => {
    try {
      const result = await httpClient.get(
        server.Compare_Output_month_URL +
          "/" +
          this.state.Lines +
          "/" +
          this.state.startDate
      );
      //console.log("Line:", this.state.Lines);
      //console.log("StartDate:", this.state.startDate);
      //console.log(result);
      if (
        !result.data ||
        !result.data.resultGraph ||
        result.data.resultGraph.length === 0
      ) {
        //console.log("No data available");

        // Show SweetAlert
        swal({
          title: "No Running",
          text: "There is no data available for the selected criteria.",
          icon: "info",
          button: "OK",
        }).then(this.handleSweetAlertConfirm); // Attach the callback to "OK" button

        this.setState({ noData: true }); // Set a flag for no data
        return;
      }

      let xAxis = [];

      for (let index = 0; index < result.data.resultGraph.length; index++) {
        const item = result.data.resultGraph[index];
        await xAxis.push(item.Month);
      }

      let PivotTable = result.data.PivotTable;
      ////console.log(PivotTable);

      this.setState({
        report: result.data.result,
        xAxis,
        isDisable: false,
      });

      let seriesData = [];

      for (let i = 0; i < PivotTable.length; i++) {
        const series = {
          name: PivotTable[i].name,
          type:
            PivotTable[i].name === "Actual_Input" ||
            PivotTable[i].name === "Total_NG"
              ? "scale"
              : PivotTable[i].name === "NG_Percentage"
              ? "line"
              : "column",
          data: PivotTable[i].data,
        };
        seriesData.push(series);
      }

      // Now seriesData contains objects with modified types
      ////console.log(seriesData);
      let columnSeries = seriesData.filter(
        (series) => series.type === "column"
      );
      let lineSeries = seriesData.filter((series) => series.type === "line");

      let mergedSeries = columnSeries.concat(lineSeries);
      //console.log(mergedSeries);

      // Now columnSeries contains objects with type 'column' and lineSeries contains objects with type 'line'
      ////console.log(columnSeries);
      ////console.log(lineSeries);

      const sortedData = seriesData.sort((a, b) => {
        // Items with name "Actual_Input" or "Total_NG" should be moved to the end
        if (
          (a.name === "Actual_Input" || a.name === "Total_NG") &&
          !(b.name === "Actual_Input" || b.name === "Total_NG")
        ) {
          return 1;
        } else if (
          !(a.name === "Actual_Input" || a.name === "Total_NG") &&
          (b.name === "Actual_Input" || b.name === "Total_NG")
        ) {
          return -1;
        } else {
          return 0;
        }
      });

      ////console.log(sortedData);

      let numColumns = 0;
      let numLines = 0;

      // Loop through the sortedData array
      for (const item of sortedData) {
        // Check if the type is 'column'
        if (item.type === "column") {
          numColumns++;
        }
        // Check if the type is 'line'
        if (item.type === "line") {
          numLines++;
        }
      }

      // Sum the counts of columns and lines
      let totalColumnsAndLines = numColumns + numLines;

      //console.log("Total columns and lines:", totalColumnsAndLines);

      const mappedSeriesNames = sortedData.map((item) => item.name);

      //console.log(mappedSeriesNames);

      // Assuming your array is named dataSeries
      const maxValues = sortedData.map((series) => Math.max(...series.data));

      // The maximum value among all data arrays
      const globalMaxValue = Math.max(...maxValues);

      ////console.log(globalMaxValue);

      const X_left = Math.max(...maxValues) / 2;
      ////console.log(X_left);

      // Assuming mappedSeriesNames[0] is the series name you want to use
      const seriesName = mappedSeriesNames[0];
      const line_percen = mappedSeriesNames[mappedSeriesNames.length - 1];
      //console.log(line_percen); // ผลลัพธ์คือ "NG_Percentage"

      //console.log(seriesName);

      let yaxisConfig = [];

      // Loop for each column
      for (let i = 0; i < totalColumnsAndLines; i++) {
        let config = {
          seriesName: seriesName,
          min: 0,

          axisTicks: {},
          axisBorder: {
            show: i === 0,
            color: i === 0 ? "#d62728" : "#3399ff",
          },
          labels: {
            show: i === 0,
            style: {
              colors: i === 0 ? "#d62728" : "#3399ff",
            },
            formatter: function (val) {
              return Number(val).toFixed(2) + "%";
            },
            yAxisIndex: 0, // Set the yAxisIndex to 0 for the left side
          },
          title: {
            show: i === 0,
            text: "Percentage",
            style: {
              color: i === 0 ? "#d62728" : "#3399ff",
            },
          },
          tooltip: {
            show: true,
            enabled: true,
          },
          show: i === 0,
          yAxisIndex: 0, // Set the yAxisIndex to 0 for the left side
          type: i === 0 ? "line" : "bar", // Set type to line for the first series, bar for others
          dataLabels: {
            enabled: true,
            offsetX: 0,
            offsetY: 0,
            style: {
              fontSize: "13px",
              color: "#000000", // Set the color to black for yAxisIndex 0
            },
            formatter: function (val) {
              return Number(val).toFixed(2) + "%";
            },
            yAxisIndex: 0, // Set the yAxisIndex to 0 for the left side
          },
          line: {
            show: i === 0, // Set show property of line to false for bars
          },
        };

        yaxisConfig.push(config);
      }

      yaxisConfig.push(
        {
          seriesName: "Income",
          min: 0,
          max: globalMaxValue,
          opposite: false,
          axisTicks: {
            show: false,
          },
          axisBorder: {
            show: false,
            color: "#1f77b4",
          },
          labels: {
            show: false,
            style: {
              colors: "#1f77b4",
            },
          },
          yAxisIndex: 1,
          grouping: true,
          type: "line",
          // Apply dataLabels configuration for yAxisIndex 1
          dataLabels: {
            enabled: false, // Set to false to hide dataLabels
          },
        },
        {
          seriesName: "Output",
          min: 0,
          max: globalMaxValue,
          axisTicks: {
            show: false,
          },
          labels: {
            show: false,
            style: {
              colors: "#000000",
            },
          },
          yAxisIndex: 1,
          grouping: true,
          type: "bar",
          // Apply dataLabels configuration for yAxisIndex 1
          dataLabels: {
            enabled: false, // Set to false to hide dataLabels
          },
        }
      );

      // Options object
      let options = {
        chart: {
          height: 350,
          type: "line",
          stacked: true,
          marginLeft: 0,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "60%",
            endingShape: "rounded",
            borderWidth: 1,
            borderColor: "#000000",
            dataLabels: {
              position: "center", // Change this line to "center" or "insideEnd"
              offsetY: 1,
            },
          },
        },
        tooltip: {
          fixed: {
            enabled: false,
          },
          followCursor: false,
        },
        dataLabels: {
          enabled: true,
          offsetX: 0,
          offsetY: 0,
          style: {
            fontSize: "13px",
            color: "#000000", // Set the color to black
          },
          formatter: function (val) {
            return Number(val).toFixed(2) + "%";
          },
          yAxisIndex: 0, // Set the yAxisIndex to 0 for the left side
        },
        title: {
          text: `%NG monthly's Summary Line ${this.state.Lines} year  ${this.state.startDate}`,
          align: "center",
          offsetX: 0,
        },
        xaxis: {
          categories: xAxis,
        },
        yaxis: yaxisConfig,
        colors: [
          "#993366",
          "#ff7f0e",
          "#2ca02c",

          "#9467bd",
          "#c49c94",
          "#e377c2",
          "#7f7f7f",
          "#bcbd22",
          "#17becf",
          "#aec7e8",
          "#ffbb78",
          "#1f77b4",
          "#c5b0d5",
          "#f7b6d2",
          "#c7c7c7",

          "#9edae5",
          "#d62728",
          "#ff6600",
          "#663300",
          "#ff66cc",
          "#666666",
          "#cccc00",
          "#00ccff",
          "#ff3300",
          "#66ff66",
          "#990000",
          "#996699",
          "#996633",
          "#ff99cc",
          "#999999",
          "#ffff00",
          "#0099ff",
          "#dbdb8d",
        ],
        fill: {
          opacity: 1,
        },
        tooltip: {
          fixed: {
            enabled: false,
          },
          followCursor: true,
          offsetY: 20,
          offsetX: 30,
        },
        legend: {
          position: "bottom",
          horizontalAlign: "center",
          offsetY: 10,
          markers: {
            width: 12,
            height: 12,
            radius: 4,
          },
          itemMargin: {
            horizontal: 10,
            vertical: 5,
          },
        },
        stroke: {
          width: 1,
          curve: "smooth",
        },
        markers: {
          size: 5,
          strokeColors: "#7f7f7f",
          strokeWidth: 2,
          hover: {
            size: 7,
          },
        },
        yaxis: yaxisConfig,
        className: "apexcharts-bar-area",
      };

      ////console.log(options);

      await this.setState({
        options: options,

        seriesY: sortedData,
      });

    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle the error, display an error message, or log it as needed
    }
  };
  doGetDataReport_Design = async () => {
    try {
      const result = await httpClient.get(
        server.Compare_Output_month_Design_URL +
          "/" +
          this.state.selectedDesign +
          "/" +
          this.state.startDate
      );
      //console.log("Line:", this.state.Lines);
      //console.log("StartDate:", this.state.startDate);
      //console.log(result);
      if (
        !result.data ||
        !result.data.resultGraph ||
        result.data.resultGraph.length === 0
      ) {
        //console.log("No data available");

        // Show SweetAlert
        swal({
          title: "No Running",
          text: "There is no data available for the selected criteria.",
          icon: "info",
          button: "OK",
        }).then(this.handleSweetAlertConfirm); // Attach the callback to "OK" button

        this.setState({ noData: true }); // Set a flag for no data
        return;
      }

      let xAxis = [];

      for (let index = 0; index < result.data.resultGraph.length; index++) {
        const item = result.data.resultGraph[index];
        await xAxis.push(item.Month);
      }

      let PivotTable = result.data.PivotTable;
      ////console.log(PivotTable);

      this.setState({
        report: result.data.result,
        xAxis,
        isDisable: false,
      });

      let seriesData = [];

      for (let i = 0; i < PivotTable.length; i++) {
        const series = {
          name: PivotTable[i].name,
          type:
            PivotTable[i].name === "Actual_Input" ||
            PivotTable[i].name === "Total_NG"
              ? "scale"
              : PivotTable[i].name === "NG_Percentage"
              ? "line"
              : "column",
          data: PivotTable[i].data,
        };
        seriesData.push(series);
      }

      // Now seriesData contains objects with modified types
      ////console.log(seriesData);
      let columnSeries = seriesData.filter(
        (series) => series.type === "column"
      );
      let lineSeries = seriesData.filter((series) => series.type === "line");

      let mergedSeries = columnSeries.concat(lineSeries);
      //console.log(mergedSeries);

      // Now columnSeries contains objects with type 'column' and lineSeries contains objects with type 'line'
      ////console.log(columnSeries);
      ////console.log(lineSeries);

      const sortedData = seriesData.sort((a, b) => {
        // Items with name "Actual_Input" or "Total_NG" should be moved to the end
        if (
          (a.name === "Actual_Input" || a.name === "Total_NG") &&
          !(b.name === "Actual_Input" || b.name === "Total_NG")
        ) {
          return 1;
        } else if (
          !(a.name === "Actual_Input" || a.name === "Total_NG") &&
          (b.name === "Actual_Input" || b.name === "Total_NG")
        ) {
          return -1;
        } else {
          return 0;
        }
      });

      ////console.log(sortedData);

      let numColumns = 0;
      let numLines = 0;

      // Loop through the sortedData array
      for (const item of sortedData) {
        // Check if the type is 'column'
        if (item.type === "column") {
          numColumns++;
        }
        // Check if the type is 'line'
        if (item.type === "line") {
          numLines++;
        }
      }

      // Sum the counts of columns and lines
      let totalColumnsAndLines = numColumns + numLines;

      //console.log("Total columns and lines:", totalColumnsAndLines);

      const mappedSeriesNames = sortedData.map((item) => item.name);

      //console.log(mappedSeriesNames);

      // Assuming your array is named dataSeries
      const maxValues = sortedData.map((series) => Math.max(...series.data));

      // The maximum value among all data arrays
      const globalMaxValue = Math.max(...maxValues);

      ////console.log(globalMaxValue);

      const X_left = Math.max(...maxValues) / 2;
      ////console.log(X_left);

      // Assuming mappedSeriesNames[0] is the series name you want to use
      const seriesName = mappedSeriesNames[0];
      const line_percen = mappedSeriesNames[mappedSeriesNames.length - 1];
      //console.log(line_percen); // ผลลัพธ์คือ "NG_Percentage"

      //console.log(seriesName);

      let yaxisConfig = [];

      // Loop for each column
      for (let i = 0; i < totalColumnsAndLines; i++) {
        let config = {
          seriesName: seriesName,
          min: 0,

          axisTicks: {},
          axisBorder: {
            show: i === 0,
            color: i === 0 ? "#d62728" : "#3399ff",
          },
          labels: {
            show: i === 0,
            style: {
              colors: i === 0 ? "#d62728" : "#3399ff",
            },
            formatter: function (val) {
              return Number(val).toFixed(2) + "%";
            },
            yAxisIndex: 0, // Set the yAxisIndex to 0 for the left side
          },
          title: {
            show: i === 0,
            text: "Percentage",
            style: {
              color: i === 0 ? "#d62728" : "#3399ff",
            },
          },
          tooltip: {
            show: true,
            enabled: true,
          },
          show: i === 0,
          yAxisIndex: 0, // Set the yAxisIndex to 0 for the left side
          type: i === 0 ? "line" : "bar", // Set type to line for the first series, bar for others
          dataLabels: {
            enabled: true,
            offsetX: 0,
            offsetY: 0,
            style: {
              fontSize: "13px",
              color: "#000000", // Set the color to black for yAxisIndex 0
            },
            formatter: function (val) {
              return Number(val).toFixed(2) + "%";
            },
            yAxisIndex: 0, // Set the yAxisIndex to 0 for the left side
          },
          line: {
            show: i === 0, // Set show property of line to false for bars
          },
        };

        yaxisConfig.push(config);
      }

      yaxisConfig.push(
        {
          seriesName: "Income",
          min: 0,
          max: globalMaxValue,
          opposite: false,
          axisTicks: {
            show: false,
          },
          axisBorder: {
            show: false,
            color: "#1f77b4",
          },
          labels: {
            show: false,
            style: {
              colors: "#1f77b4",
            },
          },
          yAxisIndex: 1,
          grouping: true,
          type: "line",
          // Apply dataLabels configuration for yAxisIndex 1
          dataLabels: {
            enabled: false, // Set to false to hide dataLabels
          },
        },
        {
          seriesName: "Output",
          min: 0,
          max: globalMaxValue,
          axisTicks: {
            show: false,
          },
          labels: {
            show: false,
            style: {
              colors: "#000000",
            },
          },
          yAxisIndex: 1,
          grouping: true,
          type: "bar",
          // Apply dataLabels configuration for yAxisIndex 1
          dataLabels: {
            enabled: false, // Set to false to hide dataLabels
          },
        }
      );

      // Options object
      let options = {
        chart: {
          height: 350,
          type: "line",
          stacked: true,
          marginLeft: 0,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "60%",
            endingShape: "rounded",
            borderWidth: 1,
            borderColor: "#000000",
            dataLabels: {
              position: "center", // Change this line to "center" or "insideEnd"
              offsetY: 1,
            },
          },
        },
        tooltip: {
          fixed: {
            enabled: false,
          },
          followCursor: false,
        },
        dataLabels: {
          enabled: true,
          offsetX: 0,
          offsetY: 0,
          style: {
            fontSize: "13px",
            color: "#000000", // Set the color to black
          },
          formatter: function (val) {
            return Number(val).toFixed(2) + "%";
          },
          yAxisIndex: 0, // Set the yAxisIndex to 0 for the left side
        },
        title: {
          text: `%NG monthly's Summary Line ${this.state.Lines} year  ${this.state.startDate}`,
          align: "center",
          offsetX: 0,
        },
        xaxis: {
          categories: xAxis,
        },
        yaxis: yaxisConfig,
        colors: [
          "#993366",
          "#ff7f0e",
          "#2ca02c",

          "#9467bd",
          "#c49c94",
          "#e377c2",
          "#7f7f7f",
          "#bcbd22",
          "#17becf",
          "#aec7e8",
          "#ffbb78",
          "#1f77b4",
          "#c5b0d5",
          "#f7b6d2",
          "#c7c7c7",

          "#9edae5",
          "#d62728",
          "#ff6600",
          "#663300",
          "#ff66cc",
          "#666666",
          "#cccc00",
          "#00ccff",
          "#ff3300",
          "#66ff66",
          "#990000",
          "#996699",
          "#996633",
          "#ff99cc",
          "#999999",
          "#ffff00",
          "#0099ff",
          "#dbdb8d",
        ],
        fill: {
          opacity: 1,
        },
        tooltip: {
          fixed: {
            enabled: false,
          },
          followCursor: true,
          offsetY: 20,
          offsetX: 30,
        },
        legend: {
          position: "bottom",
          horizontalAlign: "center",
          offsetY: 10,
          markers: {
            width: 12,
            height: 12,
            radius: 4,
          },
          itemMargin: {
            horizontal: 10,
            vertical: 5,
          },
        },
        stroke: {
          width: 1,
          curve: "smooth",
        },
        markers: {
          size: 5,
          strokeColors: "#7f7f7f",
          strokeWidth: 2,
          hover: {
            size: 7,
          },
        },
        yaxis: yaxisConfig,
        className: "apexcharts-bar-area",
      };

      ////console.log(options);

      await this.setState({
        options: options,

        seriesY: sortedData,
      });

    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle the error, display an error message, or log it as needed
    }
  };
  getMaxValue = (options) => {
    let max = -Infinity;
    let maxOption = null;

    for (const option of options) {
      const value = parseFloat(option.label);
      if (!isNaN(value) && value > max) {
        max = value;
        maxOption = option;
      }
    }

    return maxOption;
  };

  getline = async () => {
    const array = await httpClient.get(server.Compare_Output_month_Line_URL);
    const options = array.data.result.map((d) => ({
      label: d.year,
    }));
    this.setState({ listLines: options });
  };

  getprocess = async () => {
    const array = await httpClient.get(server.Compare_Output_process_month_URL);
    const options = array.data.result.map((d) => ({
      label: d.process,
    }));
    this.setState({ listprocess: options });
  };

  stopInterval() {
    clearInterval(this.intervalId);
  }

  // ฟังก์ชันเพื่อ refreath
  handleRefresh = () => {
    // สร้าง Date ใหม่
    const currentDate = new Date();

    // ทำการ setState ให้ this.state.startDate เป็นวันปัจจุบัน
    this.setState(
      { startDate: currentDate.toISOString().split("T")[0] },
      () => {
        // เรียกฟังก์ชันที่ต้องการทำหลังจาก setState เสร็จสิ้น
        this.doGetDataReport();
      }
    );
  };

  // ฟังก์ชันที่เรียกเมื่อต้องการ refreath

  startInterval() {
    this.intervalId = setInterval(() => {
      this.setState((prevState) => ({
        countdownTime: prevState.countdownTime - 1,
      }));

      if (this.state.countdownTime <= 0) {
        // เมื่อเวลาครบถ้วน, ให้ทำการ Summit ข้อมูล
        this.handleRefresh();
        // และรีเซ็ตเวลานับถอยหลังเป็น 5 นาทีใหม่
        this.setState({ countdownTime: 300 }); // 5 นาทีในวินาที
      }
    }, 1000); // 1 วินาที
  }

  stopInterval() {
    clearInterval(this.intervalId);
  }
  handleYearChange = (event) => {
    this.setState({ startDate: event.target.value });
  };
  render() {
    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 10 }}>
          <section className="content-header">
            <div className="container-fluid">
         
            </div>
          </section>
        </div>
        <div className="col-12">
          <div style={{ paddingTop: 20 }}>
            {this.state.show_link !== null && (
              <a href="/percen_OEE_monthly">
                <i className="fa fa-arrow-left"></i> back to OEE Monthly
                Dashboard Monitoring Monitoring
              </a>
            )}
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-sm-6">
            <h2>%NG Monthly's Summary</h2>
          </div>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              {this.state.show_link == null && (
                <div className="card card-primary card-outline">
                  <div className="card-header">
                    <h3 className="card-title">
                      <label>Select Parameter</label>
                    </h3>
                  </div>

                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-1">
                        <label>Select Option</label>
                        <div>
                          <input
                            type="radio"
                            value="line"
                            checked={this.state.selectedOption === "line"}
                            onChange={(e) =>
                              this.setState({ selectedOption: e.target.value })
                            }
                          />
                          <label>Line</label>
                        </div>
                        <div>
                          <input
                            type="radio"
                            value="design"
                            checked={this.state.selectedOption === "design"}
                            onChange={(e) =>
                              this.setState({ selectedOption: e.target.value })
                            }
                          />
                          <label>Design</label>
                        </div>
                      </div>

                      {/* Dropdown สำหรับ Line */}
                      {this.state.selectedOption === "line" && (
                        <div className="col-md-2">
                          <div className="form-group">
                            <label>Line&Model</label>
                            <Select
                              options={this.state.listLines}
                              onChange={async (e) => {
                                await this.setState({ Lines: e.label });
                              }}
                              placeholder="Select Line&Model"
                            />
                          </div>
                        </div>
                      )}

                      {/* Dropdown สำหรับ Design */}

                      {this.state.selectedOption === "design" && (
                        <div className="col-md-2">
                          <div className="form-group">
                            <label>Design</label>
                            <Select
                              options={[
                                {
                                  value: "3.5 inch FCC",
                                  label: "3.5 inch FCC",
                                },
                                { value: "2.5 inch", label: "2.5 inch" },
                                { value: "3.5 inch SP", label: "3.5 inch SP" },
                              ]}
                              onChange={async (e) => {
                                await this.setState({
                                  selectedDesign: e.label,
                                });
                              }}
                              placeholder="Select Design"
                            />
                          </div>
                        </div>
                      )}
                      <div className="col-md-2">
                        <div className="form-group">
                          <label>Select Year</label>
                          <Select
                            options={Array.from({ length: 3 }, (_, i) => {
                              const year = new Date().getFullYear() - i;
                              return {
                                value: year.toString(),
                                label: year.toString(),
                              };
                            })}
                            onChange={async (e) => {
                              await this.setState({ startDate: e.label });
                            }}
                            placeholder="Select Year"
                          />
                        </div>
                      </div>

                      <div className="col-md-3">
                        <button
                          disabled={this.state.isDisable}
                          onClick={async (e) => {
                            try {
                              if (this.state.selectedOption === "line") {
                                if (
                                  !this.state.Lines ||
                                  this.state.Lines.length === 0
                                ) {
                                  Swal.fire({
                                    icon: "warning",
                                    title: "Missing Information",
                                    text: "Please select at least one line before fetching data.",
                                  });
                                  return;
                                }
                              } else if (
                                this.state.selectedOption === "design"
                              ) {
                                if (
                                  !this.state.selectedDesign ||
                                  this.state.selectedDesign.length === 0
                                ) {
                                  Swal.fire({
                                    icon: "warning",
                                    title: "Missing Information",
                                    text: "Please select at least one design before fetching data.",
                                  });
                                  return;
                                }
                              }

                              if (!this.state.startDate) {
                                Swal.fire({
                                  icon: "warning",
                                  title: "Missing Start Date",
                                  text: "Please select a start date before fetching data.",
                                });
                                return;
                              }

                              this.setState({ isDisable: true });

                              if (
                                (this.state.selectedOption === "line" &&
                                  !this.state.Lines) ||
                                (this.state.selectedOption === "design" &&
                                  !this.state.selectedDesign)
                              ) {
                                Swal.fire({
                                  icon: "error",
                                  title: "Missing Selection",
                                  text: `Please select ${
                                    this.state.selectedOption === "line"
                                      ? "Line"
                                      : "Design"
                                  }`,
                                }).then(() => {
                                  this.setState({ isDisable: false }); // Re-enable the button
                                });
                              } else {
                                Swal.fire({
                                  icon: "info",
                                  title: "Loading Data",
                                  timer: 60000,
                                  allowOutsideClick: false,
                                  didOpen: async () => {
                                    Swal.showLoading();

                                    if (this.state.selectedOption === "line") {
                                      await this.doGetDataReport();
                                    } else if (
                                      this.state.selectedOption === "design"
                                    ) {
                                      await this.doGetDataReport_Design();
                                    }

                                    Swal.close();
                                  },
                                }).finally(() => {
                                  this.setState({ isDisable: false }); // Re-enable the button after operation
                                });
                              }
                            } catch (error) {
                              Swal.fire({
                                icon: "error",
                                title: "Error",
                                text: "Something went wrong. Please try again.",
                              });
                              this.setState({ isDisable: false }); // Re-enable the button in case of error
                            }
                          }}
                          type="submit"
                          className="btn btn-primary"
                          style={{ marginTop: 30 }}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="row">
                <div className="col-12">
                  {/* Insert Xbar Chart */}
                  <div className="row" style={{ width: "100%" }}>
                    <div style={{ width: "2%" }}></div>
                    <div
                      className="card card-warning"
                      style={{ width: "100%" }}
                    >
                      <div className="row">
                        <div
                          style={{
                            width: "100%",
                            backgroundColor: "#FFFFE0", // Very light blue

                            border: "1px solid #000000", // Black border color
                            borderRadius: "10px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <ReactApexChart
                            options={this.state.options}
                            series={this.state.seriesY}
                            type="line"
                            height={550}
                          />
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

export default Compare_Output_month;
