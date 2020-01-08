import axios from 'axios'
import router from '@/router/index'
import {getUserInfo} from '@/assets/js/auth'
// 定义一个插件对象
const httpPlugin = {}
// 为插件对象添加一个成员：install
// install是一个函数
// 该函数接收两个参数：vue和options
const http = axios.create({
  // 云服务器（生产环境）
  baseURL: 'http://192.168.3.29/krjrobot/'
})
// const http = axios.create({
//   // 云服务器（生产环境）
//   baseURL: 'https://krjrobot.cn/krjrobot/'
// })
/*
添加请求拦截器
拦截器本身就是一个方法
拦截器函数接收一个参数 config
config就是你当前请求的配置对象
当你使用axios发起请求的时候，那么就会先经过这个拦截器然后再发起请求
在拦截器阶段我们的请求还没有发送出去，可以在这里定制请求之前的行为
*/
// 让ajax携带cookie
http.interceptors.request.use(function (config) {
  // 如果本次请求的不是/login的接口，我们就加入请求头
  // console.log(config)
  // url 以 / 开头
  if (config.url !== '/signIn') {
    config.headers['Authorization'] = getUserInfo()
    const data = getUserInfo()
    if (!data) {
      console.log('出错了')
    }
    // console.log(getUserInfo())
  }
  // return config就好比是next()允许通过
  // 通过之后才要真正的发起请求
  return config
}, function (error) {
  return Promise.reject(error)
})
// 响应拦截器
// 我们可以在这里对一些公共的业务进行处理
// 例如需要对每个接口进行403权限认证判断
// 如果本地响应的是403，则我们提示用户，你没有权限执行该操作
http.interceptors.response.use(function (response) {
  // console.log(response)
  // console.log(response.data.status)
  if (response.data.status === '002001') {
    // window.alert('你没有权限执行该操作!')
    // 如果用户长时间未操作导致token失效或者有人恶意伪造token
    // 我们也不允许他进入我们的系统界面
    // 所以我们在这里通过对401统一拦截跳转到登录页
    // window.alert('你没有权限访问该数据，即将返回登录页！')
    router.push({
      name: 'Login',
      query: {
        redirect: window.location.hash
      }
    })
  } else if (response.data.status === '002002') {
    alert('您的帐号已在其他地方登录，请重新登录');
    router.push({
      name: 'Login',
      query: {
        redirect: window.location.hash
      }
    })
  }
  return response
}, function (error) {
  return Promise.reject(error)
})
httpPlugin.install = function (Vue, options) {
  // 添加实例方法
  Vue.prototype.$http = http
}
// 导出插件对象
export default httpPlugin
