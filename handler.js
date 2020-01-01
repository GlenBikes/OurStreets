"use strict";
const puppeteer = require("puppeteer");
const lookupPlate = require("./lookupPlate");
const Tesseract = require("tesseract.js");

let browser;

module.exports.index = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  if (!browser) {
    context.serverlessSdk.tagEvent("launch-browser");
    await context.serverlessSdk.span("launch-browser", async () => {
      browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.IS_LOCAL
          ? undefined
          : "/opt/headless_shell",
        args: ["--no-sandbox", "--disable-gpu", "--single-process"]
      });
    });
    await context.serverlessSdk.span("tesseract-regognize", async () => {
      await Tesseract.recognize("/var/task/preloadimg.png");
    });
  }

  if (!event.state || !event.number) {
    context.serverlessSdk.tagEvent("no-plate");
    return {};
  }
  context.serverlessSdk.tagEvent("lookup");

  let tries = 0;
  let res = { error: "captcha error" };
  while (res.error == "captcha error" && tries < 10) {
    res = await lookupPlate(browser, event.state, event.number, context);
    tries++;
  }
  return res;
};
