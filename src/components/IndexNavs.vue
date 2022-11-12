<template>
    <!-- 使用layout布局 -->
    <el-row :gutter="3" class="mt-10">
        <el-col :span="3" :offset="0" v-for="(item,index) in iconNavs" :key="index">
        
        <!-- 使用卡片布局 -->
        <el-card shadow="hover" @click="$router.push(item.path)">
            <div class="flex flex-col items-center justify-center cursor-pointer">
                <el-icon :class="item.color" :size="45" >
                    <component :is="item.icon"/>
                </el-icon>
                <span class="text-2xl">{{item.title}}</span>
            </div>
        </el-card>
        

        </el-col> 
    </el-row>
</template>
    

<script setup>

const iconNavs = [
    {
        icon: "user",
        color: "text-light-blue-500",
        title: "用户",
        path: "/user/list"
    },
    {
        icon: "shopping-cart",
        color: "text-violet-500",
        title: "商品",
        path: "/goods/list"
    },
    {
        icon: "tickets",
        color: "text-fuchsia-500",
        title: "订单",
        path: "/order/list"
    },
    {
        icon: "user",
        color: "text-light-blue-500",
        title: "评价",
        path: "/comment/list"
    },
    {
        icon: "picture",
        color: "text-rose-500",
        title: "图库",
        path: "/image/list"
    },
    {
        icon: "bell",
        color: "text-light-blue-500",
        title: "公告",
        path: "/notice/list"
    },
    {
        icon: "set-up",
        color: "text-grey-500",
        title: "配置",
        path: "/setting/base"
    },
    {
        icon: "files",
        color: "text-yellow-500",
        title: "优惠券",
        path: "/coupon/list"
    }
]


</script>