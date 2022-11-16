<template>
    <el-container class="bg-white rounded text-2xl" :style="{ height : ( h + 'px')}">
        
        <el-header class="image-header">
            <el-button type="primary" size="default" @click="handleOpenCreate">新建分类</el-button> 
            <el-button type="warning" size="default" @click="handleOpenUploadFile">图片上传</el-button>     
        </el-header>
        
        <el-container>
            <!-- 侧边栏 -->
            <ImageAside ref="ImageAsideRef" @change="handleAsideChange"/>

            <!-- 主体部分 -->
            <ImageMain ref="imageMainRef"/>
        
        </el-container>
    </el-container>
</template>

<script setup>
import {ref} from 'vue'
import ImageAside from '~/components/ImageAside.vue'
import ImageMain from '~/components/ImageMain.vue'

const windowHeight = window.innerHeight || document.body.clientHeight
const h = windowHeight - 64 -44 - 40

const ImageAsideRef = ref(null)

const handleOpenCreate = () => ImageAsideRef.value.imageHandleCreate()

const imageMainRef = ref(null)

const handleAsideChange = image_class_id => imageMainRef.value.loadData(image_class_id)

const handleOpenUploadFile = () => imageMainRef.value.openUploadFile()

</script>

<style>
    .image-header .image-upload{
        border-bottom: 1px solid #eeeeee;
        @apply flex items-center justify-center
    }

    .image-aside{
            border-right: 1px solid #eeeeee;
            position: relative;
        }

    .image-main{
        position: relative;
    }

    .image-aside .top,.image-main .top{
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 50px;
        overflow-y: auto;
    }

    .image-aside .bottom,.image-main .bottom{
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 50px;
        @apply flex items-center justify-center; 
    }

</style>