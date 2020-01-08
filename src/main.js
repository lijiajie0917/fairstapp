import Vue from 'vue'
import App from './App'

import WXrequest from './utils/wx-request'
Vue.prototype.$httpWX = WXrequest

// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// import "../static/weui/weui.css";

// Vue.use(ElementUI)

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

Vue.prototype.globalData = getApp().globalData
wx.getSystemInfo({
  success: res => {
    // console.log('手机信息res'+res.model)
    console.log(res);
    let modelmes = res.model;
    let height = res.screenHeight;
    if (modelmes.search("iPhone X") != -1) {
      app.globalData.isIphoneX = true;
    } else if (height >= 896) {
      // console.log('xr');
      app.globalData.isIphoneX11 = true;
    }
  }
})

export default {
  config: {}
}
