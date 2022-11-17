import { reactive, ref } from "vue";
import { logoutApi, updatePassword } from "~/api/manager.js";
import { logoutFunction, SuccessMsg } from "~/composable/utils.js";
import { useStore } from "vuex";
import { useRouter } from "vue-router";


export function useRePassword() {

    const store = useStore()
    const router = useRouter()

    const formDrawerRef = ref(null)
    const form = reactive({
        oldpassword: "",
        password: "",
        repassword: ""
    })

    const rules = {
        oldpassword: [
            {
                required: true,
                message: '旧密码不能为空',
                trigger: 'blur'
            },
        ],
        password: [
            {
                required: true,
                message: '新密码不能为空',
                trigger: 'blur'
            },
        ],
        repassword: [
            {
                required: true,
                message: '确认新密码不能为空',
                trigger: 'blur'
            },
        ]
    }

    const formRef = ref(null)
    const onSubmit = () => {
        //先进行参数验证，参数不能为空
        formRef.value.validate((valid) => {
            if (!valid) {
                return false
            }
            formDrawerRef.value.showLoading();
            updatePassword(form)
                .then(() => {
                    SuccessMsg("修改密码成功,请重新登录")
                    store.dispatch("logoutAction")

                    //跳转回登录页面
                    router.push("/login")
                    //提示退出成功
                })
                .finally(() => {
                    formDrawerRef.value.hideLoading();
                })
        })
    }

    //点击修改密码会弹出来抽屉
    const openRePasswordForm = () => formDrawerRef.value.open()

    return{
        form,
        formDrawerRef,
        formRef,
        rules,
        onSubmit,
        openRePasswordForm
    }
}

export function useLogout(){
    const store = useStore()
    const router = useRouter()

    function logout() {
        logoutFunction("是否要退出登录",).then(() => {
            logoutApi().finally(() => {

                store.dispatch("logoutAction")

                //跳转回登录页面
                router.push("/login")
                //提示退出成功
                SuccessMsg("已退出！🍺～")
            })
        })
    }
    return{
        logout
    }
}