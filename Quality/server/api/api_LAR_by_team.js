const express = require("express");
const router = express.Router();
const user = require("../database/models/user");

router.get("/LAR_BY_TEAM_RESULT/:product_type/:startdate/:enddate",

  async (req, res) => {

    try {
        const {product_type,startdate,enddate} = req.params;

        let resultGraph = await user.sequelize.query(`
     DECLARE @SupporterNames NVARCHAR(MAX), @sql NVARCHAR(MAX);

-- ดึงค่า SupporterName ที่ไม่ซ้ำกันทั้งหมดเพื่อมาใช้ใน pivot
SELECT @SupporterNames = STRING_AGG(QUOTENAME(SupporterName), ', ')
FROM (SELECT DISTINCT SupporterName FROM [QAInspection].[dbo].[tbQANumber]
where  [tbQANumber].Date between'${startdate}' and '${enddate}') AS DistinctSupporterNames;

-- สร้างคำสั่ง SQL dynamic สำหรับ pivot
SET @sql = '
WITH split_product AS (
    SELECT DISTINCT ModelShortName
    FROM [Component_Master].[dbo].[tbMasterItemNo]
    WHERE [Product_type] = ''${product_type}''
),
tb_qanumbea AS (
    SELECT DISTINCT [QANumber], [Line_No], [SupporterName]
    FROM [QAInspection].[dbo].[tbQANumber]
)
,adjusted_inspections AS (
    SELECT
        [SupporterName],
        [InspectionResult],
        Line_No,
        CASE
            WHEN CAST([Time_VMI] AS TIME) BETWEEN ''00:00:00'' AND ''06:59:59''
                THEN DATEADD(day, -1, CAST([Time_VMI] AS DATE))
            ELSE CAST([Time_VMI] AS DATE)
        END AS adjusted_date
    FROM [QAInspection].[dbo].[tbVisualInspection]
    INNER JOIN split_product ON [tbVisualInspection].Model_Name = split_product.ModelShortName
    INNER JOIN tb_qanumbea ON [tbVisualInspection].QANumber = tb_qanumbea.QANumber
    WHERE [Vis_Round] = ''1''
)
,AA AS (
SELECT
    [SupporterName],
    [InspectionResult],
    CAST(COUNT([InspectionResult]) AS FLOAT) AS RESULT_QTY,
    Line_No
FROM adjusted_inspections
WHERE adjusted_date   BETWEEN ''${startdate}'' AND ''${enddate}''
GROUP BY [SupporterName], [InspectionResult], Line_No)

,BB AS (
    SELECT 
        [SupporterName],
        Line_No,
        COALESCE(ACCEPT, 0) AS ACCEPT,
        COALESCE(REJECT, 0) AS REJECT
    FROM AA
    PIVOT (
        SUM(RESULT_QTY)
        FOR [InspectionResult] IN (ACCEPT, REJECT)
    ) AS pvt
)
SELECT *
FROM (
    SELECT 
        SupporterName,
        Line_No,
        CAST((ACCEPT * 100.0 / (ACCEPT + REJECT)) AS decimal(11, 2)) AS LAR_Percent
    FROM BB
) AS SourceTable
PIVOT (
    SUM(LAR_Percent)
    FOR SupporterName IN (' + @SupporterNames + ')
) AS PivotTable
ORDER BY  Line_No;
';

-- รันคำสั่ง dynamic SQL
EXEC sp_executesql @sql;
`)

let PivotTable = [];
let xAxis = resultGraph[0].map((item) => item.Line_No);

let pivot_columns = Object.keys(resultGraph[0][0]).filter(
  (key) => key !== "Line_No"
);

for (let key in pivot_columns) {
  let series = resultGraph[0].map((item) => {
    let value = item[pivot_columns[key]];
    return value !== null ? value : 0;
  });

  // Check if there is at least one non-zero value in the series
  if (series.some((value) => value !== 0)) {
    PivotTable.push({
      name: pivot_columns[key],
      type: "column",
      data: series,
    });
  }}

      res.json({
        resultGraph: resultGraph[0],
        xAxis,
        PivotTable: PivotTable.map((series) => ({
            name: series.name,
            type: series.type,
            data: series.data,
        })),

            api_result: "ok"
        });
    } catch (error) {
      res.json({
        error,
        api_result: "nok",
      });
    }
  }
);
module.exports = router;

