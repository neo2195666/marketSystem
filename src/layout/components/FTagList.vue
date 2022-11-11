<template>
    <div class="f-tag-list" :style="{left:$store.state.asideWidth}">

        <!-- style="min-width: 100px" 设置导航标签过多后开启左右滑动功能 -->
        <!-- 把el-tabs的closable去掉，绑定到el-tab-pane中，后面首页活动标签没有关闭按钮-->
        <!-- tab-change	活动标签改改变时触发的事件-->
        <el-tabs @tab-change="changeTab" v-model="activeTab" type="card" class="demo-tabs" @tab-remove="removeTab" style="min-width: 100px">
            <el-tab-pane :closable="item.path != '/'" v-for="item in tabList" :key="item.path" :label="item.title" :name="item.path"> </el-tab-pane>
        </el-tabs>

        <span class="tag-btn">
            <el-dropdown>
                <span class="el-dropdown-link">
                    <el-icon>
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>Action 1</el-dropdown-item>
                        <el-dropdown-item>Action 2</el-dropdown-item>
                        <el-dropdown-item>Action 3</el-dropdown-item>
                        <el-dropdown-item disabled>Action 4</el-dropdown-item>
                        <el-dropdown-item divided>Action 5</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </span>
        
    </div>
    <div style="height: 44px">

    </div>
</template>


<script setup>
import { ref } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import {useRoute,onBeforeRouteUpdate} from 'vue-router'
import { useCookies } from '@vueuse/integrations/useCookies'
import {router} from "~/router/index.js";

//活动标签的标题对应侧边栏的路由路径
const route = useRoute()
const activeTab = ref(route.path)

const tabList = ref([
  {
    title: '后台首页',
    path: '/',
  },
])

const cookie = useCookies()
const addTab =(tab) => {
    //判断tablist中是否有这个路由，如果没有，就添加新路由到tablist中，等于-1，noThisTab就是true，证明没有，如果返回0，就是false，证明有了。
    let noThisTab = tabList.value.findIndex(t=>t.path == tab.path) == -1
    if(noThisTab){
      tabList.value.push(tab)
    }
    //将新的标签添加到cookie防止刷新后标签关闭
    cookie.set("tabList",tabList.value)
}

onBeforeRouteUpdate( (to,from) => {
  //在添加时，直接激活这个标签
  activeTab.value = to.path

  //在路由更新前，在导航栏添加活动标签
  addTab({
    title: to.meta.title,
    path: to.path
  })
})

//活动标签改变时出发的事件
const changeTab = (t) => {
    //把这个页面的额活动标签激活
    activeTab.value = t
    //路由跳转到这个页面
    router.push(t)
}

//为了防止页面刷新后，所有的活动标签会关闭，所以初始化标签导航列表
const initTabList = () => {
  //从cookie获取标签导航列表
  let tbl = cookie.get("tabList")
  if(tbl) tabList.value = tbl
}
initTabList()

const removeTab = (targetName) => {

}
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