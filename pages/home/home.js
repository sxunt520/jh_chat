Page({
  data: {
    baseInputHeight: 55, // 基础高度
    expandMenuHeight: 70, // 菜单高度
    inputAreaTotalHeight: 55,
    userInfo: null,
    
    isVoiceMode: false,
    inputValue: '',
    isFocus: false,
    currentPageIndex: 0,
    
    // 状态控制
    showExpandMenu: false,
    showCommentModal: false,
    showVipPage: false,
    showRoleDetail: false,
    roleModalStartY: 0,
    roleModalScrollTop: 0, // 记录滚动条位置
    roleModalMoved: false,
    currentComments: [],
    currentRole: {
      roleName: '',
      slogan: '',
      description: '',
      bgUrl: '',
      gallery: []
    },
    
    // 语音状态
    isRecording: false,
    voiceStatus: 'normal', // normal, cancel, moving
    voiceHint: '按住 说话',
    startY: 0,
    startX: 0,

    pages: [
      {
        id: 'p1',
        bgUrl: 'https://axe-video-1257242485.cos.ap-guangzhou.myqcloud.com/site_video/jh/dj/huangying_2.webp',
        roleName: '黄樱',
        slogan: '水月停轩',
        description: '一只来自喵星的可爱少女，喜欢晒太阳和吃小鱼干。性格活泼开朗，偶尔有点小傲娇。',
        gallery: [
          'http://axe-video-1257242485.cos.ap-guangzhou.myqcloud.com/img_static/20250923/68d23e5c2f12c.jpg',
          'http://axe-video-1257242485.cos.ap-guangzhou.myqcloud.com/img_static/20250520/682c479cbd451.jpg',
          'http://axe-video-1257242485.cos.ap-guangzhou.myqcloud.com/img_static/20250923/68d23e5c2f12c.jpg'
        ],
        likes: 128,
        showHistory: false,
        latestMessage: { content: '你好呀！我是第一只猫。' },
        chatList: [{ cid: 1, content: '你好呀！', time: '10:00', isSelf: false }],
        comments: [{ id: 1, user: '用户A', content: '好可爱！' }]
      },
      {
        id: 'p2',
        bgUrl: 'https://axe-video-1257242485.cos.ap-guangzhou.myqcloud.com/site_video/jh/dj/tab_pic_4_new.png',
        roleName: '上官妙语',
        slogan: '白马王朝',
        description: '神秘的独行侠，擅长在夜晚行动。外表冷酷，内心却有着不为人知的温柔。',
        gallery: [
          'http://axe-video-1257242485.cos.ap-guangzhou.myqcloud.com/img_static/20250923/68d23e5c2f12c.jpg',
          'http://axe-video-1257242485.cos.ap-guangzhou.myqcloud.com/img_static/20250520/682c479cbd451.jpg'
        ],
        likes: 85,
        showHistory: false,
        latestMessage: { content: '喵~' },
        chatList: [{ cid: 1, content: '喵~', time: '11:00', isSelf: false }],
        comments: []
      },
      {
        id: 'p3',
        bgUrl: 'https://axe-video-1257242485.cos.ap-guangzhou.myqcloud.com/site_video/jh/dj/tab_pic_5_new.png',
        roleName: '许缁衣',
        slogan: '水月停轩',
        description: '永远睡不醒的懒熊，梦想是拥有一张无限大的床。说话慢吞吞的，很有治愈感。',
        gallery: [
          'http://axe-video-1257242485.cos.ap-guangzhou.myqcloud.com/img_static/20250923/68d23e5c2f12c.jpg'
        ],
        likes: 204,
        showHistory: false,
        latestMessage: { content: 'Zzz...' },
        chatList: [{ cid: 1, content: 'Zzz...', time: '12:00', isSelf: false }],
        comments: [{ id: 1, user: '夜猫子', content: '还没睡吗？' }]
      }
    ]
  },

  onLoad() {
    this.setData({ inputAreaTotalHeight: this.data.baseInputHeight });
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({ userInfo });

    //加载角色pages
    wx.request({
      url: "https://dj.awsl8.com/v2/chat/ai-home", // 获取角色列表
      method: 'post',
      data: {
        page: 1,//角色列表取第几页
        pagenum: 10,//角色列表一页多少条
        chat_page: 1,//聊天记录取第几页
        chat_pagenum: 30,//聊天记录一页多少条
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token':wx.getStorageSync('Token')
      },
      success: (res) => {
        console.log(res);
        if (res.data.status==0 && res.data.data) {
          this.setData({ pages: res.data.data});
        }
      }
    });

  },

  onPageChange(e) {
    const index = e.detail.current;
    this.setData({ 
      currentPageIndex: index, 
      isFocus: false, 
      showExpandMenu: false,
      isRecording: false,
      voiceStatus: 'normal'
    });
  },

  // --- 角色详情 ---
  openRoleDetail(e) {
    const id = e.currentTarget.dataset.id;
    const role = this.data.pages.find(p => p.id === id);//去data.pages里找角色详情

    //或者 请求接口获取详情

    // 确保 role 存在才赋值，否则赋空对象
    this.setData({ 
      currentRole: role || { roleName: '未知角色', slogan: '', description: '', bgUrl: '', gallery: [] }, 
      showRoleDetail: true 
    });

  },
  // 获取 scroll-view 的滚动位置
  onRoleModalScroll(e) {
    this.setData({
      roleModalScrollTop: e.detail.scrollTop
    });
  },
  onRoleModalTouchStart(e) {
    this.setData({
      roleModalStartY: e.touches[0].clientY,
      roleModalMoved: false
    });
  },
  onRoleModalTouchMove(e) {
    if (!this.data.showRoleDetail) return;
    
    const deltaY = e.touches[0].clientY - this.data.roleModalStartY;
    
    // 只有向下滑 (deltaY > 0)
    if (deltaY > 0) {
      this.setData({ roleModalMoved: true });
      
      // 【关键逻辑】
      // 如果滚动条不在顶部 (scrollTop > 0)，说明用户在浏览内容，不阻止默认滚动，也不关闭
      if (this.data.roleModalScrollTop > 0) {
        return; 
      }
      
      // 如果在顶部，且向下滑，我们可以稍微移动一下弹窗制造跟随效果 (可选高级效果)
      // 这里简单处理：标记为可关闭
    }
  },
  onRoleModalTouchEnd(e) {
    if (!this.data.showRoleDetail || !this.data.roleModalMoved) return;
    
    const deltaY = e.changedTouches[0].clientY - this.data.roleModalStartY;
    
    // 只有在顶部 (scrollTop === 0) 且 向下滑动超过 100px 才关闭
    // 注意：由于微信机制，scrollTop 可能在 touch 过程中有延迟，这里做一个宽容判断
    // 或者简单点：只要向下滑动距离很大 (比如 > 150px)，强制关闭，不管 scrollTop
    // 为了稳妥，我们采用“大距离强制关闭”策略，避免 scrollTop 判断不准
    
    if (deltaY > 150) {
      this.closeRoleDetail();
    } else {
      // 滑动距离不够，重置状态 (如果有跟随动画，这里复位)
      this.setData({ roleModalMoved: false });
    }
  },
  closeRoleDetail() {
    this.setData({ showRoleDetail: false });
  },

  // --- 跳转我的 ---
  goToMine() {
    // 确保 app.json 中有配置 /pages/mine/mine
    // 若未创建，可暂时用 toast 代替
    wx.showToast({ title: '开发中...', icon: 'none' });
    //wx.navigateTo({ url: 'pages/mine/mine' });
  },

  // --- 语音交互逻辑 ---
  toggleVoice() {
    this.setData({ 
      isVoiceMode: !this.data.isVoiceMode, 
      isFocus: false, 
      showExpandMenu: false,
      isRecording: false,
      voiceStatus: 'normal',
      voiceHint: '按住 说话'
    });
  },

  onVoiceStart(e) {
    if (!this.data.isVoiceMode) return;
    const touch = e.touches[0];
    this.setData({
      isRecording: true,
      voiceStatus: 'normal',
      voiceHint: '松开 发送',
      startY: touch.clientY,
      startX: touch.clientX
    });
    // TODO: 调用 wx.getRecorderManager().start()
  },

  onVoiceMove(e) {
    if (!this.data.isRecording) return;
    const touch = e.touches[0];
    const deltaY = touch.clientY - this.data.startY;
    const deltaX = touch.clientX - this.data.startX;

    // 上滑取消 (阈值 -100)
    if (deltaY < -100) {
      this.setData({ voiceStatus: 'cancel', voiceHint: '松开手指，取消发送' });
    } 
    // 左右滑动 (水平位移 > 50 且 垂直位移不大)
    else if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 100) {
      this.setData({ voiceStatus: 'moving', voiceHint: '松开切换文字输入' });
    } 
    // 回到正常区
    else {
      this.setData({ voiceStatus: 'normal', voiceHint: '松开 发送' });
    }
  },

  onVoiceEnd(e) {
    if (!this.data.isRecording) return;
    
    const status = this.data.voiceStatus;
    
    if (status === 'cancel') {
      wx.showToast({ title: '已取消', icon: 'none' });
    } else if (status === 'moving') {
      this.setData({ isVoiceMode: false, isFocus: true });
      wx.showToast({ title: '已切换文字', icon: 'none' });
    } else {
      wx.showToast({ title: '发送语音', icon: 'success' });
      // TODO: 调用 stop 并上传
    }

    this.setData({
      isRecording: false,
      voiceStatus: 'normal',
      voiceHint: '按住 说话'
    });
  },

  // --- 其他功能 ---
  openCommentModal(e) {
    const id = e.currentTarget.dataset.id;
    const page = this.data.pages.find(p => p.id === id);
    this.setData({ 
      currentComments: page.comments || [], 
      currentCommentPageId: id, // 记录当前评论的是哪个角色
      commentInputValue: '',    // 清空输入框
      showCommentModal: true, 
      showExpandMenu: false 
    });
  },
  // 修正 onCommentInput (需要在 WXML 绑定 bindinput)
  onCommentInput(e) {
    this.setData({ commentInputValue: e.detail.value });
  },
  closeCommentModal() { this.setData({ showCommentModal: false }); },
  
  // submitComment() {
  //   // 模拟发送
  //   const newC = { id: Date.now(), user: '我', content: '新评论' };
  //   const idx = this.data.pages.findIndex(p => p.id === this.data.currentComments[0]?.id || this.data.pages[0].id); // 简单模拟
  //   // 实际应根据 currentCommentPageId 查找，这里简化处理
  //   wx.showToast({ title: '发送成功', icon: 'none' });
  //   this.closeCommentModal();
  // },

  // --- 【改动点 4】评论提交逻辑修复 ---
  //submitComment() {
    // 获取当前正在评论的角色ID (需要从 currentComments 或者单独存一个 currentCommentPageId)
    // 为了简单，我们假设 currentComments 是属于当前页面的，或者我们需要在 openCommentModal 时记录 pageId
    
    // 更好的方式：在 data 中增加一个 currentCommentPageId
    // 这里我们遍历 pages 找到那个 comments 数组被引用的页面 (因为之前是直接赋值的引用，修改原数组可能有效，但为了稳妥建议重新 setData)
    
  //  const inputVal = this.data.inputValue; // 注意：评论输入框可能用的是另一个变量，检查 WXML
    // 检查 WXML: <input class="c-input" ... /> 这里好像没绑 value! 
    // 我们需要在 data 里加一个 commentInputValue
  //},
  // 修正：需要在 data 中添加 commentInputValue
  // data: { ..., commentInputValue: '', currentCommentPageId: null }

  // 最终修正的 submitComment
  submitComment() {
    const content = this.data.commentInputValue.trim();
    const pageId = this.data.currentCommentPageId;
    
    if (!content || !pageId) {
      wx.showToast({ title: '请输入内容', icon: 'none' });
      return;
    }

    const newComment = {
      id: Date.now(),
      user: '我',
      content: content
    };

    // 1. 更新 pages 数组中的数据
    const newPages = [...this.data.pages];
    const pageIndex = newPages.findIndex(p => p.id === pageId);
    
    if (pageIndex !== -1) {
      // 确保 comments 数组存在
      if (!newPages[pageIndex].comments) {
        newPages[pageIndex].comments = [];
      }
      // 追加新评论
      newPages[pageIndex].comments.push(newComment);
      
      // 2. 更新当前显示的评论列表 (立即看到效果)
      const newCurrentComments = [...newPages[pageIndex].comments];

      this.setData({
        pages: newPages,
        currentComments: newCurrentComments,
        commentInputValue: '', // 清空输入框
        showCommentModal: false // 可选：发送后自动关闭，或者保留让用户继续发
      });
      
      wx.showToast({ title: '评论成功', icon: 'success' });
    }
  },

  toggleExpandMenu() {
    const show = !this.data.showExpandMenu;
    const h = show ? (this.data.baseInputHeight + this.data.expandMenuHeight) : this.data.baseInputHeight;
    this.setData({ showExpandMenu: show, inputAreaTotalHeight: h });
  },
  handleSendImage() { wx.chooseMedia({count:1, mediaType:['image'], success:()=>{this.toggleExpandMenu()}}); },
  handleHeartCommand() { wx.showToast({title:'心动指令❤️'}); this.toggleExpandMenu(); },
  
  openVipPage() { this.setData({ showVipPage: true, showExpandMenu: false }); },
  closeVipPage() { this.setData({ showVipPage: false }); },

  onInput(e) { this.setData({ inputValue: e.detail.value }); },
  
  sendMessage() {
    if (!this.data.inputValue.trim()) return;
    const idx = this.data.currentPageIndex;
    const roleId=this.data.pages[idx].id;
    const push_content=this.data.inputValue;
    const newPages = [...this.data.pages];

    //自己聊天内容先推上去
    const msg = { cid: Date.now(), content: this.data.inputValue, time: 'Now', isSelf: true };
    newPages[idx].chatList.push(msg);
    newPages[idx].latestMessage = msg;
    this.setData({ pages: newPages, inputValue: '', isFocus: false });//清除表单数据、失去焦点

    //请求接口返回ai回复
    wx.request({
      url: "https://dj.awsl8.com/v2/chat/send-msg",
      method: "POST",
      data: {
        roleId: roleId,
        content: push_content
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token':wx.getStorageSync('Token')
      },
      success: (res) => {
        console.log('发送聊天2:', res.data.data);
        if (res.data.status==0 && res.data.data) {

          //Ai回复的内容在推上去
          const msg_ai = { cid: res.data.data.cid, content: res.data.data.content, time: res.data.data.time, isSelf: false };
          newPages[idx].chatList.push(msg_ai);
          newPages[idx].latestMessage = msg_ai;
          this.setData({ pages: newPages, inputValue: '', isFocus: false });

          // fetchStream(res.data.data.message.content.data, {
          //   success(result) {
          //     // 生文中
          //     if (!that.data.loading) return;
          //     that.setData({
          //       'chatList[0].status': 'streaming',
          //       'chatList[0].message.content[0].data': that.data.chatList[0].message.content[0].data + result,
          //     });
          //   },
          //   complete() {
          //     that.setData({
          //       'chatList[0].status': 'complete',
          //       loading: false,
          //     });
          //   },
          // });

        }

      }
    });
    
  },

  handleLike(e) {
    const id = e.currentTarget.dataset.id;
    const idx = this.data.pages.findIndex(p => p.id === id);
    if(idx !== -1) {
      const newPages = [...this.data.pages];
      newPages[idx].likes++;
      this.setData({ pages: newPages });
    }
  },
  handleShare() { wx.showToast({title: '分享'}); },
  
  toggleHistory(e) {
    const id = e.currentTarget.dataset.id;
    const idx = this.data.pages.findIndex(p => p.id === id);
    
    if(idx !== -1) {
      const newPages = [...this.data.pages];
      const p = newPages[idx];
      
      // 切换状态
      p.showHistory = !p.showHistory;
      
      // 【关键】如果开启历史记录，设置滚动锚点到底部
      if(p.showHistory) {
        // 确保 chatList 有数据，且锚点ID存在
        // 这里的 anchor-id 必须和 wxml 中的 <view id="anchor-{{item.id}}"></view> 对应
        p.scrollToView = `anchor-${p.id}`;
        
        // 强制更新一下，确保 scroll-view 渲染出来后再滚动
        this.setData({ pages: newPages }, () => {
          // 延迟一小会儿确保 DOM 更新
          setTimeout(() => {
            // 如果需要更精准的底部滚动，可以在这里再次触发，但通常 scroll-into-view 足够
          }, 100);
        });
      } else {
        // 关闭历史记录，不需要特殊操作，swtich wx:if 会自动隐藏
        this.setData({ pages: newPages });
      }
    }
  },
});