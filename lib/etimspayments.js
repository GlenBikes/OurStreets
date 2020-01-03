const fs = require("fs");
const puppeteer = require("puppeteer");
const Tesseract = require("tesseract.js");

const screenshotDOMElement = require("./util/screenshotDOMElement.js");

class EtimspaymentsLookup {
  constructor(url, browser) {
    this.url = url;
    this.browser = browser;
  }
  async initialize() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-gpu", "--single-process"]
      });
    }
  }
  async lookup(state, number) {
    // initialize
    await this.initialize();

    // create load payments page
    const page = await this.browser.newPage();
    await page.setViewport({ height: 768, width: 1024 });
    await page.goto(this.url, {
      waitUntil: ["domcontentloaded", "networkidle0"]
    });

    // Enter license plate number
    await page.type("[name=plateNumber]", number);

    // Set state
    await page.evaluate(state => {
      document.querySelector("[name=statePlate]").value = state;
    }, state);

    // solve the captcha >:D
    await screenshotDOMElement(page, {
      path: "/tmp/captcha.png",
      selector: "#captcha",
      padding: 4
    });
    const { text } = await Tesseract.recognize("/tmp/captcha.png");
    const captcha = text.replace(/\D/g, "");
    await page.type("[name=captchaSText]", captcha);
    fs.unlinkSync("/tmp/captcha.png");

    // avoid to timeout waitForNavigation() after click()
    await Promise.all([page.waitForNavigation(), page.keyboard.press("Enter")]);

    // parse the results
    const error = await page.evaluate(() => {
      if (document.querySelector("[name=selectForm]") === null) {
        return (
          document.querySelector(".error") &&
          document.querySelector(".error").textContent
        );
      }
    });
    if (error && error.match && error.match(/Please enter the characters/)) {
      throw Error("captcha error");
    } else if (error) {
      throw Error(error);
    }

    const total = await page.evaluate(() => {
      const totalInput = document.querySelector("input[name=totalAmount]");
      if (totalInput) {
        return totalInput.value.replace("$", "");
      }
      return Number(
        document
          .querySelector("[name=selectForm]")
          .textContent.match(
            /(The total of all your citations and fees is:|You have a total of \d+\sticket\(s\) on your account in the amount of) \$(\d+\.\d+)/
          )[2]
      );
    });

    const html = await page.evaluate(() => document.body.innerHTML);
    const [tickets, booted] = await page.evaluate(() => {
      const tickets = [];
      if (document.querySelector("li.error")) {
        for (const row of document.querySelectorAll(
          'table[width="770"][cellpadding="2"][cellspacing="0"][border="0"] tr + tr + tr ~ tr'
        )) {
          tickets.push(
            Array.from(
              row.querySelectorAll(
                ":not(:first-child):not(:nth-child(6)):not(:nth-child(7))"
              )
            ).map(el => el.textContent)
          );
        }
      } else {
        for (const row of document.querySelectorAll(
          'table[width="100%"][cellpadding="2"][cellspacing="0"][border="0"] table tbody tr:not(:first-child)'
        )) {
          if (row.children.length !== 5) continue;
          tickets.push(Array.from(row.children).map(el => el.textContent));
        }
      }
      return [tickets, Boolean(document.querySelector("li.error"))];
    });

    return { total, tickets, booted };
  }
}

module.exports = EtimspaymentsLookup;
