import Vue from 'vue'
import App from './App'

import WXrequest from './utils/wx-request'

import store from './store'

// 全局
Vue.prototype.$httpWX = WXrequest
Vue.prototype.$store = store

Vue.config.productionTip = false

App.mpType = 'app'
const app = new Vue(App)
app.$mount()

Vue.prototype.globalData = getApp().globalData

// 监控小程序的后台接口调用和页面报错，拦截wx.request
// const myRequest = wx.request;

// const wrapRequest = function () {
//   const originRequest = wx.request;
//   Object.defineProperty(wx, 'request', {
//     configurable: true,
//     enumerable: true,
//     writable: true,
//     value: function () {
//       const config = arguments[0] || {};
//       const url = config.url;
//       const data = config.data;
//       console.log('请求地址:', url, '||','提交数据:',data);
//       // 这里可以使用最原始的request方法，将请求地址和数据上报给后台作为统计
//       // myRequest({
//       //   url: url,
//       //   data: data
//       // })
//       return originRequest.apply(this, arguments);
//     }
//   });
// }

// wrapRequest();

// //防止后续的程序重写onError，导致之前注册的onError失效
// app.$mount({
//   onError: function (err) {
//     monitor.notifyError(err)
//     console.log(err)
//   }
// })

wx.getSystemInfo({
  success: res => {
    console.log('手机信息res'+res.model)
    console.log(res);
    let modelmes = res.model;
    let height = res.screenHeight;
    if (modelmes.search("iPhone X") != -1) {
      app.globalData.isIphoneX = true;
    } else if (height >= 896) {
      // console.log('xr');
      app.globalData.isIphoneX11 = true;
    } else if (height >= 568) {
      // console.log('xr');
      app.globalData.isIphone5 = true;
    }
  }
})
