<template>
  <div>
    后台首页

    <div>{{ $store.state.user }}</div>

  </div>
</template>

<script setup>
import { useCookies } from '@vueuse/integrations/useCookies'

const cookie = useCookies();

console.log(cookie);


</script>