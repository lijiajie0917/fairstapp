// 线上环境
// const host = 'https://www.krjrobot.cn/krjrobot'
// 本地环境
const host = 'http://krj/krjrobot/'

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
          'Authorization': wx.getStorageSync('JSESSIONID')
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

function get (obj) {
  return request(obj.url, 'GET', obj.data)
}

function post (obj) {
  return request(obj.url, 'POST', obj.data)
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
  formatTime
}
