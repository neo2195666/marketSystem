<template>
  <div>
    后台首页

    <el-button>设置cookie</el-button>
    <el-button>读取cookie</el-button>
    <el-button>删除cookie</el-button>

  </div>
</template>

<script setup>
import { useCookies } from '@vueuse/integrations/useCookies'

const cookie = useCookies();

console.log(cookie);


</script>