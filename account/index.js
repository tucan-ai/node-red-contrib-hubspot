module.exports = (RED) => {
  const hubspot = require('@hubspot/api-client')

  function node(config) {
    RED.nodes.createNode(this, config);

    const options = {}

    if (config) {
      options.apiKey = !config.authMode || config.authMode === 'api-key' ? config.apikey : undefined;
      options.accessToken = config.authMode === 'access-token' ? config.accessToken : undefined;
      options.developerApiKey = config.authMode === 'developer-api-key' ? config.developerApiKey : undefined;
    }

    // https://legacydocs.hubspot.com/apps/api_guidelines
    options.useLimiter = true

    const burstDuration = config.burstDuration ? Number(config.burstDuration) : 10
    const burstRequest = config.burstRequest ? Number(config.burstRequest) : 100

    options.limiterOptions = {
      maxConcurrent: config.concurrent ? Number(config.concurrent) : 5,
      reservoir: burstRequest,
      reservoirRefreshAmount: burstRequest,
      reservoirRefreshInterval: burstDuration * 1000,
    }

    switch (config?.retries) {
      case '1':
        options.numberOfApiCallRetries = hubspot.NumberOfRetries.One;
        break;

      case '2':
        options.numberOfApiCallRetries = hubspot.NumberOfRetries.Two;
        break;

      case '3':
        options.numberOfApiCallRetries = hubspot.NumberOfRetries.Three;
        break;

      case '4':
        options.numberOfApiCallRetries = hubspot.NumberOfRetries.Four;
        break;

      case '5':
        options.numberOfApiCallRetries = hubspot.NumberOfRetries.Five;
        break;

      case '6':
        options.numberOfApiCallRetries = hubspot.NumberOfRetries.Six;
        break;

      case '0':
      default:
        options.numberOfApiCallRetries = hubspot.NumberOfRetries.NoRetries
    }

    const client = this.hubspot = new hubspot.Client(options)

    this.getHubspotWrapper = async () => {
      if (config.authMode === 'oauth2') {
        // TODO depending on authentication refresh token first!

        if (!this.expiry || this.expiry < Date.now()) {
          try {
            const results = await client.oauth.tokensApi.createToken(
              'refresh_token',
              undefined,
              undefined,
              config.clientId,
              config.clientSecret,
              config.refreshToken
            )

            this.expiry = results.body.expiresIn * 1000 + Date.now()
            client.setAccessToken(results.body.accessToken)
          } catch (e) {
            this.error({
              _: 'failed to refresh oauth2 token',
              error: e
            })
          }
        }
      }

      return client
    }
  }

  RED.nodes.registerType("hubspot-account", node);
}
