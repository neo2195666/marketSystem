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
const loading = ref(fas)
  
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

### 8、axios拦截器

在axios.js文件中添加登录拦截器和请求拦截器

```bash
import axios from 'axios'
import {ElNotification} from "element-plus";
import { useCookies } from '@vueuse/integrations/useCookies'

const service = axios.create({
    baseURL:"/api"
})

// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么

    //往header添加cookie
    const cookie = useCookies()
    const token = cookie.get("admin-token-a1")
    if(token){
        config.headers["token"] = token
    }

    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response.data.data;
}, function (error) {
    // 对响应错误做点什么
    ElNotification({
        title: 'Error',
        message: error.response.data.msg || "登录失败",
        type: 'error',
    })
    return Promise.reject(error);
});

export default service
```

在login组件中，登录成功后，获取用户组建信息.

登录按钮设置一个登录状态

```vue
<template>

  <el-row class="login-container">

    <!--设置左边欢迎界面-->
    <el-col :lg="16" :md="12" class="left">

      <div>

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

      <el-form ref= formRef :model="form"  :rules="rules" class="w-[250px]">

        <el-form-item prop="username">

          <el-input v-model="form.username" placeholder="请输入用户名">

              <template #prefix>
                  <el-icon><User /></el-icon>
              </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
            <el-input  type="password" show-password v-model="form.password" placeholder="请输入密码">

                <template #prefix>
                    <el-icon><Lock /></el-icon>
                </template>
            </el-input>
        </el-form-item>

        <el-form-item>
          <!--给登录按钮设置一个登录状态-->
          <el-button round color="#6366f1" type="primary" @click="onSubmit" class="w-[250px]" :loading="loading">登录</el-button>
        </el-form-item>

      </el-form>
    </el-col>

  </el-row>

</template>

<script scoped setup>
import { ref,reactive } from 'vue'
import { login,getInfo } from '../api/manager.js'
import { ElNotification } from 'element-plus'
import { useRouter } from 'vue-router'

import { useCookies } from '@vueuse/integrations/useCookies'

const cookie = useCookies()

const router = useRouter()

const form = reactive({
  username: "",
  password: ""
})

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

const formRef = ref(null)
//登录按钮状态设置
const loading = ref(false)

const onSubmit = () => {
  formRef.value.validate((valid) => {
    if(!valid){
      return false
    }
  })
  //打开登录按钮状态
  loading.value = true
  login(form.username,form.password)
  .then( res => {
      console.log(res);

      ElNotification({
          message: '登录成功',
          type: 'success',
      })

      cookie.set("admin-token-a1",res.token)

    //获取用户登录信息
    getInfo().then(res2 => {
      console.log(res2)
    })
      router.push("/")
  })
    .finally(() => {
    //关闭登录按钮状态
    loading.value = false
  })
}
</script>
```

### 9、常用工具库封装

新建composable目录，新建一个auth.js,

将cookie功能封装一下,然后再login组建中和axios.js中引入

```js
import { useCookies } from '@vueuse/integrations/useCookies'

const TokenKey = "admin-token"
const cookie = useCookies()

//获取token
export function getToken(){
    return cookie.get(TokenKey)
}

//设置token
export function setToken(token){
    return cookie.set(TokenKey,token)
}

//删除token
export function removeToken(){
    return cookie.remove(TokenKey)
}
```

将login.vue中的设置cookie代码改成

```vue
setToken(res.token)
```



将登录成功失败的通知封装成工具类，创建一个utils.js,再axios.js，和login.vue中修改优化一下代码

```js
import { ElNotification } from 'element-plus'

export function loginSuccessMsg(){
    ElNotification({
        message: '登录成功',
        type: 'success',
    })
}

export function loginFailMsg(error){
    ElNotification({
        title: 'Error',
        message: error.response.data.msg || "登录失败",
        type: 'error',
    })
}

export function loginFirst(error){
    ElNotification({
        title: 'Error',
        message: "请先登录",
        type: 'error',
    })
}
```

### 10、vuex管理状态信息

用户登录成功后，保存用户的登录状态信息，共享给其他页面，让用户可以在登录状态下访问其他页面

```bash
#安装vuex
npm install vuex@next --save
```

新建一个sotre目录，新建一个index.js

```js
import { createStore } from 'vuex'

// 创建一个新的 store 实例
const store = createStore({
    state () {
        return {
            user:{}
        }
    },
    mutations: {
    //记录用户信息
        SET_USERINFO(state,user){
            state.user = user
        }
    }
})

export default store
```

在main.js中引入store

```js
import store from "~/store/index.js";

const app = createApp(App).use(store)

app.mount('#app')
```

在login中导入store，存储用户信息

```js
<script>
import { useStore } from 'vuex'
const store = useStore()
  
//在on_submit（）提交按钮函数中，登录成功后，设置cookie后，获取用户登录信息的时候，可以使用store，存储用户登录xin xi

          //存储cookie
          setToken(res.token)

          //获取用户登录信息
          getInfo().then(res2 => {
            store.commit("SET_USERINFO",res2)
            console.log(res2)
          })

  </script>
```

### 11、全局导航守卫拦截登录判断

根目录下创建permission.js来配置权限验证相关的内容

```js
import router from "~/router"
import { getToken } from "~/composable/auth.js";
import { loginFirst} from "~/composable/utils.js";

//配置全局前置守卫
router.beforeEach((to, from,next) => {
    //如果token不存在，证明没有登录，并且要去的页面不是login，那么钩子函数会跳转到登录页面
    const token = getToken();
    if(!token && to.path != "/login"){
        loginFirst()
        return next({path:"/login"})
    }

    //如果token存在，证明已经登录，这时不需要进入登录页面
    if(token && to.path == "/login"){
        //如果要返回的页面不存在，那就强制跳转到登录页
        return next({path: from.path ? from.path : "/login"})
    }
    next()
})
```

在main.jsz中导入权限管理的js

```js
import 'element-plus/dist/index.css'
```

### 12、登录功能完善

优化内容1，当前，登录成功后可以获取用户信息，但是当页面刷新以后，将无法获得。所以需要在store中存储获取用户信息；优化内容2：将login代码放到store里面；优化内容3:添加回车键盘监听记录，实现回车键响应登录.

在store目录中index.js中添加如下内容

```js
import { createStore } from 'vuex'
import {getInfo, login} from "~/api/manager.js";
import {setToken} from "~/composable/auth.js";

const store = createStore({
    state () {
        return {
            user:{}
        }
    },
    mutations: {
        SET_USERINFO(state,user){
            state.user = user
        }
    },
    actions: {
        //登录功能
        login({commit},{ username,password }){
            return new Promise( (resolve, reject) => {
                login(username,password).then( res => {
                    //存储cookie
                    setToken(res.token)
                    console.log("打印token:" + res.token)
                    resolve(res)

                }).catch(err => reject(err))
            })
        },

        //获取当前登录的用户信息
        getInfo({commit}){
            return new Promise((resolve,reject) => {
                getInfo().then(res => {
                    //调用SET_USERINFO函数，将信息赋值给state中的user
                    commit("SET_USERINFO",res)
                    resolve(res)
                }).catch(err => reject(err))
            })
        }
    }
})

export default store
```

将登录页面login中的，登录成功后获取用户信息删掉。

在路由权限管理的permission.js中，登录成功后，添加获取用户信息。

```js
import router from "./router"
import { getToken } from "~/composable/auth.js";
import { loginFirst} from "~/composable/utils.js";
import store from "~/store/index.js";


router.beforeEach(async (to, from,next) => {

    const token = getToken();
    if(!token && to.path != "/login"){
        loginFirst()
        return next({path:"/login"})
    }
    
    if(token && to.path == "/login"){
        return next({path: from.path ? from.path : "/login"})
    }

    //如果已经登录，获取并且保存用户信息到store中
    if(token){
        //在store中action存储的函数，在这里要使用dispatch来调度。这里使用await的时候，在钩子函数的参数中要添加async
        await store.dispatch("getInfo")
    }

    next()
})
```

修改login登录页面

```vue
<script scoped setup>
  //导入钩子进行键盘监听事件
import { ref,reactive,onMounted,onBeforeUnmount } from 'vue'
import { loginSuccessMsg } from '../composable/utils.js'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()

const form = reactive({
  username: "",
  password: ""
})

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
const formRef = ref(null)
const loading = ref(false)
const store = useStore()

const onSubmit = () => {

  formRef.value.validate((valid) => {
    if(!valid){
      return false
    }
    loading.value = true
    //login账号登录
    store.dispatch("login",form).then( res => {
      loginSuccessMsg();
      router.push("/")
    }).finally(() => {
          loading.value = false
        })
  })
}

//监听回车
function onKeyUp(e){
  if(e.key == "Enter") onSubmit()
}

//添加键盘监听事件
onMounted( () => {
    document.addEventListener("keyup",onKeyUp)
})

//退出前移除键盘监听
onBeforeUnmount(() => {
    document.removeEventListener("keyup",onKeyUp)
})
```

### 13、退出登录功能

在login页面添加退出登录按钮,绑定到logout函数里面

```vue
<template>
  <div>
    后台首页
    <el-button @click="logout">退出登录</el-button>
    <div>{{ $store.state.user }}</div>
  </div>
</template>

<script setup>
import {logoutFunction, SuccessMsg} from "~/composable/utils.js";
import router from "~/router/index.js";
//导入退出登录的额api函数
import { logoutApi } from "~/api/manager.js";
//导入store来
import {useStore} from 'vuex'

const store = useStore()
function logout(){
    logoutFunction("是否要退出登录",).then( res => {
      logoutApi().finally(res => {

        store.dispatch("logoutAction")

        //跳转回登录页面
        router.push("/login")
        //提示退出成功
        SuccessMsg("退出成功！准备去🍺")
      })
      console.log("退出成功")
    })
}

</script>
```

