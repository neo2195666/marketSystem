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
      <el-form ref= formRef :model="form"  :rules="rules" class="w-[250px]">

        <el-form-item prop="username">

          <!--username和password和下面style标签中对应-->
          <el-input v-model="form.username" placeholder="请输入用户名">

              <!--使用前置插槽-->
              <template #prefix>
                  <el-icon><User /></el-icon>
              </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
            <el-input  type="password" show-password v-model="form.password" placeholder="请输入密码">

                <!--使用前置插槽-->
                <template #prefix>
                    <el-icon><Lock /></el-icon>
                </template>
            </el-input>
        </el-form-item>

        <el-form-item>
          <el-button round color="#6366f1" type="primary" @click="onSubmit" class="w-[250px]" :loading="loading">登录</el-button>
        </el-form-item>

      </el-form>
    </el-col>

  </el-row>

</template>

<script scoped setup>
import { ref,reactive } from 'vue'
import { login,getInfo } from '../api/manager.js'
import { loginSuccessMsg } from '../composable/utils.js'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

//引入cookie
import {setToken} from "~/composable/auth.js";

const router = useRouter()

// do not use same name with ref
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

//表单提交后，先通过这个forRef拿到这个form表达的节点，然后拿到提交的数据进行验证
const formRef = ref(null)
//通过loading设置登录按钮状态
const loading = ref(false)
const store = useStore()

const onSubmit = () => {
  //先进行参数验证，参数不能为空
  formRef.value.validate((valid) => {
    if(!valid){
      return false
    }
    loading.value = true
    //调用登录的api
    login(form.username,form.password)
        .then( res => {
          console.log(res);

          loginSuccessMsg();

          //存储cookie
          setToken(res.token)

          //获取用户登录信息
          getInfo().then(res2 => {
            store.commit("SET_USERINFO",res2)
            console.log(res2)
          })
          router.push("/")
        })

        .finally(() => {
          loading.value = false
        })
  })
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