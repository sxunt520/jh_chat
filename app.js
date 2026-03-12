//const WXAPI = require('apifm-wxapi')
//WXAPI.init('sxunt')
//WXAPI.init('photography')

// const MYWXAPI = require('my-wxapi')
// MYWXAPI.init('v1')

const MYWXAPI = require('./components/my-wxapi/index.js')
MYWXAPI.init('v1')

App({
  // 全局数据定义
  globalData: {
    userInfo: null,     // 微信用户信息
    openid: null,       // 当前用户的 openid
  },

  // 小程序启动时自动执行
  onLaunch: function() {
    console.log('欢迎来到枕边江湖！');

    // 登录，获取 openid（可存在 globalData）
    wx.login({
      success: res => {
        // 调用后端接口换取 openid（建议把 code 发给你的后端）
        wx.request({
          url: 'https://dj.awsl8.com/v1/chat/login',
          method: 'POST',
          data: {
            code: res.code   // 微信临时 code
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: result => {
            if (result.data && result.data.user) {
              this.globalData.openid = result.data.user.openid;
              this.globalData.userInfo = result.data.user;
            }
          }
        });
      }
    });
  },

  // 全局获取用户信息的方法（页面可调用）
  getUserInfo(callback) {
    if (this.globalData.userInfo) {
      typeof callback === 'function' && callback(this.globalData.userInfo);
    } else {
      wx.getUserInfo({
        success: res => {
          this.globalData.userInfo = res.userInfo;
          if (callback) callback(res.userInfo);
        }
      });
    }
  }

});