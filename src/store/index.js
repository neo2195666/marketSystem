import { createStore } from 'vuex'
import {getInfo, login} from "~/api/manager.js";
import { setToken,removeToken } from "~/composable/auth.js";

const store = createStore({
    state () {
        return {
            user:{},

            //侧边宽度
            asideWidth: "250px",

            menus: [],
            ruleNames:[]
        }
    },
    mutations: {
        SET_USERINFO(state,user){
            state.user = user
        },
        handleAsideWidth(state){
            state.asideWidth = state.asideWidth == "250px" ? "64px" : "250px"
        },
        //获取后端数据，忖道state中
        SET_MENUS(state,menus){
            state.menus = menus
        },
        SET_RULENAMES(state,ruleNames){
            state.ruleNames = ruleNames
        }

    },
    actions: {
        //登录功能
        login({commit},{ username,password }){
            return new Promise( (resolve, reject) => {
                login(username,password).then( res => {
                    //存储cookie
                    setToken(res.token)
                    resolve(res)

                }).catch(err => reject(err))
            })
        },

        //获取当前登录的用户信息
        getInfo({commit}){
            return new Promise((resolve,reject) => {
                getInfo().then(res => {
                    //获取后端数据，存到state中
                    commit("SET_USERINFO",res)
                    commit("SET_MENUS",res.menus)
                    commit("SET_RULENAMES",res.ruleNames)
                    resolve(res)
                }).catch(err => reject(err))
            })
        },

        //退出登录的logout
        logoutAction({ commit }){
            //移除cookie中的token
            removeToken()
            //清除当前用户状态,清除store，state中的user
            commit("SET_USERINFO",{})
        }
        //第二种清空用户数据的方法
        // logoutAction(state){
        //     //移除cookie中的token
        //     removeToken()
        //     //清除当前用户状态,清除store，state中的user
        //     state.user = {}
        // }
    }
})

export default store