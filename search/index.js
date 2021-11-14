const onInput = (node, config) => async (msg, send, done) => {
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
    node.error("failed to prepare tokens");
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
    node.error(`search template is invalid json: \n${body}`);
    done(e.message)
    return
  }

  node.log(`execute search request: \n${JSON.stringify(body, undefined, 2)}`)

  let response

  try {
    response = await node.hubspot.apiRequest({
      method: 'POST',
      path: `/crm/v3/objects/${config.object}/search`,
      body,
    })
  } catch (e) {
    node.error("failed api request to hubspot");
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
    this.warn("something wrong with received result");
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

  RED.nodes.registerType("hubspot-search", node);
}
