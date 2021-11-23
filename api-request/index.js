const onInput = (node, config) => async (msg, send, done) => {
  const hubspot = await node.getHubspotWrapper()

  if (!hubspot) {
    node.error("hubspot account missing");
    return
  }

  if (!config.method || !config.path) {
    node.error("method and path must be defined!");

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
    node.error({
      _: "failed api request to hubspot",
      body,
      error: e
    });
    done(e.message)
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
