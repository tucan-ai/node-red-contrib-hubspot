
const onInput = (node, config) => async (msg, send, done) => {
  const hubspot = await node.getHubspotWrapper()

  if (!hubspot) {
    node.error("hubspot account missing");
    return
  }

  if (!['number', 'string'].includes(typeof msg[config.inputId])) {
    node.error(`msg.${config.inputId} should be either string or number`);

    return
  }

  try {
    msg[String(config.output || 'payload')] = (await hubspot.crm.contacts.basicApi.getById(msg[config.inputId])).body

    send(msg)
  } catch (e) {
    node.error({
      _: "failed api request to hubspot",
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

  RED.nodes.registerType("hubspot-contact-get-by-id", node);
}
