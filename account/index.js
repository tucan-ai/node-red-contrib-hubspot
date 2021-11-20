module.exports = (RED) => {
  const hubspot = require('@hubspot/api-client')

  function node(config) {
    RED.nodes.createNode(this, config);

    this.hubspot = new hubspot.Client({
      apiKey: config.apikey,
    })
  }

  RED.nodes.registerType("hubspot-account", node);
}
