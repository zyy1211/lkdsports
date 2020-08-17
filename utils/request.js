let API = require('./config.js');
let name = 1;
let $http = {
  $post: function (url, data, header) {
    let head = header === 1 ? 'application/json' : 'application/x-www-form-urlencoded';
    return new Promise(function (resolve, reject) {
      let token = wx.getStorageSync('token');
      wx.request({
        url: API.API_HOST + url,
        method: 'Post',
        header: {
          'Content-type': head,
          'token': token,
        },
        data: data,
        success: function (res) {
          // console.log(res);
          if (res.data.code == 200) {
            resolve(res.data);
          }else if(res.data.code == 401){
            let App = getApp();
            wx.clearStorageSync();
            App.isSession(function(){
              resolve(res);
            });
          } else {
            wx.showToast({title: res.data.message,icon:'none',duration:3000});
            resolve(res);
          }
        },
        fail: function (res) {
          reject(res)
        },
      })
    })
  },
  $creat:function(url,data){
    return new Promise(function (resolve, reject) {
      let token = wx.getStorageSync('token');
      wx.request({
        url: API.API_HOST + url,
        method: 'Post',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'token': token,
        },
        data: data,
        success: function (res) {
          resolve(res);
        },
        fail: function (res) {
          reject(res)
        }
      })
    })
  },
  $get:function(url,data){
    return new Promise(function (resolve, reject) {
      let token = wx.getStorageSync('token');
      wx.request({
        url: API.API_HOST + url,
        data: data,
        method: 'Get',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'token': token,
        },
        success: function (res) {
          // console.log(res)
          if (res.data.code == 200) {
            resolve(res.data);
          }else if(res.data.code == 401){
            console.log('fs')
            let App = getApp();
            wx.clearStorageSync();
            App.isSession(function(){
              resolve(res);
            });
          } else {
            wx.showToast({title: res.data.message ,icon:'none',duration:3000});
            resolve(res.data);
          }
        },
        fail: function (res) {
          reject(res)
        },
      })
    })
  },
  $getT:function(url,data){
    return new Promise(function (resolve, reject) {
      wx.request({
        url: API.API_HOST + url,
        data: data,
        method: 'Get',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: function (res) {
          // console.log(res)
          if (res.data.code == 200) {
            resolve(res);
          }else if(res.data.code == 401){
            let App = getApp();
            wx.clearStorageSync();
            App.isSession(function(){
              resolve(res);
            });
          } else {
            wx.showToast({title: res.data.message ,icon:'none',duration:3000});
            resolve(res);
          }
        },
        fail: function (res) {
          
          reject(res)
        },
      })
    })
  },
  $getBuffer:function(url){
    return new Promise(function (resolve, reject) {
      wx.request({
        url: API.API_HOST + url,
        responseType: 'arraybuffer', 
        method: 'Get',
        success: function (res) {
          // console.log(res)
          if (res.data.code == 200) {
            resolve(res);
          }else if(res.data.code == 401){
            let App = getApp();
            wx.clearStorageSync();
            App.isSession(function(){
              resolve(res);
            });
          } else {
            wx.showToast({title: res.data.message ,icon:'none',duration:3000});
            resolve(res);
          }
        },
        fail: function (res) {
          
          reject(res)
        },
      })
    })
  },
}
module.exports = {
  post: $http.$post,
  get:$http.$get,
  creat:$http.$creat,
  getT:$http.$getT,
  getBuffer:$http.$getBuffer

};