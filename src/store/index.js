import { createStore } from 'vuex'
import {getInfo, login} from "~/api/manager.js";
import { setToken,removeToken } from "~/composable/auth.js";

const store = createStore({
    state () {
        return {
            user:{}
        }
    },
    mutations: {
        SET_USERINFO(state,user){
            state.user = user
        }
    },
    actions: {
        //登录功能
        login({commit},{ username,password }){
            return new Promise( (resolve, reject) => {
                login(username,password).then( res => {
                    //存储cookie
                    setToken(res.token)
                    console.log("打印token:" + res.token)
                    resolve(res)

                }).catch(err => reject(err))
            })
        },

        //获取当前登录的用户信息
        getInfo({commit}){
            return new Promise((resolve,reject) => {
                getInfo().then(res => {
                    //调用SET_USERINFO函数，将信息赋值给state中的user
                    commit("SET_USERINFO",res)
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