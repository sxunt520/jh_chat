Page({
  //data: { userInfo: null, stats: { follow: 0, fans: 0, newMsg: 0 } },
  onLoad() {
    // wx.getUserInfo({
    //   success: (res) => {
    //     this.setData({ userInfo: res.userInfo });
    //     // 登录，获取用户统计
    //     wx.request({
    //       url: "https://dj.awsl8.com/v1/chat/stats",
    //       data: { openid: res.userInfo.openId },
    //       success: (statRes) => {
    //         this.setData({ stats: statRes.data });
    //       }
    //     });
    //   }
    // });
  },
  onLogin(e) {
    let userInfo = e.detail.userInfo;console.log(e);
    // this.setData({ userInfo });
    // wx.request({
    //   url: "https://dj.awsl8.com/v1/chat/login",
    //   method: "POST",
    //   data: userInfo,
    //   success: (res) => {
    //     // 登录成功
    //   }
    // });
  }
});