const soap = require("soap");

// The Seattle court web service to query citations.
// This could break at any time since they don't document its availability.
var url =
  "https://web6.seattle.gov/Courts/ECFPortal/JSONServices/ECFControlsService.asmx?wsdl";

class SeaLookup {
  async initialize() {
    if (this.client) return;
    this.client = await new Promise((resolve, reject) =>
      soap.createClient(url, (err, client) =>
        err ? reject(err) : resolve(client)
      )
    );
  }

  async lookup(state, number) {
    await this.initialize();
    const vehicleNumbers = await new Promise((resolve, reject) =>
      this.client.GetVehicleByPlate(
        { Plate: number, State: state },
        (err, result) =>
          err
            ? reject(err)
            : resolve(
                JSON.parse(JSON.parse(result.GetVehicleByPlateResult).Data)
              )
      )
    );
    const citations = [];
    const citationIds = new Set();
    for (const { VehicleNumber } of vehicleNumbers) {
      const vehicleCitations = await new Promise((resolve, reject) =>
        this.client.GetCitationsByVehicleNumber(
          { VehicleNumber },
          (err, result) =>
            err
              ? reject(err)
              : resolve(
                  JSON.parse(
                    JSON.parse(result.GetCitationsByVehicleNumberResult).Data
                  )
                )
        )
      );
      for (const citation of vehicleCitations) {
        if (!citationIds.has(citation.Citation)) {
          citationIds.add(citation.Citation);
          citations.push(citation);
        }
      }
    }
    return citations;
  }
}

module.exports = SeaLookup;
