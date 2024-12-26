// App_Init
export const APP_INIT = "APP_INIT";
export const APP_TITLE = "NMB Covid19 command center";

// Login Page
export const HTTP_LOGIN_FETCHING = "HTTP_LOGIN_FETCHING";
export const HTTP_LOGIN_SUCCESS = "HTTP_LOGIN_SUCCESS";
export const HTTP_LOGIN_FAILED = "HTTP_LOGIN_FAILED";

// Register Page
export const HTTP_REGISTER_FETCHING = "HTTP_REGISTER_FETCHING";
export const HTTP_REGISTER_SUCCESS = "HTTP_REGISTER_SUCCESS";
export const HTTP_REGISTER_FAILED = "HTTP_REGISTER_FAILED";

// Division code
export const HTTP_DIVCODE_FETCHING = "HTTP_DIVCODE_FETCHING";
export const HTTP_DIVCODE_SUCCESS = "HTTP_DIVCODE_SUCCESS";
export const HTTP_DIVCODE_FAILED = "HTTP_DIVCODE_FAILED";

// Error Code
export const E_PICKER_CANCELLED = "E_PICKER_CANCELLED";
export const E_PICKER_CANNOT_RUN_CAMERA_ON_SIMULATOR =
  "E_PICKER_CANNOT_RUN_CAMERA_ON_SIMULATOR";
export const E_PERMISSION_MISSING = "E_PERMISSION_MISSING";
export const E_PICKER_NO_CAMERA_PERMISSION = "E_PICKER_NO_CAMERA_PERMISSION";
export const E_USER_CANCELLED = "E_USER_CANCELLED";
export const E_UNKNOWN = "E_UNKNOWN";
export const E_DEVELOPER_ERROR = "E_DEVELOPER_ERROR";
export const TIMEOUT_NETWORK = "ECONNABORTED"; // request service timeout
export const NOT_CONNECT_NETWORK = "NOT_CONNECT_NETWORK";

//////////////// Localization Begin ////////////////
export const NETWORK_CONNECTION_MESSAGE =
  "Cannot connect to server, Please try again.";
export const NETWORK_TIMEOUT_MESSAGE =
  "A network timeout has occurred, Please try again.";
export const UPLOAD_PHOTO_FAIL_MESSAGE =
  "An error has occurred. The photo was unable to upload.";




export const apiUrl = "http://localhost:2010/"; //localhost port 2010
export const apiUrlhome = "http://localhost:5173/"; //localhost port 2010
export const Url = "http://192.168.101.67:3000/"; //Port frontend
export const apiUrl_python = "http://192.168.101.120:2028/"; //deploy บางปะอิน 

// SPD 
// export const apiUrl = "http://192.168.101.120:2026/"; //deploy บางปะอิน 
// export const apiUrlhome = "http://192.168.101.120:2031/"; //localhost port 2010
// export const Url = "http://192.168.101.120:2027/"; //deploy บางปะอิน 
// export const apiUrl_python = "http://192.168.101.120:2028/"; //deploy บางปะอิน 

//nmb 
// export const apiUrl = "http://10.120.122.28:2016/"; //deploy บางปะอิน 
// export const Url = "http://10.120.122.28:2017/"; //deploy บางปะอิน 
// export const apiUrl_python = "http://10.120.122.28:2012/"; //deploy บางปะอิน 


// export const apiUrl = "http://192.168.101.120:2033/"; //Backend of javascript
// export const apiUrlhome = "http://192.168.101.120:2031/"; //localhost port 2010
// export const Url = "http://192.168.101.120:2032/"; //frontend
// export const apiUrl_python = "http://192.168.101.120:2028/"; //Frontend of backpython

