const fetch = require('fetch-cookie')(require('node-fetch'))
const { JSDOM } = require('jsdom')
const FormData = require('form-data');
 
class DsPaymentsLookup {
  constructor(url) {
    this.url = url;
  }
  async initialize() { }
  async lookup(state, number) {
    let resp = await fetch(this.url);
    let dom = new JSDOM(await resp.text());
    const csrfToken = dom.window.document.querySelector('[name=__RequestVerificationToken]').value;
    const body = new FormData();
    body.append('__RequestVerificationToken', csrfToken)
    body.append('SearchType', 'Citation')
    body.append('SearchTypeAccordian', 'Citation')
    body.append('CitationNumber', '')
    body.append('Plate', number)
    body.append('PlateStateProv', state.toUpperCase())
    body.append('submit', 'Search')
    resp = await fetch(this.url, {
      method: 'POST',
      body
    })
    dom = new JSDOM(await resp.text());
    const error = dom.window.document.querySelector('.alert_msg_error').textContent
    if (error) {
      throw Error(error)
    }

    const citationsElement = dom.window.document.querySelector('script:not(:empty)')
    const citations = JSON.parse(citationsElement.textContent.split(';')[0].split('=')[1]);
    return citations;
  }
}

module.exports = DsPaymentsLookup
