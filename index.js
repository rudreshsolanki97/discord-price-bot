require("dotenv").config();
const Discord = require("discord.js");
const axios = require("axios");
const client = new Discord.Client();

let lastMessage = null;

const channelId = process.env.CHANNEL_ID;

function SetBotPrice() {
  axios
    .get("https://farmerapi.storx.io/get-asset-price")
    .then((data) => {
      if (data.data.status === 200) {
        const SRX = data.data.data.SRXUSDT;
        if (lastMessage) {
          lastMessage.guild.me.setNickname(`${SRX}`);
          console.log("set nick name,", data.data.data.SRXUSDT);
        }
      }
    })
    .catch((e) => {
      console.error(e);
    });
}

client.on("ready", () => {
  console.log("I am ready!");

  const channel = client.channels.cache.get(channelId);
  channel.messages
    .fetch({ limit: 1 })
    .then((messages) => {
      lastMessage = messages.first();
      SetBotPrice();
    })
    .catch(console.error);

  setInterval(SetBotPrice, 1 * 60 * 1000);
});

client.on("message", (message) => {
  lastMessage = message;
});

client.login(process.env.TOKEN);
