<template>
  <div>

      <!-- 使用layout布局 -->
      <el-row :gutter="20">
            <el-col :span="6" :offset="0" v-for="(item,index) in panels" :key="index">

                  <!-- 使用ep 的卡片组件 -->
                  <el-card shadow="hover" :body-style="{ padding: '20px' }">
                        <template #header>
                              <div class="flex justify-between">
                                    <!-- 卡片标题 -->
                                    <span>{{ item.title }}</span>

                                    <el-tag :type="item.unitColor" effect="dark">
                                        {{ item.unit }}
                                    </el-tag>
                              </div>
                        </template>

                        <!-- 卡片的body -->
                        <span class="text-3xl font-bold">
                              {{ item.value }}
                        </span>

                        <!-- 分割线 -->
                        <el-divider />

                        <div class="flex justify-between">
                              <span>{{ item.subTitle }}</span>
                              <span>{{ item.subValue }}</span>
                        </div>

                  </el-card>


            </el-col>
      </el-row>
      
  

  </div>
</template>

<script setup>
    import { ref } from "vue"
    import { getStatistics1 } from "~/api/index.js"

    //获取面板信息
    const panels = ref([])
    getStatistics1()
    .then( res => {
        console.log(res);
        panels.value = res.panels
    })

</script>