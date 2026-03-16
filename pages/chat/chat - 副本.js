Page({
  data: {
    roleId: 0,
    roleInfo: {},
    messages: [],
    inputMsg: ""
  },
  onLoad(options) {
    this.setData({ roleId: options.roleId });
    // 拉角色信息
    wx.request({
      url: `https://dj.awsl8.com/v1/chat/role-detail/`,
      method: 'post',
      data: {
        roleId: options.roleId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        this.setData({ roleInfo: res.data.data });
      }
    });
    this.loadChatHistory(options);
  },
  loadChatHistory(options) {
    wx.request({
      url: `https://dj.awsl8.com/v1/chat/history-message/`,
      method: 'post',
      data: {
        roleId: options.roleId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token':wx.getStorageSync('Token')
      },
      success: (res) => {
        console.log('聊天记录:', res.data.messages);
        this.setData({ messages: res.data.messages });
      }
    });
  },
  onInput(e) {
    this.setData({ inputMsg: e.detail.value });
  },
  sendMsg() {
    const msg = this.data.inputMsg;
    // 发消息到后端，返回AI回复
    wx.request({
      url: "https://dj.awsl8.com/v1/chat/send-message",
      method: "POST",
      data: {
        roleId: this.data.roleId,
        content: msg
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token':wx.getStorageSync('Token')
      },
      success: (res) => {
        console.log(res);
        this.setData({ messages: res.data.messages, inputMsg: "" });
      }
    });
  }
});