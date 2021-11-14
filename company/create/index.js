
const onInput = (node, config) => async (msg, send, done) => {
  msg[String(config.output || 'payload')] = await node.hubspot.companies.create(msg[config.inputData])

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

  RED.nodes.registerType("hubspot-deal-create", node);
}
