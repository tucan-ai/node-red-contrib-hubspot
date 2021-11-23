const onInput = (node, config) => async (msg, send, done) => {
  const hubspot = await node.getHubspotWrapper()

  if (!hubspot) {
    node.error("hubspot account missing");
    return
  }

  const mustache = require('mustache')
  const NodeContext = require('../utils/mustach.node.context')
  const parseContext = require('../utils/parse.context')
  const extractTokens = require('../utils/extract.tokens')

  const promises = []
  const tokens = extractTokens(mustache.parse(config.search || ''))
  const resolvedTokens = {}

  tokens.forEach(function(name) {
    const context = parseContext(name)

    if (context) {
      const type = context.type
      const store = context.store
      const field = context.field
      const target = node.context()[type]

      if (target) {
        promises.push(
          new Promise((resolve, reject) => {
            target.get(field, store, (err, val) => {
              if (err) {
                reject(err)
              } else {
                resolvedTokens[name] = val
                resolve()
              }
            })
          })
        )
      }
    }
  })

  try {
    await Promise.all(promises)
  } catch (e) {
    node.error({
      _: "failed to prepare tokens",
      error: e
    });
    done(e.message)
    return
  }

  let body = mustache.render(
    config.search || '',
    new NodeContext(
      msg,
      node.context(),
      null,
      false,
      resolvedTokens
    )
  )

  try {
    body = JSON.parse(body)
  } catch (e) {
    node.error({
      _: `search template is invalid json`,
      body
    });
    done(e.message)
    return
  }

  node.log({
    _: 'execute search request',
    body
  })

  let response

  try {
    response = (await hubspot.apiRequest({
      method: 'POST',
      path: `/crm/v3/objects/${config.object}/search`,
      body,
    })).body
  } catch (e) {
    node.error({
      _: "failed api request to hubspot",
      error: e
    });
    done(e.message)
    return
  }

  if (response.total === 0) {
    send([
      null,
      null,
      {
        ...msg,
        [String(config.output || 'payload')]: 'empty'
      },
    ])
  } else if (response.total === 1) {
    send([
      {
        ...msg,
        [String(config.output || 'payload')]: response.results[0]
      },
      null,
      null,
    ])
  } else if (response.total > 1) {
    send([
      null,
      {
        ...msg,
        [String(config.output || 'payload')]: response.results
      },
      null,
    ])
  } else {
    node.warn({
      _: "something wrong with received result",
      response
    });
  }

  done()
}


module.exports = (RED) => {
  function node(config) {
    RED.nodes.createNode(this, config)

    this.getHubspotWrapper = () => RED.nodes.getNode(config.account)?.getHubspotWrapper()

    this.on('input', onInput(this, config))
  }

  RED.nodes.registerType("hubspot-search", node);
}
