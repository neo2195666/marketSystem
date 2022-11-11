import { ref } from 'vue'
import {useRoute,onBeforeRouteUpdate} from 'vue-router'
import { useCookies } from '@vueuse/integrations/useCookies'
import {router} from "~/router/index.js";

export function useTabList(){
    //活动标签的标题对应侧边栏的路由路径
    const route = useRoute()
    const activeTab = ref(route.path)

    const tabList = ref([
        {
            title: '后台首页',
            path: '/',
        },
    ])

    const cookie = useCookies()
    const addTab =(tab) => {
        //判断tablist中是否有这个路由，如果没有，就添加新路由到tablist中，等于-1，noThisTab就是true，证明没有，如果返回0，就是false，证明有了。
        let noThisTab = tabList.value.findIndex(t=>t.path == tab.path) == -1
        if(noThisTab){
        tabList.value.push(tab)
        }
        //将新的标签添加到cookie防止刷新后标签关闭
        cookie.set("tabList",tabList.value)
    }

    onBeforeRouteUpdate( (to,from) => {
    //在添加时，直接激活这个标签
    activeTab.value = to.path

    //在路由更新前，在导航栏添加活动标签
    addTab({
            title: to.meta.title,
            path: to.path
        })
    })

    //活动标签改变时出发的事件
    const changeTab = (t) => {
        //把这个页面的额活动标签激活
        activeTab.value = t
        //路由跳转到这个页面
        router.push(t)
    }

    //为了防止页面刷新后，所有的活动标签会关闭，所以初始化标签导航列表
    const initTabList = () => {
        //从cookie获取标签导航列表
        let tbl = cookie.get("tabList")
        if(tbl) tabList.value = tbl
    }
    initTabList()

    const removeTab = (t) => {
        //6、removeTab 执行完毕后，触发changeTab事件

        let tabs = tabList.value
        let a = activeTab
        //1、如果当前活动页标签等于要关闭的标签
        if(a == t){
            tabs.forEach((tab,index) => {
                //2、如果要关闭的t标签和tab.path标签的path一样，那么获取这个要关闭标签的上一个或者下一个标签
                if(tab.path == t){
                        const nextTabl = tabs[index + 1] || tabs[index-1]

                        //3、拿到标签后，把它赋值给当前激活的标签
                        if(nextTabl){
                        activeTab.value = nextTabl.path
                        }
                }
            });
        }
        //4、将tabList中存在的活动页标签去掉
        tabList.value = tabList.value.filter( tab => tab.path != t)

        //5、存储新的tabList到cookie中
        cookie.set("tabList",tabList.value)
    }

    const handleClose = (c) => {
        if(c == "clearAll"){
            //1、把激活的活动标签切换到默认首页
            activeTab.value = "/"
            //2、过滤只剩下首页
            tabList.value = tabList.value.filter(tab => tab.path == "/")
        }else if(c == "clearOther"){
            tabList.value = tabList.value.filter(tab => tab.path == "/" || tab.path == activeTab.value)
        }
        cookie.set("tabList",tabList.value)
    }

    return {
        activeTab,
        tabList,
        changeTab,
        removeTab,
        handleClose
    }
}