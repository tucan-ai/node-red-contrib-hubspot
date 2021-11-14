
const onInput = (node, config) => async (msg, send, done) => {
  if (!['number', 'string'].includes(typeof msg[config.inputId])) {
    node.error(`msg.${config.inputId} should be either string or number`);

    return
  }

  msg[String(config.output || 'payload')] = await node.hubspot.deals.getById(msg[config.inputId])

  send(msg)
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
