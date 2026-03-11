//const WXAPI = require('apifm-wxapi')
//WXAPI.init('sxunt')
//WXAPI.init('photography')

// const MYWXAPI = require('my-wxapi')
// MYWXAPI.init('v1')

const MYWXAPI = require('./components/my-wxapi/index.js')
MYWXAPI.init('v1')

App({
  onLaunch() {
    console.log('欢迎来到枕边江湖！');
  }
});