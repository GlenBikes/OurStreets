const fetch = require("node-fetch");

class NyLookup {
  async initialize() {}
  async lookup(state, number) {
    const resp = await fetch(
      `https://data.cityofnewyork.us/resource/uvbq-3m68.json?state=${state.toUpperCase()}&plate=${number.toUpperCase()}`
    );
    return await resp.json();
  }
}

module.exports = NyLookup;
