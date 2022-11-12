import store from "~/store"

function hasPermission(value,el = false){
    //如果传递进来的参数不是数组，直接报错
    if(!Array.isArray(value)) throw new Error(`需要配置权限`)

    //判断当前用户是否有权限
    const hasAuth = value.findIndex(v => store.state.ruleNames.includes(v)) != -1
    
    //如果没有权限，从父节点删除
    if(el && hasAuth) el.parentNode && el.parentNode.removeChild(el)

    return hasAuth
}

export default {
    install(app){
        app.directive("permission",{
            mounted(el,binding) {
                hasPermission(binding.value,el)
            }
        })
    }

}