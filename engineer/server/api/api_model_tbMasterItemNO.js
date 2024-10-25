
const express = require("express");
const router = express.Router();
const user = require("../database/models/user");

router.get("/ModelGroup", async (req, res) => {
  
  try {
    let result = await user.sequelize.query(`SELECT distinct
    [ModelGroup]
FROM [Component_Master].[dbo].[tbMasterItemNo]
where [ModelGroup] !='ALL'
union select '**ALL**' 
order by [ModelGroup]
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
module.exports = router;