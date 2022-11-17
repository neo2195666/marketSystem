<template>
    <el-card shadow="hover" class="border-0">
        <div class="flex items-center justify-between mb-4">
            <el-button type="primary" size="default" >新建</el-button>

            <el-tooltip effect="dark" content="点击刷新" placement="top">
                <el-button text size="default" @click="getTableData">
                    <el-icon :size="20"><Refresh /></el-icon>
                </el-button>
            </el-tooltip>
        </div>

        <el-table :data="tableData" style="width: 100%" v-loading="loading">
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="create_time" label="创建时间" width="380" />
            <el-table-column label="操作" width="180" align="center">
                <template #default="scope">
                    <el-button size="small" type="primary">编辑</el-button>

                    <el-popconfirm @confirm="handleDeleteNotice(scope.row.id)" title="确认删除公告?" confirm-button-text="是" cancel-button-text="否" confirm-button-type="danger">
                        <template #reference>
                            <el-button size="small" type="danger">删除</el-button>
                        </template>
                    </el-popconfirm>

                </template>
            </el-table-column>
        </el-table>

        <div class="bottom flex justify-center items-center mt-5">
            <el-pagination background layout="prev, pager, next" :total="total" :current-page="currentPage" :page-size="limit" @current-change="getImageData"/>
        </div>

        <FormDrawer ref="formDrawerRef" title="新增" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="公告标题" placeholder="公告标题" prop="title">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>

                <el-form-item label="公告内容" prop="content" type="textarea" :row="5">
                    <el-input v-model="form.content"></el-input>
                </el-form-item>

            </el-form>
            
        </FormDrawer>
    </el-card>
    
</template>


<script setup>
import { ref,reactive } from "vue"
import { getNoticeList,createNotice } from "~/api/notice.js"
import FormDrawer from "~/components/FormDrawer.vue"

const tableData = ref([])

const formDrawerRef = ref(null)


//加载图片动画效果
const loading = ref(false)

//分页设置
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)

const getTableData = (id) => {
    tableData.value = getNoticeData()
}

//获取公告数据 
function getNoticeData(p = null) {
    if(typeof p == "number") {
        currentPage.value = p
        }
    loading.value = true

    //获取列表
    getNoticeList(currentPage.value)
    .then( res => {
        tableData.value = res.list
        total.value = res.totalCount
        console.log(res);
    })
    .finally( () => {
        loading.value = false
    })
}

getNoticeData()

//删除公告
const handleDeleteNotice = () => {

}

//新增公告
const handleSubmit = () =>{

}

//打开表单
const handleCreate = () => {
    formDrawer.value.open()
}

//抽屉表单
const formRef = ref(null)
const form = reactive({
    title:"",
    content:""
})

const rules = {
    title: [],
    content: []
}


</script>