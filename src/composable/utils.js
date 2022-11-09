//导入消息盒子
import { ElNotification,ElMessageBox } from 'element-plus'
import nprogress from 'nprogress'

export function SuccessMsg(title){
    ElNotification({
        title,
        type: 'success',
    })
}

export function loginFailMsg(error){
    ElNotification({
        message: error.response.data.msg || "登录失败",
        type: 'error',
    })
}

export function loginFirst(){
    ElNotification({
        message: "兄弟，你得先登录!",
        type: 'error',
    })
}

//添加退出登录按钮内容
export function logoutFunction(context = "提示内容",type = "Warning",title = ""){
    return  ElMessageBox.confirm(
        context,
        title,
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type
        }
    )
}

//显示全屏loading
export function showFullLoading(){
    nprogress.start()
}


//隐藏全屏loading
export function hideFullLoading(){
    nprogress.done()
}