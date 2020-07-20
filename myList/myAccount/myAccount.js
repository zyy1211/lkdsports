let http = require('../../utils/request');
let API = require('../../utils/config.js');
let bhv_refresh = require('../../pages/component/behavior/bhv_refresh')
let bhv_bottom = require('../../pages/component/behavior/bhv_bottom')
let util = require('../../utils/util');
let app = getApp();



Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNames: [],
    cardUrl: API.cvs_img + '/20200427/fc732e50c8952077a2df437bdc8b4581.png',
    dataList: [],
    beTotal: '',
    total: '',
    api: API.img_host,
    stickyId: '',
    pageNum: 1,
    pageSize: 10
  },
  behaviors: [bhv_refresh, bhv_bottom],

  onChange(event) {
    // console.log(event)
    let ids = event.currentTarget.dataset.ids;
    let key = 'dataList[' + ids + '].activity';
    let activity = this.data.dataList[ids].activity;
    this.setData({
      activeNames: event.detail,
      [key]: !activity
    });
  },
  conceCach: function () {
    let beTotal = this.data.totalMoney.withdrawableBalance/100;
    wx.navigateTo({
      url: '../cachIn/cachIn?beTotal=' + beTotal, 
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow: function () {
    let self = this;
    app.isLogin(function () {
      self.initData();
    })
  },
  initData() {
    this.show();
    this.queryTotal();
    this.getData(0);
  },
  queryTotal: function () {
    let self = this;
    http.get('/user/queryAccount', '').then(function (res) {
      console.log(res)
      self.hide();
      if (res.code == 200) {
        self.setData({
          totalMoney: res.response[0]
        })
      }
    })
  },
  getData(concat) {
    let self = this;
    let {
      pageNum,
      pageSize
    } = this.data;
    http.get('/user/queryActivitiesCollections', {
      pageNum,
      pageSize
    }).then(function (res) {
      self.hide();
      console.log(res)
      if (res.code == 200) {
        let dataList = res.response[0].records || [];
        let total = res.response[0].total;
        dataList.forEach(item => {
          item['activity'] = false;
          item['Time'] = (util.timeSlot(item.startTime, item.endTime))
          let total = 0;
          item?.balanceLogs?.forEach((num,index) =>{
            let number = 0;
            num?.balanceLogs?.forEach((it) =>{
              number += (it.money/100)
            })
            // console.log(number)
            total += number;
          })
          console.log(total)
          item['total'] = total;
        })
        if (concat == 0) {
          self.setData({
            dataList,
            total
          })
          return;
        }
        dataList = self.data.dataList.concat(dataList)
        self.setData({
          dataList,
          total
        })

      }
    })
  },


})