import { createRouter, createWebHashHistory } from 'vue-router'
// 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。

const routes = [
    { 
        path: '/',
        name: 'admin',
        component: () =>  import(/* webpackChunkName: "Home" */ '../layout/admin.vue'),
    },
    { 
        path: '/login',
        name: 'Login',
        component: () =>  import(/* webpackChunkName: "Login" */ '../pages/Login.vue'),
        meta:{
            title : "用户登录"
        }
    },
    { 
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () =>  import(/* webpackChunkName: "NotFound" */ '../pages/404.vue')
    },
]

//定义动态路由，用于匹配菜单，动态添加路由
const asyncRoutes = [
    {
        path: '/',
        name: '/',
        component: () =>  import(/* webpackChunkName: "Home" */ '../pages/Index.vue'),
        meta:{
            title : "后台首页"
        }
    },{ 
        path: '/goods/list',
        name: '/goods/list',
        component: () =>  import(/* webpackChunkName: "NotFound" */ '../pages/goods/list.vue'),
        meta:{
            title : "商品管理",
        }
    },
    { 
        path: '/category/list',
        name: '/category/list',
        component: () =>  import(/* webpackChunkName: "分类列表" */ '../pages/category/list.vue'),
        meta:{
            title : "分类列表",
        }
    },
]

// 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
export const router = createRouter({
    // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})


//定义动态添加路由的方法
export function addRoutes(menus){
    //是否有新路由
    let hasNewRoute = false
    
    const findAndAddRouteByMenus = (arr) => {
        arr.forEach(e => {
            e.frontpath
            let item = asyncRoutes.find(o => o.path == e.frontpath )
            //如果递归查询到的路由是true，并且之前的路由列表里面没有它，那么把这个路由添加到routes去
            if(item && !router.hasRoute(item.path)) { 
                router.addRoute("admin",item)
                hasNewRoute = true
            }
             //如果拥有child，并且child的长度 > 0，那么在此调用自身，来添加到routes路由中
            if(e.child && e.child.length > 0) findAndAddRouteByMenus(e.child)
        })
    }

    findAndAddRouteByMenus(menus)
    return hasNewRoute

}

