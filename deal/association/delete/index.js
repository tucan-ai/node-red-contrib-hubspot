const {getSingular} = require("../../../utils/crm.types")

const onInput = (node, config) => async (msg, send, done) => {
  const hubspot = await node.getHubspotWrapper()

  if (!hubspot) {
    node.error("hubspot account missing");
    return
  }

  if (
    !msg[config.inputDealId]
    || !msg[config.inputLinkId]
  ) {
    node.error(`msg.${config.inputDealId} must be set`);
    node.error(`msg.${config.inputLinkId} must be set`);

    return
  }

  try {
    msg[String(config.output || 'payload')] = (await hubspot.crm.deals.associationsApi.archive(
      msg[String(config.inputDealId)],
      config.inputLinkType,
      msg[String(config.inputLinkId)],
      `deal_to_${getSingular(config.inputLinkType)}`
    )).body

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

    this.getHubspotWrapper = () => RED.nodes.getNode(config.account)?.getHubspotWrapper()

    this.on('input', onInput(this, config))
  }

  RED.nodes.registerType("hubspot-deal-association-delete", node);
}
