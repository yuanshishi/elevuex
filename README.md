# elevuex

提供electron+vue 各个进程状态共享

## 安装

1. 包安装
```sh
npm install elevuex
```

2.在项目中使用
- **在主进程中添加代码**
```javascript
import { mainProcess } from 'elevuex'
mainProcess(store)
```
- **在渲染进程中添加代码**    
```javascript
import {rendererProcess} from 'elevuex'
rendererProcess(store)
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
```



