<template>
   <el-card shadow="never">
       <template #header>
            <div class="flex justify-between text-2xl">
                <!-- 卡片标题 -->
                <span>{{ title }}</span>

                <el-tag type="danger" effect="dark">
                         {{ tip }}
                </el-tag>
            </div>
       </template>
       
        <el-row :gutter="20">
            <el-col :span="6" :offset="0" v-for="(item,index) in btns" :key="index">
                <el-card shadow="hover" class="border-0; bg-light-400">
                    <div class="flex flex-col items-center justify-center">
                        <span class="text-2xl">{{ item.value }}</span>
                        <span class="text-2xl">{{ item.label }}</span> 
                    </div>
                </el-card>        
            </el-col>
            
        </el-row>
        
   </el-card>
   


</template>

<script setup>

defineProps({
    title: String,
    tip: String,
    btns:Array
})

</script>