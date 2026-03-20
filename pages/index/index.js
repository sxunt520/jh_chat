Page({
  data: {
    // 基础高度：输入框本身的高度 (约 90px)
    baseInputHeight: 80,
    // 扩展菜单高度 (约 160rpx -> 80px)
    expandMenuHeight: 80,
    // 当前总高度
    inputAreaTotalHeight: 65,
    
    isVoiceMode: false,
    inputValue: '',
    isFocus: false,
    currentPageIndex: 0,
    
    // 新功能状态
    showExpandMenu: false,
    showCommentModal: false,
    showVipPage: false,
    currentCommentPageId: null, // 当前正在评论哪一页
    currentComments: [] // 当前弹窗显示的评论列表

    // pages 数据保持不变...
    , pages: [
      {
        id: 'page1',
        bgUrl: 'https://axe-video-1257242485.cos.ap-guangzhou.myqcloud.com/site_video/jh/dj/huangying_2.webp',
        likes: 128,
        showHistory: false,
        scrollToView: '',
        latestMessage: { content: '你好呀！我是第一只猫。' },
        chatList: [
          { cid: 1, content: '你好呀！我是第一只猫。', time: '10:00', isSelf: false },
        ],
        comments: [ // 新增：每页独立的评论数据
          { id: 1, user: '用户A', content: '好可爱的猫！' },
          { id: 2, user: '用户B', content: '背景图真好看。' }
        ]
      },
      {
        id: 'page2',
        bgUrl: 'https://axe-video-1257242485.cos.ap-guangzhou.myqcloud.com/site_video/jh/dj/tab_pic_4_new.png',
        likes: 85,
        showHistory: false,
        scrollToView: '',
        latestMessage: { content: '喵~ 我是第二只猫。' },
        chatList: [{ cid: 1, content: '喵~', time: '11:00', isSelf: false }],
        comments: []
      },
      {
        id: 'page3',
        bgUrl: 'https://axe-video-1257242485.cos.ap-guangzhou.myqcloud.com/site_video/jh/dj/tab_pic_5_new.png',
        likes: 204,
        showHistory: false,
        scrollToView: '',
        latestMessage: { content: '睡觉中...' },
        chatList: [{ cid: 1, content: 'Zzz...', time: '12:00', isSelf: false }],
        comments: [{ id: 1, user: '夜猫子', content: '还没睡吗？' }]
      }
    ]
  },

  onLoad() {
    // 初始化高度
    //this.setData({ inputAreaTotalHeight: this.data.baseInputHeight });
  },

  onPageChange(e) {
    const currentIndex = e.detail.current;
    this.setData({ currentPageIndex: currentIndex, isFocus: false, showExpandMenu: false });
  },

  // --- 功能 1: 评论弹窗 ---
  openCommentModal(e) {
    const id = e.currentTarget.dataset.id;
    const page = this.data.pages.find(p => p.id === id);
    
    this.setData({
      currentCommentPageId: id,
      currentComments: page.comments || [],
      showCommentModal: true,
      showExpandMenu: false // 打开弹窗时关闭菜单
    });
  },

  closeCommentModal() {
    this.setData({ showCommentModal: false });
  },

  submitComment() {
    // 这里简单获取输入框内容比较麻烦，因为 modal 里的 input 没有绑定 data
    // 实际开发建议在 data 里再绑一个 modalInputValue
    // 演示起见，这里模拟发送一条
    const newComment = {
      id: Date.now(),
      user: '我',
      content: '这是一条新评论 (演示)'
    };

    const index = this.data.pages.findIndex(p => p.id === this.data.currentCommentPageId);
    if (index !== -1) {
      const newPages = [...this.data.pages];
      const oldComments = newPages[index].comments || [];
      newPages[index].comments = [...oldComments, newComment];
      
      this.setData({
        pages: newPages,
        currentComments: newPages[index].comments // 刷新弹窗列表
      });
      wx.showToast({ title: '评论成功', icon: 'none' });
    }
  },

  // --- 功能 2: 扩展菜单 ---
  toggleExpandMenu() {
    const show = !this.data.showExpandMenu;
    const newHeight = show ? (this.data.baseInputHeight + this.data.expandMenuHeight) : this.data.baseInputHeight;
    
    this.setData({
      showExpandMenu: show,
      inputAreaTotalHeight: newHeight
    });
  },

  handleSendImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        wx.showToast({ title: '选择了图片', icon: 'none' });
        console.log(res.tempFiles[0].tempFilePath);
        this.toggleExpandMenu(); // 关闭菜单
      }
    });
  },

  handleHeartCommand() {
    wx.showToast({ title: '发送心动指令 ❤️', icon: 'none' });
    this.toggleExpandMenu();
  },

  // --- 功能 3: VIP 侧滑页 ---
  openVipPage() {
    this.setData({ showVipPage: true, showExpandMenu: false });
  },
  closeVipPage() {
    this.setData({ showVipPage: false });
  },

  // --- 原有功能 ---
  toggleVoice() { this.setData({ isVoiceMode: !this.data.isVoiceMode, isFocus: false, showExpandMenu: false }); },
  onInput(e) { this.setData({ inputValue: e.detail.value }); },
  sendMessage() {
    if (!this.data.inputValue.trim()) return;
    // ... (复用之前的发送逻辑，记得更新 pages 数组)
    const index = this.data.currentPageIndex;
    const newMsg = { cid: Date.now(), content: this.data.inputValue, time: 'Now', isSelf: true };
    const newPages = [...this.data.pages];
    newPages[index].chatList.push(newMsg);
    newPages[index].latestMessage = newMsg;
    this.setData({ pages: newPages, inputValue: '', isFocus: false });
  },
  handleLike(e) {
    const id = e.currentTarget.dataset.id;
    const index = this.data.pages.findIndex(p => p.id === id);
    if(index !== -1) {
      const newPages = [...this.data.pages];
      newPages[index].likes++;
      this.setData({ pages: newPages });
    }
  },
  handleShare() { wx.showToast({title: '分享'}); },
  toggleHistory(e) {
    const id = e.currentTarget.dataset.id;
    const index = this.data.pages.findIndex(p => p.id === id);
    if(index !== -1) {
      const newPages = [...this.data.pages];
      const p = newPages[index];
      p.showHistory = !p.showHistory;
      if(p.showHistory) p.scrollToView = `anchor-${p.id}`;
      this.setData({ pages: newPages });
    }
  },
  focusInput(e) {
    const id = e.currentTarget.dataset.id;
    const index = this.data.pages.findIndex(p => p.id === id);
    if (index === this.data.currentPageIndex) {
      this.setData({ isVoiceMode: false, isFocus: true, showExpandMenu: false });
    }
  }
});