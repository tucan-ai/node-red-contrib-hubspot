const {getSingular} = require("../../../utils/crm.types")

const onInput = (node, config) => async (msg, send, done) => {
  if (
    !msg[config.inputCompanyId]
    || !msg[config.inputLinkId]
  ) {
    node.error(`msg.${config.inputCompanyId} must be set`);
    node.error(`msg.${config.inputLinkId} must be set`);

    return
  }

  try {
    msg[String(config.output || 'payload')] = (await node.hubspot.crm.companies.associationsApi.archive(
      msg[String(config.inputCompanyId)],
      config.inputLinkType,
      msg[String(config.inputLinkId)],
      `company_to_${getSingular(config.inputLinkType)}`
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

  RED.nodes.registerType("hubspot-company-association-delete", node);
}
