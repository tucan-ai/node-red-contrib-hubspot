const {showErrorAndFinish} = require("../../utils/build.hubspot.error")

const onInput = (node, config) => async (msg, send, done) => {
  const hubspot = await node.getHubspotWrapper()

  if (!hubspot) {
    showErrorAndFinish("hubspot account missing", node, done);
    return
  }

  try {
    msg[String(config.output || 'payload')] = (await hubspot.crm.companies.basicApi.create(msg[config.inputData])).body

    send(msg)
  } catch (e) {
    showErrorAndFinish(e, node, done, {
      data: msg[config.inputData],
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

  RED.nodes.registerType("hubspot-company-create", node);
}
