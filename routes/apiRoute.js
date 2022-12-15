const express = require("express");
const steamControllers = require("../controllers/steamControllers");

const router = express.Router();

router.get("/all-user-inventory/:steamId", steamControllers.allUserInventory);

// export router
module.exports = router;
