
const express = require("express");
const router = express.Router();
const user = require("../database/models/user");

router.get("/year", async (req, res) => {
  try {
    let result = await user.sequelize.query(`  select distinct year([InspectionDate]) as year
    FROM [QAInspection].[dbo].[tbVisualInspection]
    order by year([InspectionDate])`);
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
router.get("/Month", async (req, res) => {
  try {
    let result = await user.sequelize.query(`select distinct Month([InspectionDate]) as Month
      FROM [QAInspection].[dbo].[tbVisualInspection]
      order by Month([InspectionDate])`);
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
router.get("/Month", async (req, res) => {
  try {
    let result = await user.sequelize.query(`SELECT [EmpNo]
    where year([InspectionDate]) as year = '${year}'and Month([InspectionDate]) as Month='${Month}'
    FROM [QAInspection].[dbo].[tbEmpNameList]`);
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






router.get("/LARPP/:year/:Month",
  async (req, res) => {
    try {
      var result = [[]];
      const { year, Month } = req.params;
        var result = await user.sequelize
          .query(` with Lable1 as (select convert(nvarchar,[InspectionDate]) as Date,[QANumber], 
          [InspectionResult],CAST(count([InspectionResult]) AS FLOAT) AS ACCEPT
                   FROM [QAInspection].[dbo].[tbVisualInspection] 
            where  [Vis_Round]='1'and  [InspectionType]='MP' and  
            month([InspectionDate])='${Month}' and year([InspectionDate])='${year}'
            and [InspectionResult]='ACCEPT'
                    group by [InspectionDate],[QANumber],[InspectionResult])
    
      ,Lable2 as (select convert(nvarchar,[InspectionDate]) as Date,[QANumber], 
          [InspectionResult],CAST(count([InspectionResult]) AS FLOAT) AS REJECT
                   FROM [QAInspection].[dbo].[tbVisualInspection] 
            where  [Vis_Round]='1'and  [InspectionType]='MP' and  
            month([InspectionDate])='${Month}' and year([InspectionDate])='${year}'
            and [InspectionResult]='REJECT'
                    group by [InspectionDate],[QANumber],[InspectionResult])
    
      ,Lable3 as (
      select convert(nvarchar,[InspectionDate]) as Date,Visuual.[QANumber] as QANumber,[InspectionResult]
                   FROM [QAInspection].[dbo].[tbVisualInspection] as Visuual
            where  [Vis_Round]='1'and  [InspectionType]='MP' and  
            month([InspectionDate])='${Month}' and year([InspectionDate])='${year}')
    
      ,Lable4 as (
      select Lable3.Date,Lable3.[QANumber]
        ,case when Lable1.ACCEPT is null then 0 else Lable1.ACCEPT end as ACCEPT
      ,case when Lable2.REJECT is null then 0 else Lable2.REJECT end as REJECT,[SupporterName],[ModelName],[Line_No]
            from Lable3 left join Lable1 on Lable3.QANumber=Lable1.[QANumber]
            left join Lable2 on Lable2.[QANumber]=Lable3.[QANumber]
            left join [QAInspection].[dbo].[tbQANumber] on [QAInspection].[dbo].[tbQANumber].[QANumber]
            = Lable3.[QANumber]
            group by Lable3.Date,Lable3.[QANumber],Lable1.ACCEPT,Lable2.REJECT,[SupporterName],[ModelName],[Line_No]
            )
        ,final as (
        select [ModelName],'L'+[Line_No] as Line_No,[SupporterName],[ENEmpName],
                           sum(REJECT)+sum(ACCEPT) AS Input,
                           sum(ACCEPT) AS Output,
                           sum(REJECT) AS Reject,
                       CAST ((sum(ACCEPT)*100/(sum(ACCEPT)+sum(REJECT))) AS decimal(11,2)) AS LAR,
                           CAST ((sum(REJECT)*100/(sum(ACCEPT)+sum(REJECT))) AS decimal(11,2)) AS Reject_Percent
                 from Lable4
                 left join[QAInspection].[dbo].[tbEmpNameList] on [tbEmpNameList].[EmpNo]=Lable4.[SupporterName]
                 group by [SupporterName],[ENEmpName],[ModelName],[Line_No])
    
                 select * from final
                 where [ENEmpName]!='null'
                 --and [SupporterName]='g3182'
                 order by Reject_Percent
                  

`);
          var resultGraph = await user.sequelize
          .query(`with Lable1 as (select convert(nvarchar,[InspectionDate]) as Date,[QANumber], 
          [InspectionResult],CAST(count([InspectionResult]) AS FLOAT) AS ACCEPT
                   FROM [QAInspection].[dbo].[tbVisualInspection] 
            where  [Vis_Round]='1'and  [InspectionType]='MP' and  
            month([InspectionDate])='${Month}' and year([InspectionDate])='${year}'
            and [InspectionResult]='ACCEPT'
                    group by [InspectionDate],[QANumber],[InspectionResult])
    
      ,Lable2 as (select convert(nvarchar,[InspectionDate]) as Date,[QANumber], 
          [InspectionResult],CAST(count([InspectionResult]) AS FLOAT) AS REJECT
                   FROM [QAInspection].[dbo].[tbVisualInspection] 
            where  [Vis_Round]='1'and  [InspectionType]='MP' and  
            month([InspectionDate])='${Month}' and year([InspectionDate])='${year}'
            and [InspectionResult]='REJECT'
                    group by [InspectionDate],[QANumber],[InspectionResult])
    
      ,Lable3 as (
      select convert(nvarchar,[InspectionDate]) as Date,Visuual.[QANumber] as QANumber,[InspectionResult]
                   FROM [QAInspection].[dbo].[tbVisualInspection] as Visuual
            where  [Vis_Round]='1'and  [InspectionType]='MP' and  
            month([InspectionDate])='${Month}' and year([InspectionDate])='${year}')
    
      ,Lable4 as (
      select Lable3.Date,Lable3.[QANumber]
        ,case when Lable1.ACCEPT is null then 0 else Lable1.ACCEPT end as ACCEPT
      ,case when Lable2.REJECT is null then 0 else Lable2.REJECT end as REJECT,[SupporterName]
            from Lable3 left join Lable1 on Lable3.QANumber=Lable1.[QANumber]
            left join Lable2 on Lable2.[QANumber]=Lable3.[QANumber]
            left join [QAInspection].[dbo].[tbQANumber] on [QAInspection].[dbo].[tbQANumber].[QANumber]
            = Lable3.[QANumber]
            group by Lable3.Date,Lable3.[QANumber],Lable1.ACCEPT,Lable2.REJECT,[SupporterName]
            )
        ,final as (
        select [SupporterName],[ENEmpName],
                           sum(REJECT)+sum(ACCEPT) AS Input,
                           sum(ACCEPT) AS Output,
                           sum(REJECT) AS Reject,
                       CAST ((sum(ACCEPT)*100/(sum(ACCEPT)+sum(REJECT))) AS decimal(11,2)) AS LAR,
                           CAST ((sum(REJECT)*100/(sum(ACCEPT)+sum(REJECT))) AS decimal(11,2)) AS Reject_Percent
                 from Lable4
                 left join[QAInspection].[dbo].[tbEmpNameList] on [tbEmpNameList].[EmpNo]=Lable4.[SupporterName]
                 group by [SupporterName],[ENEmpName])
    
                 select * from final
                 where Input>100
                 order by Reject_Percent,Input desc`);

                           var resultGraph = await user.sequelize
          .query(`with Lable1 as (select convert(nvarchar,[InspectionDate]) as Date,[QANumber], 
          [InspectionResult],CAST(count([InspectionResult]) AS FLOAT) AS ACCEPT
                   FROM [QAInspection].[dbo].[tbVisualInspection] 
            where  [Vis_Round]='1'and  [InspectionType]='MP' and  
            month([InspectionDate])='${Month}' and year([InspectionDate])='${year}'
            and [InspectionResult]='ACCEPT'
                    group by [InspectionDate],[QANumber],[InspectionResult])
    
      ,Lable2 as (select convert(nvarchar,[InspectionDate]) as Date,[QANumber], 
          [InspectionResult],CAST(count([InspectionResult]) AS FLOAT) AS REJECT
                   FROM [QAInspection].[dbo].[tbVisualInspection] 
            where  [Vis_Round]='1'and  [InspectionType]='MP' and  
            month([InspectionDate])='${Month}' and year([InspectionDate])='${year}'
            and [InspectionResult]='REJECT'
                    group by [InspectionDate],[QANumber],[InspectionResult])
    
      ,Lable3 as (
      select convert(nvarchar,[InspectionDate]) as Date,Visuual.[QANumber] as QANumber,[InspectionResult]
                   FROM [QAInspection].[dbo].[tbVisualInspection] as Visuual
            where  [Vis_Round]='1'and  [InspectionType]='MP' and  
            month([InspectionDate])='${Month}' and year([InspectionDate])='${year}')
    
      ,Lable4 as (
      select Lable3.Date,Lable3.[QANumber]
        ,case when Lable1.ACCEPT is null then 0 else Lable1.ACCEPT end as ACCEPT
      ,case when Lable2.REJECT is null then 0 else Lable2.REJECT end as REJECT,[SupporterName]
            from Lable3 left join Lable1 on Lable3.QANumber=Lable1.[QANumber]
            left join Lable2 on Lable2.[QANumber]=Lable3.[QANumber]
            left join [QAInspection].[dbo].[tbQANumber] on [QAInspection].[dbo].[tbQANumber].[QANumber]
            = Lable3.[QANumber]
            group by Lable3.Date,Lable3.[QANumber],Lable1.ACCEPT,Lable2.REJECT,[SupporterName]
            )
        ,final as (
        select [SupporterName],[ENEmpName],
                           sum(REJECT)+sum(ACCEPT) AS Input,
                           sum(ACCEPT) AS Output,
                           sum(REJECT) AS Reject,
                       CAST ((sum(ACCEPT)*100/(sum(ACCEPT)+sum(REJECT))) AS decimal(11,2)) AS LAR,
                           CAST ((sum(REJECT)*100/(sum(ACCEPT)+sum(REJECT))) AS decimal(11,2)) AS Reject_Percent
                 from Lable4
                 left join[QAInspection].[dbo].[tbEmpNameList] on [tbEmpNameList].[EmpNo]=Lable4.[SupporterName]
                 group by [SupporterName],[ENEmpName])
    
                 select * from final
                 where Input>100
                 order by Reject_Percent,Input desc`);
          
    

                 let PivotTable = [];
                 let pivot_columns = Object.keys(resultGraph[0][0]).filter((key) => key !== 'SupporterName');
                 
               
                 for (let key in pivot_columns) {
                   let seriesData = resultGraph[0].map((item) => {
                     let value = item[pivot_columns[key]];
                     return value !== null ? value : 0;
                   });
                 
                   let seriesType = 'column'; // Default type is 'column'
                 
                   // Check if the series name is 'Output' or 'Target', and set the type to 'line' accordingly
                   if (pivot_columns[key] === 'Reject_Percent') {
                     seriesType = 'line';
                   }
                 
                   PivotTable.push({
                     name: pivot_columns[key],
                     type: seriesType,
                     data: seriesData,
                   });
                 }
                 
                 // Now PivotTable contains columns and lines based on the condition
                 console.log(PivotTable);

    


    var listRawData = [];
    listRawData.push(result[0]);
    res.json({
      result: result[0],
      resultGraph:resultGraph[0],
      listRawData,
      PivotTable: PivotTable,
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
