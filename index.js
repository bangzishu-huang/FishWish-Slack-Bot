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
  await respond({ text: `The fish has a ping of: ${latency}ms` });
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


// picture
app.command("/fishwish-catpic", async({ ack, respond }) => {
  await ack()

  try {
    await respond({
      blocks: [
        {
          type: "image",
          image_url: `https://cataas.com/cat?ts=${Date.now()}`,       
          alt_text: "A random cat pic"
        }
      ]
    });
  } catch (err) {
      console.log("Full error:", err.message);
      console.log("Error response data:", err.response?.data);
      console.log("Error response status:", err.response?.status);
      await respond({ text: "Failed to fetch a cat pic." });
  }
});


// greeting
app.command("/fishwish-greet", async({ ack, respond }) => {
  await ack()

  try {
    await respond({
      blocks: [
        {
          type: "image",
          image_url: `https://cataas.com/cat/says/Wassuppp?ts=${Date.now()}`,       
          alt_text: "A random cat greeting"
        }
      ]
    });
  } catch (err) {
      await respond({ text: "Failed to fetch a cat greeting." });
  }
});



// filter
app.command("/fishwish-catfilter", async({ ack, respond }) => {
  await ack()

  const brightness = Math.floor(Math.random() * 4) + 1;
  const lightness = Math.floor(Math.random() * 11) - 5;
  const saturation = Math.floor(Math.random() * 11);
  const hue = Math.floor(Math.random() * 16) - 15;

  const imageUrl = `https://cataas.com/cat?filter=custom` +
  `&brightness=${brightness}`+
  `&lightness=${lightness}`+
  `&saturation=${saturation}`+
  `&hue=${hue}`+
  `&ts=${Date.now()}`;

  console.log(imageUrl);

  try {
    await respond({
      blocks: [
        {
          type: "image",
          image_url: imageUrl,
          alt_text: "A random cat pic with filter"
        }
      ]
    });
  } catch (err) {
      await respond({ text: "Failed to fetch a cat filter." });
  }
});


// help
app.command("/fishwish-help", async ({ ack, respond }) => {
  await ack();

  try {
    await respond({ text: `Thank you for using FishWish! Below are the commands for FishWish:
      \n
      \n/fishwish-ping: See the fish's ping
      \n/fishwish-catfact: Some neat cat facts to know
      \n/fishwish-catgif: A cat gif from your imaginations
      \n/fishwish-catpic: Cat pictures to see
      \n/fishwish-catfilter: Apply random filter on a cat image
      \n/fishwish-greet: Greetings sent from our fellow cats
      \n/fishwish-help: Uhhh, well you just did it` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});