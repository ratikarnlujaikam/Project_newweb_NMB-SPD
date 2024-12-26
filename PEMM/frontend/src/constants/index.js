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


//Missing part 
MISSING_PART_URL: `api/missing_part`,
MISSING_PART_GETCOMPONENT: `api/missing_part/component`,
MISSING_PART_GETLINE: `api/missing_part/line`,


percen_error_URL: `api/percen_error/LARPP`,
percen_Downtime_URL: `api/percen_Downtime/LARPP`,

// DOWNRIME_IMPORT_URL 
IMPORTMENT_DOWNTIME_PART_URL: `api/importment_downtime/`,

//Downtime
DOWNTIME_URL: `api/downtime`,
DOWNTIME_GETPROCESS: `api/downtime/process`,
DOWNTIME_GETLINE: `api/downtime/line`,

    //MC_Error
    ERRORTable_URL: `api/MC_Error/Table`,
    MC_ERROR_Line_URL: `api/MC_Error/Line`,
    MC_ERROR_URL: `api/MC_Error/MC_ERROR`,
    MC_ERROR_NG_URL: `api/MC_Error/MC_ERROR_where_NG`,

    MONTH_ERRORTable_URL: `api/MC_Error_Month/Table`,
    MONTH_MC_ERROR_Line_URL: `api/MC_Error_Month/Line`,
    MONTH_MC_ERROR_MONTH_URL: `api/MC_Error_Month/month_Error`,
    MONTH_MC_ERROR_Year_URL: `api/MC_Error_Month/year_Error`,
    MONTH_MC_ERROR_URL: `api/MC_Error_Month/MC_ERROR`,
    MONTH_MC_ERROR_NG_URL: `api/MC_Error_Month/MC_ERROR_NG`,

};
export const key = {
  LOGIN_PASSED: `LOGIN_PASSED`,
  API_KEY: `API_KEY`,
  USER_LV: `USER_LV`,
  USER_NAME: "USER_NAME",
  USER_EMP: "USER_EMP",
  JWT_TOKEN: "JWT_TOKEN",
};
