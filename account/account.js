module.exports = (RED) => {
  const Hubspot = require('hubspot')

  function node(config) {
    RED.nodes.createNode(this, config);

    this.hubspot = new Hubspot({
      apiKey: config.apikey,
    })
  }

  RED.nodes.registerType("hubspot-account", node);
}
