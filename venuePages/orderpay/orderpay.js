let http = require('../../utils/request')
let bhv_location = require('../../pages/component/behavior/bhv_location')
let bhv_refresh = require('../../pages/component/behavior/bhv_refresh')
let bhv_pay = require('../../pages/component/behavior/bhv_pay')
let unit = require('../../utils/util')
let app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    iscurrent:1,
    show: false,
    itemList: [],
    ableRefund: false, //是否可退款
    ableRefundTime: '',
    isOnce: 1, //仅一次
    isNotify: true,
    lastTimer: ''

  },
  behaviors: [bhv_location, bhv_refresh,bhv_pay],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    let {
      bussId,
      oid,
      isOnce
    } = options;
    // bussId = 14;
    // oid = '190849345522765824';
    // isOnce = !1;
    self.setData({
      bussId,
      oid,
      isOnce
    })
    console.log(this.data.isOnce)
    app.isLogin(() => {

      if (isOnce == 1) {
        self.initData();
      } else {
        self.initData()
      }
    })

  },
  // 订单详情
  initData() {
    let self = this;
    let {
      oid
    } = this.data;
    self.show();
    http.get('/order/detail/' + oid).then((res) => {
      self.hide()
      // console.log(res)
      if (res.code != 200) {
        return
      }
      let order = res.response[0].order;
      let children = res.response[0].children;
      let statusMap = new Map();
      children.forEach((item) => {
        statusMap.set(item.itemsId, item)
      })
      let {
        endCancelTime
      } = res.response[0].extd;
      let {
        status,
        refStatus,
        payWay,
        bussId,
        payPrice,
        createTime
      } = order;

      self.setData({
        order,
        children,
        payPrice,
        statusMap,
        detailId: bussId
      })
      self.isStatus(createTime, endCancelTime, status, payWay,refStatus)
      self.orderDtl();
      self.venueDtl();
    })
  },
  isStatus(createTime, endCancelTime, status, payWay,refStatus) {

    let self = this;
    let time_diff = parseInt((new Date().getTime() - new Date(createTime)) / 1000);
    let time_cancel = parseInt((new Date(endCancelTime) - new Date().getTime()) / 1000);
    if (!(status > 20)) {
      if (time_diff < 300) {
        let leftTime = 300 - time_diff;
        self.setData({ 
          isNotify: false
        })
        // 倒计时
        self.data.itvTimer = setInterval(() => {
          leftTime--;
          let lastTimer = unit.getTimeLeft(leftTime);
          console.log(leftTime +'剩余时间')
          if (leftTime < 1) {
            clearInterval(self.data.itvTimer);
            self.setData({
              isNotify: true
            })
            self.initData();
          }
          self.setData({
            lastTimer
          })
        }, 1000);
      } else {
        self.setData({
          isNotify: true
        })
        self.initData();
      }
    }else{
      self.setData({
        isNotify: true
      })
    }
    if (status < 50 && status > 20 && payWay != 'cash') { 
      // console.log(endCancelTime)
      console.log(time_cancel)
      console.log(refStatus)
      console.log(refStatus)
      // 0: 无退款 10：退款待审核/确认 20: 全额退款成功 30：部分退款成功 40：退款失败
      // 订单状态;订单状态（0：订单创建 10: 待确认 20: 待支付 30: 待发货 35: 已发货 40: 待使用 50：已完成 60: 待结算 70：已结算 100: 系统取消 101：用户取消 120：订单删除）
      if (time_cancel > 0 && ( refStatus == 0 || refStatus == 40)) {
        let ableRefundTime = unit.getLastTime(time_cancel)
        self.setData({
          ableRefundTime,
          ableRefund: true
        })  
        // 剩余时间
      } else {
        self.setData({
          ableRefund: false
        })
      }

    }
  },
  // 预约信息
  orderDtl() {
    let self = this;
    let {
      children,
      statusMap
    } = this.data;
    let lockId = children.map((item) => {
      return item.itemsId
    })
    http.post('/venue/resourceLockInfo', lockId, 1).then((res) => {
      // console.log(res)
      if (res.code != 200) {
        return
      }
      let main = res.response[0];
      // console.log(main)
      // console.log(statusMap)
      main.forEach((item) => {
        let it = statusMap.get(item.itemsId);

        item['status'] = it.status;
        item['refStatus'] = it.refStatus;
      })
      self.setData({
        itemList: main
      })
    })
  },
  // 场馆详情
  venueDtl() {
    let self = this;
    let {
      detailId
    } = this.data;
    http.get('/venue/detail', {
      detailId
    }).then((res) => {
      // console.log(res)
      if (res.code != 200) {
        return
      }
      let main = res.response[0];
      self.setData({
        orderphone: main
      })
    })
  },
  onHide(){
    clearInterval(self.data.itvTimer);
  },

  toActivity() {
    // 去活动
  },
  // 倒计时
  // 20<status<=40可退款
  getTimer(createTime) {
    let self = this;
    let expand = 0;
    createTime = '2020-06-10 16:40:10';
    let timedf = (new Date().getTime()) - new Date(createTime);
    console.log(timedf)
    if (timedf / 1000 / 60 > 5) {
      this.setData({
        isNotify: false
      })
      return;
    }
  }

})