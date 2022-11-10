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