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
export const Url = "http://localhost:3000/"; //Port frontend
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
  //QAInspection
    MODELQA_URL: `api/QAInspection/model`,
    INSTYPE_URL: `api/QAInspection/insType`,
    REPORT_URL: `api/QAInspection/report`,
    REPORT2_URL: `api/QAInspection/report2`,

    //Rejection
    REJECTMODEL_URL: `api/Rejection/model`,
    REJECTTYPE_URL: `api/Rejection/insType`,
    REJECTBYMODEL_URL: `api/Rejection/RejectByModel`,
    REJECTBYQA_URL: `api/Rejection/RejectByQANO`,

    //mouthlyQA
    MODELMONTHLYQA_URL: `api/monthlyQA/model`,
    INSTYPEQA_URL: `api/monthlyQA/insType`,
    MONTHLYQA_URL: `api/monthlyQA/monthlyQA`,
    
    //Trace_back_function_test
    QPMBYLOTQA_URL : `api/QPM/lotQA`,
    QPMBYBARCODEMOTOR_URL : `api/QPM/barcodemotor`,

    LINE_TRACE_DYNAMIC_URL: `api/Trace_Dynamic/LINE`,
    GETLINE_TRACE_DYNAMIC_URL: `api/Trace_Dynamic/getline_model`,
    Trace_Dynamic_process_URL: `api/Trace_Dynamic/process`,
    Trace_Dynamic_model_URL: `api/Trace_Dynamic/model`,
    Trace_Dynamic_URL: `api/Trace_Dynamic/Master`,
    Trace_Dynamic_moter_URL: `api/Trace_Dynamic/moter`,

    //Daily_LAR_by_Model
    DEFECTYEAR_URL: `api/Daily_LAR_by_Model/year`,
    DEFECTMONTH_URL: `api/Daily_LAR_by_Model/Month`,
    DEFECTMODEL_URL: `api/Daily_LAR_by_Model/model`,
    DEFECTMTYPE_URL: `api/Daily_LAR_by_Model/insType`,
    DFFECTMLINE_URL: `api/Daily_LAR_by_Model/line`,
    DEFECTNG_URL: `api/Daily_LAR_by_Model/DefectNG`,
    DEFECPRODUCT_TYPE_URL: `api/Daily_LAR_by_Model/product_type`,
    
    //Monthly_LAR_report_all_Model
    LARYEAR_URL: `api/Monthly_LAR_report_all_Model/year`,
    LARMONTH_URL: `api/Monthly_LAR_report_all_Model/Month`,
    LAR_URL: `api/Monthly_LAR_report_all_Model/LARPP`,
    
    //Monthly LAR report by Model
    LARMODEL_URL: `api/Monthly_LAR_report_by_Model/model`,
    LARTYPE_URL: `api/Monthly_LAR_report_by_Model/insType`,
    LARYEAR_Month_URL: `api/Monthly_LAR_report_by_Model/year`,
    LARMONTHLY_URL: `api/Monthly_LAR_report_by_Model/LARMonth`,
    
    // Trace back shipment
    DODATABYLOTQA_URL : `api/QPM/dobylotqa`,
    DODATABYINVOID_URL : `api/QPM/dobyinvoid`,

    // Product hold control
    ModelHoldQA_URL: `api/Product_hold_control/model`,
    LINEQAHOLD_URL: `api/Product_hold_control/Line`,
    StatusQAHOLD_URL: `api/Product_hold_control/Status`,
    Access_byHOLD_URL: `api/Product_hold_control/Access_by`,
    QAHOLD_URL: `api/Product_hold_control/report2`,
    HOLDNUMBER_URL: `api/Product_hold_control/report3`,
    REPORTHOLD_URL: `api/Product_hold_control/report`,
    CHECKBOXALL_URL: `api/Product_hold_control/HOLDALL`,
    HOLDFORPC_URL: `api/Product_hold_control/HoldForpc`,
    // QA lots status
    MOVEMENTQA_URL: `api/QA_lots_status/QaNumberAll`, 
    RESULT_URL: `api/QA_lots_status/result`, 
    ITEMNOSMOVEMENT_URL: `api/QA_lots_status/ItemNos`, 

    // %NG Dashboard Monitoring
    percen_ng_URL: `api/percen_ng/LARPP`,

    //LAR_by_team
    GRAPH_LAR_BYTEAM_URL: `api/graph_LAR_byteam/output`, 
    GET_SUPPORT_URL: `api/graph_LAR_byteam/Support`, 
    GRAPH_DAILY_LAR_BY_TEAM_URL: `api/graph_LAR_byteam/output_daily`, 

    //Daily LAR Monitoring
    LARYEAR_UPDATE_URL: `api/LAR_BY_MODEL_UPDATE/year`,
    LARMONTH_UPDATE_URL: `api/LAR_BY_MODEL_UPDATE/Month`,
    LAR_UPDATE_URL: `api/LAR_BY_MODEL_UPDATE/LAR_UPDATE`,

    //graph_trendmaster//
PROCESS_TRENDMASTER_URL: `api/trend_master/Process`,
PARAMETER_TRENDMASTER_URL: `api/trend_master/Parameter`,
MODEL_TRENDMASTER_URL: `api/trend_master/model`,
LINE_TRENDMASTER_URL: `api/trend_master/Line`,
SERIAL_TRENDMASTER_URL: `api/trend_master/Serial`,
MACHINE_TRENDMASTER_URL: `api/trend_master/machine`,
FIXTURE_TRENDMASTER_URL: `api/trend_master/fixture`,
VALUE_Y_TRENDMASTER_URL: `api/trend_master/graph_trend_master`,


};
export const key = {
  LOGIN_PASSED: `LOGIN_PASSED`,
  API_KEY: `API_KEY`,
  USER_LV: `USER_LV`,
  USER_NAME: "USER_NAME",
  USER_EMP: "USER_EMP",
  JWT_TOKEN: "JWT_TOKEN",
};
