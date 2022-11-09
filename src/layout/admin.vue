<template>
<!-- 外层使用element plus提供的容器组件来布局 -->
        <el-container>
                <!-- 头部部分 -->
                <el-header>
                        <!-- 头部导航栏 -->
                        <f-header></f-header>
                </el-header>
                <!-- 侧边栏和主题放到一个容器内 -->

                <el-container>
                        <el-aside>
                            <!-- 侧边栏 -->
                            <f-menu></f-menu>
                        </el-aside>  

                        //主容器分标签导航栏
                        <el-main>
                                标签导航
                                <f-tag-list></f-tag-list>

                                //主容器用router—viwer来渲染主组件
                                <router-view></router-view>

                        </el-main>
                
                </el-container>

        </el-container>
</template>

<script setup>
    import FHeader from "./components/FHeader.vue"
    import FMenu from "./components/FMenu.vue"
    import FTagList from "./components/FTagList.vue"

</script>