在utils.js中添加登录按钮的响应功能

```js
//导入消息盒子
import { ElNotification,ElMessageBox } from 'element-plus'

//添加退出登录按钮内容
export function logoutFunction(context = "提示内容",type = "Warning",title = ""){
    return  ElMessageBox.confirm(
        context,
        title,
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type
        }
    )
}
```

在manager.js中添加退出登录api

```js
//添加退出登录的api
export function logoutApi(){
    return axios.post("/admin/logout")
}
```

在store中的index.js中的action添加清空用户数据的方法

```js
import { createStore } from 'vuex'
import {getInfo, login} from "~/api/manager.js";
import { setToken,removeToken } from "~/composable/auth.js";

const store = createStore({
    state () {
        return {
            user:{}
        }
    },
    mutations: {
        SET_USERINFO(state,user){
            state.user = user
        }
    },
  
    actions: {
        //退出登录的logout
        logoutAction({ commit }){
            //移除cookie中的token
            removeToken()
            //清除当前用户状态,清除store，state中的user
            commit("SET_USERINFO",{})
        }
        //第二种清空用户数据的方法
        // logoutAction(state){
        //     //移除cookie中的token
        //     removeToken()
        //     //清除当前用户状态,清除store，state中的user
        //     state.user = {}
        // }
    }
})

export default store
```

### 14、全局loading加载进度条

```bash
#安装NProgress,可以在https://www.npmjs.com/中检索模块
npm i nprogress
```

在main.js中导入

```js
import "../node_modules/nprogress/nprogress.css"
```

在util.js中设置进度条函数

```js
import nprogress from 'nprogress'


//显示全屏loading
export function showFullLoading(){
    nprogress.start()
}


//隐藏全屏loading
export function hideFullLoading(){
    nprogress.done()
}
```

在权限配置permission.js中配置钩子函数

```js
import { loginFirst,showFullLoading,hideFullLoading } from "~/composable/utils.js";

//配置全局前置守卫
router.beforeEach(async (to, from,next) => {
    //显示loading进度条
    showFullLoading()

    next()
})

//全局后置钩子结束进度条
router.afterEach((to, from) => hideFullLoading())
```

可以在app.vue中修改一下进度条的样式

```vue
<style scoped>
#nprogress .bar{
  background: #6fff71!important;
  height: 3px!important;
}
</style>
```

### 15、动态页面标题实现

在路由配置中，为每个页面添加一个meta.title的页面标题属性

```js
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    { path: '/',
        name: 'Index',
        component: () =>  import(/* webpackChunkName: "Home" */ '../pages/Index.vue'),
     	//添加一个meta.title的页面标题属性
        meta:{
            title : "后台首页"
        }
    },
    { path: '/login',
        name: 'Login',
        component: () =>  import(/* webpackChunkName: "Login" */ '../pages/Login.vue'),
    	//添加一个meta.title的页面标题属性
        meta:{
            title : "用户登录"
        }
    },
    { path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () =>  import(/* webpackChunkName: "NotFound" */ '../pages/404.vue')
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})

export default router
```

## 三、后台全局layout布局开发

### 1、后台布局规划

创建一个layout目录，并在里面创建admin.vue，后台管理组件

```vue
<template>
<!-- 外层使用element plus提供的容器组件来布局 -->
        <el-container>
                <!-- 头部部分 -->
                <el-header>
                        <!-- 头部导航栏 -->
                        <f-header></f-header>
                </el-header>
                <!-- 侧边栏和主题放到一个容器内 -->

                <el-container>
                        <el-aside>
                            <!-- 侧边栏 -->
                            <f-menu></f-menu>
                        </el-aside>  

                        //主容器分标签导航栏
                        <el-main>
                                标签导航
                                <f-tag-list></f-tag-list>

                                //主容器用router—viwer来渲染主组件
                                <router-view></router-view>

                        </el-main>
                
                </el-container>

        </el-container>
</template>

<script setup>
    import FHeader from "./components/FHeader.vue"
    import FMenu from "./components/FMenu.vue"
    import FTagList from "./components/FTagList.vue"

</script>
```

在layout目录下新建compones目录，管理页面的组件都存放到这里

在componets中新建三个组件,FHeader.vue,FMenu.vue,FTagList.vue

在路由配置中导入

```js
import { createRouter, createWebHashHistory } from 'vue-router'

//配置admin组件路由，admin下的所有组件，添加到children里面
const routes = [{ 
        path: '/',
        name: 'Admin',
        component: () =>  import(/* webpackChunkName: "Home" */ '../layout/admin.vue'),
        children: [{
            path: '/',
            component: () =>  import(/* webpackChunkName: "Home" */ '../pages/Index.vue'),
            meta:{
                title : "后台首页"
            }
        }]
    },
    { path: '/login',
        name: 'Login',
        component: () =>  import(/* webpackChunkName: "Login" */ '../pages/Login.vue'),
        meta:{
            title : "用户登录"
        }
    },
    { path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () =>  import(/* webpackChunkName: "NotFound" */ '../pages/404.vue')
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})

export default router
```

### 2、头部组件开发

头部样式布局

```vue
<template>
    <div class="f-header">
        <!-- logo图标 -->
        <span class="logo">
            <el-icon class="mr-2"><Shop /></el-icon>
            商城后台系统
        </span>

        <!-- 收缩图标 -->
        <el-icon class="icon-btn"><Fold /></el-icon>
         <!-- 刷新图标 -->
        <el-icon class="icon-btn"><Refresh /></el-icon>


        <!-- 右边的图标和下拉菜单放到一个div -->
        <!--  style="margin-left: auto" -->
        <div class="ml-auto flex items-center">

            <!-- 全屏图标 -->
            <el-icon class="icon-btn"><FullScreen /></el-icon>

            <!-- 下拉菜单 -->
            <el-dropdown class="dropdown">

                    <!-- 下拉菜单的头像 -->
                    <span class="flex items-center text-light-50">
                            <!-- 下拉菜单的头像 -->
                            <el-avatar class="mr-2" :size="25" :src="$store.state.user.avatar" />
                            <!-- 下拉菜单头像右边的用户名 -->
                            {{ $store.state.user.username }}
                            <el-icon class="el-icon--right">
                                    <arrow-down />
                            </el-icon>
                    </span>

                    <!-- 下拉菜单 -->
                    <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item>修改密码</el-dropdown-item>
                                <el-dropdown-item>退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                    </template>
                </el-dropdown>
        </div>

    </div>
</template>

<script setup>

</script>

<style scoped>
    .f-header{
        @apply flex items-center bg-indigo-700 text-light-50 fixed top-0 left-0 right-0;
        height: 64px;
    }

    .logo{
        width: 250px;
        @apply flex justify-center items-center text-3xl font-extralight;
    }

    .icon-btn{
        @apply flex justify-center items-center;
        width: 42px;
        height: 64px;
        cursor: pointer;
    }

    .icon-btn:hover{
        @apply bg-indigo-600;
    }

    .f-header .dropdown{
            height: 64px;
            cursor: pointer;
            @apply flex justify-center items-center mx-5;
    }

    .el-icon svg{
        height: 2em;
        width: 2em;
    }
</style>
```

### 3、头部组件开发2

将退出登录按钮放到下拉菜单中，删除index.vue的退出登录相关代码

鼠标移动时显示提示

添加刷新，全屏切换

```bash
#安装vueuse
npm i @vueuse/core
```

```vue
<template>
    <div class="f-header">
        <!-- logo图标 -->
        <span class="logo">
            <el-icon class="mr-2"><Shop /></el-icon>
            商城后台系统
        </span>

        <el-icon class="icon-btn"><Fold /></el-icon>

         <!-- 添加鼠标移动过提示刷新 -->
          <el-tooltip effect="dark" content="刷新" placement="bottom">
                <!-- 添加一个事件监听,点击后刷新页面， -->
                <el-icon class="icon-btn" @click="handleRefresh"><Refresh /></el-icon>
          </el-tooltip>

        <!-- 右边的图标和下拉菜单放到一个div -->
        <div class="ml-auto flex items-center">

            <!-- 添加鼠标移动过提示 -->
            <el-tooltip effect="dark" content="全屏切换" placement="bottom">
                    <el-icon class="icon-btn" @click="toggle">
                        <FullScreen v-if="!isFullscreen" />
                        <el-icon v-else><Aim /></el-icon>
                    </el-icon>
            </el-tooltip>

            <!-- 下拉菜单，添加command事件 -->
            <el-dropdown class="dropdown" @command="handleCommand">

                    <span class="flex items-center text-light-50">

                            <el-avatar class="mr-2" :size="25" :src="$store.state.user.avatar" />

                            {{ $store.state.user.username }}
                            <el-icon class="el-icon--right">
                                    <arrow-down />
                            </el-icon>
                    </span>

                    <!-- 下拉菜单 -->
                    <template #dropdown>
                            <el-dropdown-menu>
                                <!-- 添加command属性，绑定下面的handleCommand -->
                                <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
                                <el-dropdown-item command="logoutAccount">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                    </template>
                </el-dropdown>
        </div>

    </div>
</template>

<script setup>
import {logoutFunction, SuccessMsg} from "~/composable/utils.js";
import router from "~/router/index.js";
import { logoutApi } from "~/api/manager.js";
import {useStore} from 'vuex'

//导入vueuse的方法来实现全屏
import { useFullscreen } from '@vueuse/core'
const { isFullscreen,toggle } = useFullscreen()

//调用原生的js代码刷新页面
const handleRefresh = () => location.reload()

//处理handleCommand事件
const handleCommand = (c) => {
    switch (c){
        case "logoutAccount":
                logout();
                break;
        case "rePassword":
                console.log("修改密码");
                break
    }
}

const store = useStore()

//退出登录功能
function logout(){
    logoutFunction("是否要退出登录",).then( () => {
      logoutApi().finally(() => {

        store.dispatch("logoutAction")

        //跳转回登录页面
        router.push("/login")
        //提示退出成功
        SuccessMsg("已退出！准备去撸串～")
      })
      console.log("退出成功")
    })
}
</script>

<style scoped>
    .f-header{
        @apply flex items-center bg-indigo-700 text-light-50 fixed top-0 left-0 right-0;
        height: 64px;
    }

    .logo{
        width: 250px;
        @apply flex justify-center items-center text-3xl font-extralight;
    }

    .icon-btn{
        @apply flex justify-center items-center;
        width: 42px;
        height: 64px;
        cursor: pointer;
    }

    .icon-btn:hover{
        @apply bg-indigo-600;
    }

    .f-header .dropdown{
            height: 64px;
            cursor: pointer;
            @apply flex justify-center items-center mx-5;
    }

    .el-icon svg{
        height: 2em;
        width: 2em;
    }
</style>
```

