<template>
        <div class="aside-list" :class="{'active' : active}">
                <span class="truncate" ><slot/></span>
                <el-button text class="ml-auto px-1" type="primary" size="default" @click="$emit('edit')">
                    <el-icon><Edit :size="12"/></el-icon>
                </el-button>

                <el-popconfirm title="确认要删除分类吗?" confirm-button-text="是" cancel-button-text="否" confirm-button-type="danger" @confirm="$emit('delete')">
                  <template #reference>
                    <el-button>
                      <el-button text type="primary" class="px-1" size="default">
                        <el-icon><Close :size="12"/></el-icon>
                      </el-button>
                    </el-button>
                  </template>
                </el-popconfirm>

        </div>
</template>

<script setup>
defineProps({
    active:{
        type: Boolean,
        default: false
    }
})

defineEmits(["edit","delete"])

</script>

<style>
    .aside-list{
        border-bottom: 1px solid #f4f4f4;
        cursor: pointer;
        @apply flex items-center p-3 text-2xl text-gray-600;
    }

    .aside-list:hover,.active{
        @apply bg-blue-100;
    }
</style>
    