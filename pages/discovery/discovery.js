Page({
  data: {
    roles: []
  },
  onLoad() {
    wx.request({
      url: "https://dj.awsl8.com/v1/chat/role-list", // 获取角色列表
      success: (res) => {
        console.log(res);
        this.setData({ roles: res.data.data});
      }
    });
  },
  onRoleTap(e) {
    // 跳到聊天页并传递虚拟人物ID
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/chat/chat?roleId=${id}` });
  }
});