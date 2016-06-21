'use babel'

import Shell from 'shell'
import childProcess from 'child_process'
import packageData from '../../package'

export default class Service {
  constructor (serviceName) {
    this.type = serviceName
    this.accessPromise = null
  }

  authenticate () {
    // access and refresh tokens
    // are stored in config
    const config = this.getConfig()

    if (config.accessToken) {
      return Promise.resolve(config)
    } else if (!this.accessPromise) {
      this.accessPromise = {}
      this.accessPromise.promise = new Promise((resolve, reject) => {
        this.accessPromise.resolve = resolve
        this.accessPromise.reject = reject
      })
      this.openPath(`http://localhost:8888/auth/${this.type}`)
    }
    return this.accessPromise.promise
  }

  deauthenticate () {
    this.accessPromise = null
    this.setConfig({})
  }

  gotData (data) {
    if (data.type === this.type) {
      this.setConfig(data)
      this.accessPromise.resolve(data)
    }
  }

  setConfig ({accessToken, refreshToken}) {
    const accessPath = this.getConfigPath('AccessToken')
    const refreshPath = this.getConfigPath('RefreshToken')
    atom.config.set(accessPath, accessToken)
    atom.config.set(refreshPath, refreshToken)
  }

  getConfig () {
    const accessToken = atom.config.get(this.getConfigPath('AccessToken'))
    const refreshToken = atom.config.get(this.getConfigPath('RefreshToken'))
    const clientId = atom.config.get(this.getConfigPath('ClientId'))
    const clientSecret = atom.config.get(this.getConfigPath('ClientSecret'))
    const config = {accessToken, refreshToken, clientId, clientSecret}
    this.validateConfig(config)
    return config
  }

  validateConfig (config) {
    if (!config.clientId) {
      const error = new Error('No client ID found for the Genius API.\nThe Genius lyrics package requires you to set a client ID in the package settings. You can get one at https://genius.com/api-clients')
      throw error
    }
    if (!config.clientSecret) {
      const error = new Error('No client secret found for the Genius API.\nThe Genius lyrics package requires you to set a client secret in the package settings. You can get one at https://genius.com/api-clients')
      throw error
    }
  }

  getConfigPath (item) {
    const packageName = packageData.name
    return `${packageName}.${this.type}${item}`
  }

  getEnv () {
    const {clientId, clientSecret} = this.getConfig()
    return {
      [this.clientIdEnvKey()]: clientId,
      [this.clientSecretEnvKey()]: clientSecret
    }
  }

  accessTokenEnvKey () {
    return `${this.type.toUpperCase()}_ACCESS_TOKEN`
  }

  clientSecretEnvKey () {
    return `${this.type.toUpperCase()}_CLIENT_SECRET`
  }

  clientIdEnvKey () {
    return `${this.type.toUpperCase()}_CLIENT_ID`
  }

  openPath (filePath) {
    const processArchitecture = process.platform
    switch (processArchitecture) {
      case 'darwin':
        childProcess.exec(`open "${filePath}"`)
        break
      case 'linux':
        childProcess.exec(`xdg-open "${filePath}"`)
        break
      case 'win32': Shell.openExternal(`file:///${filePath}`)
        break
    }
  }
}