export const server = {

Lgraph_output_Line_URL: `api/graph_output/Line`,
percen_ng_URL: `api/percen_ng/LARPP`,
percen_OEE_monthly_URL: `api/percen_OEE/monthly`,
Compare_Output_day_URL: `api/graph_Compare_day/LARPP`,
graph_output_URL: `api/graph_output/LARPP`,

Compare_Output_Line_URL: `api/Compare_Output/Line`,
Compare_Output_process_URL: `api/Compare_Output/process`,
Compare_Output_URL: `api/Compare_Output/LARPP`,

percen_OEE_URL: `api/percen_OEE/LARPP`,
Compare_Output_month_URL: `api/graph_Compare_month/LARPP`,

Compare_Output_month_Line_URL: `api/graph_Compare_month/Line`,
Compare_Output_process_month_URL: `api/graph_Compare_month/process`,
Compare_Output_month_URL: `api/graph_Compare_month/LARPP`,
Compare_Output_month_Design_URL: `api/graph_Compare_month/design`,

Compare_Output_day_Line_URL: `api/graph_Compare_day/Line`,
Compare_Output_day_URL: `api/graph_Compare_day/LARPP`,

SHIFTOPT_URL: `api/OPT/shift`,
REPORTOPT_URL: `api/OPT/report`,


Monthly_Operator_YEAR_URL: `api/Monthly_Operator/year`,
Monthly_Operator_MONTH_URL: `api/Monthly_Operator/Month`,
Monthly_Operator_URL: `api/Monthly_Operator/LARPP`,
Operator_GroupName_URL: `api/Monthly_Operator/GroupName`,
Operator_line_URL: `api/Monthly_Operator/line`,


// LAR report per Production team
MQTYEAR_URL: `api/report_per_producion_team/year`,
MQTMONTH_URL: `api/report_per_producion_team/Month`,
MQT_URL: `api/report_per_producion_team/LARPP`,

//Daily_Report_Packing
PACKINGMODEL_URL: `api/Dailypacking/Model`,
PACKINGT1_URL: `api/Dailypacking/report1`,
PACKINGT2_URL: `api/Dailypacking/report2`,
PACKINGT3_URL: `api/Dailypacking/report3`,

graph_output_packing_URL: `api/Packing_output/output`,

//NGLOTRECORD
MODELNGLOTRECORD_URL : `api/NGlotrecord/Model`,
SUMMARYNGLOT_URL : `api/NGlotrecord/SummaryNGlot`,
DETAILNGLOT_URL : `api/NGlotrecord/DetailNGlot`,
TAKEOUTNGLOT_URL : `api/NGlotrecord/TakeoutNGlot`,

//Packing Pallet in progress
HOLDPALLETBYLOTQA_URL : `api/Packed_Half_Pallet/lotqanumber`,
HOLDPALLETSUM_URL : `api/Packed_Half_Pallet/packed_half_Sum`,
HOLDPALLETDETAIL_URL : `api/Packed_Half_Pallet/packed_half_Detail`,
MODELPACKPALLET_URL : `api/Packed_Half_Pallet/model`,

//Daily Output Final ass’y (Before QA)
MODELCO2_URL: `api/OutPutCo2/Model`,
LINECO2_URL: `api/OutPutCo2/Line`,
SUMOUTPUTCO2_URL: `api/OutputCo2/SumOutputCo2`,
DETAILCO2_URL: `api/OutputCo2/DetailOutputCo2`,

//Daily Output Final ass’y (QA Passed)
MODELAFTERQA_URL: `api/AfterQA/Model`,
LINEAFTERQA_URL: `api/AfterQA/Line`,
SUMQAINSPECTION_URL: `api/AfterQA/SumQainspection`,
DETAILQAINSPECTION_URL: `api/AfterQA/DetailQainspection`,

//Production hold record
HOLDCO2_URL: `api/HoldCo2/HoldoutputCo2`,
HOLDDETAIL_URL: `api/HoldCo2/DetailHoldCo2`,

//Report_printlable
MODELLABAL_URL: `api/Report_printlabal/model`,
LINELABAL_URL: `api/Report_printlabal/Line`,
CONFIRMLABAL_URL: `api/Report_printlabal/confirm`,
REPORTprintlabal_URL: `api/Report_printlabal/report`,

//Alarm training
MODELALARMTRAINING : `api/alarmtraining/Model`,
LINEALARMTRAINING : `api/alarmtraining/Line`,
ALARMTRAININGALL : `api/alarmtraining/Alarmdetail`,
ALARMTRAININGMODEL : `api/alarmtraining/AlarmTraning`,
ALARMTRAININGEMPNO : `api/alarmtraining/AlarmEmpNo`,

//Training record report
MODELREPORTTRAINING : `api/reportojt/Model`,
LINEREPORTTRAINING : `api/reportojt/Line`,
REPORTTRAININGMODEL : `api/reportojt/Reportojt`,

//Unpacking_sorting_QANumber
UNPACK_SORTING_QANUMBER: `api/Unpacking/Unpacking_sorting_QANumber`,
UNPACKMODEL: `api/Unpacking/Model`,
UNPACK_SORTING_MODEL: `api/Unpacking/Unpacking_sorting`,

};
export const key = {
  LOGIN_PASSED: `LOGIN_PASSED`,
  API_KEY: `API_KEY`,
  USER_LV: `USER_LV`,
  USER_NAME: "USER_NAME",
  USER_EMP: "USER_EMP",
  JWT_TOKEN: "JWT_TOKEN",
};
