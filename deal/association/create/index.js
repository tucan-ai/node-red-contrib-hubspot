const { getSingular } = require("../../../utils/crm.types")

const onInput = (node, config) => async (msg, send, done) => {
  if (
    !msg[config.inputDealId]
    || !msg[config.inputLinkId]
  ) {
    node.error(`msg.${config.inputDealId} must be set`);
    node.error(`msg.${config.inputLinkId} must be set`);

    return
  }

  try {
    msg[String(config.output || 'payload')] = (await node.hubspot.crm.deals.associationsApi.create(
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

    this.hubspot = RED.nodes.getNode(config.account)?.hubspot

    if (!this.hubspot) {
      return
    }

    this.on('input', onInput(this, config))
  }

  RED.nodes.registerType("hubspot-deal-association-create", node);
}
