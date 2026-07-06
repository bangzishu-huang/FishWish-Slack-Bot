const axios = require("axios");

require("dotenv").config();

const { App } = require("@slack/bolt");
const { act } = require("react");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});


// ping
app.command("/fishwish-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();


// facts
app.command("/fishwish-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});


// gifs
app.command("/fishwish-catgif", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://cataas.com/cat/gif",{
        headers: {Accept: "application/json"}
    });
    
    const catData = response.data;
    const catGifUrl = catData.url

    await respond({
      blocks: [
        {
          type: "image",
          image_url: catGifUrl,
          alt_text: "A random cat gif"
        }
      ]
    });

  } catch (err) {
    console.log("Full error:", err.message);
    console.log("Error response data:", err.response?.data);
    console.log("Error response status:", err.response?.status);
    await respond({ text: "Failed to fetch a cat gif." });
  }
});


app.command("/fishwish-catpic", async({ ack, respond }) => {
  await ack();
    try {
      const response = await axios.get("https://cataas.com/cat");
      await respond({ text: `Cat Picture:\n${response.data.fact}` });
    } catch (err) {
      await respond({ text: "Failed to fetch a cat fact." });
  }
});

// format

// app.command("/command-name", async ({ ack, respond }) => {
//   // your code here
// });
