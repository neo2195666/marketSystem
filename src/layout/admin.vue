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
                        <!-- 设置主容器的侧边栏容器距离为动态的，右边容器将会动态的像左边闭合移动 -->
                        <el-aside :width="$store.state.asideWidth">
                            <!-- 侧边栏 -->
                            <f-menu></f-menu>
                        </el-aside>  

                        <!-- 主容器分标签导航栏 -->
                        <el-main>
                                <!-- 标签导航 -->
                                <f-tag-list></f-tag-list>

                                <!-- 主容器用router—viwer来渲染主组件 -->

                                <router-view v-slot="{ Component }">
                                        <!-- 缓存10个组件，只缓存十个标签 -->
                                        <!-- component组件是vue提供的 -->
                                        <transition name="fade">
                                                <keep-alive :max="10">        
                                                        <component :is="Component"></component>
                                                </keep-alive>
                                        </transition>
                                        
                                </router-view>

                        </el-main>
                
                </el-container>

        </el-container>
</template>

<script setup>
    import 'animate.css';
    import FHeader from "./components/FHeader.vue"
    import FMenu from "./components/FMenu.vue"
    import FTagList from "./components/FTagList.vue"

</script>

<style scoped>
        /* 收缩时设置动画 */
        .el-aside{
                transition: all 0.2s;
        }
        
        .fade-enter-from{
                opacity: 0;
                -webkit-transform: translate3d(0, -100%, 0);
                transform: translate3d(0, -100%, 0);
        }

        .fade-enter-to{
                opacity: 1;
                -webkit-transform: translate3d(0, 0, 0);
                transform: translate3d(0, 0, 0);
        }

        .fade-leave-from{
                opacity: 1;
        }

        .fade-leave-to{
                opacity: 0;
                -webkit-transform: translate3d(0, 100%, 0);
                transform: translate3d(0, 100%, 0);
        }

        .fade-enter-active .fade-leave-active{
                transition: all 0.3s;

        }

        .fade-enter-active{
                transition-delay: 00.3s;
        }

</style>