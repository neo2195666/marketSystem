# 商城后台项目

## 一、环境准备

### 1、安装node.js

### 2、打开工程目录，创建vite项目

```bash
npm create vite@latest marketSystem -- --template vue

cd marketSystem
npm install
npm run dev
```

### 3、引入element UI 库

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

### 4、引入windicss框架

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

### 5、安装vue-router

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

## 二、登录页面设计

### 1、页面设计

页面设计，先从布局开始，逐层往下深入，具体实现

1、先将框架生成的style.css文件注释掉，不要引用进去

2、新建一个login组建，配置路由。

3、默认情况下flex将布局分成24格，我们采用左边16格，右边8格子来实现布局，设置整体的CSS样式

4、设置左边欢迎使用和CSS样式

5、设置右边用户登录和CSS央视，表单使用element plus提供的表单

```vue
<template>
  <!--  <el-row class="min-h-screen bg-indigo-500">  -->
  <el-row style="min-height: 100vh;" class="bg-indigo-500">

    <!--设置左边欢迎界面-->
    <!--flex 是WindiCss，代表display使用flex，items-center是垂直居中，justify-center是垂直居中，flex布局是垂直放心:flex-col-->
    <el-col :span="16" class="flex items-center justify-center flex-col">
      <div>
        <!--设置字体的粗体，大小，颜色。设置颜色的时候，如果排版中字体颜色没有想要的，可以使用text-格式+颜色，颜色去颜色面板查找。设置下边距 -->
        <div class="font-bold text-5xl text-light-50 mb-4">欢迎使用CMDB</div>
        <div class="text-light-50">假作真时真亦假 无为有处有还无。 ————————《红楼梦》</div>
      </div>
    </el-col>

    <!--设置右边用户登录模块-->
    <el-col :span="8" class="bg-light-50 flex items-center justify-center flex-col">
      <h2 class="font-bold text-3xl text-gray-800">欢迎回来</h2>
      <div class="flex items-center justify-center my-5 text-gray-300 space-x-2">
        <span class="h-[4px] w-16 bg-gray-200"></span>
        <span class="">账号密码登</span>
        <span class="h-[4px] w-16 bg-gray-200"></span>
      </div>

      <!--form表单使用element plus提供-->
      <el-form :model="form" class="w-[250px]">
        <el-form-item >
          <!--username和password和下面style标签中对应-->
          <el-input v-model="form.username" placeholder="请输入用户名"/>
        </el-form-item>

        <el-form-item >
          <el-input v-model="form.password" placeholder="请输入密码"/>
        </el-form-item>

        <el-form-item>
          <!--button是element plus提供的组件，可以直接按照element plus提供的来修改 round实现圆角边框，颜色可以对比WindiCss样式来取用-->
          <el-button round color="#6366f1" type="primary" @click="onSubmit" class="w-[250px]">登录</el-button>
        </el-form-item>
        
      </el-form>
    </el-col>

  </el-row>

</template>

<script scoped setup>
import { reactive } from 'vue'

// do not use same name with ref
const form = reactive({
  name: '',
  password: ''
})

const onSubmit = () => {
  console.log('submit!')
}

</script>
```

### 2、响应式布局

当前页面只能在全屏或最大化的时候浏览器中才可以正常显示，一旦使用h5，或者拖动浏览器大小，样式就会错乱，所以要进行响应式布局的设定，使页面在窗口状态改变的情况下，自动适应大小。使用element plus的layout布局中的响应式布局来进行设置。这里使用md和lg规格，将登录页面中左右分布的布局，在属性中加上

```vue
<template>
  <el-row style="min-height: 100vh;" class="bg-indigo-500">

    <!--设置左边欢迎界面-->
    <!--设置响应式布局lg和md-->
    <el-col :lg="16" :md="12" class="flex items-center justify-center flex-col">
      <div>
      </div>
    </el-col>

    <!--设置右边用户登录模块-->
    <!--设置响应式布局lg和md-->
    <el-col :lg="8" :md="12" class="bg-light-50 flex items-center justify-center flex-col">
      <div>
      </div>
    </el-col>

  </el-row>
</template>
```

### 3、引入icon图标库

在网站中如果使用图片icon，例如在登录页面的用户名和密码中引入两个icon可以使用element plus提供的icon库

```bash
#安装element plus 的icon库
npm install @element-plus/icons-vue
```

引入图标有三种方式，第一种在class属性中直接引用

```vue
<template>
      <el-form :model="form" class="w-[250px]">
        <el-form-item >
          <!--:prefix-icon 会使图片展示在文本框的最前-->
          <!--:suffix-icon 会使图片展示在文本框的最后-->
          <el-input :prefix-icon="User" v-model="form.username" placeholder="请输入用户名"/>
        </el-form-item>

        <el-form-item >
          <el-input :prefix-icon="Lock" v-model="form.password" placeholder="请输入密码"/>
        </el-form-item>

      </el-form>
</template>

<script scoped setup>
//导入icon图标
import { User, Lock } from '@element-plus/icons-vue'
</script>
```

