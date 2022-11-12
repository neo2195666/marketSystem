<template>
    {{ d.num.toFixed(0) }}
</template>

<script setup>
import {reactive, watch} from "vue";
import gsap from "gsap"

//定义从父组件接受数据,然后动画滚动到这里
const props = defineProps({
    value: {
        type: Number,
        default: 0
    }
})

//设置动画从哪里开始滚动
const d = reactive({
    num:0
})

//定义滚动的函数
const AnimateToValue = () => {
    gsap.to(d,{
        duration:0.5,
        num:props.value
    })
}

//执行函数
AnimateToValue()

//开启监听，发现数据改变就开始从新执行滚动
watch( () => props.value,() => AnimateToValue() )
</script>

