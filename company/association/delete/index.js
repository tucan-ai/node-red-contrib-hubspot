const {getSingular} = require("../../../utils/crm.types")

const onInput = (node, config) => async (msg, send, done) => {
  const hubspot = await node.getHubspotWrapper()

  if (!hubspot) {
    node.error("hubspot account missing");
    return
  }

  if (
    !msg[config.inputCompanyId]
    || !msg[config.inputLinkId]
  ) {
    node.error(`msg.${config.inputCompanyId} must be set`);
    node.error(`msg.${config.inputLinkId} must be set`);

    return
  }

  try {
    msg[String(config.output || 'payload')] = (await hubspot.crm.companies.associationsApi.archive(
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

    this.getHubspotWrapper = () => RED.nodes.getNode(config.account)?.getHubspotWrapper()

    this.on('input', onInput(this, config))
  }

  RED.nodes.registerType("hubspot-company-association-delete", node);
}
