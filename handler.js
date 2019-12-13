"use strict";
const puppeteer = require("puppeteer");
const lookupPlate = require("./lookupPlate");

let browser;

module.exports.index = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.IS_LOCAL ? undefined : "/opt/headless_shell",
      args: ["--no-sandbox", "--disable-gpu", "--single-process"]
    });
  }

  if (!state || !number) {
    return {};
  }

  let tries = 0;
  let res = { error: "captcha error" };
  while (res.error == "captcha error" && tries < 10) {
    res = await lookupPlate(browser, event.state, event.number);
    tries++;
  }
  return res;
};
