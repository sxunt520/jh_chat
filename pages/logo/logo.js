const MYWXAPI = require('../../components/my-wxapi/index.js')
// pages/logo/logo.js
Page({
  /**
   * 页面的初始数据
   */
 data:{
    time: 1
  },

  bindLogoTap: function() {
    wx.reLaunch({
      url: '../home/home'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    MYWXAPI.advBanner({
      page: 1,
      pagenum: 1,
      type_id: 4,
    }).then(res => {
    if (res.status == 0) {
      this.setData({
        logoimg: res.data
      })
    }
    });

    // 设置初始计时秒数
    let time = 1;
    // 开始定时器
    this.timer = setInterval(() => {
      this.setData({
        time: -- time
      });
      // 读完秒后携带洗衣机编号跳转到计费页
      if(time < 0){
        clearInterval(this.timer)
        wx.reLaunch({
          url: '../home/home'
        })
      }
    },1000)
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})