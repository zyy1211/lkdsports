let http = require('../../utils/request')
let bhv_refresh = require('../../pages/component/behavior/bhv_refresh')
let bhv_bottom = require('../../pages/component/behavior/bhv_bottom')
let bhv_pay = require('../../pages/component/behavior/bhv_pay')
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAlert:false,
    activityNav: null,
    navData: [{
        name: '全部',
        id: null
      },
      {
        name: '待支付',
        id: [0, 10, 20]
      },
      {
        name: '已取消',
        id: [100, 101]
      },
      {
        name: '待完成',
        id: [30, 35, 40]
      },
      {
        name: '已退款',
        id: 999
      },
    ],
    pageSize: 10,
    pageNum: 1
  },
  behaviors: [bhv_refresh, bhv_bottom,bhv_pay],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    app.isLogin(() => {
      self.initData();
    })
  },

  initData() {
    this.getData(0);
  },
  getData(concat) {
    let self = this;
    self.show();
    let {
      pageSize,
      pageNum: pageNo,
      activityNav,
      dataList
    } = this.data;
    let params = activityNav == 999 ? {
      refStatus: [20, 30]
    } : {
      status: activityNav
    }
    http.post('/order/list', {
      pageSize,
      pageNo,
      ...params
    }, 1).then((res) => {
      self.hide();
      if (res.code != 200) {
        return
      }
      let total = res.response[0].total;
      let orders = res.response[0].orders;
      let neworder = [];
      for (let i = 0; i < orders.length; i++) {
        let item = orders[i];
        item['isPay'] = self.payStatus(item);
        item['iscancel'] = self.cancelStatus(item);
        if (i != 0) {
          let lastitem = orders[i - 1]
          if (item.parentOid == lastitem.parentOid) {
            if(item.parentOid == item.oid){
              neworder[neworder.length - 1].payPrice = item.payPrice;
            }
            neworder[neworder.length - 1].children.push(item)
          } else {
            neworder.push({
              ...item,
              children: [{
                ...item
              }]
            })
          }
        } else {
          neworder.push({
            ...item,
            children: [{
              ...item
            }]
          })
        }
      }
      if (concat == 0) {
        self.setData({
          dataList: neworder,
          total
        })
        return;
      }
      dataList = dataList.concat(neworder)
      // console.log(dataList.length)
      self.setData({
        dataList,
        total
      })
    })
  },
  orderDetail(e) {
    let bussId = e.currentTarget.dataset.bussId;
    let oid = e.currentTarget.dataset.oid;
    wx.navigateTo({
      url: '/venuePages/orderpay/orderpay?isOnce=!1&bussId=' + bussId + '&oid=' + oid,
    })
  },

  payStatus(item){
        let time_diff = parseInt((new Date().getTime() - new Date(item.createTime)) / 1000);
        if (!(item.status > 20) && time_diff < 300) {
          // item.isPay = true
          return true;
        }
        return false;

  },
  cancelStatus(item){
    // item.iscancel = false;
    let time_cancel = parseInt((new Date(item.endCancelTime) - new Date().getTime()) / 1000);
    if (item.status > 20 && item.status < 50 && time_cancel > 0 && (item.refStatus == 0 || item.refStatus == 40)) {
     return true;
    }
    return false;
  },

  changeNav(e) {
    // console.log(e.detail.index)
    let {
      navData
    } = this.data;
    let index = e.detail.index;
    this.setData({
      activityNav: navData[index].id,
      pageNum: 1
    })
    this.getData(0);
  },


})