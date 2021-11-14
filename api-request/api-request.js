
const onInput = (node, config) => async (msg, send, done) => {
 if (!config.method || !config.path) {
   node.error("method and path must be defined!");

   return
 }

 let body = null

 if (config.body === 'payload') {
   body = msg.payload
 }

  msg[String(config.output || 'payload')] = await node.hubspot.apiRequest({
    method: config.method,
    path: config.path,
    body,
  })

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

  RED.nodes.registerType("hubspot-api-request", node);
}
