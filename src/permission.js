import router from "./router"
import { getToken } from "~/composable/auth.js";
import { loginFirst} from "~/composable/utils.js";
import store from "~/store/index.js";

//配置全局前置守卫
router.beforeEach(async (to, from,next) => {
    //如果token不存在，证明没有登录，并且要去的页面不是login，那么钩子函数会跳转到登录页面
    const token = getToken();
    if(!token && to.path != "/login"){
        loginFirst()
        return next({path:"/login"})
    }

    //如果token存在，证明已经登录，这时不需要进入登录页面
    if(token && to.path == "/login"){
        //如果要返回的页面不存在，那就强制跳转到登录页
        return next({path: from.path ? from.path : "/login"})
    }

    //如果已经登录，获取并且保存用户信息到store中
    if(token){
        //在store中action存储的函数，在这里要使用dispatch来调度。这里使用await的时候，在钩子函数的参数中要添加async
        await store.dispatch("getInfo")
    }

    next()
})