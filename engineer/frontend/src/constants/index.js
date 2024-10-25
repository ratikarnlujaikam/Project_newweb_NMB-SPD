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




// export const apiUrl = "http://localhost:2010/"; //localhost port 2010
// export const apiUrlhome = "http://192.168.101.120:2031/"; //localhost port 2010
// export const Url = "http://localhost:3000/"; //Port frontend
// export const apiUrl_python = "http://192.168.101.120:2028/"; //deploy บางปะอิน 

// SPD 
// export const apiUrl = "http://192.168.101.120:2026/"; //deploy บางปะอิน 
// export const apiUrlhome = "http://192.168.101.120:2031/"; //localhost port 2010
// export const Url = "http://192.168.101.120:2027/"; //deploy บางปะอิน 
// export const apiUrl_python = "http://192.168.101.120:2028/"; //deploy บางปะอิน 

//nmb 
// export const apiUrl = "http://10.120.122.28:2016/"; //deploy บางปะอิน 
// export const Url = "http://10.120.122.28:2017/"; //deploy บางปะอิน 
// export const apiUrl_python = "http://10.120.122.28:2012/"; //deploy บางปะอิน 


export const apiUrl = "http://192.168.101.120:2033/"; //Backend of javascript
export const apiUrlhome = "http://192.168.101.120:2031/"; //localhost port 2010
export const Url = "http://192.168.101.120:2032/"; //frontend
export const apiUrl_python = "http://192.168.101.120:2028/"; //Frontend of backpython

export const server = {
//Master ItemNO
MASTERGROUP_URL: `api/MasterItemNO/ModelGroup`,
MASTERITEMNO_URL: `api/MasterItemNO/ItemNo`,
MASTER_URL: `api/MasterItemNO/Master`,
//Master Supplier
MASTERSUPPLIER_URL: `api/MasterSupplier/Supplier`,
MASTERMODELGROUP_URL: `api/MasterSupplier/ModelGroup`,
MASTERSUP_URL: `api/MasterSupplier/Master`,
//Master Line
GROUP_URL: `api/Masterline/ModelGroup`,
LINE_URL: `api/Masterline/Line`,
MASTERLINE_URL: `api/Masterline/Masterline`,

//side_manu
DROPDOWN_DIVISION_URL: `api/side_menu/dropdown_Division`,
INSERT_SIDEMENU_URL: `api/side_menu/api_insert_sidemenu`,
ENG_URL: `api/side_menu/Engineer`,

//Loging_ML
UPDATE_Master_URL: `api/Master_ML/update`,
LOGIN_api_Master_ML_URL: `api/Master_ML/login`,
REGISTER_Master_ML_URL: `api/Master_ML/register`,
//master_ml
MODELMasterURL: `api/Master_ML/model`,
Process_URL: `api/Master_ML/Process`,
parameter_URL: `api/Master_ML/Parameter`,
no_parameter_URL: `api/Master_ML/no_parameter`,
INSERT_Master_URL: `api/Master_ML/INSERT_Master`,
REPORT_Master_ML_URL: `api/Master_ML/report`,

//Report_printlable
CODE_AS_400_Component_name__URL: `api/code_AS400/model`,
CODE_AS_400_Vendor_Name_URL: `api/code_AS400/Line`,
CODE_AS_400_URL: `api/code_AS400/confirm`,
CODE_AS400_URL: `api/code_AS400/report`,
};
export const key = {
  LOGIN_PASSED: `LOGIN_PASSED`,
  API_KEY: `API_KEY`,
  USER_LV: `USER_LV`,
  USER_NAME: "USER_NAME",
  USER_EMP: "USER_EMP",
  JWT_TOKEN: "JWT_TOKEN",
};
