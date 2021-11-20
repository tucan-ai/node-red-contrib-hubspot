
const onInput = (node, config) => async (msg, send, done) => {
  if (!['number', 'string'].includes(typeof msg[config.inputId])) {
    node.error(`msg.${config.inputId} should be either string or number`);

    return
  }

  try {
    msg[String(config.output || 'payload')] = (await node.hubspot.crm.deals.basicApi.getById(msg[config.inputId])).body

    send(msg)
  } catch (e) {
    node.error("failed api request to hubspot");
    done(e.message)
    return
  }

  done()
}


module.exports = (RED) => {
  function node(config) {
    RED.nodes.createNode(this, config)

    this.hubspot = RED.nodes.getNode(config.account)?.hubspot

    if (!this.hubspot) {
      return
    }

    this.on('input', onInput(this, config))
  }

  RED.nodes.registerType("hubspot-deal-get-by-id", node);
}
