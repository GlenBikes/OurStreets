"use strict";
const puppeteer = require("puppeteer");
const lookupPlate = require("./lookupPlate");

module.exports.index = async (event, context) => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/opt/headless_shell",
    args: ["--no-sandbox", "--disable-gpu", "--single-process"]
  });

  return lookupPlate(browser, event.state, event.number);
};