### 4、头部组件开发3

修改密码功能

1、在api的manager.js中添加修改密码api

```js
//修改密码api
export function updatePassword(data){
    return axios.post("/admin/updatepassword",data)
}
```

2、添加抽屉组件

```vue
<template>
    <div class="f-header">
        <!-- 左边的logo和图标 -->
        
        <!-- 右边的图标和下拉菜单-->
        <div class="ml-auto flex items-center">
        </div>
    </div>

    <!-- 添加一个修改密码的表单 -->
    <el-drawer v-model="showDrawer" title="修改密码" :close-on-click-modal="false" size="40%">
            <!-- 添加一个form表单 -->
            <el-form ref= formRef :model="form"  :rules="rules" label-width="80px">

                    <el-form-item prop="oldpassword" label="旧密码">
                        <!--username和password和下面style标签中对应-->
                            <el-input v-model="form.oldpassword" placeholder="请输入旧密码"/>
                    </el-form-item>

                    <el-form-item prop="password" label="新密码">
                            <el-input  type="password" show-password v-model="form.password" placeholder="新密码"/>
                    </el-form-item>

                    <el-form-item prop="repassword" label="确认密码">
                            <el-input  type="password" show-password v-model="form.repassword" placeholder="确认新密码"/>
                    </el-form-item>

                    <el-form-item>
                    <el-button type="primary" @click="onSubmit"  :loading="loading">提交</el-button>
                    </el-form-item>

      </el-form>
    </el-drawer>

</template>

<script setup>
//加入修改密码的js代码
import { ref,reactive } from 'vue'

//处理handleCommand事件
const handleCommand = (c) => {
    switch (c){
        case "logoutAccount":
                logout();
                break;
        case "rePassword":
                console.log("修改密码");
                showDrawer.value = true;
                break
    }
}

//修改密码部分
const showDrawer = ref(false)
const form = reactive({
  oldpassword: "",
  password: "",
  repassword: ""
})

const rules = {
  oldpassword:[
      { 
        required: true,
        message: '旧密码不能为空', 
        trigger: 'blur'
       },
  ],
  password:[
          { 
        required: true,
        message: '新密码不能为空', 
        trigger: 'blur'
       },
  ],
  repassword:[
          { 
        required: true,
        message: '确认新密码不能为空', 
        trigger: 'blur'
       },
  ]
}

const formRef = ref(null)
const loading = ref(false)

const onSubmit = () => {
  //先进行参数验证，参数不能为空
  formRef.value.validate((valid) => {
    if(!valid){
      return false
    }
    loading.value = true;
    updatePassword(form)
    .then(res => {
        SuccessMsg("修改密码成功,请重新登录!s")
        store.dispatch("logoutAction")

        //跳转回登录页面
        router.push("/login")
    })
    .finally(() => {
      loading.value = false
    })
  })
}
</script>
```

修改相应拦截器，增加一个判断，如果发现token失效，强制退出登录，并且刷新页面

```js
// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response.data.data;
}, function (error) {
    // 对响应错误做点什么

    const msg = error.response.data.msg || "请求失败"

    if(msg == "非法token，请先登录！"){
            store.dispatch("logoutAction").finally(() => location.reload())
    }

    loginFailMsg(error)
    
    return Promise.reject(error);
});
```

### 5、封装抽屉组建

1、在根目录下的compones目中，新建一个FormDrawer组建，来作为抽屉组建的模版

```vue
<template>
  <!-- 添加一个修改密码的表单 -->
  <el-drawer v-model="showDrawer"
             :title="title"
             :close-on-click-modal="false"
             :size="size"
             :destroy-on-close="destroyOnClose">
      <div class="formDrawer">

            <!-- 抽屉表单部分-->
            <div class="body">
                <slot></slot>
            </div>

            <!-- 提交按钮部分 -->
            <div class="actions">
              <el-button class="mb-4" type="primary" round @click="submit" :loading="loading">{{ confirmText }}</el-button>
              <el-button class="mb-4" type="default" round>取消</el-button>
            </div>
      </div>


  </el-drawer>
</template>

<script setup>
import { ref } from 'vue'
//页面加载进度
const loading = ref(null)
const showLoading = () => loading.value = true
const hideLoading = () => loading.value = false

const showDrawer = ref(false)

//打开抽屉
const open = () => showDrawer.value = true

//关闭抽屉
const close = () => showDrawer.value = false

//提交
const emit = defineEmits(["submit"])
const submit = () => emit("submit")

//向父组建暴露以下内容
defineExpose({
  open,
  close,
  showLoading,
  hideLoading
})

//不同功能模块调用抽屉的时候需要定制，所以要暴露接口给父组建
const props = defineProps({
    title: String,
    size: {
      type: String,
      default: "45%"
    },
    //控制是否在关闭 Drawer 之后将子元素全部销毁
  destroyOnClose:{
      type: Boolean,
      default: false
  },
  confirmText:{
      type: String,
      default: "提交"
  }
})

</script>

<style scoped>
    .formDrawer{
      height: 100%;
      width: 100%;
      position: relative;
      @apply flex flex-col;
    }

    .formDrawer .body{
      flex: 1;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 50px;
      overflow-y: auto;
    }

    .formDrawer .actions{
      height: 50px;
      @apply mt-auto flex items-center;
    }

</style>
```

2、在根目录下的composable目录中新建userManager.js脚本,将退出功能和修改密码功能抽离出来

```js
import {reactive, ref} from "vue";
import {logoutApi, updatePassword} from "~/api/manager.js";
import {logoutFunction, SuccessMsg} from "~/composable/utils.js";
import {useStore} from "vuex";
import {useRouter } from "vue-router";

export function useRePassword() {
    const store = useStore()
    const router = useRouter()

    const formDrawerRef = ref(null)
    const form = reactive({
        oldpassword: "",
        password: "",
        repassword: ""
    })
    const rules = {
        oldpassword: [
            {
                required: true,
                message: '旧密码不能为空',
                trigger: 'blur'
            },
        ],
        password: [
            {
                required: true,
                message: '新密码不能为空',
                trigger: 'blur'
            },
        ],
        repassword: [
            {
                required: true,
                message: '确认新密码不能为空',
                trigger: 'blur'
            },
        ]
    }

    const formRef = ref(null)
    const onSubmit = () => {
        //先进行参数验证，参数不能为空
        formRef.value.validate((valid) => {
            if (!valid) {
                return false
            }
            formDrawerRef.value.showLoading();
            updatePassword(form)
                .then(res => {
                    SuccessMsg("修改密码成功,请重新登录")
                    store.dispatch("logoutAction")

                    //跳转回登录页面
                    router.push("/login")
                    //提示退出成功
                })
                .finally(() => {
                    formDrawerRef.value.hideLoading();
                })
        })
    }

    //点击修改密码会弹出来抽屉
    const openRePasswordForm = () => formDrawerRef.value.open()

    return{
        form,
        formDrawerRef,
        formRef,
        rules,
        onSubmit,
        openRePasswordForm
    }
}

export function useLogout(){
    const store = useStore()
    const router = useRouter()

    function logout() {
        logoutFunction("是否要退出登录",).then(() => {
            logoutApi().finally(() => {

                store.dispatch("logoutAction")

                //跳转回登录页面
                router.push("/login")
                //提示退出成功
                SuccessMsg("已退出！准备去撸串～")
            })
            console.log("退出成功")
        })
    }
    return{
        logout
    }
}
```

3、优化FHeader组件代码，使用抽屉模板

