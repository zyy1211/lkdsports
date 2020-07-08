let Api = require('../../utils/config')
let http = require('../../utils/request')
let bhv_refresh = require('../../pages/component/behavior/bhv_refresh')
let bhv_bottom = require('../../pages/component/behavior/bhv_bottom')
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noteShow:false,
    pageSize: 10,
    pageNum: 1,
    status: '',
    tablist: [{
        name: '进行中',
        value: 20
      },
      {
        name: '已取消',
        value: 100
      }, {
        name: '已结束',
        value: 30
      }
    ],
    apiimg: Api.API_IMG,
    dataList: []
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
  initData() {
    this.getData(0);
  },
  getData(concat) {

    let self = this;
    let {
      status,
      pageSize,
      pageNum
    } = this.data;
    self.show();
    http.get('/activities/getActivitiesBySelf', {
      status,
      pageSize,
      pageNum
    }).then((res) => {
      // console.log(res)
      self.hide();
      if (res.code != 200) {
        return
      }
      let main = res.response[0].records;
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

  toissue_a(e){
    let key = e.currentTarget.dataset.key;
    wx.navigateTo({
      url: '/activityPages/issue_a/issue_a?id='+key+'&isdraft=1',
    })
  },

})