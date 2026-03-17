/**
 * 获取导航栏高度（状态栏 + 导航栏）
 * 适用于微信小程序
 * @returns {number} 总高度（单位：px）
 */
export const getNavigationBarHeight = () => {
  try {
    // 1. 使用新 API 获取窗口信息（包含 statusBarHeight）
    const windowInfo = wx.getWindowInfo();
    const statusBarHeight = windowInfo.statusBarHeight || 20;
    
    // 2. 获取菜单按钮（右上角胶囊）的位置信息（此 API 未废弃）
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    
    // 3. 计算导航栏高度（公式不变）
    const navBarHeight = (menuButtonInfo.top - statusBarHeight) * 2 + menuButtonInfo.height;
    
    // 4. 返回总高度
    return statusBarHeight + navBarHeight;
  } catch (error) {
    console.error('获取导航栏高度失败', error);
    // 降级处理：返回一个默认值（比如 80px）
    return 80;
  }
};