```vue
<template>
  <div class="f-header">
    <!-- logo图标 -->
    <span class="logo">
            <el-icon class="mr-2"><Shop/></el-icon>
            商城后台系统
        </span>

    <!-- 收缩图标 -->
    <el-icon class="icon-btn">
      <Fold/>
    </el-icon>

    <!-- 刷新图标 -->
    <!-- 添加鼠标移动过提示刷新 -->
    <el-tooltip effect="dark" content="刷新" placement="bottom">
      <!-- 添加一个事件监听,点击后刷新页面， -->
      <el-icon class="icon-btn" @click="handleRefresh">
        <Refresh/>
      </el-icon>
    </el-tooltip>

    <!-- 右边的图标和下拉菜单放到一个div -->
    <!--  style="margin-left: auto" -->
    <div class="ml-auto flex items-center">

      <!-- 添加鼠标移动过提示 -->
      <el-tooltip effect="dark" content="全屏切换" placement="bottom">
        <el-icon class="icon-btn" @click="toggle">
          <FullScreen v-if="!isFullscreen"/>
          <el-icon v-else>
            <Aim/>
          </el-icon>
        </el-icon>
      </el-tooltip>

      <!-- 下拉菜单，添加command事件 -->
      <el-dropdown class="dropdown" @command="handleCommand">

        <!-- 下拉菜单的头像 -->
        <span class="flex items-center text-light-50">

                            <!-- 下拉菜单的头像 -->
                            <el-avatar class="mr-2" :size="25" :src="$store.state.user.avatar"/>

          <!-- 下拉菜单头像右边的用户名 -->
                            {{ $store.state.user.username }}
                            <el-icon class="el-icon--right">
                                    <arrow-down/>
                            </el-icon>
                    </span>

        <!-- 下拉菜单 -->
        <template #dropdown>
          <el-dropdown-menu>
            <!-- 添加command属性 -->
            <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="logoutAccount">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>

  <form-drawer ref="formDrawerRef" title="修改密码" destroy-on-close @submit="onSubmit">
    <el-form ref=formRef :model="form" :rules="rules" label-width="80px">

      <el-form-item prop="oldpassword" label="旧密码">
        <!--username和password和下面style标签中对应-->
        <el-input v-model="form.oldpassword" placeholder="请输入旧密码"/>
      </el-form-item>

      <el-form-item prop="password" label="新密码">
        <el-input type="password" show-password v-model="form.password" placeholder="新密码"/>
      </el-form-item>

      <el-form-item prop="repassword" label="确认密码">
        <el-input type="password" show-password v-model="form.repassword" placeholder="确认新密码"/>
      </el-form-item>

    </el-form>
  </form-drawer>


</template>

<script setup>
//导入抽屉组建
import FormDrawer from "~/components/FormDrawer.vue";
import {useStore} from "vuex";
//全屏切换
import {useFullscreen} from "@vueuse/core";
const {isFullscreen, toggle} = useFullscreen()
//使用useRePassword
import { useLogout,useRePassword } from "~/composable/useManagers.js";
const { form,formDrawerRef,formRef,rules,onSubmit,openRePasswordForm } = useRePassword()
const { logout } = useLogout()
//调用原生的js代码刷新页面
const handleRefresh = () => location.reload()
const store = useStore()

//处理handleCommand事件
const handleCommand = (c) => {
  switch (c) {
    case "logoutAccount":
      logout();
      break;
    case "rePassword":
      //点击修改密码会弹出来抽屉
      openRePasswordForm();
      break
  }
}

</script>

<style scoped>
.f-header {
  @apply flex items-center bg-indigo-700 text-light-50 fixed top-0 left-0 right-0;
  height: 64px;
}

.logo {
  width: 250px;
  @apply flex justify-center items-center text-3xl font-extralight;
}

.icon-btn {
  @apply flex justify-center items-center;
  width: 42px;
  height: 64px;
  cursor: pointer;
}

.icon-btn:hover {
  @apply bg-indigo-600;
}

.f-header .dropdown {
  height: 64px;
  cursor: pointer;
  @apply flex justify-center items-center mx-5;
}

.el-icon svg {
  height: 2em;
  width: 2em;
}
</style>
```

### 6、侧边栏开发

1、开发侧边栏，

2、设置侧边栏收缩动画

```vue
<template>
    <div class="f-menu" :style="{width:$store.state.asideWidth}" >
    <!-- collapse-transition关闭折叠动画;unique-opend 只是展开一个字菜单 -->
        <el-menu :default-active="defaultActive" unique-opened :collapse="isCollapse" default-active="2" class="border-0" @select="handleSelect" :collapse-transition="false">
        
            <template v-for="(item,index) in asideMenus" :key="index">
                <el-sub-menu v-if="item.child && item.child.length > 0" :index="item.name">
                
                    <!-- 循环展示菜单 -->
                    <template #title>
                        <el-icon>
                            <component :is="item.icon"></component>
                        </el-icon>
                        <span>{{ item.name }}</span>
                    </template>

                    <!-- 循环展示2级菜单 -->
                    <el-menu-item v-for="(item2,index2) in item.child" :key="index2" :index="item2.frontpath">
                        <el-icon>
                            <component :is="item2.icon"></component>
                        </el-icon>
                        <span>{{ item2.name }}</span>
                    </el-menu-item>
                
                </el-sub-menu>

                <el-menu-item v-else :index="item.frontpath">

                    <el-icon>
                        <component :is="item.icon"></component>
                    </el-icon>

                    <span>{{ item.name }}</span>
                </el-menu-item>
            </template>

      </el-menu>
    </div>
</template>

<script setup>
import {useRouter} from 'vue-router'
import {computed,ref} from 'vue'
import {useStore,useRoute} from 'vuex'

const router = useRouter()
const route = useRoute()
const defaultActive = ref(route.path)
// 是否折叠
const store = useStore()
const isCollapse = computed( () => !(store.state.asideWidth == '250px'))


    const asideMenus = [{
        "name": "后台面板", 
        "icon": "help",
        "child": [{
            "name": "主控台",
            "icon": "home-filled", 
            "frontpath": "/", 
        }]
    },{
        "name": "商城管理", 
        "icon": "shopping-bag",
        "child": [{
            "name": "商品管理",
            "icon": "shopping-cart-full", 
            "frontpath": "/goods/list", 
        }]
    }]


    const handleSelect = (e) => {
        router.push(e)
        console.log(e);
    }
</script>

<style scoped>
    .f-menu{
        /* 如果要实现动态的开关收缩菜单，这里宽度就不能指定，要和store中的asideWidth动态绑定，可以在标签中绑定 */
        /* width: 250px; */

        /* 添加展开的动画效果 */
        transition: all 0.2s;
        @apply fixed shadow-md bg-light-50;
        top: 64px;
        bottom: 0px;
        left: 0px;
        overflow: auto;
    }
    /* 隐藏侧边栏滚动条 */
    .f-menu::-webkit-scrollbar{
        width: 0px;
    }
</style>
```

在pages目录下，新建goods目录，新建list.vue

```vue
<template>
    <div>
        商品管理
    </div>
</template>
```

配置路由

```js
import { createRouter, createWebHashHistory } from 'vue-router'
// 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。
const routes = [
    { 
        path: '/',
        name: 'Admin',
        component: () =>  import(/* webpackChunkName: "Home" */ '../layout/admin.vue'),
        children: [
            {
                path: '/',
                component: () =>  import(/* webpackChunkName: "Home" */ '../pages/Index.vue'),
                meta:{
                    title : "后台首页"
            }
        },{ 
                path: '/goods/list',
                name: 'GoodList',
                component: () =>  import(/* webpackChunkName: "NotFound" */ '../pages/goods/list.vue'),
                meta:{
                    title : "商品管理",
                }
            },
        ],
    },
    { 
        path: '/login',
        name: 'Login',
        component: () =>  import(/* webpackChunkName: "Login" */ '../pages/Login.vue'),
        meta:{
            title : "用户登录"
        }
    },
    { 
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () =>  import(/* webpackChunkName: "NotFound" */ '../pages/404.vue')
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

export default router
```

配置store文件

```js
import { createStore } from 'vuex'
import {getInfo, login} from "~/api/manager.js";
import { setToken,removeToken } from "~/composable/auth.js";

const store = createStore({
    state () {
        return {
            user:{},

            //侧边宽度
            asideWidth: "250px",
        }
    },
    mutations: {
        SET_USERINFO(state,user){
            state.user = user
        },
        //动态修改侧边菜单
        handleAsideWidth(state){
            state.asideWidth = state.asideWidth == "250px" ? "64px" : "250px"
        }

    },
    actions: {
        //登录功能
        login({commit},{ username,password }){
            return new Promise( (resolve, reject) => {
                login(username,password).then( res => {
                    //存储cookie
                    setToken(res.token)
                    console.log("打印token:" + res.token)
                    resolve(res)

                }).catch(err => reject(err))
            })
        },

        //获取当前登录的用户信息
        getInfo({commit}){
            return new Promise((resolve,reject) => {
                getInfo().then(res => {
                    //调用SET_USERINFO函数，将信息赋值给state中的user
                    commit("SET_USERINFO",res)
                    resolve(res)
                }).catch(err => reject(err))
            })
        },

        //退出登录的logout
        logoutAction({ commit }){
            //移除cookie中的token
            removeToken()
            //清除当前用户状态,清除store，state中的user
            commit("SET_USERINFO",{})
        }
        //第二种清空用户数据的方法
        // logoutAction(state){
        //     //移除cookie中的token
        //     removeToken()
        //     //清除当前用户状态,清除store，state中的user
        //     state.user = {}
        // }
    }
})

export default store
```

修改FHeader设置收缩按钮

