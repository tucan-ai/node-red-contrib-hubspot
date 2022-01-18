const {getSingular} = require("../../../utils/crm.types")
const {showErrorAndFinish} = require("../../../utils/build.hubspot.error")

const onInput = (node, config) => async (msg, send, done) => {
  const hubspot = await node.getHubspotWrapper()

  if (!hubspot) {
    showErrorAndFinish("hubspot account missing", node, done);
    return
  }

  if (
    !msg[config.inputCompanyId]
    || !msg[config.inputLinkId]
  ) {
    showErrorAndFinish(`msg.${config.inputCompanyId} and msg.${config.inputLinkId} must be set`, node, done);

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
    showErrorAndFinish(e, node, done, {
      companyId: msg[String(config.inputCompanyId)],
      linkType: config.inputLinkType,
      linkId: msg[String(config.inputLinkId)],
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

  RED.nodes.registerType("hubspot-company-association-delete", node);
}
