"use strict";
const puppeteer = require("puppeteer");
const lookupPlate = require("./lookupPlate");

module.exports.index = async (event, context) => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/opt/headless_shell",
    args: ["--no-sandbox", "--disable-gpu", "--single-process"]
  });

  let tries = 0;
  let res = { error: "captcha error" };
  while (res.error == "captcha error" && tries < 10) {
    res = await lookupPlate(browser, event.state, event.number);
    tries++;
  }
  return res;
};
