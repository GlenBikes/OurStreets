const fs = require("fs");
const Tesseract = require("tesseract.js");

const screenshotDOMElement = require("./screenshotDOMElement.js");

module.exports = async (browser, state = "DC", number = "ey9285", context) => {
  let page;
  await context.serverlessSdk.span("new-page", async () => {
    page = await browser.newPage();
  });
  await page.setViewport({ height: 768, width: 1024 });
  await context.serverlessSdk.span("goto", async () => {
    await page.goto(
      "https://prodpci.etimspayments.com/pbw/include/dc_parking/input.jsp",
      { waitUntil: ["domcontentloaded", "networkidle0"] }
    );
  });

  await context.serverlessSdk.span("enter-plate", async () => {
    try {
      // Enter license plate number
      await page.type("[name=plateNumber]", number);

      // Set state
      await page.evaluate(state => {
        document.querySelector("[name=statePlate]").value = state;
      }, state);
    } catch (e) {
      return {
        error:
          "error filling in form, maybe it's down? https://prodpci.etimspayments.com/pbw/include/dc_parking/input.jsp cc @schep_"
      };
    }
  });

  // solve the captcha >:D
  await context.serverlessSdk.span("solve-captcha", async () => {
    await screenshotDOMElement(page, {
      path: "/tmp/captcha.png",
      selector: "#captcha",
      padding: 4
    });
    let text;
    await context.serverlessSdk.span("solve-captcha.tesseract", async () => {
      ({ text } = await Tesseract.recognize("/tmp/captcha.png"));
    });
    const captcha = text.replace(/\D/g, "");
    await page.type("[name=captchaSText]", captcha);
    fs.unlinkSync("/tmp/captcha.png");
  });

  // avoid to timeout waitForNavigation() after click()
  await context.serverlessSdk.span("submit-form", async () => {
    await Promise.all([page.waitForNavigation(), page.keyboard.press("Enter")]);
  });

  let total, tickets;
  await context.serverlessSdk.span("parse-results", async () => {
    const error = await page.evaluate(() => {
      if (document.querySelector("[name=selectForm]") === null) {
        return (
          document.querySelector(".error") &&
          document.querySelector(".error").textContent
        );
      }
    });
    if (error && error.match && error.match(/Please enter the characters/)) {
      return { error: "captcha error" };
    } else if (error) {
      return { error };
    }

    total = await page.evaluate(() => {
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
    tickets = await page.evaluate(() => {
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
      return tickets;
    });
  });

  return { total, tickets };
};
