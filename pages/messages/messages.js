Page({
  data: { chats: [] },
  onLoad() {
    wx.request({
      url: "https://你的后端/api/chat/list",
      success: (res) => {
        this.setData({ chats: res.data.chats });
      }
    });
  },
  gotoChat(e) {
    wx.navigateTo({ url: "/pages/chat/chat?roleId=" + e.currentTarget.dataset.roleid });
  }
});