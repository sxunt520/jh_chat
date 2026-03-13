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
    let that = this;
    console.log('欢迎来到枕边江湖！');

    // 登录，获取 openid（可存在 globalData）
    wx.login({
      success: res => {
        // 调用后端接口换取 openid（建议把 code 发给你的后端）
        wx.request({
          url: 'https://dj.awsl8.com/v1/member/wx-login',
          method: 'POST',
          data: {
            code: res.code   // 微信临时 code
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: result => {
            console.log(result.data);
            if (result.data.status==0 && result.data.data) {
              that.globalData.openid = result.data.data.openid;
              that.globalData.userInfo = result.data.data.user_profile;
              that.globalData.token = result.data.data.api_token;
              wx.setStorageSync('openid', result.data.data.openid);
              wx.setStorageSync('userInfo', result.data.data.user_profile);
              wx.setStorageSync('Token', result.data.data.api_token);
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
      // 本地缓存优先
      let userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        this.globalData.userInfo = userInfo;
        callback(userInfo);
        return;
      }
      // 主动授权（一般页面触发，或首次缺少详细信息时执行）
        wx.getUserProfile({
          desc: '用于完善用户资料',
          success: res => {
            this.globalData.userInfo = res.userInfo;
            wx.setStorageSync('userInfo', res.userInfo);
            // 同步到后端
            wx.request({
              url: 'https://dj.awsl8.com/v1/chat/update-userinfo',
              method: 'POST',
              data: {
                openid: this.globalData.openid,
                nickName: res.userInfo.nickName,
                avatarUrl: res.userInfo.avatarUrl
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              }
            });
            callback(res.userInfo);
          }
        });
    }
  }

});