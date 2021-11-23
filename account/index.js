module.exports = (RED) => {
  const hubspot = require('@hubspot/api-client')

  function node(config) {
    RED.nodes.createNode(this, config);

    let options = {}

    if (config) {
      options = {
        apiKey: !config.authMode || config.authMode === 'api-key' ? config.apikey : undefined,
        accessToken: config.authMode === 'access-token' ? config.accessToken : undefined,
        developerApiKey: config.authMode === 'developer-api-key' ? config.developerApiKey : undefined,
      }
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
