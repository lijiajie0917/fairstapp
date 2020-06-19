
let host;

let dev = __wxConfig.envVersion; // 运行环境
switch (dev)
{
  case 'develop':
    host = 'https://dev.krjrobot.cn/krjrobot'; // 测试环境
    break;
  case 'trial':
    host = 'https://dev.krjrobot.cn/krjrobot'; //体验环境
    break;
  case 'release':
    host = 'https://krjrobot.cn/krjrobot'; // 线上环境
    break;
  default:
    host = 'https://dev.krjrobot.cn/krjrobot'; // 测试环境
}

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

// PUT请求
function put (obj) {
  return request(obj.url, 'PUT', obj.data)
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

//成功toast
function showSuccessToast(msg) {
  wx.showToast({
    title: msg,
    // duration:2000,//显示时长
    mask:true,//是否显示透明蒙层，防止触摸穿透，默认：false
    icon:'success' //图标，支持"success"、"loading"
  })
}

//失败toast
function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    mask: true,
    icon: "none" //图标，支持"success"、"loading"
    // image: '/static/images/icon_error.png' //自定义失败图标
  })
}

//封装wx.showModel为alert
function alert(title = '',msg = '',confirm,cancel) {//confirm,cancel分别对应成功后的回调函数和失败后的回调函数
  wx.showModal({
    title: title , //标题
    content: msg, //提示内容
    showCancel: cancel ? true : false, //是否显示取消按钮（如果cancel函数为空也就是不传，则不显示，否则显示）
    confirmColor: '#336FFF',//确定文字的颜色
    success:res=>{
      if(res.confirm){
        if(confirm){ //如果confirm函数不为空，则点击确定执行该函数
          confirm()
        }
      } else {}
    }
  })
}

export default {
  request,
  get,
  post,
  put,
  host,
  formatTime,
  setStorage,
  getStorage,
  showSuccessToast,
  showErrorToast,
  alert
}
