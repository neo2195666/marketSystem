import axios from "../axios"

export function login(username,password){
    return axios.post("/admin/login",{
        username,
        password
    })
}

export function getInfo(){
    return axios.post("/admin/getinfo")
}

//添加退出登录的api
export function logoutApi(){
    return axios.post("/admin/logout")
}

//修改密码api
export function updatePassword(data){
    return axios.post("/admin/updatepassword",data)
}