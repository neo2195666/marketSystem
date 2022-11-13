<script setup>

</script>

<template>

  <router-view></router-view>
</template>


<style>

body{
  @apply bg-gray-100;
}

#nprogress .bar{
  background: #6fff71!important;
  height: 3px!important;
}

/* 滚动条 */
::-webkit-scrollbar .bar{
        width: 4px;
        height: 6px;
    }

/* 滚动条边角部分 */
::-webkit-scrollbar-corner{
  display: block;
}

/* 滚动条矩形 */
::-webkit-scrollbar-thumb{
  border-radius: 8px;
  background-color: rgba(0,0,0,0.2);
}

/* 修改滚动条的轨道 */
::-webkit-scrollbar-thumb,
::-webkit-scroll-track{
  border-right-color: transparent;
  border-left-color: transparent;
  background-color: rgba(0,0,0,0.1);
}

</style>
