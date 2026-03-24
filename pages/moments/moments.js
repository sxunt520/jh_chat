Page({
  data: { moments: [] },
  onLoad() {
    wx.request({
      url: "https://dj.awsl8.com/v1/chat/moment",
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token':wx.getStorageSync('Token')
      },
      success: (res) => {
        this.setData({ moments: res.data.moments });
      }
    });
  }
});