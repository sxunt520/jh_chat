Page({
  data: { 
    isLogin: false,
    userInfo: null, 
    stats: { follow: 0, fans: 0, newMsg: 0 }
   },
  onLoad() {
    this.checkLoginStatus();
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
    //let userInfo = e.detail.userInfo;console.log(e);
    
    // this.setData({ userInfo });
    // wx.request({
    //   url: "https://dj.awsl8.com/v1/chat/login",
    //   method: "POST",
    //   data: userInfo,
    //   success: (res) => {
    //     // 登录成功
    //   }
    // });
  },
  onShow() {
    // let app = getApp();
    // app.getUserInfo(userInfo => {
    //   this.setData({ userInfo });
    // });

    // 每次进入页面刷新数据（如新消息数）
    //  if (this.data.isLogin) {
    //   this.fetchUserData();
    //  }

  },

  // 检查本地登录状态
  checkLoginStatus() {
    const Token = wx.getStorageSync('Token');
    const userInfo = wx.getStorageSync('userInfo');
    
    if (Token && userInfo) {
      this.setData({
        isLogin: true,
        userInfo: userInfo
      });
      this.fetchUserData();
    } else {
      this.setData({ isLogin: false });
    }
  },

  // 调用后端获取详细数据（关注数、消息数等）
  fetchUserData() {
    const userId = wx.getStorageSync('userId');
    wx.request({
      url: 'https://dj.awsl8.com/v1/member/my', // 需在后端实现此接口
      method: 'POST',
      header: {
        'Token':wx.getStorageSync('Token')
      },
      success: (res) => {
        if (res.data.status === 0) {
          const data = res.data.data;
          this.setData({
            stats: {
              followCount: data.follower_count || 0,
              fansCount: data.fans_count || 0,
              newMsgCount: data.wait_reply_num || 0
            }
          });
        }
      }
    });
  },

  // 微信登录处理
  handleLogin() {
    wx.showLoading({ title: '登录中...' });
    wx.login({
      success: (res) => {
        if (res.code) {
          wx.request({
            url: 'https://your-domain.com/auth/login',
            method: 'POST',
            data: { code: res.code },
            success: (response) => {
              wx.hideLoading();
              if (response.data.code === 200) {
                const { token, user_id, openid } = response.data.data;
                
                // 保存 Token
                wx.setStorageSync('token', token);
                wx.setStorageSync('userId', user_id);

                // 获取用户详细信息（如果后端login没返回，可再调一次getUserInfo接口）
                // 这里简化处理，假设登录成功后需要用户授权头像昵称（新版微信流程略有不同，需用头像昵称填写组件）
                // 为演示方便，这里暂存openid作为ID，实际项目中应引导用户完善资料
                
                const tempUserInfo = {
                  avatarUrl: '/images/default-avatar.png', 
                  nickName: '新朋友',
                  wxId: openid.substring(0, 8) + '***'
                };
                
                wx.setStorageSync('userInfo', tempUserInfo);
                
                this.setData({
                  isLogin: true,
                  userInfo: tempUserInfo
                });
                
                wx.showToast({ title: '登录成功', icon: 'success' });
                this.fetchUserData();
              } else {
                wx.showToast({ title: response.data.msg || '登录失败', icon: 'none' });
              }
            },
            fail: () => {
              wx.hideLoading();
              wx.showToast({ title: '网络请求失败', icon: 'none' });
            }
          });
        } else {
          wx.hideLoading();
          wx.showToast({ title: '获取code失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '登录授权失败', icon: 'none' });
      }
    });
  },

  // 修改头像 (调用微信头像选择器)
  chooseAvatar() {
    if (!this.data.isLogin) return;
    let that=this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        
        // TODO: 此处应添加上传头像到服务器的逻辑
        wx.uploadFile({
          url: 'https://dj.awsl8.com/v1/member/upload-photo', // 服务器接口
          filePath: tempFilePath,
          name: 'UploadForm[picture_url]',                          // 对应后端接收文件的字段名
          header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Token':wx.getStorageSync('Token')
              },
          formData: {                             // 这就是额外的 form-data 字段
            //userId: 123,
          },
          success(res) {
            // 后端返回的数据一般在 res.data 中
            console.log('上传成功', res.data);
            var photodata = JSON.parse(res.data);//json转为js对象
            //上传成功后更新本地数据和后端
            that.setData({
              'userInfo.picture_url': photodata.data.picture_url
            });
            wx.showToast({ title: '头像已更新', icon: 'none' });
          }
        });

        // 上传成功后更新本地数据和后端
        // this.setData({
        //   'userInfo.picture_url': tempFilePath
        // });
        // wx.showToast({ title: '头像已更新', icon: 'none' });
      }
    });
  },

  // 页面跳转通用方法
  goToPage(e) {
    const url = e.currentTarget.dataset.url;
    if (!this.data.isLogin && url !== '/pages/login/login') {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    wx.navigateTo({ url });
  },

  // 退出登录
  handleLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          this.setData({
            isLogin: false,
            userInfo: { avatarUrl: '/images/default-avatar.png', nickName: '', wxId: '' },
            stats: { followCount: 0, fansCount: 0, newMsgCount: 0 }
          });
          wx.showToast({ title: '已退出', icon: 'success' });
        }
      }
    });
  }

});