第二种使用插槽模式，引入template模板

```vue
<template>
      <el-form :model="form" class="w-[250px]">
        
          <el-input v-model="form.username" placeholder="请输入用户名">
            
              <template #prefix>
                  <el-icon><User /></el-icon>
              </template>
          </el-input>
        </el-form-item>

        <el-form-item >
          <el-input  v-model="form.password" placeholder="请输入密码">
              <template #prefix>
                  <el-icon><Lock /></el-icon>
              </template>
          </el-input>
        </el-form-item>

      </el-form>
</template>

<script scoped setup>
//导入icon图标
import { User, Lock } from '@element-plus/icons-vue'

</script>
```

第三种使用全局引入方式

```vue
<template>
      <el-form :model="form" class="w-[250px]">
        
          <el-input v-model="form.username" placeholder="请输入用户名">
            
              <template #prefix>
                  <el-icon><User /></el-icon>
              </template>
          </el-input>
        </el-form-item>

        <el-form-item >
          <el-input  v-model="form.password" placeholder="请输入密码">
              <template #prefix>
                  <el-icon><Lock /></el-icon>
              </template>
          </el-input>
        </el-form-item>

      </el-form>
</template>
```

在main.js中引入全局

方式一，方式二使用方式不变，不再需要在script标签中使用

```js
import { createApp } from 'vue'
//导入element plus 的icon库
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import 'virtual:windi.css'
import App from './App.vue'

const app = createApp(App).use(ElementPlus).use(router)
//在app挂载前全局引入
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')
```

### 4、优化CSS代码

将在元素中的css代码单独提出来

```vue
<template>
  <!--  <el-row class="min-h-screen bg-indigo-500">  -->
  <el-row class="login-container">

    <!--设置左边欢迎界面-->
    <!--flex 是WindiCss，代表display使用flex，items-center是垂直居中，justify-center是垂直居中，flex布局是垂直放心:flex-col-->
    <el-col :lg="16" :md="12" class="left">
      <div>
        <!--设置字体的粗体，大小，颜色。设置颜色的时候，如果排版中字体颜色没有想要的，可以使用text-格式+颜色，颜色去颜色面板查找。设置下边距 -->
        <div>欢迎使用CMDB</div>
        <div>假作真时真亦假 无为有处有还无。 ————————《红楼梦》</div>
      </div>
    </el-col>

    <!--设置右边用户登录模块-->
    <el-col :lg="8" :md="12" class="right">

      <h2 class="title">欢迎回来</h2>
      <div>
        <span class="line"></span>
        <span class="">账号密码登</span>
        <span class="line"></span>
      </div>

      <!--form表单使用element plus提供-->
      <el-form :model="form" class="w-[250px]">

        <el-form-item :rules="rules">
          <!--username和password和下面style标签中对应-->
          <el-input v-model="form.username" placeholder="请输入用户名">
              <!--使用前置插槽-->
              <template #prefix>
                  <el-icon><User /></el-icon>
              </template>
          </el-input>
        </el-form-item>

        <el-form-item >
            <el-input  v-model="form.password" placeholder="请输入密码">
                <!--使用前置插槽-->
                <template #prefix>
                    <el-icon><Lock /></el-icon>
                </template>
            </el-input>
        </el-form-item>

        <el-form-item>
          <!--button是element plus提供的组件，可以直接按照element plus提供的来修改 round实现圆角边框，颜色可以对比WindiCss样式来取用-->
          <el-button round color="#6366f1" type="primary" @click="onSubmit" class="w-[250px]">登录</el-button>
        </el-form-item>

      </el-form>
    </el-col>

  </el-row>

</template>

<script scoped setup>
import { reactive } from 'vue'

// do not use same name with ref
const form = reactive({
  name: '',
  password: ''
})

const onSubmit = () => {
  console.log('submit!')
}

</script>

<style scoped>
.login-container{
  @apply min-h-screen bg-indigo-500;
}

.login-container .left,.login-container .right{
  @apply flex items-center justify-center;
}

.login-container .right{
  @apply bg-light-50 flex-col;
}

.left>div>div:first-child{
  @apply font-bold text-5xl text-light-50 mb-4;
}

.left>div>div:last-child{
  @apply text-light-50;
}

.right .title{
  @apply font-bold text-3xl text-gray-800;
}

.right>div{
  @apply flex items-center justify-center my-5 text-gray-300 space-x-2;
}

.right .line{
  @apply h-[4px] w-16 bg-gray-200;
}
  
</style>
```

### 5、表单验证功能

用户名和密码不能为空，密码要使用符号遮盖起来，不能明文

