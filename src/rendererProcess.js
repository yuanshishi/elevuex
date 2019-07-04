import { ipcRenderer } from "electron"

const INIT = "ys_init"
const CONNECT = "ys_connect"
const SENDDATA = "ys_senddata"

class rendererProcess {
    constructor(store) {
        this.store = store
        this.store.originCommit = this.store.commit
        this.init() 
    }
    //初始化
    init() {
        this.store.commit = (event, mutation) => {
            this.noticeMain(mutation)
        }
        ipcRenderer.send(CONNECT)
        ipcRenderer.on(SENDDATA, (event, mutation) => {
            this.updateVuex(event, mutation)
        })
        ipcRenderer.on(INIT, (store) => {
            this.store.replaceState(store.state)
        })
    }

    //通知主进程
    noticeMain(mutation) {
        ipcRenderer.send(SENDDATA, mutation)
    }

    //更新vuex
    updateVuex(event, mutation) {
        this.store.originCommit(event, mutation)
    }

}
export default (option = {}) => {
    new rendererProcess(option)
    return (store) => {
    }
} 
