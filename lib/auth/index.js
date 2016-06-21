'use babel'

import childProcess from 'child_process'
import Service from './service'

export default {
  activate (services) {
    // don't start server if running tests;
    // it causes an error for some reason
    if (atom.inSpecMode()) return

    this.services = {}
    services.forEach((serviceName) => {
      this.initializeService(serviceName)
    })

    const serverEnv = process.env
    this.serviceList.forEach((service) => {
      const serviceEnv = service.getEnv()
      Object.keys(serviceEnv).forEach((key) => {
        serverEnv[key] = serviceEnv[key]
      })
    })

    this.serverProcess = this.spawnServer(serverEnv)
    this.tailLogs()
  },

  initializeService (name) {
    const service = new Service(name)
    this.services[name] = service
  },

  get serviceList () {
    return Object.keys(this.services).map((name) => this.services[name])
  },

  spawnServer (env) {
    const serverPath = __dirname
    // const cp = childProcess
    const serverProcess = childProcess.spawn('node', ['./server'], { cwd: serverPath })
    return serverProcess
  },

  tailLogs () {
    this.serverProcess.stdout.setEncoding('utf8')
    this.serverProcess.stdout.on('data', (data) => {
      try {
        const parsed = JSON.parse(data)
        console.log(`server stdout: ${data}`)
        const service = this.services[parsed.type]
        if (service) {
          service.gotData(parsed)
        }
      } catch (err) {
        console.log(`server stdout: ${data}`)
      }
    })

    this.serverProcess.stderr.on('data', (data) => {
      console.log(`server stderr: ${data}`)
    })

    this.serverProcess.on('close', (code) => {
      console.log(`server child process exited with code ${code}`)
    })
  },

  deactivate () {
    this.killServer()
  },

  killServer () {
    if (this.serverProcess) this.serverProcess.kill()
  },

  deauthenticate () {
    this.serviceList.forEach((service) => service.deauthenticate())
  }
}
