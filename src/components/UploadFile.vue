<template>
    <el-upload drag :action="uploadImageAction" multiple :headers="{ token }" name="img" :data="data" :on-success="uploadSuccess" :on-error="uploadError">
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        将文件拖动到这里或者<em>单击上传</em>
      </div>
      <template #tip>
          <div class="el-upload__tip">
            jpg/png 格式小于 500kb
          </div>
      </template>
    </el-upload>
</template>

<script setup>
import { getToken} from "../composable/auth.js";
import { UploadFilled } from '@element-plus/icons-vue'
import { uploadImageAction } from '~/api/image.js'
import { SuccessMsg } from '~/composable/utils.js'

const token = getToken()

defineProps({
  data:Object
})

const emit = defineEmits(["success"])

const uploadSuccess = (response, uploadFile, uploadFiles) => {
    console.log(response)
    emit('success',{
      response, uploadFile, uploadFiles
    })
}

const uploadError = (error, uploadFile, uploadFiles) => {
    let msg = JSON.parse(error.message).msg || "上传失败"
    SuccessMsg(msg,"error")
    console.log(msg)
}
</script>