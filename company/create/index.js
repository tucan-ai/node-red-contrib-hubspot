
const onInput = (node, config) => async (msg, send, done) => {
  const hubspot = await node.getHubspotWrapper()

  if (!hubspot) {
    node.error("hubspot account missing");
    return
  }

  try {
    msg[String(config.output || 'payload')] = (await hubspot.crm.companies.basicApi.create(msg[config.inputData])).body

    send(msg)
  } catch (e) {
    node.error({
      _: "failed api request to hubspot",
      input: msg[config.inputData],
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

  RED.nodes.registerType("hubspot-company-create", node);
}
