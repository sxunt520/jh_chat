Page({
  data: { moments: [] },
  onLoad() {
    wx.request({
      url: "https://你的后端/api/moments",
      success: (res) => {
        this.setData({ moments: res.data.moments });
      }
    });
  }
});