```vue
<template>
  <div class="f-header">
    <!-- logo图标 -->
    <span class="logo">
            <el-icon class="mr-2"><Shop/></el-icon>
            商城后台系统
        </span>

    <!-- 收缩图标添加监听事件 -->
    <el-icon class="icon-btn" @click="$store.commit('handleAsideWidth')">
      <Fold v-if="$store.state.asideWidth == '250px'"/>
      <Expand v-else />
    </el-icon>

    <!-- 刷新图标 -->
    <!-- 添加鼠标移动过提示刷新 -->
    <el-tooltip effect="dark" content="刷新" placement="bottom">
      <!-- 添加一个事件监听,点击后刷新页面， -->
      <el-icon class="icon-btn" @click="handleRefresh">
        <Refresh/>
      </el-icon>
    </el-tooltip>

    <!-- 右边的图标和下拉菜单放到一个div -->
    <!--  style="margin-left: auto" -->
    <div class="ml-auto flex items-center">

      <!-- 添加鼠标移动过提示 -->
      <el-tooltip effect="dark" content="全屏切换" placement="bottom">
        <el-icon class="icon-btn" @click="toggle">
          <FullScreen v-if="!isFullscreen"/>
          <el-icon v-else>
            <Aim/>
          </el-icon>
        </el-icon>
      </el-tooltip>

      <!-- 下拉菜单，添加command事件 -->
      <el-dropdown class="dropdown" @command="handleCommand">

        <!-- 下拉菜单的头像 -->
        <span class="flex items-center text-light-50">

                            <!-- 下拉菜单的头像 -->
                            <el-avatar class="mr-2" :size="25" :src="$store.state.user.avatar"/>

                            <!-- 下拉菜单头像右边的用户名 -->
                            {{ $store.state.user.username }}
                            <el-icon class="el-icon--right">
                                    <arrow-down/>
                            </el-icon>
                    </span>

        <!-- 下拉菜单 -->
        <template #dropdown>
          <el-dropdown-menu>
            <!-- 添加command属性 -->
            <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="logoutAccount">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>

  <form-drawer ref="formDrawerRef" title="修改密码" destroy-on-close @submit="onSubmit">
    <el-form ref=formRef :model="form" :rules="rules" label-width="80px">

      <el-form-item prop="oldpassword" label="旧密码">
        <!--username和password和下面style标签中对应-->
        <el-input v-model="form.oldpassword" placeholder="请输入旧密码"/>
      </el-form-item>

      <el-form-item prop="password" label="新密码">
        <el-input type="password" show-password v-model="form.password" placeholder="新密码"/>
      </el-form-item>

      <el-form-item prop="repassword" label="确认密码">
        <el-input type="password" show-password v-model="form.repassword" placeholder="确认新密码"/>
      </el-form-item>

    </el-form>
  </form-drawer>


</template>

<script setup>
//导入抽屉组建
import FormDrawer from "~/components/FormDrawer.vue";
import {useStore} from "vuex";
//全屏切换
import {useFullscreen} from "@vueuse/core";
const {isFullscreen, toggle} = useFullscreen()
//使用useRePassword
import { useLogout,useRePassword } from "~/composable/useManagers.js";
const { form,formDrawerRef,formRef,rules,onSubmit,openRePasswordForm } = useRePassword()
const { logout } = useLogout()
//调用原生的js代码刷新页面
const handleRefresh = () => location.reload()
const store = useStore()

//处理handleCommand事件
const handleCommand = (c) => {
  switch (c) {
    case "logoutAccount":
      logout();
      break;
    case "rePassword":
      //点击修改密码会弹出来抽屉
      openRePasswordForm();
      break
  }
}

</script>

<style scoped>
.f-header {
  @apply flex items-center bg-indigo-700 text-light-50 fixed top-0 left-0 right-0;
  height: 64px;
}

.logo {
  width: 250px;
  @apply flex justify-center items-center text-2xl font-extralight;
}

.icon-btn {
  @apply flex justify-center items-center;
  width: 42px;
  height: 64px;
  cursor: pointer;
}

.icon-btn:hover {
  @apply bg-indigo-600;
}

.f-header .dropdown {
  height: 64px;
  cursor: pointer;
  @apply flex justify-center items-center mx-5;
}

.el-icon svg {
  height: 2em;
  width: 2em;
}
</style>
```

### 7、菜单数据前后交互

修改store把后端的数据存进来

```js
import { createStore } from 'vuex'
import {getInfo, login} from "~/api/manager.js";
import { setToken,removeToken } from "~/composable/auth.js";

const store = createStore({
    state () {
        return {
            user:{},

            //侧边宽度
            asideWidth: "250px",

            menus: [],
            ruleNames:[]
        }
    },
    mutations: {
        SET_USERINFO(state,user){
            state.user = user
        },
        handleAsideWidth(state){
            state.asideWidth = state.asideWidth == "250px" ? "64px" : "250px"
        },
        //获取后端数据，忖道state中
        SET_MENUS(state,menus){
            state.menus = menus
        },
        SET_RULENAMES(state,ruleNames){
            state.ruleNames = ruleNames
        }

    },
    actions: {
        //登录功能
        login({commit},{ username,password }){
            return new Promise( (resolve, reject) => {
                login(username,password).then( res => {
                    //存储cookie
                    setToken(res.token)
                    console.log("打印token:" + res.token)
                    resolve(res)

                }).catch(err => reject(err))
            })
        },

        //获取当前登录的用户信息
        getInfo({commit}){
            return new Promise((resolve,reject) => {
                getInfo().then(res => {
                    //获取后端数据，存到state中
                    commit("SET_USERINFO",res)
                    commit("SET_MENUS",res.menus)
                    commit("SET_RULENAMES",res.ruleNames)
                    console.log(res);
                    resolve(res)
                }).catch(err => reject(err))
            })
        },

        //退出登录的logout
        logoutAction({ commit }){
            //移除cookie中的token
            removeToken()
            //清除当前用户状态,清除store，state中的user
            commit("SET_USERINFO",{})
        }
        //第二种清空用户数据的方法
        // logoutAction(state){
        //     //移除cookie中的token
        //     removeToken()
        //     //清除当前用户状态,清除store，state中的user
        //     state.user = {}
        // }
    }
})

export default store
```

在pages目录下新建category目录，再新建一个list.vue

```vue
<template>
    <div>
        分类列表
    </div>
</template>
```

添加category的路由

```js
import { createRouter, createWebHashHistory } from 'vue-router'
// 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。
const routes = [
    { 
        path: '/',
        name: 'Admin',
        component: () =>  import(/* webpackChunkName: "Home" */ '../layout/admin.vue'),
        children: [
            {
                path: '/',
                component: () =>  import(/* webpackChunkName: "Home" */ '../pages/Index.vue'),
                meta:{
                    title : "后台首页"
            }
            },{ 
                path: '/goods/list',
                name: 'GoodList',
                component: () =>  import(/* webpackChunkName: "NotFound" */ '../pages/goods/list.vue'),
                meta:{
                    title : "商品管理",
                }
            },
            { 
                path: '/category/list',
                name: 'Category',
                component: () =>  import(/* webpackChunkName: "分类列表" */ '../pages/category/list.vue'),
                meta:{
                    title : "分类列表",
                }
            },
        ],
    },
    { 
        path: '/login',
        name: 'Login',
        component: () =>  import(/* webpackChunkName: "Login" */ '../pages/Login.vue'),
        meta:{
            title : "用户登录"
        }
    },
    { 
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () =>  import(/* webpackChunkName: "NotFound" */ '../pages/404.vue')
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

export default router
```

### 8、根据菜单动态添加路由

```js
import { createRouter, createWebHashHistory } from 'vue-router'
// 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。

const routes = [
    { 
        path: '/',
        name: 'admin',
        component: () =>  import(/* webpackChunkName: "Home" */ '../layout/admin.vue'),
    },
    { 
        path: '/login',
        name: 'Login',
        component: () =>  import(/* webpackChunkName: "Login" */ '../pages/Login.vue'),
        meta:{
            title : "用户登录"
        }
    },
    { 
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () =>  import(/* webpackChunkName: "NotFound" */ '../pages/404.vue')
    },
]

//定义动态路由，用于匹配菜单，动态添加路由
const asyncRoutes = [
    {
        path: '/',
        name: '/',
        component: () =>  import(/* webpackChunkName: "Home" */ '../pages/Index.vue'),
        meta:{
            title : "后台首页"
        }
    },{ 
        path: '/goods/list',
        name: '/goods/list',
        component: () =>  import(/* webpackChunkName: "NotFound" */ '../pages/goods/list.vue'),
        meta:{
            title : "商品管理",
        }
    },
    { 
        path: '/category/list',
        name: '/category/list',
        component: () =>  import(/* webpackChunkName: "分类列表" */ '../pages/category/list.vue'),
        meta:{
            title : "分类列表",
        }
    },
]

// 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
export const router = createRouter({
    // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})


//定义动态添加路由的方法
export function addRoutes(menus){
    //是否有新路由
    let hasNewRoute = false
    
    const findAndAddRouteByMenus = (arr) => {
        arr.forEach(e => {
            e.frontpath
            let item = asyncRoutes.find(o => o.path == e.frontpath )
            //如果递归查询到的路由是true，并且之前的路由列表里面没有它，那么把这个路由添加到routes去
            if(item && !router.hasRoute(item.path)) { 
                router.addRoute("admin",item)
                hasNewRoute = true
            }
             //如果拥有child，并且child的长度 > 0，那么在此调用自身，来添加到routes路由中
            if(e.child && e.child.length > 0) findAndAddRouteByMenus(e.child)
        })
    }

    findAndAddRouteByMenus(menus)
    return hasNewRoute

}
```

由于在路由配置中，修改对router的定义，所以需要在main.js和permission.js中从新导入router

```js
import { router } from './router'
```

在permission.js中，获取到信息并且存储到sstore中后，就可以设置路由了

```js
import { addRoutes, router } from './router'
import { getToken } from "~/composable/auth.js";
import { loginFirst,showFullLoading,hideFullLoading } from "~/composable/utils.js";
import store from "~/store/index.js";


//配置全局前置守卫
router.beforeEach(async (to, from,next) => {
    //显示loading进度条
    showFullLoading()

    //如果token不存在，证明没有登录，并且要去的页面不是login，那么钩子函数会跳转到登录页面
    const token = getToken();
    if(!token && to.path != "/login"){
        loginFirst()
        return next({path:"/login"})
    }

    //如果token存在，证明已经登录，这时不需要进入登录页面
    if(token && to.path == "/login"){
        //如果要返回的页面不存在，那就强制跳转到登录页
        return next({path: from.path ? from.path : "/login"})
    }


    let hasNewRoutes = false

    //如果已经登录，获取并且保存用户信息到store中
    if(token){
        //在store中action存储的函数，在这里要使用dispatch来调度。这里使用await的时候，在钩子函数的参数中要添加async
        let { menus } = await store.dispatch("getInfo")
        hasNewRoutes = addRoutes(menus)
    }

    //设置页面标题
    let title = to.meta.title ? to.meta.title : ""
    document.title = title

    hasNewRoutes ? next(to.fullPath) : next()
})

//全局后置钩子结束进度条
router.afterEach((to, from) => hideFullLoading())
```

