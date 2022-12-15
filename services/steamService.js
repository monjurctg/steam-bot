const SteamUser = require("steam-user");
const SteamTotp = require("steam-totp");
const TradeOfferManager = require("steam-tradeoffer-manager");

const SteamCommunity = require("steamcommunity");

const steamServices = {};
const client = new SteamUser();
const community = new SteamCommunity();
const manager = new TradeOfferManager({
  steam: client,
  community: community,
  language: "en",
});

steamServices.allUserInventory = (steamId) => {
  const offer = manager.createOffer(`${steamId}`);
  // for deposit
  manager.loadUserInventory(steamId, 730, 2, false, (err, theirInv) => {
    if (err) {
      console.log(err);
    } else {
      const theirItem = theirInv.find((item) => item.id == itemId);
      offer.addTheirItem(theirItem);
      offer.setMessage(`Will you trade your ${theirItem.name}`);
      // offer.send((err, status) => {
      //   if (err) {
      //     console.log(err.message);
      //   } else {
      //     console.log(`Sent offer. Status: ${status}.`);
      //   }
      // });
    }
  });
};

module.exports = steamServices;
