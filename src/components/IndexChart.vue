<template>
    <el-card shadow="hover">
        <template #header>
            <div class="flex justify-between">
                <span class="text-2xl">订单统计</span>
                <div>
                     <el-check-tag @click="handleChoose(item.value)" :checked="current == item.value" style="margin-right: 8px" v-for="(item,index) in options" :key="index">
                        {{ item.text }}
                     </el-check-tag>
                </div>
            </div>
        </template>

        <!-- 定义图表 -->
        <div ref="el" id="chart" style="width:100%; height:300px"></div>


    </el-card>
</template>

<script setup>
    import { ref,onMounted,onBeforeMount } from "vue"
    import * as echarts from 'echarts';
    import { getStatistics3 } from "~/api/index.js"

    //导入vueuse实现图表的动态变大变小
    import { useResizeObserver } from '@vueuse/core'
    //实现图表随着浏览器大小变动，而动态变化大小
    const el = ref(null)
    useResizeObserver(el, (entries) => myChart.resize())

    const current = ref("")
    const options = [{
            text:"近一个月",
            value:"month"
        },
        {
            text:"近一周",
            value:"week"
        },
        {
            text:"近24小时",
            value:"hour"
        }]

    const handleChoose = (type) => {
        current.value = type
        getData()
    }  


//设置树状图图表
var myChart = null
onMounted( () => {
    var chartDom = document.getElementById('chart');
    if(chartDom){
        myChart = echarts.init(chartDom);
        getData();
    }
})

//在关闭网页前销毁图表组件
onBeforeMount( () => {;
    if(myChart) echarts.dispose();
})


const getData = () => {
    let option = {
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [],
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                }
            }
        ]
    };


    //开启loading动画
    myChart.showLoading()
    //从后台获取数据，赋值给chart图表
    getStatistics3(current.value).then( res => {
 
        option.xAxis.data = res.x
        option.series[0].data = res.y 

        //渲染图表
        myChart.setOption(option);  
    }).finally( () => {
        myChart.hideLoading()
    })

}

</script>