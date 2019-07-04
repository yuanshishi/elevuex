import { ipcMain } from "electron"

const INIT = "ys_init"
const CONNECT = "ys_connect"
const SENDDATA = "ys_senddata"

class mainProcess {
    constructor(store) {
        this.List = new Map()
        this.store = store
        this.init() 
    }
    //初始化
    init() {
        ipcMain.on(CONNECT, event => {
            let id=event.sender.id
            this.List.set(event.sender.id, event.sender)
            event.sender.webContents.send(INIT, this.store.state)
            event.sender.on("destroyed", () => {
                this.List.delete(id)
            })
        })

        ipcMain.on(SENDDATA, (event, mutation) => {
            this.store.dispatch(mutation.type,mutation.payload)
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

