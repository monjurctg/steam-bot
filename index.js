const express = require("express");
const cors = require("cors");

const SteamUser = require("steam-user");
const SteamTotp = require("steam-totp");
const TradeOfferManager = require("steam-tradeoffer-manager");

const SteamCommunity = require("steamcommunity");

const config = require("./config.json");
const app = express();

app.use(cors());
// app.use(json());

const port = 5000;

// const {json} = require("express");

const client = new SteamUser();
const community = new SteamCommunity();
const manager = new TradeOfferManager({
  steam: client,
  community: community,
  language: "en",
});

const logOnOptions = {
  accountName: config.username,
  password: config.password,
  twoFactorCode: SteamTotp.generateAuthCode(config.sharedSecret),
};

try {
  client.logOn(logOnOptions);

  client.on("loggedOn", () => {
    console.log("Logged into Steam");
    client.setPersona(SteamUser.EPersonaState.Online, " monjurul alam ");
    client.gamesPlayed(730);
  });

  client.on("webSession", (sessionid, cookies) => {
    manager.setCookies(cookies);
    community.setCookies(cookies);
    community.startConfirmationChecker(10000, config.idSecret);
    sendRandomItem();
  });
} catch (err) {
  console.log(err);
}
// manager.on("newOffer", (offer) => {
//   if (offer.partner.getSteamID64() === "132224795&token=HuEE9Mk1") {
//     offer.accept((err, status) => {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log(`Accepted offer. Status: ${status}.`);
//       }
//     });
//   } else {
//     offer.decline((err) => {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log("Canceled offer from scammer.");
//       }
//     });
//   }
// });

// load inventory end point send all inventory

app.get("/deposit", (req, res) => {
  const partner = req.query.partner;
  const itemId = req.query.itemId;
  const appid = 730;
  const contextid = 2;
  console.log(partner);

  if (!partner) {
    res.status(500).json({succes: false, message: "steam Id is required"});
  } else if (!itemId) {
    res.status(500).json({succes: false, message: "itemId is required"});
  }

  //  "https://steamcommunity.com/tradeoffer/new/?partner=1216619463&token=dXPBgZ6U"
  const offer = manager.createOffer(`${partner}`);
  // for deposit
  manager.loadUserInventory(
    partner,
    appid,
    contextid,
    false,
    (err, theirInv) => {
      // console.log(theirInv, "injskdjksdjskdjksjdksjdkv");

      if (err) {
        console.log(err);
        res.status(500).json({succes: false, message: err.message});
      } else {
        const theirItem = theirInv.find((item) => item.id == itemId);
        res.json({data: theirItem});
        // theirInv[Math.floor(Math.random() * theirInv.length - 1)];
        // offer.addTheirItem(theirItem);
        // offer.setMessage(`Will you trade your ${theirItem.name}`);
        // offer.send((err, status) => {
        //   if (err) {
        //     console.log(err.message);
        //   } else {
        //     console.log(`Sent offer. Status: ${status}.`);
        //   }
        // });
      }
    }
  );

  // manager.loadInventory(appid, contextid, true, (err, myInv) => {
  //   // console.log("load inventory");
  //   // console.log(myInv);
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     const myItem = myInv.find((item) => item.classid == itemId);
  //     // const myItem = myInv[Math.floor(Math.random() * myInv.length - 1)];
  //     // console.log(myItem, "item");
  //     offer.addMyItem(myItem);
  //     manager.loadUserInventory(
  //       partner,
  //       appid,
  //       contextid,
  //       false,
  //       (err, theirInv) => {
  //         console.log(theirInv, "injskdjksdjskdjksjdksjdkv");

  //         if (err) {
  //           console.log(err);
  //         } else {
  //           const theirItem =
  //             theirInv[Math.floor(Math.random() * theirInv.length - 1)];
  //           offer.addTheirItem(theirItem);
  //           offer.setMessage(
  //             `Will you trade your ${theirItem.name} for my ${myItem.name}?`
  //           );
  //           offer.send((err, status) => {
  //             if (err) {
  //               console.log(err.message);
  //             } else {
  //               console.log(`Sent offer. Status: ${status}.`);
  //             }
  //           });
  //         }
  //       }
  //     );
  //   }
  // });
});

app.get("/withdraw", (req, res) => {
  const partner = req.query.partner;
  const itemId = req.query.itemId;
  const appid = 730;
  const contextid = 2;
  console.log(partner);

  if (!partner) {
    res.status(500).json({succes: false, message: "steam Id is required"});
  } else if (!itemId) {
    res.status(500).json({succes: false, message: "itemId is required"});
  }

  //  "https://steamcommunity.com/tradeoffer/new/?partner=1216619463&token=dXPBgZ6U"
  const offer = manager.createOffer(`${partner}`);
  // for deposit
  manager.loadInventory(appid, contextid, true, (err, myInv) => {
    // console.log(theirInv, "injskdjksdjskdjksjdksjdkv");

    if (err) {
      console.log(err);
      res.status(500).json({succes: false, message: err.message});
    } else {
      const myItem = myInv.find((item) => item.id == itemId);
      console.log(myItem, "myItem");

      offer.addMyItem(myItem);
      // theirInv[Math.floor(Math.random() * theirInv.length - 1)];
      // offer.addTheirItem(theirItem);
      offer.setMessage(`Will you withdraw your ${myItem.name}`);
      offer.send((err, status) => {
        if (err) {
          console.log(err);
          res.status(500).json({success: false, message: err.message});
        } else {
          console.log(`Sent offer. Status: ${status}.`);
          res.status(500).json({success: true, status: status});
        }
      });
    }
  });

  // manager.loadInventory(appid, contextid, true, (err, myInv) => {
  //   // console.log("load inventory");
  //   // console.log(myInv);
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     const myItem = myInv.find((item) => item.classid == itemId);
  //     // const myItem = myInv[Math.floor(Math.random() * myInv.length - 1)];
  //     // console.log(myItem, "item");
  //     offer.addMyItem(myItem);
  //     manager.loadUserInventory(
  //       partner,
  //       appid,
  //       contextid,
  //       false,
  //       (err, theirInv) => {
  //         console.log(theirInv, "injskdjksdjskdjksjdksjdkv");

  //         if (err) {
  //           console.log(err);
  //         } else {
  //           const theirItem =
  //             theirInv[Math.floor(Math.random() * theirInv.length - 1)];
  //           offer.addTheirItem(theirItem);
  //           offer.setMessage(
  //             `Will you trade your ${theirItem.name} for my ${myItem.name}?`
  //           );
  //           offer.send((err, status) => {
  //             if (err) {
  //               console.log(err.message);
  //             } else {
  //               console.log(`Sent offer. Status: ${status}.`);
  //             }
  //           });
  //         }
  //       }
  //     );
  //   }
  // });
});

app.get("/all-user-inventory/:steamId", (req, res) => {
  const steamId = req.params.steamId;
  const appid = 730;
  const contextid = 2;
  manager.loadUserInventory(
    steamId,
    appid,
    contextid,
    false,
    (err, theirInv) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json({success: true, data: theirInv});
      }
    }
  );
});

app.get("/my-inventory", (req, res) => {
  // const steamId = req.params.steamId;
  const appid = 730;
  const contextid = 2;

  manager.loadInventory(appid, contextid, true, (err, myInventory) => {
    if (err) {
      console.log(err);
      res.status(500).json({success: false, message: err.message});
    } else {
      res.status(200).json({success: true, data: myInventory});
    }
  });
});
app.get("/", (req, res) => {
  res.status(200).json({message: "app run successfully"});
});

app.listen(port, () => {
  console.log("App running in port", port);
});
