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



