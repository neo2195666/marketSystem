<template>
    <el-main class="image-main" v-loading="loadig">

            <div class="top p-3">
                <!-- <div v-for="(item,index) in list" :key="item"> {{ item.url }}</div> -->
                <el-row :gutter="10">
                    <el-col :span="6" :offset="0" v-for="(item,index) in list" :key="index">
                        <el-card :body-style="{'padding' : 0}" shadow="hover" class="relative mb-3">
                            <el-image :preview-src-list="[item.url]" :initial-index="0" :src="item.url" style="100%;" fit="cover" :lazy="true" class="h-[150px]"></el-image>
                            
                            <div class="image-title">{{item.name}}</div>
                            <div class="flex items-center justify-center p-2">
                                <el-button type="primary" size="default" text @click="handleEidt(item)">重命名</el-button>

                                <el-popconfirm @confirm="handleDeleteImage(item.id)" title="确认删除图片?" confirm-button-text="是" cancel-button-text="否" confirm-button-type="danger">
                                    <template #reference>
                                        <el-button text type="primary" class="px-1" size="default">
                                            <el-button type="primary" size="default" text>删除</el-button>
                                        </el-button>
                                    </template>
                                </el-popconfirm>
                                
                            </div>
                        </el-card>
                    </el-col> 
                </el-row>
                
            </div>  

            <div class="bottom">
                <el-pagination background layout="prev, pager,next" :total="total" :current-page="currentPage" :page-size="limit" @current-change="getImageData"/>
            </div>

        </el-main>

        <el-drawer v-model="drawer" title="图片上传">
            <UploadFile :data="{ image_class_id }" @success="handleUploadSuccess"/>
        </el-drawer>
</template>

<script setup>
import { getImageList,updateImage,deleteImage } from "~/api/image.js"
import { ref } from 'vue'
import { showPrompt,SuccessMsg } from "~/composable/utils.js"
import UploadFile from "~/components/uploadFile.vue"
//上传图片
const drawer = ref(false)
const openUploadFile = () => drawer.value = true

//分页设置
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)
const image_class_id = ref(0)
const loadig = ref(false)
const list = ref([])
const loading = ref(false)

//获取图片数据
function getImageData(p = null) {
    if(typeof p == "number") {
        currentPage.value = p
        }

    loading.value = true

    //获取分类列表
    getImageList(image_class_id.value,currentPage.value).then( res => {
        list.value = res.list
        total.value = res.totalCount
    })
    .finally( () => {
        loading.value = false
    })
}

//根据分类ID重新加载图片列表
const loadData = (id) => {
    currentPage.value = 1
    image_class_id.value = id
    getImageData()
}

//重命名
const handleEidt = (item) => {
    showPrompt("重命名",item.name)
    .then( res => {
        console.log(res);
        loading.value = true
        updateImage(item.id,res.value)
        .then( res => {
            SuccessMsg("修改成功","success")
            getImageData()
        })
        .finally(() => {
            loading.value = false;
        })
    })
}

//删除图片
const handleDeleteImage = (id) => {
    loading.value = true
    deleteImage([id]).then( () => {
       SuccessMsg("删除成功!","success")
       getImageData();
    })
    .finally( () => {
        loading.value = false
    })
}

//上传成功
const handleUploadSuccess = () => getImageData(1)


defineExpose({
    loadData,
    openUploadFile
})

</script>

<style>
    .image-main{
        position: relative;
    }

    .image-main .top{
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 50px;
        overflow-y: auto;
    }

    .image-main .bottom{
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 50px;
        @apply flex items-center justify-center; 
    }

    .image-title{
        position: absolute;
        top: 122px;
        left: -1px;
        right: -1px;
        @apply text-sm truncate text-gray-100 bg-opacity-50 bg-gray-800 px-2 py-2.5;
    }

</style>