

// function version(){
//   console.log('envVersion', __wxConfig.envVersion);
//   let version = __wxConfig.envVersion;
//   switch (version)
//   {
//     case 'develop':
//       return 'https://测试版环境域名';
//       break;
//     case 'trial':
//       return 'https://体验版环境域名';
//       break;
//     case 'release':
//       return 'https://线上环境域名';
//       break;
//     default:
//       return 'https://测试版环境域名';
//   }
// }

//调用
// version();


// 线上环境
const host = 'https://krjrobot.cn/krjrobot'
// 本地环境
// const host = 'http://krj/krjrobot'
// 测试环境
// const host = 'https://dev.krjrobot.cn/krjrobot'

import store from '../store'//引入store

function request (url, method, data, header = {}) {
  wx.showLoading({
    title: '加载中' // 数据请求前loading
  })
  if(url != '/mini/signIn' && wx.getStorageSync('JSESSIONID')){
    return new Promise((resolve, reject,header) => {
      wx.request({
        url: host + url, // 仅为示例，并非真实的接口地址
        method: method,
        data: data,
        header: {
          'content-type': 'application/json', // 默认值
          'Authorization': wx.getStorageSync('JSESSIONID'),
          'projectId':store.state.projectId
        },
        success: function (res) {
          wx.hideLoading()
          resolve(res.data)
        },
        fail: function (res) {
          wx.hideLoading()
          // reject(false)
        },
        complete: function () {
          wx.hideLoading()
        }
      })
    })
  }else{
    return new Promise((resolve, reject,header) => {
      wx.request({
        url: host + url, // 仅为示例，并非真实的接口地址
        method: method,
        data: data,
        header: {
          'content-type': 'application/json', // 默认值
          // 'projectId':store.state.projectId
        },
        success: function (res) {
          wx.hideLoading()
          resolve(res.data)
        },
        fail: function (res) {
          wx.hideLoading()
          // reject(false)
        },
        complete: function () {
          wx.hideLoading()
        }
      })
    })
  }
}

// GET请求
function get (obj) {
  return request(obj.url, 'GET', obj.data)
}

// POST请求
function post (obj) {
  return request(obj.url, 'POST', obj.data)
}

// 存
function setStorage (key,value) {
  wx.setStorageSync(key, value);
}

// 取
function getStorage (key) {
  wx.getStorageSync(key);
}

// 获取时间
function formatTime (){
  var timestamp = Date.parse(new Date());
  var date = new Date(timestamp);
  //获取年份  
  var Y =date.getFullYear();
  //获取月份  
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //获取当日日期 
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  var timeDate = Y + '-' + M + '-' + D
  return timeDate;
}

export default {
  request,
  get,
  post,
  host,
  formatTime,
  setStorage,
  getStorage
}
