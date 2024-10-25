import React, { Component } from "react";
import { key, server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import Chart from "react-apexcharts";
import moment from "moment";
import Select from "react-select";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";
import ReactDOM from "react-dom";
import ReactApexChart from "react-apexcharts";
import ApexCharts from "apexcharts";
import "./Test_graph.css"; // นำเข้าไฟล์ CSS สำหรับสไตล์ของกล่อง
//npm install @mui/material @emotion/react @emotion/styled
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";

class Monthly_LAR_report_all_Model extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      year: [],
      Month: [],
      report: [],
      xAxis: [],
      yAxis1: [],
      seriesY: [],
      series2: [],
      series3: [],
      series4: [],
      series_: [],
      series_shift: [],
      seriesCleanroom: [],
      options: {},
      options_pp: {},
      options2: {},
      options3: {},
      options4: {},
      options_shift: {},
      chart: [],
      rawData: [],

      Raw_Dat: [],
      yAxisIndex: [],
      xAxis_shift: [],

      startDate: moment().format("yyyy-MM-DD"), //moment().add("days", -6).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"), //moment().format("yyyy-MM-DD"),
      listyear: [],
      listMonth: [],
      listModel: [],

      listYear: [],
      listMonth: [],
      selectedMaxYear: "",
      selectedMaxMonth: "",

      optionSelected: null,
      isDisable: false,
      countdownEnabled: false, // เพิ่ม state สำหรับการเปิด/ปิด countdown
      intervalId: null, // เพิ่ม state สำหรับเก็บ ID ของ interval
      countdownTime: 50, // 5 นาทีในวินาที
    };
  }

  componentDidMount = async () => {
    await this.getyear();
    this.setState({ countdownEnabled: false });
    const savedStartDate = localStorage.getItem("startDate");

    if (savedStartDate) {
      this.setState({ startDate: savedStartDate });
    }
    const { location, history } = this.props;
    const { state } = location;
    const { lineName } = state;
    this.setState({ year: lineName });

    // Now, you can access this.state.year in other methods, like doGetDataReport
    this.doGetDataReport();
  };

  doGetDataReport = async () => {
    const result = await httpClient.get(
      server.graph_output_URL +
        "/" +
        this.state.year +
        "/" +
        this.state.startDate
    );
    console.log(result);
    const compareLink = `/compare/${this.state.year}/${this.state.startDate}`;

    let xAxis = [];

    for (let index = 0; index < result.data.resultGraph.length; index++) {
      const item = result.data.resultGraph[index];
      await xAxis.push(item.Hour);
    }

    let xAxis_shift = [];

    for (let index = 0; index < result.data.result_shift.length; index++) {
      const item = result.data.result_shift[index];
      await xAxis_shift.push(item.shift_all);
    }
    console.log(xAxis_shift);

    let yAxis6 = result.data.Actual;
    let yAccum_Actual = result.data.Accum_Actual;
    let yAccum_Plan = result.data.Accum_Plan;
    let yRejectPP = result.data.Plan;
    let ydiff = result.data.diff;
    let CKT = result.data.CKT;
    let rawData = result.data.listRawData;
    let DT_Pie = result.data.DT_Pie;
    let NG_Pie = result.data.NG_Pie;
    let PE_Pie = result.data.PE_Pie;
    let CKT_Pie = result.data.CKT_Pie;
    let result_Pie = result.data.result_Pie[0];

    console.log(result_Pie.DT_Pie);
    console.log(result_Pie.NG_Pie);
    console.log(result_Pie.PE_Pie);
    console.log(result_Pie.CKT_Pie);

    // Set a maximum value for yRejectPP
    const maxAllowedValue = Math.max(...yRejectPP) + 200;

    console.log(maxAllowedValue);
    // Access the first element of the result_Operating array
    const operatingResult = result.data.result_Operating[0];

    const Plen_PercentageResult =
      operatingResult.Plen_Percentage !== null
        ? parseFloat(operatingResult.Plen_Percentage.toFixed(1))
        : null;

    const PE_PercentageResult =
      operatingResult.PE_Percentage !== null
        ? parseFloat(operatingResult.PE_Percentage.toFixed(1))
        : null;

    const NG_PercentageResult =
      operatingResult.NG_Percentage !== null
        ? parseFloat(operatingResult.NG_Percentage.toFixed(1))
        : null;

    const DT_PercentageResult =
      operatingResult.DT_Percentage !== null
        ? parseFloat(operatingResult.DT_Percentage.toFixed(1))
        : null;
    const CKT_PercentageResult =
      operatingResult.CKT_Percentage !== null
        ? parseFloat(operatingResult.CKT_Percentage.toFixed(1))
        : null;

    // Log the results
    console.log("Results from result.data:");
    console.log(`Plen_Percentage: ${Plen_PercentageResult}`);
    console.log(`PE_Percentage: ${PE_PercentageResult}`);
    console.log(`NG_Percentage: ${NG_PercentageResult}`);
    console.log(`DT_Percentage: ${DT_PercentageResult}`);
    console.log(`CKT_Percentage: ${CKT_PercentageResult}`);

    let actualValue = Number(rawData[0][0].Actual).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });

    let plan1Value = Number(rawData[0][0].Plan_1).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });

    let diffValue = Number(rawData[0][0].diff).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });

    // แสดงค่า
    console.log("Actual:", actualValue);
    console.log("Plan_1:", plan1Value);
    console.log("diff:", diffValue);

    console.log(rawData.length);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat: rawData[0] });
    console.log(this.state.Raw_Dat);

    this.setState({
      report: result.data.result,
      xAxis,
      yAxis6,
      yAccum_Plan,
      yAccum_Actual,
      yRejectPP,
      ydiff,
      rawData,
      CKT,
      Plen_PercentageResult,
      PE_PercentageResult,
      NG_PercentageResult,
      DT_PercentageResult,
      CKT_PercentageResult,
      maxAllowedValue,
      DT_Pie,
      NG_Pie,
      PE_Pie,
      CKT_Pie,
      xAxis_shift,

      // series,

      isDisable: false,
    });
    // graph Hourly Output
    await this.setState({
      options: {
        chart: {
          height: 350,
          type: "bar",
          stacked: true,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "60%",
            endingShape: "rounded",
            borderWidth: 1,
            borderColor: "#000000",
            dataLabels: {
              position: "center", // แก้เป็น "bottom"
              offsetY: 1,
              rotation: -90, // เพิ่มค่า rotation เป็น -90 องศา
            },
          },
        },

        dataLabels: {
          enabled: true,
          offsetX: 0,
          offsetY: 0,
          style: {
            fontSize: "13px", // Set your desired font size here
          },
          formatter: function (val) {
            return Number(val).toLocaleString();
          },
        },

        title: {
          text: `Hourly Output${this.state.year}`,
          align: "left",
          offsetX: 50,
        },
        xaxis: {
          categories: xAxis,
        },

        yaxis: [
          {
            seriesName: "Actual",
            min: 0,
            max: maxAllowedValue,
            axisTicks: {
              show: true,
            },

            axisBorder: {
              show: true,
              color: "#000000",
            },
            labels: {
              style: {
                colors: "#000000",
              },
              formatter: function (val) {
                return Number(val).toLocaleString();
              },
            },
            title: {
              text: "QTY",
              style: {
                color: "#000000",
              },
            },
            tooltip: {
              enabled: true,
            },
            yAxisIndex: 0,
          },
          {
            seriesName: "Actual",
            min: 0,
            max: maxAllowedValue,

            axisTicks: {
              show: false,
            },
            labels: {
              show: false,
              style: {
                colors: "#3399ff",
              },
              formatter: function (val) {
                return Number(val).toLocaleString();
              },
            },
            yAxisIndex: 1,
          },
          {
            seriesName: "Actual",
            min: 0,
            max: maxAllowedValue,

            axisTicks: {
              show: false,
            },
            labels: {
              show: false,
              style: {
                colors: "#3399ff",
              },
            },
            yAxisIndex: 2,
          },
        ],

        colors: ["#33cc33", "#ff1a1a", "#3399ff"],

        tooltip: {
          fixed: {
            enabled: false, // ตั้งค่า fixed ให้เป็น false
          },
          followCursor: true, // เปิดใช้งาน followCursor เพื่อให้ tooltip ตามตำแหน่งของเมาส์
          offsetY: 20,
          offsetX: 30,
        },

        legend: {
          position: "bottom",
          offsetY: 5,
        },

        stroke: {
          width: 5,
          curve: "smooth",
        },
        markers: {
          size: 5,
          strokeColors: "#fff",
          strokeWidth: 2,
          hover: {
            size: 7,
          },
        },
        className: "apexcharts-bar-area", // เพิ่มคลาส CSS ที่คุณต้องการใช้งาน
      },

      seriesY: [
        {
          name: "Actual",
          type: "bar",
          data: yAxis6,
          stack: "one",
          dataLabels: {
            enabled: true,
            offsetX: 0,
            offsetY: -5,
          },
        },
        {
          name: "Diff",
          type: "bar",
          data: ydiff,
          stack: "one",
          dataLabels: {
            enabled: true,
            offsetX: 0,
            offsetY: -30,
          },
        },
        {
          name: "Plan",
          type: "line",
          data: yRejectPP,
          dataLabels: {
            enabled: true,
            offsetX: 0,
            offsetY: -50,
          },
        },
      ],
    });
    //Operaing/Non
    await this.setState({
      options2: {
        chart: {
          type: "bar",
          height: 350,
          stacked: true,
          stackType: "100%",
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },

        title: {
          text: "Operating/Non Operating time",
        },

        dataLabels: {
          enabled: true,
          enabledOnSeries: [0, 1, 2, 3],
          formatter: function (val) {
            return val.toFixed(1) + "%";
          },
          align: "bottom",
          offsetX: 0,
          offsetY: 10,
          style: {
            colors: ["#000000", "#111111", "#222222", "#333333"], // Replace with your preferred font colors
          },
        },

        yaxis: {
          title: {
            text: undefined,
          },
        },

        states: {
          hover: {
            filter: "none",
          },
        },
        legend: {
          position: "bottom",
          offsetY: 5,
        },

        yaxis: [
          {
            seriesName: "Total",
            axisTicks: {
              show: false,
            },
            axisBorder: {
              show: false,
              color: "#33cc33",
            },
            labels: {
              show: false,
              style: {
                colors: "#33cc33",
              },
            },
            title: {
              text: "Total",
            },

            yAxisIndex: 0,
          },
        ],
        colors: ["#33cc33", "#ff3399", "#ff9900", "#3399ff", "#cc33ff"],

        tooltip: {
          fixed: {
            enabled: false, // ตั้งค่า fixed ให้เป็น false
          },
          followCursor: true, // เปิดใช้งาน followCursor เพื่อให้ tooltip ตามตำแหน่งของเมาส์
          offsetY: 20,
          offsetX: 30,
        },
        legend: {
          position: "bottom",
          offsetY: 10,
        },
        stroke: {
          width: 2,
          curve: "smooth",
          color: "#000000", // กำหนดสีของกรอบเป็นสีดำ
        },
      },
      series2: [
        {
          name: "%OparationTime",
          type: "bar",
          data: [Plen_PercentageResult],
          stacked: true,
          dataLabels: {
            enabled: true,
            offsetY: -20,
            style: {
              fontSize: "12px",
              colors: ["#33cc33"],
            },
          },
          yAxisIndex: 0,
        },
        {
          name: "%PF",
          type: "bar",
          data: [PE_PercentageResult],
          stacked: true,
          dataLabels: {
            enabled: true,
            offsetY: -20,
            style: {
              fontSize: "12px",
              color: "#ff3399",
            },
          },
          yAxisIndex: 0,
        },
        {
          name: "%Yield",
          type: "bar",
          data: [NG_PercentageResult],
          dataLabels: {
            enabled: true,
            offsetY: -20,
            style: {
              fontSize: "12px",
              colors: ["#ff1a1a"],
            },
          },
          yAxisIndex: 0,
        },
        {
          name: "%DT",
          type: "bar",
          data: [DT_PercentageResult],
          dataLabels: {
            enabled: true,
            offsetY: -20,
            style: {
              fontSize: "12px",
              colors: ["#aaffaa"],
            },
          },
          yAxisIndex: 0,
        },
        {
          name: "%CKT",
          type: "bar",
          data: [CKT_PercentageResult],
          dataLabels: {
            enabled: true,
            offsetY: -20,
            style: {
              fontSize: "12px",
              colors: ["#cc33ff"],
            },
          },
          yAxisIndex: 0,
        },
      ],
    });
    //Problem Ratio
    await this.setState({
      options3: {
        chart: {
          type: "pie",
          height: 350,
        },

        dataLabels: {
          enabled: true,
          enabledOnSeries: [0, 1, 2, 3],
          formatter: function (val) {
            return val.toFixed(1) + "%";
          },
          align: "bottom",
          offsetX: 0,
          offsetY: 5,
          style: {
            colors: ["#000000", "#000000", "#000000", "#000000"], // กำหนดสีของตัวอักษร
            borderColor: "#000000", // กำหนดสีของขอบ
            borderWidth: 3, // กำหนดความกว้างของขอบ
          },
        },

        labels: ["DT%", "NG%", "PF%", "CKT%"],
        colors: ["#3399ff", "#ff9900", "#ff3399", "#cc33ff"],
        plotOptions: {
          pie: {
            dataLabels: {
              style: {
                color: "#000000", // กำหนดสีของ label เป็นสีดำ
              },
            },
            stroke: {
              color: "#000000", // กำหนดสีของขอบเป็นสีดำ
              width: 1, // กำหนดความกว้างของขอบ
            },
          },
        },
        className: "apexcharts-pie-slice", // เพิ่มคลาส CSS ที่คุณต้องการใช้งาน
      },

      series3: [
        result_Pie.DT_Pie,
        result_Pie.NG_Pie,
        result_Pie.PE_Pie,
        result_Pie.CKT_Pie,
      ],
    });
    //Hourly Problem
    await this.setState({
      options4: {
        chart: {
          height: 350,
          type: "bar",
          stacked: true,
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

        dataLabels: {
          enabled: true,
          offsetX: 0,
          offsetY: 0,
          style: {
            fontSize: "13px", // Set your desired font size here
          },
          formatter: function (val) {
            return Number(val).toLocaleString();
          },
        },

        title: {
          text: `Hourly Problem ${this.state.year}`,
          align: "left",
          offsetX: 110,
        },
        xaxis: {
          categories: xAxis,
        },

        yaxis: [
          {
            seriesName: "Yield",
            min: 0,
            // max: maxAll,
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: "#000000",
            },
            labels: {
              style: {
                colors: "#000000",
              },
              formatter: function (val) {
                return Number(val).toLocaleString();
              },
            },
            title: {
              text: "QTY",
              style: {
                color: "#000000",
              },
            },
            tooltip: {
              enabled: true,
            },
            yAxisIndex: 0,
          },
          {
            seriesName: "Yield",
            min: 0,
            // max: maxAll,

            axisTicks: {
              show: false,
            },
            labels: {
              show: false,
              style: {
                colors: "#3399ff",
              },
              formatter: function (val) {
                return Number(val).toLocaleString();
              },
            },
            yAxisIndex: 1,
          },
          {
            seriesName: "Yield",
            min: 0,
            // max: maxAll,

            axisTicks: {
              show: false,
            },
            labels: {
              show: false,
              style: {
                colors: "#3399ff",
              },
            },
            yAxisIndex: 2,
          },
        ],
        // colors: ["#33cc33", "#ff3399", "#ff9900", "#3399ff"],
        colors: ["#ff9900", "#3399ff", "#ff3399", "#cc33ff"],

        tooltip: {
          fixed: {
            enabled: false, // ตั้งค่า fixed ให้เป็น false
          },
          followCursor: true, // เปิดใช้งาน followCursor เพื่อให้ tooltip ตามตำแหน่งของเมาส์
          offsetY: 20,
          offsetX: 30,
        },

        legend: {
          position: "bottom",
          offsetY: 5,
        },

        stroke: {
          width: 5,
          curve: "smooth",
        },
        markers: {
          size: 5,
          strokeColors: "#fff",
          strokeWidth: 2,
          hover: {
            size: 7,
          },
        },
      },

      series4: [
        {
          name: "Yield",
          type: "bar",
          data: result.data.Yield,
          stack: "one",
          dataLabels: {
            enabled: true,
            offsetX: 0,
            offsetY: -5,
          },
        },
        {
          name: "MC_Downtime",
          type: "bar",
          data: result.data.MC_Downtime,
          stack: "one",
          dataLabels: {
            enabled: true,
            offsetX: 0,
            offsetY: -30,
          },
        },
        {
          name: "Loss_PF",
          type: "bar",
          data: result.data.Loss_PF,
          dataLabels: {
            enabled: true,
            offsetX: 0,
            offsetY: -50,
          },
        },
        {
          name: "CKT",
          type: "bar",
          data: result.data.CKT,
          dataLabels: {
            enabled: true,
            offsetX: 0,
            offsetY: -50,
          },
        },
      ],
    });
    //Output/shift
    await this.setState({
      options_shift: {
        chart: {
          height: 350,
          type: "bar",
          stacked: true,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "60%",
            endingShape: "rounded",
          },
        },

        dataLabels: {
          enabled: true,
          offsetX: 0,
          offsetY: 0,
          style: {
            fontSize: "12px", // Set your desired font size here
          },
          formatter: function (val) {
            return Number(val).toLocaleString();
          },
        },

        title: {
          text: `Output/shift" ${this.state.year}`,
          align: "left",
          offsetX: 110,
        },
        xaxis: {
          categories: xAxis_shift,
        },

        yaxis: [
          {
            seriesName: "Actual",
            min: 0,
            // max: maxAllowedValue,
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: "#000000",
            },
            labels: {
              style: {
                colors: "#000000",
              },
              formatter: function (val) {
                return Number(val).toLocaleString();
              },
            },
            title: {
              text: "QTY",
              style: {
                color: "#000000",
              },
            },
            tooltip: {
              enabled: true,
            },
            yAxisIndex: 0,
          },
          {
            seriesName: "Actual",
            min: 0,
            // max: maxAllowedValue,

            axisTicks: {
              show: false,
            },
            labels: {
              show: false,
              style: {
                colors: "#3399ff",
              },
              formatter: function (val) {
                return Number(val).toLocaleString();
              },
            },
            yAxisIndex: 1,
          },
          {
            seriesName: "Actual",
            min: 0,
            // max: maxAllowedValue,

            axisTicks: {
              show: false,
            },
            labels: {
              show: false,
              style: {
                colors: "#3399ff",
              },
            },
            yAxisIndex: 2,
          },
        ],

        colors: ["#33cc33", "#ff1a1a", "#3399ff"],

        tooltip: {
          fixed: {
            enabled: false, // ตั้งค่า fixed ให้เป็น false
          },
          followCursor: true, // เปิดใช้งาน followCursor เพื่อให้ tooltip ตามตำแหน่งของเมาส์
          offsetY: 20,
          offsetX: 30,
        },

        legend: {
          position: "bottom",
          offsetY: 5,
        },

        stroke: {
          width: 5,
          curve: "smooth",
        },
        markers: {
          size: 5,
          strokeColors: "#fff",
          strokeWidth: 2,
          hover: {
            size: 7,
          },
        },
      },

      series_shift: [
        {
          name: "Actual",
          type: "bar",
          data: result.data.Actual_shift,
          stack: "one",
          dataLabels: {
            enabled: true,
            offsetX: 0,
            offsetY: -5,
          },
        },
        {
          name: "Diff",
          type: "bar",
          data: result.data.diff_shift,
          stack: "one",
          dataLabels: {
            enabled: true,
            offsetX: 0,
            offsetY: -30,
          },
        },
        {
          name: "Plan",
          type: "line",
          data: result.data.Plan_shift,
          dataLabels: {
            enabled: true,
            offsetX: 0,
            offsetY: -50,
          },
        },
      ],
    });
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

  getyear = async () => {
    const array = await httpClient.get(server.Lgraph_output_Line_URL);
    const options = array.data.result.map((d) => ({
      label: d.year,
    }));
    this.setState({ listyear: options });
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

  render() {
    console.log(this.state.xAxis);
    console.log(this.state.yAccum_Actual);
    console.log(this.state.yReject);

    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 10 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  {/* <h1>Monthly LAR report all Model</h1> */}
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">
                      {/* Monthly LAR report all Model */}
                    </li>
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
                    <a href="/percen_ng">
                      <i className="fa fa-arrow-left"></i> Back to %NG Dashboard
                      Monitoring
                    </a>
                  </h3>
                </div>
              </div>

              <div className="row">
                <div className="col-7">
                  {/* Insert Xbar Chart */}
                  <div className="row" style={{ width: "100%" }}>
                    <div style={{ width: "1%" }}></div>
                    <div
                      className="card card-warning"
                      style={{
                        width: "100%",
                        backgroundColor: "#FFFFE0", // Light yellow color
                        border: "1px solid #000000", // Black border color
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <div className="card-body">
                        <div className="row">
                          <div style={{ width: "100%" }}>
                            <ReactApexChart
                              options={this.state.options}
                              series={this.state.seriesY}
                              type="line"
                              height={350}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="row" style={{ width: "100%" }}>
                      <div style={{ width: "1%" }}></div>
                      <div
                        className="card card-warning"
                        style={{
                          width: "100%",
                          backgroundColor: "#FFFFE0", // Light yellow color
                          border: "1px solid #000000", // Black border color
                          borderRadius: "10px",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <div className="card-body">
                          <div className="row">
                            <div style={{ width: "100%" }}>
                              <ReactApexChart
                                options={this.state.options4}
                                series={this.state.series4}
                                type="line"
                                height={200}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-5">
                  {this.state.rawData.map((data, index) => (
                    <div key={index} className="row">
                      <div className="col-md-3">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: "blue",
                            border: "1px solid #000000",
                          }}
                        >
                          <h1 style={{ color: "white" }}>Plan </h1>
                          <h1 style={{ color: "white" }}>
                            {Number(data[0].Plan_1).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}
                          </h1>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: "#33cc33",
                            border: "1px solid #000000",
                          }}
                        >
                          <h1 style={{ color: "white" }}>Actual </h1>
                          <h1 style={{ color: "white" }}>
                            {Number(data[0].Actual).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}
                          </h1>
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div
                          className="card card-warning text-center"
                          style={{
                            backgroundColor: data[0].diff < 0 ? "red" : "green",
                            border: "1px solid #000000",
                          }}
                        >
                          <h1 style={{ color: "white" }}>Diff</h1>
                          <h1 style={{ color: "white" }}>
                            {Number(data[0].diff).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}
                          </h1>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="row" style={{ width: "100%" }}>
                        <div style={{ width: "1%" }}></div>
                        <div
                          className="card card-warning"
                          style={{
                            width: "100%",
                            backgroundColor: "#FFFFE0", // Light yellow color
                            border: "1px solid #000000", // Black border color
                            borderRadius: "10px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <div className="card-body">
                            <div className="row">
                              <div style={{ width: "100%" }}>
                                <ReactApexChart
                                  options={this.state.options2}
                                  series={this.state.series2}
                                  type="bar"
                                  height={180}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="row" style={{ width: "100%" }}>
                        <div style={{ width: "1%" }}></div>
                        <div
                          className="card card-warning"
                          style={{
                            width: "100%",
                            backgroundColor: "#FFFFE0", // Light yellow color
                            border: "1px solid #000000", // Black border color
                            borderRadius: "10px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <div className="card-body">
                            <div className="row">
                              <div style={{ width: "100%" }}>
                                <ReactApexChart
                                  options={this.state.options3}
                                  series={this.state.series3}
                                  type="pie"
                                  height={200}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <div className="row" style={{ width: "100%" }}>
                        <div style={{ width: "1%" }}></div>
                        <div
                          className="card card-warning"
                          style={{
                            width: "100%",
                            backgroundColor: "#FFFFE0", // Light yellow color
                            border: "1px solid #000000", // Black border color
                            borderRadius: "10px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <div className="card-body">
                            <div className="row">
                              <div style={{ width: "100%" }}>
                                <ReactApexChart
                                  options={this.state.options_shift}
                                  series={this.state.series_shift}
                                  type="line"
                                  height={240}
                                />
                              </div>
                            </div>
                          </div>
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

export default Monthly_LAR_report_all_Model;
