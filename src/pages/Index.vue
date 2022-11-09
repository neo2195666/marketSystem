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
    logoutFunction("是否要退出登录",).then( () => {
      logoutApi().finally(() => {

        store.dispatch("logoutAction")

        //跳转回登录页面
        router.push("/login")
        //提示退出成功
        SuccessMsg("退出成功！准备去撸串～")
      })
      console.log("退出成功")
    })
}

</script>