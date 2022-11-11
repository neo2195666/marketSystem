<template>
    <div class="f-tag-list" :style="{left:$store.state.asideWidth}">

        <!-- style="min-width: 100px" 设置导航标签过多后开启左右滑动功能 -->
        <!-- 把el-tabs的closable去掉，绑定到el-tab-pane中，后面首页活动标签没有关闭按钮-->
        <!-- tab-change	活动标签改改变时触发的事件-->
        <el-tabs @tab-change="changeTab" v-model="activeTab" type="card" class="demo-tabs" @tab-remove="removeTab" style="min-width: 100px">
            <el-tab-pane :closable="item.path != '/'" v-for="item in tabList" :key="item.path" :label="item.title" :name="item.path"> </el-tab-pane>
        </el-tabs>

        <span class="tag-btn">
            <!-- 添加command事件监听，来绑定clearOther和clearAll -->
            <el-dropdown @command="handleClose" >
                <span class="el-dropdown-link">
                    <el-icon>
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="clearOther">关闭其他标签</el-dropdown-item>
                        <el-dropdown-item command="clearAll">关闭所有标签</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </span>
        
    </div>
    <div style="height: 44px">

    </div>
</template>


<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { useTabList} from "~/composable/useTabList.js"
const { activeTab,
        tabList,
        changeTab,
        removeTab,
        handleClose } = useTabList()
</script>


<style scoped>
    .f-tag-list{
        @apply fixed bg-gray-200 flex items-center px-2;
        top: 64px;
        right: 0px;
        height: 44px;
        z-index: 100;
    }

    .tag-btn{
        @apply bg-indigo-400 rounded ml-auto flex items-center justify-center px-2;
        height: 32px;
    }

    :deep(.el-tabs__header){
        @apply mb-0;
    }

    :deep(.el-tabs__nav){
        border: 0!important;
    }

    :deep(.el-tabs__item){
        border: 0!important;
        height: 32px;
        line-height: 32px;
        margin-top: 4px;
        @apply bg-white mx-1 rounded-2xl;
    }

    /*导航栏华东区到头后变成禁止符号*/
    :deep(.is-disabled){
        cursor: not-allowed;
        @apply text-gray-300;
    }
</style>