class HubspotError extends Error {
  constructor(
    message,
    correlationId,
    category,
  ) {
    super(message)

    this.correlationId = correlationId
    this.category = category
  }
}

const showErrorAndFinish = (e, node, done, context) => {
  const error = buildHubspotError(e)

  const data = {
    msg: error.message,
    error,
    context,
  }

  node.error({
    ...data,
    toString: () => JSON.stringify({
      message: error.message,
      correlationId: error.correlationId,
      category: error.category,
      stack: error.stack,
      context,
    })
  });

  done && done(error)

  return error
}

const buildHubspotError = (e) => {
  if (e instanceof HubspotError) {
    return e
  }

  if (typeof e === 'string') {
    return new HubspotError(e)
  }

  if (
    e.response
    && e.response.body
  ) {
    return new HubspotError(
      e.response.body.message,
      e.response.body.correlationId,
      e.response.body.category,
    )
  }

  return new HubspotError(e.message)
}

module.exports = {
  showErrorAndFinish,
  buildHubspotError,
}
