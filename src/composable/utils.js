import { ElNotification } from 'element-plus'

export function loginSuccessMsg(){
    ElNotification({
        message: '登录成功',
        type: 'success',
    })
}

export function loginFailMsg(error){
    ElNotification({
        title: 'Error',
        message: error.response.data.msg || "登录失败",
        type: 'error',
    })
}

export function loginFirst(){
    ElNotification({
        title: 'Error',
        message: "请先登录",
        type: 'error',
    })
}