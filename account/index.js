module.exports = (RED) => {
  const hubspot = require('@hubspot/api-client')

  function node(config) {
    RED.nodes.createNode(this, config);

    this.hubspot = new hubspot.Client({
      apiKey: config.apikey ? config.apikey : undefined,
      accessToken: config.accessToken ? config.accessToken : undefined,
      developerApiKey: config.developerApiKey ? config.developerApiKey : undefined,
    })
  }

  RED.nodes.registerType("hubspot-account", node);
}
