/**
 * 获取导航栏高度（状态栏 + 导航栏）
 * 适用于微信小程序
 * @returns {number} 总高度（单位：px）
 */
export const getNavigationBarHeight = () => {
  const systemInfo = wx.getSystemInfoSync();
  // 状态栏高度
  const statusBarHeight = systemInfo.statusBarHeight || 20;
  
  // 获取菜单按钮（右上角胶囊）的位置信息
  const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
  
  // 导航栏高度 = 胶囊高度 + (顶部间距) * 2
  // 顶部间距 = 胶囊顶部坐标 - 状态栏高度
  const navBarHeight = (menuButtonInfo.top - statusBarHeight) * 2 + menuButtonInfo.height;
  
  // 返回总高度
  return statusBarHeight + navBarHeight;
};