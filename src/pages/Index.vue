<template>
  <div>

      <!-- 使用layout布局 -->
      <el-row :gutter="20">
            <template v-if="panels.length == 0">
              <el-col :span="6" :offset="0" v-for="i in 4" :key="i">

                <!-- 使用骨架屏 -->
                <!-- animated 和 loading是加载动画效果 -->
                <el-skeleton style="width: 100%" animated loading>
                  <template #template>
                    <!-- 使用ep 的卡片组件 -->
                    <el-card shadow="hover" :body-style="{ padding: '20px' }">
                      <template #header>
                        <div class="flex justify-between">
                          <!-- 卡片标题 -->
                          <el-skeleton-item variant="text" style="width: 50%" />

                          <el-skeleton-item variant="text" style="width: 15%" />

                        </div>
                      </template>

                      <!-- 卡片的body -->
                      <el-skeleton-item variant="h3" style="width: 80%" />

                      <!-- 分割线 -->
                      <el-divider />

                      <div class="flex justify-between">
                        <el-skeleton-item variant="text" style="width: 50%" />
                        <el-skeleton-item variant="text" style="width: 15%" />
                      </div>

                    </el-card>
                  </template>
                </el-skeleton>
              </el-col>
            </template>


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

                        <!-- 卡片的body --><!-- 引入滚动动画 -->
                        <span class="text-3xl font-bold">
                              <CountTo :value="item.value"/>
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
    import CountTo from "~/components/CountTo.vue"

    //获取面板信息
    const panels = ref([])
    getStatistics1()
    .then( res => {
        panels.value = res.panels
    })

</script>