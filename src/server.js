import initExpress from './initExpress.js'
import initIpfs from './initIpfs.js'
import initStorage from './initStorage.js'
import StorageAdapter from './storageAdapter.js'
import routers from './routers/index.js'

const Server = (config) => {
  const start = async () => {
    const storage = initStorage({ 
      bucketName: config.bucketName, 
      storageProvider: config.storageProvider 
    })
    const storageAdapter = new StorageAdapter(storage)
    const ipfs = await initIpfs(storageAdapter, config)
    
    const app = initExpress(config)
    const router = routers(ipfs, config)
    
    app.use(router)
    
    return app
  }

  const stop = async () => {
    // Cleanup if needed
  }

  return {
    start,
    stop
  }
}

export default Server