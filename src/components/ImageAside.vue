<template>
    <el-aside width="320px" class="image-aside" v-loading="loading">
            <!-- 侧边分类列表 -->
            <div class="top">
                <AsideList @click="handleChangeActiveID(item.id)" @delete="imageHandleDelete(item.id)" @edit="imageHandleEdit(item)" :active="activeId == item.id" v-for="(item,index) in list" :key="index">
                    {{ item.name }}
                </AsideList>

            </div>

            <!-- 上一页，下一页 -->
            <div class="bottom">
                <el-pagination background layout="prev, next" :total="total" :current-page="currentPage" :page-size="limit" @current-change="getImageData"/>
            </div>
        </el-aside>

        <!-- 导入抽屉组件来实现新增图库 -->
        <FormDrawer :title="drawerTitle" ref="formDrawerRef" @submit="imageHandleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>

                <el-form-item label="排序">
                    <el-input-number v-model="form.order" :min="0" :max="100"/>
                </el-form-item>
            </el-form>
               
        </FormDrawer>

</template>

<script setup>
import {ref, reactive, computed} from 'vue'
import AsideList from './AsideList.vue'
import { getImageClassList,createImageClass,updateImageClass,deleteImageClass } from "~/api/image_class.js"
import { SuccessMsg } from "~/composable/utils.js"
//导入之前新建的表单模板
import FormDrawer from "./FormDrawer.vue"

//加载图片动画效果
const loading = ref(false)

const list = ref([])



//分页设置
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)

//获取图片数据
function getImageData(p = null) {
    if(typeof p == "number") {
        currentPage.value = p
        }

    loading.value = true

    //获取分类列表
    getImageClassList(currentPage.value).then( res => {
        list.value = res.list
        total.value = res.totalCount
        //:actvie是vue自带的激活，当第一个的值存在的时候，把它激活
        let item = list.value[0]
        if(item) handleChangeActiveID(item.id)
    })
    .finally( () => {
        loading.value = false
    })
}

getImageData()
//图库分类的id
const editId = ref(0)

//动态设定是新建还是修改标题
const drawerTitle = computed( () => editId.value ? "修改" :"新建")

//新建图库分类
const formDrawerRef = ref(null)
//激活，打开新建窗口
const imageHandleCreate = () => {
    editId.value = 0
    form.name = ""
    form.order = 50
    formDrawerRef.value.open()
    }

//新建功能和编辑功能是在header组件上面，在list页面使用，所以需要把本组件的处理函数暴露给父组件
defineExpose({
    imageHandleCreate,
})


//新建图库分类表单设置
const form = reactive({
    name: "",
    order: 50
})

const rules = {
    name:[{
        required: true,
        message: '分类名称不能为空',
        trigger: 'blur'
    }]
}

const formRef = ref(null)
const imageHandleSubmit = () => {
    formRef.value.validate((valid) => {
        if(!valid) return
        formDrawerRef.value.showLoading()

        const fun = editId.value ? updateImageClass(editId.value,form) : createImageClass(form)
        fun.then( res => {
            SuccessMsg(drawerTitle.value + "图片分类成功")
            //从新加载分类数据
            getImageData(editId.value ? currentPage.value : 1)
            //关闭新增图片的弹框
            formDrawerRef.value.close()
        }).finally( () => {
            formDrawerRef.value.hideLoading()
        })

        console.log("提交成功");
    })
}

//修改图库分类信息
const imageHandleEdit = (row) => {
    editId.value = row.id
    form.name = row.name
    form.order = row.order
    formDrawerRef.value.open()
}

//删除图片分类
const imageHandleDelete = id => {
  loading.value = true
  deleteImageClass(id)
      .then(res => {
          SuccessMsg("删除成功")
          getImageData()
      }).finally( () => [
          loading.value = false
      ])
}

//选中图库分类id
const activeId = ref(0)
const emit = defineEmits(["change"])
function handleChangeActiveID(id){
    activeId.value = id
    emit("change",id)
}

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