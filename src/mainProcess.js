import { ipcMain } from "electron"
const Store = require('electron-store');
const vuexStore = new Store();

const INIT = "ys_init"
const CONNECT = "ys_connect"
const SENDDATA = "ys_senddata"

class mainProcess {
    constructor(store) {
        this.List = new Map()
        this.store = store
        if (this.store.state) {
            vuexStore.set(this.store.state)
        }
        this.init()
    }
    //初始化
    init() {
        ipcMain.on(CONNECT, event => {
            let id = event.sender.id
            this.List.set(event.sender.id, event.sender)
            event.sender.on("destroyed", () => {
                this.List.delete(id)
            })
        })

        ipcMain.on(SENDDATA, (event, mutation) => {
            this.store.dispatch(mutation.type, mutation.payload)
            if (this.store.state) {
                vuexStore.set(this.store.state)
            }
            this.noticeRenderers(mutation)
        })
    }

    //通知渲染进程
    noticeRenderers(payload) {
        this.List.forEach((sender) => {
            if (!sender.isDestroyed()) {
                sender.webContents.send(SENDDATA, payload)
            }
        })
    }

}
export default (store) => {
    new mainProcess(store)
}

