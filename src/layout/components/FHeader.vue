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
         <!-- 添加鼠标移动过提示刷新 -->
          <el-tooltip effect="dark" content="刷新" placement="bottom">
                <!-- 添加一个事件监听,点击后刷新页面， -->
                <el-icon class="icon-btn" @click="handleRefresh"><Refresh /></el-icon>
          </el-tooltip>

        <!-- 右边的图标和下拉菜单放到一个div -->
        <!--  style="margin-left: auto" -->
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
                                <!-- 添加command属性 -->
                                <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
                                <el-dropdown-item command="logoutAccount">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                    </template>
                </el-dropdown>
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
import { ref,reactive } from 'vue'
import {logoutFunction, SuccessMsg} from "~/composable/utils.js";
import router from "~/router/index.js";
//导入退出登录的额api函数
import { logoutApi,updatePassword } from "~/api/manager.js";
//导入store来
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
                showDrawer.value = true;
                break
    }
}

const store = useStore()
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
        SuccessMsg("修改密码成功,请重新登录")
        store.dispatch("logoutAction")

        //跳转回登录页面
        router.push("/login")
        //提示退出成功
    })
    .finally(() => {
      loading.value = false
    })
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