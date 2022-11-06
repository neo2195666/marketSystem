# 商城后台项目

## 一、环境准备

## 1、安装node.js

## 2、打开工程目录，创建vite项目

```bash
npm create vite@latest marketSystem -- --template vue

cd marketSystem
npm install
npm run dev
```

## 3、引入element UI 库

打开element plus 官网，找到安装步骤（element UI和Element plus是不一样的，要选择正确的ui库安装）

```bash
npm install element-plus --save
```

在vue工程中导入element plus,如果你对打包后的文件大小不是很在乎，那么使用完整导入会更方便。

```js
// main.ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')
```

Volar 支持

如果您使用 Volar，请在 `tsconfig.json` 中通过 `compilerOptions.type` 指定全局组件类型。

```json
// tsconfig.json
{
  "compilerOptions": {
    // ...
    "types": ["element-plus/global"]
  }
}
```

## 4、引入windicss框架

打开windicss官网，找到安装命令

```bash
npm i -D vite-plugin-windicss windicss
```

在vite.config.js中引入windicss

```js
import WindiCSS from 'vite-plugin-windicss'

export default {
  plugins: [
    WindiCSS(),
  ],
}
```

在main.js里面也要导入windicss

```bash
import 'virtual:windi.css'
```

## 5、安装vue-router

打开vue-router官网，复制安装命令

```bash
npm install vue-router@4
```

在工程中创建router文件夹，创建index.js路由Javascript

```js
import {createRouter,createWebHashHistory} from 'vue-router'

// 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。
const routes = [
    { path: '/',
        name: 'Index',
        component: () =>  import(/* webpackChunkName: "Home" */ '../pages/Index.vue')
    },
    { path: '/login',
        name: 'Login',
        component: () =>  import(/* webpackChunkName: "About" */ '../pages/Login.vue')
    },
]

// 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = createRouter({
    // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})
```

在主配置文件main.js中导入路由

```bash
import { createApp } from 'vue'
import './style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'virtual:windi.css'
import App from './App.vue'
import Router from './router'

createApp(App).use(ElementPlus).use(Router).mount('#app')
```

在vite.config.js中导入文件系统别名

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve:{
    alias:{
      "~":path.resolve("scr"),
    }
  },
  plugins: [vue(),WindiCSS()]
})
```

在App.vue中使用router-view标签来导入路由试图

```vue
<script setup>
</script>

<template>
  <router-view></router-view>
</template>

<style scoped>
</style>
```

配置404路由页面

此处404组建使用的element plus 库中的组建

```vue
<template>
    <div>
        <el-result
            icon="error"
            title="404"
            sub-title="请求的页面已过期或者不存在"
        >
          <template #extra>
            <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
          </template>
        </el-result>
    </div>
</template>

<script>
export default {
  name: "404"
}
</script>

<style scoped>

</style>
```

```js
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
		//404路由配置在这里，将此处添加到工程中
    { path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () =>  import(/* webpackChunkName: "NotFound" */ '../pages/404.vue')
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes, 
})

export default router
```

