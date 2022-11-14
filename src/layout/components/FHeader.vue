<template>
  <div class="f-header">
    <!-- logo图标 -->
    <span class="logo">
            <el-icon class="mr-2 text-4xl"><Shop/></el-icon>
            <span class="text-2xl">商城后台系统</span>
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
  z-index: 1000;
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