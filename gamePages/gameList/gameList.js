let http = require('../../utils/request')
let Api = require('../../utils/config.js');
let bhv_refresh = require('../../pages/component/behavior/bhv_refresh')
let bhv_bottom = require('../../pages/component/behavior/bhv_bottom')
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageSize: 10,
    pageNo: 1,
    apiimg:Api.API_IMG,
  },
  behaviors: [bhv_refresh, bhv_bottom],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    let self = this;
    app.isLogin(function () {
      self.initData();
    })
  },
  initData(){
    this.getData(0);
  },
  getData(concat) {
    let self = this;
    self.show();
    let {
      pageSize,
      pageNo,
    } = this.data;
    http.post('/games/list', {
      pageSize,
      pageNo,
    },1).then((res) => {
      self.hide();
      if (res.code != 200) {
        return
      }
      let main = res.response[0].lists;
      let total = res.response[0].total;
      if (concat == 0) {
        self.setData({
          dataList: main,
          total
        })
        return;
      }
      let dataList = self.data.dataList;
      dataList = dataList.concat(main)
      self.setData({
        dataList,
        total
      })
    })
  },
  onShareAppMessage: function () {
    return {
        title: '赛事列表',
        path: '/gamePages/gameList/gameList',
    }
  }
})