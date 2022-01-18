const {showErrorAndFinish} = require("../utils/build.hubspot.error")
const onInput = (node, config) => async (msg, send, done) => {
  const hubspot = await node.getHubspotWrapper()

  if (!hubspot) {
    showErrorAndFinish("hubspot account missing", node, done);
    return
  }

  if (!config.method || !config.path) {
    showErrorAndFinish("method and path must be defined!", node, done);

    return
  }

  let body = null

  if (config.body === 'payload') {
    body = msg.payload
  }

  try {
    msg[String(config.output || 'payload')] = (await hubspot.apiRequest({
      method: config.method,
      path: config.path,
      body,
    })).body

    send(msg)
  } catch (e) {
    showErrorAndFinish(e, node, done, {
      method: config.method,
      path: config.path,
    });
    return
  }

  done()
}


module.exports = (RED) => {
  function node(config) {
    RED.nodes.createNode(this, config)

    this.getHubspotWrapper = () => RED.nodes.getNode(config.account)?.getHubspotWrapper()

    this.on('input', onInput(this, config))
  }

  RED.nodes.registerType("hubspot-api-request", node);
}