### 9、标签导航栏设计

```vue
<template>
    <div class="f-tag-list" :style="{left:$store.state.asideWidth}">

        <!-- style="min-width: 100px" 设置导航标签过多后开启左右滑动功能 -->
        <!-- 把el-tabs的closable去掉，绑定到el-tab-pane中，后面首页活动标签没有关闭按钮-->
        <!-- tab-change	活动标签改改变时触发的事件-->
        <el-tabs @tab-change="changeTab" v-model="activeTab" type="card" class="demo-tabs" @tab-remove="removeTab" style="min-width: 100px">
            <el-tab-pane :closable="item.path != '/'" v-for="item in tabList" :key="item.path" :label="item.title" :name="item.path"> </el-tab-pane>
        </el-tabs>

        <span class="tag-btn">
            <!-- 添加command事件监听，来绑定clearOther和clearAll -->
            <el-dropdown @command="handleClose" >
                <span class="el-dropdown-link">
                    <el-icon>
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="clearOther">关闭其他标签</el-dropdown-item>
                        <el-dropdown-item command="clearAll">关闭所有标签</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </span>
        
    </div>
    <div style="height: 44px">

    </div>
</template>


<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { useTabList} from "~/composable/useTabList.js"
const { activeTab,
        tabList,
        changeTab,
        removeTab,
        handleClose } = useTabList()
</script>


<style scoped>
    .f-tag-list{
        @apply fixed bg-gray-200 flex items-center px-2;
        top: 64px;
        right: 0px;
        height: 44px;
        z-index: 100;
    }

    .tag-btn{
        @apply bg-indigo-400 rounded ml-auto flex items-center justify-center px-2;
        height: 32px;
    }

    :deep(.el-tabs__header){
        @apply mb-0;
    }

    :deep(.el-tabs__nav){
        border: 0!important;
    }

    :deep(.el-tabs__item){
        border: 0!important;
        height: 32px;
        line-height: 32px;
        margin-top: 4px;
        @apply bg-white mx-1 rounded-2xl;
    }

    /*导航栏滑动到头后变成禁止符号*/
    :deep(.is-disabled){
        cursor: not-allowed;
        @apply text-gray-300;
    }
</style>
```

将导航标签的处理函数封装成一个js文件。useTabList.js

```js
import { ref } from 'vue'
import {useRoute,onBeforeRouteUpdate} from 'vue-router'
import { useCookies } from '@vueuse/integrations/useCookies'
import {router} from "~/router/index.js";

export function useTabList(){
    //活动标签的标题对应侧边栏的路由路径
    const route = useRoute()
    const activeTab = ref(route.path)

    const tabList = ref([
        {
            title: '后台首页',
            path: '/',
        },
    ])

    const cookie = useCookies()
    const addTab =(tab) => {
        //判断tablist中是否有这个路由，如果没有，就添加新路由到tablist中，等于-1，noThisTab就是true，证明没有，如果返回0，就是false，证明有了。
        let noThisTab = tabList.value.findIndex(t=>t.path == tab.path) == -1
        if(noThisTab){
        tabList.value.push(tab)
        }
        //将新的标签添加到cookie防止刷新后标签关闭
        cookie.set("tabList",tabList.value)
    }

    onBeforeRouteUpdate( (to,from) => {
    //在添加时，直接激活这个标签
    activeTab.value = to.path

    //在路由更新前，在导航栏添加活动标签
    addTab({
            title: to.meta.title,
            path: to.path
        })
    })

    //活动标签改变时出发的事件
    const changeTab = (t) => {
        //把这个页面的额活动标签激活
        activeTab.value = t
        //路由跳转到这个页面
        router.push(t)
    }

    //为了防止页面刷新后，所有的活动标签会关闭，所以初始化标签导航列表
    const initTabList = () => {
        //从cookie获取标签导航列表
        let tbl = cookie.get("tabList")
        if(tbl) tabList.value = tbl
    }
    initTabList()

    const removeTab = (t) => {
        //6、removeTab 执行完毕后，触发changeTab事件

        let tabs = tabList.value
        let a = activeTab
        //1、如果当前活动页标签等于要关闭的标签
        if(a == t){
            tabs.forEach((tab,index) => {
                //2、如果要关闭的t标签和tab.path标签的path一样，那么获取这个要关闭标签的上一个或者下一个标签
                if(tab.path == t){
                        const nextTabl = tabs[index + 1] || tabs[index-1]

                        //3、拿到标签后，把它赋值给当前激活的标签
                        if(nextTabl){
                        activeTab.value = nextTabl.path
                        }
                }
            });
        }
        //4、将tabList中存在的活动页标签去掉
        tabList.value = tabList.value.filter( tab => tab.path != t)

        //5、存储新的tabList到cookie中
        cookie.set("tabList",tabList.value)
    }

    const handleClose = (c) => {
        if(c == "clearAll"){
            //1、把激活的活动标签切换到默认首页
            activeTab.value = "/"
            //2、过滤只剩下首页
            tabList.value = tabList.value.filter(tab => tab.path == "/")
        }else if(c == "clearOther"){
            tabList.value = tabList.value.filter(tab => tab.path == "/" || tab.path == activeTab.value)
        }
        cookie.set("tabList",tabList.value)
    }

    return {
        activeTab,
        tabList,
        changeTab,
        removeTab,
        handleClose
    }
}
```

router路由配置文件

```js
import { createRouter, createWebHashHistory } from 'vue-router'
// 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。

const routes = [
    { 
        path: '/',
        name: 'admin',
        component: () =>  import(/* webpackChunkName: "Home" */ '../layout/admin.vue'),
    },
    { 
        path: '/login',
        name: 'Login',
        component: () =>  import(/* webpackChunkName: "Login" */ '../pages/Login.vue'),
        meta:{
            title : "用户登录"
        }
    },
    { 
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () =>  import(/* webpackChunkName: "NotFound" */ '../pages/404.vue')
    },
]

//定义动态路由，用于匹配菜单，动态添加路由
const asyncRoutes = [
    {
        path: '/',
        name: '/',
        component: () =>  import(/* webpackChunkName: "Home" */ '../pages/Index.vue'),
        meta:{
            title : "后台首页"
        }
    },{ 
        path: '/goods/list',
        name: '/goods/list',
        component: () =>  import(/* webpackChunkName: "NotFound" */ '../pages/goods/list.vue'),
        meta:{
            title : "商品管理",
        }
    },
    { 
        path: '/category/list',
        name: '/category/list',
        component: () =>  import(/* webpackChunkName: "分类列表" */ '../pages/category/list.vue'),
        meta:{
            title : "分类列表",
        }
    },
]

// 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
export const router = createRouter({
    // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})


//定义动态添加路由的方法
export function addRoutes(menus){
    //是否有新路由
    let hasNewRoute = false
    
    const findAndAddRouteByMenus = (arr) => {
        arr.forEach(e => {
            e.frontpath
            let item = asyncRoutes.find(o => o.path == e.frontpath )
            //如果递归查询到的路由是true，并且之前的路由列表里面没有它，那么把这个路由添加到routes去
            if(item && !router.hasRoute(item.path)) { 
                router.addRoute("admin",item)
                hasNewRoute = true
            }
             //如果拥有child，并且child的长度 > 0，那么在此调用自身，来添加到routes路由中
            if(e.child && e.child.length > 0) findAndAddRouteByMenus(e.child)
        })
    }

    findAndAddRouteByMenus(menus)
    return hasNewRoute

}
```

## 四、后台主控台开发和交互

### 1、统计组件面板开发

在api中新建一个index.js的文件，对应index.vue组件。导入axios

```js
import axios from "~/axios"

export function getStatistics1(){
    return axios.get("/admin/statistics1")
}
```

修改index.vue组件,布局页面，导入卡element plus的卡片组件和骨架屏。组件的工作流程是，当进入后台页面后，panels没有加载出来，panels.length长度是0，此时股价瓶的效果会出来，而下面真正卡片的内容还没有加载出来，所以没有在页面上显示，等页面上panels的数据加载完毕后，骨架屏会隐藏，真正的卡片内容就会加载出来

