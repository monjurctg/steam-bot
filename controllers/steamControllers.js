const steamServices = require("../services/steamService");

const steamControllers = {};

// create a user

steamControllers.allUserInventory = (req, res) => {
  // do someting like db
  let steamId = req.params.steamId;
  console.log(steamId);

  try {
    const result = steamServices.allUserInventory(steamId);
    console.log(result);

    res.json({result: result});
    // res.status(200).json({success: true, data: result});
  } catch (err) {
    console.log(err);

    return res.status(500).json({success: false, message: err.message});
  }
};

// exports controller
module.exports = steamControllers;
