<template>
    <div class="f-menu" :style="{width:$store.state.asideWidth}" >
    <!-- collapse-transition关闭折叠动画;unique-opend 只是展开一个字菜单 -->
        <el-menu :default-active="defaultActive" unique-opened :collapse="isCollapse" default-active="2" class="border-0" @select="handleSelect" :collapse-transition="false">
        
            <template v-for="(item,index) in asideMenus" :key="index" >
                <el-sub-menu v-if="item.child && item.child.length > 0" :index="item.name">
                
                    <!-- 循环展示菜单 -->
                    <template #title>
                        <el-icon>
                            <component :is="item.icon" class="text-3xl"></component>
                        </el-icon>
                        <span>{{ item.name }}</span>
                    </template>

                    <!-- 循环展示2级菜单 -->
                    <el-menu-item class="text-2xl" v-for="(item2,index2) in item.child" :key="index2" :index="item2.frontpath">
                        <el-icon>
                            <component :is="item2.icon" class="text-3xl"></component>
                        </el-icon>
                        <span>{{ item2.name }}</span>
                    </el-menu-item>
                
                </el-sub-menu>

                <el-menu-item v-else :index="item.frontpath">

                    <el-icon>
                        <component :is="item.icon" ></component>
                    </el-icon>

                    <span>{{ item.name }}</span>
                </el-menu-item>
            </template>

      </el-menu>
    </div>
</template>

<script setup>
import {useRouter,useRoute} from 'vue-router'
import {computed,ref} from 'vue'
import {useStore} from 'vuex'

const router = useRouter()
const route = useRoute()
const defaultActive = ref(route.path)
// 是否折叠
const store = useStore()
const isCollapse = computed( () => !(store.state.asideWidth == '250px'))

const asideMenus = computed( () => store.state.menus)

const handleSelect = (e) => {
    router.push(e)
}
</script>

<style scoped>
    .f-menu{
        /* 如果要实现动态的开关收缩菜单，这里宽度就不能指定，要和store中的asideWidth动态绑定，可以在标签中绑定 */
        /* width: 250px; */

        /* 添加展开的动画效果 */
        transition: all 0.2s;
        @apply fixed shadow-md bg-light-50 text-2xl;
        top: 64px;
        bottom: 0px;
        left: 0px;
        overflow: auto;
    }
    /* 隐藏侧边栏滚动条 */
    .f-menu::-webkit-scrollbar{
        width: 0px;
    }
</style>