```vue
<template>
  <div>

      <!-- 使用layout布局 -->
      <el-row :gutter="20">
            <template v-if="panels.length == 0">
              <el-col :span="6" :offset="0" v-for="i in 4" :key="i">

                <!-- 使用骨架屏 -->
                <!-- animated 和 loading是加载动画效果 -->
                <el-skeleton style="width: 100%" animated loading>
                  <template #template>
                    <!-- 使用ep 的卡片组件 -->
                    <el-card shadow="hover" :body-style="{ padding: '20px' }">
                      <template #header>
                        <div class="flex justify-between">
                          <!-- 卡片标题 -->
                          <el-skeleton-item variant="text" style="width: 50%" />

                          <el-skeleton-item variant="text" style="width: 15%" />

                        </div>
                      </template>

                      <!-- 卡片的body -->
                      <el-skeleton-item variant="h3" style="width: 80%" />

                      <!-- 分割线 -->
                      <el-divider />

                      <div class="flex justify-between">
                        <el-skeleton-item variant="text" style="width: 50%" />
                        <el-skeleton-item variant="text" style="width: 15%" />
                      </div>

                    </el-card>
                  </template>
                </el-skeleton>
              </el-col>
            </template>

        
            <el-col :span="6" :offset="0" v-for="(item,index) in panels" :key="index">
                  <!-- 使用ep 的卡片组件 -->
                  <el-card shadow="hover" :body-style="{ padding: '20px' }">
                        <template #header>
                              <div class="flex justify-between">
                                    <!-- 卡片标题 -->
                                    <span>{{ item.title }}</span>

                                    <el-tag :type="item.unitColor" effect="dark">
                                        {{ item.unit }}
                                    </el-tag>
                              </div>
                        </template>

                        <!-- 卡片的body -->
                        <span class="text-3xl font-bold">
                              {{ item.value }}
                        </span>

                        <!-- 分割线 -->
                        <el-divider />

                        <div class="flex justify-between">
                              <span>{{ item.subTitle }}</span>
                              <span>{{ item.subValue }}</span>
                        </div>

                  </el-card>
              
            </el-col>
      </el-row>

  </div>
</template>

<script setup>
    import { ref } from "vue"
    import { getStatistics1 } from "~/api/index.js"

    //获取面板信息
    const panels = ref([])
    getStatistics1()
    .then( res => {
        console.log(res);
        panels.value = res.panels
    })

</script>
```

给数据添加滚动动画效果，在npm网找到gsap模块，安装到工程中。

```bash
npm i gsap
```

在根目录下的components新建一个CountTo.vue组件

```vue
<template>
    {{ d.num.toFixed(0)}}
</template>

<script setup>
import {reactive, watch} from "vue";
import gsap from "gsap"

//定义从父组件接受数据
const props = defineProps({
    value: {
        type: Number,
        default: 0
    }
})

//设置动画从哪里开始滚动
const d = reactive({
    num:0
})

//定义滚动的函数
function AnimateToValue(){
    gsap.to(d,{
        duration:0.5,
        num:props.value
    })
}
//开启监听，发现数据改变就开始滚动
watch( () => props.value,() => AnimateToValue())
</script>
```

调用CountTo组件，将上面的index.vue组件修改成如下，实现卡片内数字的动画效果

```vue
<template>
  <div>

      <!-- 使用layout布局 -->
      <el-row :gutter="20">
            <template v-if="panels.length == 0">
              <el-col :span="6" :offset="0" v-for="i in 4" :key="i">

                <!-- 使用骨架屏 -->
                <!-- animated 和 loading是加载动画效果 -->
                <el-skeleton style="width: 100%" animated loading>
                  <template #template>
                    <!-- 使用ep 的卡片组件 -->
                    <el-card shadow="hover" :body-style="{ padding: '20px' }">
                      <template #header>
                        <div class="flex justify-between">
                          <!-- 卡片标题 -->
                          <el-skeleton-item variant="text" style="width: 50%" />

                          <el-skeleton-item variant="text" style="width: 15%" />

                        </div>
                      </template>

                      <!-- 卡片的body -->
                      <el-skeleton-item variant="h3" style="width: 80%" />

                      <!-- 分割线 -->
                      <el-divider />

                      <div class="flex justify-between">
                        <el-skeleton-item variant="text" style="width: 50%" />
                        <el-skeleton-item variant="text" style="width: 15%" />
                      </div>

                    </el-card>
                  </template>
                </el-skeleton>
              </el-col>
            </template>


            <el-col :span="6" :offset="0" v-for="(item,index) in panels" :key="index">
                  <!-- 使用ep 的卡片组件 -->
                  <el-card shadow="hover" :body-style="{ padding: '20px' }">
                        <template #header>
                              <div class="flex justify-between">
                                    <!-- 卡片标题 -->
                                    <span>{{ item.title }}</span>

                                    <el-tag :type="item.unitColor" effect="dark">
                                        {{ item.unit }}
                                    </el-tag>
                              </div>
                        </template>

                        <!-- 卡片的body --><!-- 引入滚动动画 -->
                        <span class="text-3xl font-bold">
                              <CountTo :value="item.value"/>
                        </span>

                        <!-- 分割线 -->
                        <el-divider />

                        <div class="flex justify-between">
                              <span>{{ item.subTitle }}</span>
                              <span>{{ item.subValue }}</span>
                        </div>

                  </el-card>

            </el-col>
      </el-row>

  </div>
</template>

<script setup>
    import { ref } from "vue"
    import { getStatistics1 } from "~/api/index.js"
    import CountTo from "~/components/CountTo.vue"

    //获取面板信息
    const panels = ref([])
    getStatistics1()
    .then( res => {
        panels.value = res.panels
    })
</script>
```

### 2、分类组件开发和跳转

在根目录下的component目录下新建indexNavs.vue组件。

```vue
<template>
    <!-- 使用layout布局 -->
    <el-row :gutter="3" class="mt-10">
        <el-col :span="3" :offset="0" v-for="(item,index) in iconNavs" :key="index">
        
        <!-- 使用卡片布局 -->
        <el-card shadow="hover" @click="$router.push(item.path)">
            <div class="flex flex-col items-center justify-center cursor-pointer">
                <el-icon :class="item.color" :size="45" >
                    <component :is="item.icon"/>
                </el-icon>
                <span class="text-2xl">分类</span>
            </div>
        </el-card>

        </el-col> 
    </el-row>
</template>
    
<script setup>

const iconNavs = [
    {
        icon: "user",
        color: "text-light-blue-500",
        title: "用户",
        path: "/user/list"
    },
    {
        icon: "shopping-cart",
        color: "text-violet-500",
        title: "商品",
        path: "/goods/list"
    },
    {
        icon: "tickets",
        color: "text-fuchsia-500",
        title: "订单",
        path: "/order/list"
    },
    {
        icon: "user",
        color: "text-light-blue-500",
        title: "评价",
        path: "/comment/list"
    },
    {
        icon: "picture",
        color: "text-rose-500",
        title: "图库",
        path: "/image/list"
    },
    {
        icon: "bell",
        color: "text-light-blue-500",
        title: "公告",
        path: "/notice/list"
    },
    {
        icon: "set-up",
        color: "text-grey-500",
        title: "配置",
        path: "/setting/base"
    },
    {
        icon: "files",
        color: "text-yellow-500",
        title: "优惠券",
        path: "/coupon/list"
    }
]

</script>
```

在pages目录下，创建user,coupon,order,comment,notice,image目录，每个目录创建一个list组件。创建setting目录，在里面创建base组件。

然后配置路由，

```js
import { createRouter, createWebHashHistory } from 'vue-router'
// 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。

const routes = [
    { 
        path: '/',
        name: 'admin',
        component: () =>  import(/* webpackChunkName: "Home" */ '../layout/admin.vue'),
    },
    { 
        path: '/login',
        name: 'Login',
        component: () =>  import(/* webpackChunkName: "Login" */ '../pages/Login.vue'),
        meta:{
            title : "用户登录"
        }
    },
    { 
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () =>  import(/* webpackChunkName: "NotFound" */ '../pages/404.vue')
    },
]

//定义动态路由，用于匹配菜单，动态添加路由
const asyncRoutes = [
    {
        path: '/',
        name: '/',
        component: () =>  import(/* webpackChunkName: "Home" */ '../pages/Index.vue'),
        meta:{
            title : "后台首页"
        }
    },{ 
        path: '/goods/list',
        name: '/goods/list',
        component: () =>  import(/* webpackChunkName: "商品管理" */ '../pages/goods/list.vue'),
        meta:{
            title : "商品管理",
        }
    },
    { 
        path: '/category/list',
        name: '/category/list',
        component: () =>  import(/* webpackChunkName: "分类列表" */ '../pages/category/list.vue'),
        meta:{
            title : "分类列表",
        }
    },
    { 
        path: '/user/list',
        name: '/user/list',
        component: () =>  import(/* webpackChunkName: "用户列表" */ '../pages/user/list.vue'),
        meta:{
            title : "用户列表",
        }
    },
    { 
        path: '/order/list',
        name: '/order/list',
        component: () =>  import(/* webpackChunkName: "订单列表" */ '../pages/order/list.vue'),
        meta:{
            title : "订单列表",
        }
    },
    { 
        path: '/image/list',
        name: '/image/list',
        component: () =>  import(/* webpackChunkName: "图片列表" */ '../pages/image/list.vue'),
        meta:{
            title : "图片列表",
        }
    },
    { 
        path: '/comment/list',
        name: '/comment/list',
        component: () =>  import(/* webpackChunkName: "评价列表" */ '../pages/comment/list.vue'),
        meta:{
            title : "评价列表",
        }
    },
    { 
        path: '/notice/list',
        name: '/notice/list',
        component: () =>  import(/* webpackChunkName: "公告列表" */ '../pages/notice/list.vue'),
        meta:{
            title : "公告列表",
        }
    },
    { 
        path: '/coupon/list',
        name: '/coupon/list',
        component: () =>  import(/* webpackChunkName: "优惠列表" */ '../pages/coupon/list.vue'),
        meta:{
            title : "优惠列表",
        }
    },
    { 
        path: '/setting/base',
        name: '/setting/base',
        component: () =>  import(/* webpackChunkName: "设置列表" */ '../pages/setting/base.vue'),
        meta:{
            title : "设置列表",
        }
    },
]

// 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
export const router = createRouter({
    // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})


//定义动态添加路由的方法
export function addRoutes(menus){
    //是否有新路由
    let hasNewRoute = false
    
    const findAndAddRouteByMenus = (arr) => {
        arr.forEach(e => {
            e.frontpath
            let item = asyncRoutes.find(o => o.path == e.frontpath )
            //如果递归查询到的路由是true，并且之前的路由列表里面没有它，那么把这个路由添加到routes去
            if(item && !router.hasRoute(item.path)) { 
                router.addRoute("admin",item)
                hasNewRoute = true
            }
             //如果拥有child，并且child的长度 > 0，那么在此调用自身，来添加到routes路由中
            if(e.child && e.child.length > 0) findAndAddRouteByMenus(e.child)
        })
    }

    findAndAddRouteByMenus(menus)
    return hasNewRoute
}
```

