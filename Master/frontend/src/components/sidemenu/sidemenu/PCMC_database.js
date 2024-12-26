import React, { Component } from "react";
import { server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import moment from "moment";
import { Url } from "../../constants/index.js";
class Engineer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
    };
  }
  componentDidMount = async () => {
    try {
      let result = await httpClient.get(server.ENG_URL);
      console.log(result);
      this.setState({ data: result.data });
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle the error, e.g., set an error state or show a message
    }
  };

  render() {
    const { data } = this.state;
    const Url_1 = `${Url}`;
    // กรองข้อมูลที่ Details เท่ากับ 'Monitoring'
    const Traceability =
      data && data.api_PCMC
        ? data.api_PCMC.filter((item) => item.Details === "Traceability")
        : [];

    const Monitoring =
      data && data.api_PCMC
        ? data.api_PCMC.filter((item) => item.Details === "Monitoring")
        : [];
    const Report =
      data && data.api_PCMC
        ? data.api_PCMC.filter((item) => item.Details === "Report")
        : [];
    const Analysis_requester =
      data && data.api_PCMC
        ? data.api_PCMC.filter((item) => item.Details === "Analysis_requester")
        : [];

    if (!data) return <div>Loading...</div>;
    return (
      <div className="content-wrapper" style={{ border: "1px solid #e6f7ff" }}>
        <div className="content" style={{ paddingTop: 80 }}>
          {/* ... rest of your code ... */}

          <div className="row">
            <ol className="breadcrumb float-sm-right">
              <li className="breadcrumb-item">
                <a href="/Home">
                  <i className="fa fa-arrow-left"></i> Home
                </a>
              </li>
            </ol>
            <div className="col-md-12">
              <div
                className="card card-primary card-outline"
                style={{
                  width: "100",
                  height: "200%",
                  backgroundColor: "#e6f7ff",
                }}
              >
                <div className="col-sm-12">
                  <h2>Production</h2>
                  <div className="row">
                    <div className="col-md-6">
                      <div
                        className="card card-primary card-outline"
                        style={{
                          width: "100%",
                          height: "100%",
                          border: "2px solid #0073e6", // Set border color to a darker blue
                        }}
                      >
                        <div className="card-header">
                          <h3 className="card-title">
                            <h5>Traceability</h5>
                          </h3>
                        </div>

                        <div className="card-body">
                          {Traceability.map((item, index) => (
                            <React.Fragment key={index}>
                              <a href={`${Url_1}${item.path}`}>
                                {item.name}
                                {item.icon && (
                                  <img
                                    src={`${Url_1}${item.icon}`}
                                    alt={item.name}
                                    style={{
                                      marginLeft: "4px",
                                      verticalAlign: "middle",
                                    }}
                                  />
                                )}
                              </a>
                              <br /> {/* ขึ้นบรรทัดใหม่หลังจากแต่ละลิงก์ */}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div
                        className="card card-primary card-outline"
                        style={{
                          width: "100%",
                          height: "100%",
                          border: "2px solid #0073e6", // Set border color to a darker blue
                        }}
                      >
                        <div className="card-header">
                          <h3 className="card-title">
                            <h5>Monitoring</h5>
                          </h3>
                        </div>

                        <div className="card-body">
                          {Monitoring.map((item, index) => (
                            <React.Fragment key={index}>
                              <a href={`${Url_1}${item.path}`}>
                                {item.name}
                                {item.icon && (
                                  <img
                                    src={`${Url_1}${item.icon}`}
                                    alt={item.name}
                                    style={{
                                      marginLeft: "4px",
                                      verticalAlign: "middle",
                                    }}
                                  />
                                )}
                              </a>
                              <br /> {/* ขึ้นบรรทัดใหม่หลังจากแต่ละลิงก์ */}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6" style={{ paddingTop: 60 }}>
                      <div
                        className="card card-primary card-outline"
                        style={{
                          width: "100%",
                          height: "300%",
                          border: "2px solid #0073e6", // Set border color to a darker blue
                        }}
                      >
                        <div className="card-header">
                          <h3 className="card-title">
                            <h5>Report</h5>
                          </h3>
                        </div>

                        <div className="card-body">
                          {Report.map((item, index) => (
                            <React.Fragment key={index}>
                              <a href={`${Url_1}${item.path}`}>
                                {item.name}
                                {item.icon && (
                                  <img
                                    src={`${Url_1}${item.icon}`}
                                    alt={item.name}
                                    style={{
                                      marginLeft: "4px",
                                      verticalAlign: "middle",
                                    }}
                                  />
                                )}
                              </a>
                              <br /> {/* ขึ้นบรรทัดใหม่หลังจากแต่ละลิงก์ */}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6" style={{ paddingTop: 60 }}>
                      <div
                        className="card card-primary card-outline"
                        style={{
                          width: "100%",
                          height: "300%",
                          border: "2px solid #0073e6", // Set border color to a darker blue
                        }}
                      >
                        <div className="card-header">
                          <h3 className="card-title">
                            <h5>Analysis requester</h5>
                          </h3>
                        </div>
                        <div className="card-body">
                          {Analysis_requester.map((item, index) => (
                            <React.Fragment key={index}>
                              <a href={`${Url_1}${item.path}`}>
                                {item.name}
                                {item.icon && (
                                  <img
                                    src={`${Url_1}${item.icon}`}
                                    alt={item.name}
                                    style={{
                                      marginLeft: "4px",
                                      verticalAlign: "middle",
                                    }}
                                  />
                                )}
                              </a>
                              <br /> {/* ขึ้นบรรทัดใหม่หลังจากแต่ละลิงก์ */}
                            </React.Fragment>
                          ))}
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
    );
  }
}

export default Engineer;
