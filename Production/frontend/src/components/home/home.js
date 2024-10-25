import React, { Component } from "react";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      xAxis: [],
      yAxis: [],
      yAxis2: [],

    };
    this.state = {
      userLocation: null,
    };
  }

  render() {
    return (
      <>
        <div className="content-wrapper" style={{ paddingTop: 80 }}>
          <h1>Products</h1>
          <h2>Spindle Motor for HDDs</h2>
         
          
          <div
            className="content"
            style={{
              paddingTop: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div className="row">
              <div className="border-full-bottom">
                <div className="D-3 M-12 D-right-9 M-left-0 no-gap">
                  <div className="title-section title-inside"></div>
                </div>
              </div>
            </div>


            {/* เพิ่มรูปภาพด้านล่างนี้ */}
            <img
              src="Gallery-Bangpain8.jpg"
              width="1200" // กำหนดความกว้าง
              height="650" // กำหนดความสูง
              style={{ alignSelf: "center" }} // จัดรูปภาพให้อยู่ตรงกลาง
            />
          </div>
        </div>
      

      </>
    );
  }
}
export default Home;
