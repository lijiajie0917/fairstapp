// 对于token获取和保存的
// JESSIONID保存的是字符串
const userInfoKey = 'JSESSIONID'
// 保存token
export function saveUserInfo (userInfo = {}) {
  wx.setStorageSync(userInfoKey, userInfo);
  // window.localStorage.setItem(userInfoKey, userInfo)
}
// 获取token
export function getUserInfo () {
  // console.log(window.localStorage.getItem(userInfoKey))
  try {
    // 本地存储中的user-info可能不是一个有效的JSON格式字符串
    // 所以我们这里为了避免程序蓄出错，使用了try-catcher 来捕获转换失败的异常
    // return window.localStorage.getItem(userInfoKey)
    return wx.getStorageSync(userInfoKey);
  } catch (err) {
    return ''
  }
}
// 删除token
export function removeUserInfo () {
  // window.localStorage.removeItem(userInfoKey)
  wx.removeStorageSync(userInfoKey);
}
