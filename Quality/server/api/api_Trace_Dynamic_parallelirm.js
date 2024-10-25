
const express = require("express");
const router = express.Router();
const user = require("../database/models/user");

router.get("/LINE", async (req, res) => {
  
  try {
    let result = await user.sequelize.query(`select distinct [Dynamic_Parallelism_Tester].Line as Line FROM [Temp_TransportData].[dbo].[Dynamic_Parallelism_Tester]
    where  Line != ''`);
    res.json({
      result: result[0],
      api_result: "ok",
    });
  } catch (error) {
    console.log(error);
    res.json({
      error,
      api_result: "nok",
    });
  }
});
router.get("/model/:process", async (req, res) => {
  const { process} = req.params;
  try {
    let result = await user.sequelize.query(`SELECT distinct [Model] as model FROM [Temp_TransportData].[dbo].[${process}] where Model !=''`);
    res.json({
      result: result[0],
      api_result: "ok",
    });
  } catch (error) {
    console.log(error);
    res.json({
      error,
      api_result: "nok",
    });
  }
});
router.get("/getline_model/:model/:process", async (req, res) => {
  const { model ,process} = req.params;
  try {
    let result = await user.sequelize.query(`SELECT distinct Line_IP as Line_1 FROM [Temp_TransportData].[dbo].[${process}] where  line!='D-4' and model='${model}' and line !=''`);
    res.json({
      result: result[0],
      api_result: "ok",
    });
  } catch (error) {
    console.log(error);
    res.json({
      error,
      api_result: "nok",
    });
  }
});

router.get("/process", async (req, res) => {
  
  try {
    let result = await user.sequelize.query(`
    SELECT  [lable_process] as process
    FROM [Web_I4].[dbo].[Table_Temp]
    where [use_lable]='yes';
    
     `);
    res.json({
      result: result[0],
      api_result: "ok",
    });
  } catch (error) {
    console.log(error);
    res.json({
      error,
      api_result: "nok",
    });
  }
});


router.get("/Master/:LINE/:startDate/:finishDate",
async (req, res) => {
  try {
    const { LINE,startDate,finishDate} = req.params;
  let result = await user.sequelize
    .query(`exec [Machine DownTime].[dbo].[trace_Dym] '${LINE}','${startDate}:00','${finishDate}:00'; `);

    var listRawData = [];
    listRawData.push(result[0]);
    res.json({
      result: result[0],
      listRawData,
      api_result: "ok",
    });
  } catch (error) {
    console.log(error);
    res.json({
      error,
      api_result: "nok",
    });
  }
});

router.get("/moter/:process/:model/:Line_1/:startDate/:finishDate",
async (req, res) => {
  //ที่ต้องทำ 2 เงื่อนไข เพราะ ใน oneday ไม่มี Table Dimension_WR
  try {
    const {startDate,finishDate, model,Line_1,process} = req.params;
    var line = Line_1.trim(); //trim คือการลบ spacebar ทั้งหน้าและหลัง


    if (process == "Dimension_WR") {
      var result = await user.sequelize.query(`
      SELECT *,'Temp_TransportData' as table_name
      FROM [Temp_TransportData].[dbo].[${process}]
      where Time between '${startDate}' and '${finishDate}'
      and model='${model}' and Line ='${line}'
      order by Time`);
    } else if (process == "He_Leak")
    {
      var result = await user.sequelize.query(`
        SELECT *,'Temp_TransportData' as table_name
        FROM [Temp_TransportData].[dbo].[He_Leak]
        where Time between '${startDate}' and '${finishDate}'
        and model='${model}' and [Line_IP] ='${line}'
        and Date != CONVERT(date, GETDATE())
        union all
        SELECT *, 'Oneday_ReadtimeData' as table_name
        FROM [Oneday_ReadtimeData].[dbo].[He_LeakK]
        where Date = CONVERT(date, GETDATE())
        and model='${model}' and [Line_IP] ='${line}'
        and Time between '${startDate}' and '${finishDate}'
        order by Time
        `);
    }
    else {
      var result = await user.sequelize.query(`
      
      SELECT *,'Temp_TransportData' as table_name
      FROM [Temp_TransportData].[dbo].[${process}]
      where Time between '${startDate}' and '${finishDate}'
      and model='${model}' and [Line_IP] ='${line}'
      and Date != CONVERT(date, GETDATE())
      union all
      SELECT *, 'Oneday_ReadtimeData' as table_name
      FROM [Oneday_ReadtimeData].[dbo].[${process}]
      where Date = CONVERT(date, GETDATE())
      and model='${model}' and [Line_IP] ='${line}'
      and Time between '${startDate}' and '${finishDate}'
      order by Time
      `);
    }

    var listRawData = [];
    listRawData.push(result[0]);
    res.json({
      result: result[0],
      listRawData,
      api_result: "ok",
    });
  } catch (error) {
    console.log(error);
    res.json({
      error,
      api_result: "nok",
    });
  }
});



module.exports = router;
