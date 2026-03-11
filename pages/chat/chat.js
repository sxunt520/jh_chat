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
      url: `https://你的后端/api/roles/${options.roleId}`,
      success: (res) => {
        this.setData({ roleInfo: res.data });
      }
    });
    this.loadChatHistory();
  },
  loadChatHistory() {
    wx.request({
      url: `https://你的后端/api/chat/history?roleId=${this.data.roleId}`,
      success: (res) => {
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
      url: "https://你的后端/api/chat/send",
      method: "POST",
      data: {
        roleId: this.data.roleId,
        content: msg
      },
      success: (res) => {
        this.setData({ messages: res.data.messages, inputMsg: "" });
      }
    });
  }
});