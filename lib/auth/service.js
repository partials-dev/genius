'use babel'

import Shell from 'shell'
import childProcess from 'child_process'

export default class AuthService {
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
      this.openPath(`http://localhost:8888/auth/${this.type}`)
      this.accessPromise = {}
      this.accessPromise.promise = new Promise((resolve, reject) => {
        this.accessPromise.resolve = resolve
        this.accessPromise.reject = reject
      })
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
    return {accessToken, refreshToken, clientId, clientSecret}
  }

  getConfigPath (item) {
    return `rhyming-dictionary.${this.type}${item}`
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