```vue
<template>

	  <!--在form表单中添加规则，在script标签中定义规则rules;此处的model与script标签中的formRule绑定，保持一直-->
      <el-form :model="formRule" :rules="rules" class="w-[250px]">
        
		<!--prop与script标签中的rules中的username规则绑定，prop是key-->
        <el-form-item prop="username">

          <el-input v-model="formRule.username" placeholder="请输入用户名">

              <template #prefix>
                  <el-icon><User /></el-icon>
              </template>
          </el-input>
        </el-form-item>

		<!--prop与script标签中的rules中的password规则绑定，prop是key-->
        <el-form-item prop="password">
            
            <!--type类型设置成password，将密码不再设置成明文，show-password，设置开启和关闭明文显示密码-->
            <el-input  type="password" show-password v-model="formRule.password" placeholder="请输入密码">
                <!---->
                <template #prefix>
                    <el-icon><Lock /></el-icon>
                </template>
            </el-input>
        </el-form-item>

        <el-form-item>
          <el-button round color="#6366f1" type="primary" @click="onSubmit" class="w-[250px]">登录</el-button>
        </el-form-item>

      </el-form>
    </el-col>

  </el-row>

</template>

<script scoped setup>
import { reactive } from 'vue'

const formRule = reactive({
  username: "",
  password: ""
})

//设置的规则与的form中的对象要一一对应
const rules = {
  username:[
      { 
        required: true,
        message: '用户名不能为空', 
        trigger: 'blur'
       },
  ],
  password:[
          { 
        required: true,
        message: '密码不能为空', 
        trigger: 'blur'
       },
  ]
}

const onSubmit = () => {
  console.log('submit!')
}
</script>
```

### 6、异步登录axios

1、安装axios

```bash
#安装axios
npm install axios
```

2、在工程根目录下创建axios的js文件

```js
import axios from 'axios'

const service = axios.create({
    baseURL:"/api"
})

export default service
```

3、创建api目录，存放工程的api，然后创建manager.js登录接口

```js
import axios from "../axios"

export function login(username,password){
    return axios.post("/admin/login",{
        username,
        password
    })
}
```

4、vite.config.js中配置服务器代理，解决跨域问题

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve:{
    alias:{
      "~":path.resolve("src"),
    }
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://ceshi13.dishait.cn/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },

  plugins: [vue(),WindiCSS()]
})
```

5、在Login页面导入axios实现登录验证

```vue
<template>
  <el-row class="login-container">

    <!--设置左边欢迎界面-->
    <el-col :lg="16" :md="12" class="left">

    </el-col>

    <!--设置右边用户登录模块-->
    <el-col :lg="8" :md="12" class="right">

      <!--通过formRef拿到form表单节点，然后可以拿到form表单提交的数据-->
      <el-form ref= formRef :model="form"  :rules="rules" class="w-[250px]">

      </el-form>
        
    </el-col>
      
  </el-row>

</template>

<script scoped setup>
import { ref,reactive } from 'vue'
import { login } from '../api/manager.js'

//导入element plus 的UI库
import { ElNotification } from 'element-plus'
    
//导入vue-router路由
import { useRouter } from 'vue-router'

//表单提交后，先通过这个formRef拿到这个form表达的节点，然后拿到提交的数据进行验证
const router = useRouter()

const form = reactive({
  username: "",
  password: ""
})

const formRef = ref(null)

//本节重点
//点击提交
const onSubmit = () => {
  //先进行参数验证，参数不能为空
  formRef.value.validate((valid) => {
    if(!valid){
      return false
    }
  })

  //调用login登录api
  login(form.username,form.password)
  .then( res => {
      //ElNotification是element plus的UI组件
      ElNotification({
          message: '登录成功',
          type: 'success',
      })

      //登录成功后跳转到后台首页
      router.push("/")
  })
  .catch( err => {
      ElNotification({
          title: 'Error',
          message: err.response.data.msg || "登录失败",
          type: 'error',
      })
  })
}

</script>
```

### 7、使用cookie存储用户token

1、安装vue工具库vueuse

```bash
#先安装cookie工具以来的库
npm i @vueuse/integrations

#安装vueuse的cookie
npm i universal-cookie
```

```js
<script scoped setup>

//1、引入cookie
import { useCookies } from '@vueuse/integrations/useCookies'
//2、创建cookie
const cookie = useCookies()

const onSubmit = () => {
  formRef.value.validate((valid) => {
    if(!valid){
      return false
    }
  })

  login(form.username,form.password)
  .then( res => {
      ElNotification({
          message: '登录成功',
          type: 'success',
      })
	   //3、登录成功后，设置cookie
      cookie.set("admin-token-a1",res.data.data.token)

      router.push("/")
  })
  .catch( err => {
      ElNotification({
          title: 'Error',
          message: err.response.data.msg || "登录失败",
          type: 'error',
      })
  })
}
</script>
```









