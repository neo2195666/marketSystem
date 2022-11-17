//导入消息盒子
import { ElNotification,ElMessageBox } from 'element-plus'
import nprogressRef from 'nprogress'

export function SuccessMsg(title,type,dangerouslyUseHTMLString = true){
    ElNotification({
        title,
        type,
        dangerouslyUseHTMLString
    })
}

export function loginFailMsg(error){
    ElNotification({
        message: error.response.data.msg || "登录失败🙅",
        type: 'error',
    })
}

export function loginFirst(){
    ElNotification({
        message: "亲亲，请先登录!🌚",
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
    nprogressRef.start()
}

//隐藏全屏loading
export function hideFullLoading(){
    nprogressRef.done()
}

//弹出框
export function showPrompt(tip,value = ""){
    return ElMessageBox.prompt(tip,'', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputValue:value
      })
}