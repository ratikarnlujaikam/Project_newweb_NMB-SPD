
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


router.get("/LARPP/:product_type/:year/:Month",
  async (req, res) => {
    try {
      var result = [[]];
      const { year, Month ,product_type} = req.params;
        var result = await user.sequelize
          .query(` DECLARE @sql NVARCHAR(MAX);
DECLARE @cols NVARCHAR(MAX);


WITH Numbers AS (
    SELECT TOP 31 ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS DayNumber
    FROM master.dbo.spt_values 
)
SELECT @cols = STRING_AGG(QUOTENAME(CONCAT('DAY', CAST(Numbers.DayNumber AS NVARCHAR))), ', ')
FROM Numbers
LEFT JOIN (
    SELECT DISTINCT DAY(InspectionDate) AS InspectionDay
    FROM [QAInspection].[dbo].[tbVisualInspection]
    WHERE MONTH([InspectionDate]) = ${Month} AND YEAR([InspectionDate]) = ${year}
) AS Days ON Numbers.DayNumber = Days.InspectionDay;


PRINT @cols;


-- Create the dynamic SQL query
SET @sql = '
WITH 

	Model_for_Product_type as (SELECT distinct [ModelShortName]
  FROM [Component_Master].[dbo].[tbMasterItemNo]
  where [Product_type]=''${product_type}'')

    ,Lable1 AS (
    SELECT
        CONVERT(NVARCHAR, [InspectionDate]) AS Date,
        [QANumber],
        [InspectionResult],
        CAST(COUNT([InspectionResult]) AS FLOAT) AS ACCEPT
    FROM
        [QAInspection].[dbo].[tbVisualInspection]
		inner join Model_for_Product_type
		on tbVisualInspection.Model_Name = Model_for_Product_type.ModelShortName
    WHERE
        [Vis_Round] = ''1'' AND
        [InspectionType] = ''MP'' AND
        MONTH([InspectionDate]) = ''${Month}'' AND
        YEAR([InspectionDate]) = ''${year}'' AND
        [InspectionResult] = ''ACCEPT''
    GROUP BY
        [InspectionDate], [QANumber], [InspectionResult]
),
Lable2 AS (
    SELECT
        CONVERT(NVARCHAR, [InspectionDate]) AS Date,
        [QANumber],
        [InspectionResult],
        CAST(COUNT([InspectionResult]) AS FLOAT) AS REJECT
    FROM
        [QAInspection].[dbo].[tbVisualInspection]
	inner join Model_for_Product_type
		on tbVisualInspection.Model_Name = Model_for_Product_type.ModelShortName
    WHERE
        [Vis_Round] = ''1'' AND
        [InspectionType] = ''MP'' AND
        MONTH([InspectionDate]) = ''${Month}'' AND
        YEAR([InspectionDate]) = ''${year}'' AND
        [InspectionResult] = ''REJECT''
    GROUP BY
        [InspectionDate], [QANumber], [InspectionResult]
),
Lable3 AS (
    SELECT
        CONVERT(NVARCHAR, [InspectionDate]) AS Date,
        Visuual.[QANumber] AS QANumber,
        [InspectionResult]
		,[Model_Name]+''_''+ Line as Model_Name

    FROM
        [QAInspection].[dbo].[tbVisualInspection] AS Visuual
		inner join Model_for_Product_type
		on Visuual.Model_Name = Model_for_Product_type.ModelShortName
    WHERE
        [Vis_Round] = ''1'' AND
        [InspectionType] = ''MP'' AND
        MONTH([InspectionDate]) = ''${Month}'' AND
        YEAR([InspectionDate]) = ''${year}''
)
,Lable4 AS (
    SELECT
        Lable3.Date,
        Lable3.[QANumber],
        CASE WHEN Lable1.ACCEPT IS NULL THEN 0 ELSE Lable1.ACCEPT END AS ACCEPT,
        CASE WHEN Lable2.REJECT IS NULL THEN 0 ELSE Lable2.REJECT END AS REJECT,
        Lable3.Model_Name
    FROM
        Lable3
    LEFT JOIN
        Lable1 ON Lable3.QANumber = Lable1.[QANumber]
    LEFT JOIN
        Lable2 ON Lable2.[QANumber] = Lable3.[QANumber]
    LEFT JOIN
        [QAInspection].[dbo].[tbQANumber] ON [QAInspection].[dbo].[tbQANumber].[QANumber] = Lable3.[QANumber]
    WHERE
        Lable3.Model_Name != ''NULL''
    GROUP BY
        Lable3.Date, Lable3.[QANumber], Lable1.ACCEPT, Lable2.REJECT, Lable3.Model_Name)

,total AS (
		select 
		[Model_Name],
		CAST ((sum(ACCEPT)*100/(sum(ACCEPT)+sum(REJECT))) AS decimal(11,2)) AS TOTAL
		FROM Lable4 
		GROUP BY [Model_Name]
		)
SELECT
    Model_Name, ' + @cols + ',TOTAL
FROM
    (SELECT
        Lable4.Model_Name,
		TOTAL,
        CONCAT(''DAY'', DAY(Date)) AS DAY,
        CAST((SUM(ACCEPT) * 100.0 / (SUM(ACCEPT) + SUM(REJECT))) AS DECIMAL(11, 2)) AS ACCEPT
    FROM
        Lable4 inner join total on Lable4.Model_Name = total.Model_Name
    GROUP BY
        Lable4.Model_Name, CONCAT(''DAY'', DAY(Date)),total.TOTAL
    ) AS SourceTable
PIVOT
    (sum(ACCEPT) FOR DAY IN (' + @cols + ')
    ) AS PivotTable
ORDER BY TOTAL;';
print(@sql)

-- Execute the dynamic SQL query
EXEC sp_executesql @sql;



	`);
          var resultGraph = await user.sequelize
          .query(`with Model_for_Product_type as (SELECT distinct [ModelShortName]
  FROM [Component_Master].[dbo].[tbMasterItemNo]
  where [Product_type]='${product_type}')
  ,A01 as (
               select convert(nvarchar,[InspectionDate]) as Date, [InspectionResult],CAST(count([InspectionResult]) AS FLOAT) AS RESULT_QTY
                  ,[Model_Name]+'_'+ Line as Model_Name
                                  FROM [QAInspection].[dbo].[tbVisualInspection]
                                  inner join Model_for_Product_type
		on tbVisualInspection.Model_Name = Model_for_Product_type.ModelShortName
                                  where  [Vis_Round]='1'
                             and  [InspectionType]='MP' and Month([InspectionDate])='${Month}' and year([InspectionDate])='${year}'
                                  group by [InspectionDate],[InspectionResult],[InspectionDate],[Model_Name],Line)
   
                          ,B01 as (
                            SELECT
                     case when ACCEPT is null then 0 else ACCEPT end as ACCEPT
                           ,case when REJECT is null then 0 else REJECT end as REJECT,Date,[Model_Name]
                                     FROM A01
                                     PIVOT (sum(RESULT_QTY)
                                     FOR [InspectionResult] IN (ACCEPT,REJECT))
                                     AS pvt
                                     group by ACCEPT,REJECT,date,[Model_Name]
                           )
   
                      select
                      [Model_Name],
                          sum(B01.ACCEPT)+sum(B01.REJECT) AS Input,
                          sum(B01.ACCEPT) AS Output,
                          sum(B01.REJECT) AS Reject,
                      CAST ((sum(B01.ACCEPT)*100/(sum(B01.ACCEPT)+sum(B01.REJECT))) AS decimal(11,2)) AS LAR,
                          CAST ((sum(B01.REJECT)*100/(sum(B01.ACCEPT)+sum(B01.REJECT))) AS decimal(11,2)) AS Reject_Percent
                       
                         from B01
                         group by [Model_Name]
                             order by LAR desc`);


    // แกน  y
   
    let LAR = [];
    let Input = [];
    let Reject=[];
    let Reject_Percent=[];
    resultGraph[0].forEach( (item) => {
      LAR.push(item.LAR);
      Input.push(item.Input);
      Reject.push(item.Reject);
      Reject_Percent.push(item.Reject_Percent);
    });
  
    // console.log(LAR);
    console.log(resultGraph[0]);
    console.log(LAR);
    console.log(Input);
    console.log(Reject);
    console.log(Reject_Percent);
    


    var listRawData = [];
    listRawData.push(result[0]);
    res.json({
      result: result[0],
      resultGraph: resultGraph[0],
      listRawData,
      LAR,
      Reject,
      Input,
      Reject_Percent,
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
