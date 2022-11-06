<template>
<!--两种方式都无法达到效果-->
<!--  <el-row class="min-h-screen bg-indigo-500">-->
  <el-row style="min-height: 100vh" class="bg-indigo-500">
    <el-col :span="16">左边</el-col>
    <el-col :span="8" class="bg-light-50">右边</el-col>
  </el-row>


<!--官方的模板在这里也跑不起来-->
<!--  <el-row>-->
<!--    <el-col :span="12">左边<div class="grid-content ep-bg-purple" /></el-col>-->
<!--    <el-col :span="12">右边<div class="grid-content ep-bg-purple-light" /></el-col>-->
<!--  </el-row>-->

</template>

<script>
export default {
  name: "Login"
}
</script>

<style scoped>

</style>