Page({
  data: {
    // 模拟背景图列表
    bgImages: [
      { id: 1, url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80' }, // 猫
      { id: 2, url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&q=80' }, // 猫
      { id: 3, url: 'https://images.unsplash.com/photo-1495360019602-e0019216adfe?w=800&q=80' }  // 猫
    ],
    
    // 聊天数据
    chatList: [
      { id: 101, type: 'other', content: '你好呀！今天想聊点什么？', time: '10:00', isSelf: false },
      { id: 102, type: 'self', content: '随便聊聊，给我讲个故事吧。', time: '10:01', isSelf: true },
      { id: 103, type: 'other', content: '好的，从前有一只住在云端的猫...', time: '10:01', isSelf: false },
      { id: 104, type: 'other', content: '它每天的任务就是收集夕阳的颜色。', time: '10:02', isSelf: false }
    ],
    
    latestMessage: {}, // 当前显示的最新一条
    showHistory: false, // 是否显示历史记录列表
    scrollToView: '', // 滚动定位ID
    
    // 输入状态
    inputValue: '',
    isVoiceMode: false,
    focusInput: false,
    likes: 128
  },

  onLoad() {
    this.updateLatestMessage();
  },

  // 更新最新一条消息用于默认展示
  updateLatestMessage() {
    const list = this.data.chatList;
    if (list.length > 0) {
      this.setData({
        latestMessage: list[list.length - 1]
      });
    }
  },

  // 滑动切换背景
  onSwiperChange(e) {
    console.log('当前背景索引:', e.detail.current);
  },

  // 切换历史/单条模式
  toggleHistory() {
    const showHistory = !this.data.showHistory;
    this.setData({ showHistory });
    
    if (showHistory) {
      // 切换到历史模式，滚动到底部
      setTimeout(() => {
        this.setData({
          scrollToView: 'bottom-anchor'
        });
      }, 100);
    }
  },

  // 切换语音/文字模式
  toggleVoice() {
    this.setData({
      isVoiceMode: !this.data.isVoiceMode,
      focusInput: false // 切换时取消聚焦
    });
  },

  // 输入框内容变化
  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  // 发送消息
  sendMessage() {
    const text = this.data.inputValue.trim();
    if (!text) return;

    const newMsg = {
      id: Date.now(),
      type: 'self',
      content: text,
      time: this.getCurrentTime(),
      isSelf: true
    };

    const newChatList = [...this.data.chatList, newMsg];
    
    // 模拟回复
    setTimeout(() => {
      const replyMsg = {
        id: Date.now() + 1,
        type: 'other',
        content: '收到你的消息了："'+ text +'"，很有趣！',
        time: this.getCurrentTime(),
        isSelf: false
      };
      this.setData({
        chatList: [...newChatList, replyMsg]
      });
      this.updateLatestMessage();
      if(this.data.showHistory) {
         this.setData({ scrollToView: 'bottom-anchor' });
      }
    }, 1000);

    this.setData({
      chatList: newChatList,
      inputValue: '',
      focusInput: false
    });
    
    this.updateLatestMessage();
    
    // 如果当前在历史模式，自动滚动到底部
    if (this.data.showHistory) {
      this.setData({ scrollToView: 'bottom-anchor' });
    }
  },

  // 按钮点击处理
  handleAction(e) {
    const type = e.currentTarget.dataset.type;
    if (type === 'like') {
      this.setData({ likes: this.data.likes + 1 });
      wx.showToast({ title: '已点赞', icon: 'none' });
    } else if (type === 'share') {
      wx.showToast({ title: '分享面板开发中', icon: 'none' });
    } else if (type === 'comment') {
      this.setData({ focusInput: true }); // 点击评论直接聚焦输入框
    }
  },

  getCurrentTime() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }
});