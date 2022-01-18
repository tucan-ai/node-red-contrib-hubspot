const {showErrorAndFinish} = require("../../utils/build.hubspot.error")

const onInput = (node, config) => async (msg, send, done) => {
  const hubspot = await node.getHubspotWrapper()

  if (!hubspot) {
    showErrorAndFinish("hubspot account missing", node, done);
    return
  }

  if (!['number', 'string'].includes(typeof msg[config.inputId])) {
    showErrorAndFinish(`msg.${config.inputId} should be either string or number`, node, done, {
      type: typeof msg[config.inputId],
    })

    return
  }

  try {
    msg[String(config.output || 'payload')] = (await hubspot.crm.contacts.basicApi.getById(
      msg[config.inputId],
      config.properties ? config.properties.split(',') : [],
      config.associations ? config.associations.split(',') : [],
    )).body

    send(msg)
  } catch (e) {
    showErrorAndFinish(e, node, done, {
      id: msg[config.inputId],
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

  RED.nodes.registerType("hubspot-contact-get-by-id", node);
}
