import { ipcRenderer } from "electron"
import Store from "electron-store"
const vuexStore = new Store();

const INIT = "ys_init"
const CONNECT = "ys_connect"
const SENDDATA = "ys_senddata"

class rendererProcess {
    constructor(store) {
        this.store = store
        this.store.originDispatch = this.store.dispatch
        this.init()
    }
    //初始化
    init() {
       
        this.store.commit =  () => {
            throw new Error(`vuex请使用dispatch.`)
          }
        this.store.dispatch = (type, payload) => {
            this.noticeMain({type, payload})
        }
        ipcRenderer.send(CONNECT)
        ipcRenderer.on(SENDDATA, (event, mutation) => {
            this.updateVuex( mutation)
        })
        
        this.store.replaceState(vuexStore.get())
    }

    //通知主进程
    noticeMain(mutation) {
        ipcRenderer.send(SENDDATA, mutation)
    }

    //更新vuex
    updateVuex(mutation) {
        this.store.originDispatch(mutation.type,mutation.payload)
    }

}
export default (store) => {
    new rendererProcess(store)
} 
