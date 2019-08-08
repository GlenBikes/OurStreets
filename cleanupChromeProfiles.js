const fs = require("fs");
const glob = require("glob");

const cleanupChromeProfiles = () => {
  console.log("all files:", glob.sync("/tmp/*"));
  glob.sync("/tmp/core.headless_shell*").map(f => fs.unlinkSync(f));
};

module.exports = cleanupChromeProfiles;