### 3、echart图表组件开发和交互

echart图表的样式，可以在apache官网的echart部分寻找

打开echarts官网，找到安装命令

```bash
npm install echarts
```

在index.js的api文件中配置api接口，get请求方式

```js
export function getStatistics3(){
    return axios.get("/admin/statistics3?type=" + type)
}
```

在根目录下的component目录中创建IndexChart组件

```vue
<template>
    <el-card shadow="hover">
        <template #header>
            <div class="flex justify-between">
                <span class="text-2xl">订单统计</span>
                <div>
                     <el-check-tag @click="handleChoose(item.value)" :checked="current == item.value" style="margin-right: 8px" v-for="(item,index) in options" :key="index">
                        {{ item.text }}
                     </el-check-tag>
                </div>
            </div>
        </template>

        <!-- 定义图表 -->
        <div ref="el" id="chart" style="width:100%; height:300px"></div>

    </el-card>
</template>

<script setup>
    import { ref,onMounted,onbeforeMount } from "vue"
    import * as echarts from 'echarts';
    import { getStatistics3 } from "~/api/index.js"

    //导入vueuse实现图表的动态变大变小
    import { useResizeObserver } from '@vueuse/core'
    //实现图表随着浏览器大小变动，而动态变化大小
    const el = ref(null)
    useResizeObserver(el, (entries) => myChart.resize())

    const current = ref("")
    const options = [{
            text:"近一个月",
            value:"month"
        },
        {
            text:"近一周",
            value:"week"
        },
        {
            text:"近24小时",
            value:"hour"
        }]

    const handleChoose = (type) => {
        current.value = type
        getData()
    }  


//设置树状图图表
var myChart = null
onMounted( () => {
    var chartDom = document.getElementById('chart');
    myChart = echarts.init(chartDom);

    getData();
})

//在关闭网页前销毁图表组件
onbeforeMount( () => {
    if(myChart) echarts.dispose();
})

const getData = () => {
    let option = {
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [],
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                }
            }
        ]
    };

    //开启loading动画
    myChart.showLoading()
    //从后台获取数据，赋值给chart图表
    getStatistics3(current.value).then( res => {
 
        option.xAxis.data = res.x
        option.series[0].data = res.y 

        //渲染图表
        myChart.setOption(option);  
    }).finally( () => {
        myChart.hideLoading()
    })
}

</script>
```

### 4、店铺和交易提示组件开发

在api目录下，index.js添加接口

```js
export function getStatistics2(){
    return axios.get("/admin/statistics2")
}
```

在根目录下的components组件新建一个IndexCard组件

```vue
<template>
   <el-card shadow="never">
       <template #header>
            <div class="flex justify-between text-2xl">
                <!-- 卡片标题 -->
                <span>{{ title }}</span>

                <el-tag type="danger" effect="dark">
                         {{ tip }}
                </el-tag>
            </div>
       </template>
       
        <el-row :gutter="20">
            <el-col :span="6" :offset="0" v-for="(item,index) in btns" :key="index">
                <el-card shadow="hover" class="border-0; bg-light-400">
                    <div class="flex flex-col items-center justify-center">
                        <span class="text-2xl">{{ item.value }}</span>
                        <span class="text-2xl">{{ item.label }}</span> 
                    </div>
                </el-card>        
            </el-col>
            
        </el-row>
        
   </el-card>

</template>

<script setup>

defineProps({
    title: String,
    tip: String,
    btns:Array
})

</script>
```

### 5、修改Index.vue来导入步骤1到4的所有组件

```vue
<template>
  <div>

      <!-- 使用layout布局 -->
      <el-row :gutter="20">
            <template v-if="panels.length == 0">
              <el-col :span="6" :offset="0" v-for="i in 4" :key="i">

                <!-- 使用骨架屏 -->
                <!-- animated 和 loading是加载动画效果 -->
                <el-skeleton style="width: 100%" animated loading>
                  <template #template>
                    <!-- 使用ep 的卡片组件 -->
                    <el-card shadow="hover" :body-style="{ padding: '20px' }">
                      <template #header>
                        <div class="flex justify-between">
                          <!-- 卡片标题 -->
                          <el-skeleton-item variant="text" style="width: 50%" />

                          <el-skeleton-item variant="text" style="width: 15%" />

                        </div>
                      </template>

                      <!-- 卡片的body -->
                      <el-skeleton-item variant="h3" style="width: 80%" />

                      <!-- 分割线 -->
                      <el-divider />

                      <div class="flex justify-between">
                        <el-skeleton-item variant="text" style="width: 50%" />
                        <el-skeleton-item variant="text" style="width: 15%" />
                      </div>

                    </el-card>
                  </template>
                </el-skeleton>
              </el-col>
            </template>


            <el-col :span="6" :offset="0" v-for="(item,index) in panels" :key="index" >
                  <!-- 使用ep 的卡片组件 -->
                  <el-card shadow="hover" :body-style="{ padding: '20px' }">
                        <template #header>
                              <div class="flex justify-between text-2xl">
                                    <!-- 卡片标题 -->
                                    <span>{{ item.title }}</span>

                                    <el-tag :type="item.unitColor" effect="dark">
                                        {{ item.unit }}
                                    </el-tag>
                              </div>
                        </template>

                        <!-- 卡片的body --><!-- 引入滚动动画 -->
                        <span class="text-5xl font-bold">
                              <CountTo :value="item.value"/>
                        </span>

                        <!-- 分割线 -->
                        <el-divider />

                        <div class="flex justify-between text-2xl">
                              <span>{{ item.subTitle }}</span>
                              <span>{{ item.subValue }}</span>
                        </div>

                  </el-card>
            </el-col>
      </el-row>

      <IndexNavs/>

      <!-- 使用layout布局，左右各12 -->
      <el-row :gutter="20" class="mt-5">
            <!-- 左边的图表组件 -->
            <el-col :span="12" :offset="0">
                  <!-- 调用卡片 -->
                  <IndexChart"/>
            </el-col>

            <!-- 右边的卡片组 -->
            <el-col :span="12" :offset="0">
                <IndexCard class="mb-3" title="店铺及商品提示" tip="店铺及商品提示" :btns="goods"/>
                <IndexCard title="交易提示" tip="需要立即处理的交易订单" :btns="order"/>
            </el-col>
      </el-row>
      
  </div>
</template>

<script setup>
    import { ref } from "vue"
    import { getStatistics1,getStatistics2 } from "~/api/index.js"
    import CountTo from "~/components/CountTo.vue"
    import IndexNavs from "~/components/IndexNavs.vue"
    import IndexChart from "~/components/IndexChart.vue"
    import IndexCard from "~/components/IndexCard.vue"

    //获取面板信息
    const panels = ref([])
    getStatistics1()
    .then( res => {
        panels.value = res.panels
    })


    const goods = ref([])
    const order = ref([])
    getStatistics2().then( res => {
        goods.value = res.goods
        order.value = res.order
    })

</script>
```

### 6、v-permission权限

根目录下新建directives的目录，新进一个permission.js

## 五、图库模块开发

### 1、新建两个模块组件

在根目录下的componets中新建三个图片相关模块组件，ImageAside.vue,ImageMain.vue,AsideList.vue

AsideList.vue

```vue
<template>
        <div class="aside-list" :class="{'active' : active}">
                <span class="truncate" ><slot/></span>
                <el-button text class="ml-auto px-1" type="primary" size="default" @click="$emit('edit')">
                    <el-icon><Edit :size="12"/></el-icon>
                </el-button>
                <el-button text type="primary" class="px-1" size="default" @click="$emit('delete')">
                    <el-icon><Close :size="12"/></el-icon>
                </el-button>
        </div>
</template>

<script setup>
defineProps({
    active:{
        type: Boolean,
        default: false
    }
})

defineEmits(["edit","delete"])

</script>

<style>
    .aside-list{
        border-bottom: 1px solid #f4f4f4;
        cursor: pointer;
        @apply flex items-center p-3 text-2xl text-gray-600;
    }

    .aside-list:hover,.active{
        @apply bg-blue-100;
    }
</style>
```

ImageAside.vue

```vue
<template>
    <el-aside width="220px" class="image-aside">
            <div class="top">
                <AsideList>
                    分类标题
                </AsideList>

                <AsideList active="true">
                    分类标题
                </AsideList>

            </div>

            <!-- 侧边分页 -->
            <div class="bottom">
                侧边分页功能
            </div>
        </el-aside>
</template>

<script setup>
import AsideList from './AsideList.vue'

</script>

<style>
    .image-aside{
        border-right: 1px solid #eeeeee;
        position: relative;
    }

    .image-aside .top{
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 50px;
        overflow-y: auto;
    }

    .image-aside .bottom{
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 50px;
        @apply flex items-center justify-center; 
    }
</style>
```

ImageMain.vue

```vue
<template>
    <el-main class="image-main">

            <div class="top">
                <div v-for="i in 100" :key="i"> {{ i }}</div>
            </div> 

            <div class="bottom">
                主体分页功能
            </div>

        </el-main>
</template>


<style>
    .image-main{
        position: relative;
    }

    .image-main .top{
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 50px;
        overflow-y: auto;
    }

    .image-main .bottom{
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 50px;
        @apply flex items-center justify-center; 
    }

</style>
```

































