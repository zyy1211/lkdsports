let http = require('../../utils/request')
let bhv_location = require('../../pages/component/behavior/bhv_location')
let bhv_refresh = require('../../pages/component/behavior/bhv_refresh')
let bhv_pay = require('../../pages/component/behavior/bhv_pay')
let unit = require('../../utils/util')
let app = getApp()
let Api = require('../../utils/config')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    iscurrent: 1,
    successShow: false,
    showToActivity: false,
    noteShow: false,
    itemList: [],
    ableRefund: false, //是否可退款
    ableRefundTime: '',
    isOnce: 1, //仅一次
    isNotify: true,
    lastTimer: '',
    itemsType: '',
    apiimg: Api.API_IMG
  },
  behaviors: [bhv_location, bhv_refresh, bhv_pay], 

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
    // console.log(options)
    // bussId = 38;
    // oid = '194038548842680320';
    // isOnce = !1;
    self.setData({
      bussId,
      oid,
      isOnce
    })
    // console.log(this.data.isOnce)
    app.isLogin(() => {

      if (isOnce == 1) {
        self.initData();
      } else {
        self.initData()
      }
    })

  },
  onHide() {
    // console.log('hiden!!!!!!!')
    clearInterval(this.data.itvTimer);
  },
  onUnload() {
    // console.log('onUnload!!!!!!!')
    clearInterval(this.data.itvTimer);
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
        createTime,
        itemsType
      } = order;

      self.setData({
        order,
        children,
        payPrice,
        statusMap,
        detailId: bussId,
        itemsType
      })
      // console.log(children)
      self.isStatus(createTime, endCancelTime, status, payWay, refStatus)
      self.otherType(itemsType)

    })
  },
  isStatus(createTime, endCancelTime, status, payWay, refStatus) {
    let self = this;

    if (refStatus == 30 || refStatus == 20 || refStatus == 10) {
      self.setData({
        isNotify: true, 
        ableRefund: false
      })
    } else {
      // if(status ==100 || status == 101 ||status == 50)
      let time_diff = parseInt((new Date().getTime() - self.formatg(createTime)) / 1000);

      let time_cancel = parseInt((self.formatg(endCancelTime) - new Date().getTime()) / 1000);
      // 待支付

      if (!(status > 20)) {

        if (time_diff < 300) {
          let leftTime = 300 - time_diff;
          self.setData({
            isNotify: false
          })
          // console.log(self.data.isNotify)
          // 倒计时
          self.data.itvTimer = setInterval(() => {
            leftTime--;
            let lastTimer = unit.getTimeLeft(leftTime);
            // console.log(leftTime + '剩余时间')
            // console.log(leftTime < 1)
            if ((leftTime / 1) < 1) {
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
        }
      } else {
        if (status < 50 && status > 20 && payWay != 'cash') {
          // console.log(time_cancel)
          // console.log(refStatus)
          // 0: 无退款 10：退款待审核/确认 20: 全额退款成功 30：部分退款成功 40：退款失败
          // 订单状态;订单状态（0：订单创建 10: 待确认 20: 待支付 30: 待发货 35: 已发货 40: 待使用 50：已完成 60: 待结算 70：已结算 100: 系统取消 101：用户取消 120：订单删除）
          if (time_cancel > 0 && (refStatus == 0 || refStatus == 40)) {
            let ableRefundTime = unit.getLastTime(time_cancel)
            self.setData({
              ableRefundTime,
              ableRefund: true
            })
          } else {
            self.setData({
              ableRefund: false
            })
          }
        }else{
          self.setData({
            ableRefund: false
          })
        }
        self.setData({
          isNotify: true
        })
      }
    }
  },
  toActivityDetail(){
    let id = this.data.order.itemsId;
    wx.navigateTo({
      url: '/activityPages/activityDetail/activityDetail?id=' + id,
    })
  },
  otherType(itemsType) {
    let self = this;
    if (itemsType == 5) {
      self.getSkuList()
      self.getUserInfo()
      self.getDetail();
      // 活动

    } else if (itemsType == 10) {
      // 场馆
      self.venueDtl();
      self.orderDtl();

    } else if (itemsType == 12) {
      self.venueDtl();
      // 会员卡

    } else if (itemsType == 15) {
      self.venueDtl();
      // 会员卡充值
    } else if (itemsType == 20) {
      // 赛事
    } else if (itemsType == 30) {
      // 商品
    } else if (itemsType == 40) {
      self.venueDtl();
      // 次数卡核销
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
  // 用户信息
  getUserInfo() {
    let {
      bussId
    } = this.data;
    let self = this;
    http.get('/user/getInfo/' + bussId).then((res) => {
      // console.log(res)
      if (res.code != 200) {
        return
      }
      let main = res.response[0];
      self.setData({
        userInfo: main
      })
    })
  },

  getDetail() {
    let self = this;
    let {
      itemsId,
    } = self.data.order;
    self.show();
    http.get('/activities/selectActivity/' + itemsId).then((res) => {
      self.hide()
      // console.log(res)
      if (res.code != 200) {
        return;
      }
      let main = res.response[0];

      let {
        activities,
        activitiesSkuList,
        headImage,
        activityHeadImage,
        activityDetailImage,
        cUserDTO,
        flag,
      } = main;
      self.setData({
        activities,
        activitiesSkuList,
        headImage,
        activityHeadImage,
        activityDetailImage,
        cUserDTO,
        flag,
      })

    })
  },

  getSkuList(){
    let self = this;
    let {
      itemsId,
    } = this.data.order;
    let {children} = this.data;
    http.get('/activities/getApplySku/'+itemsId).then((res) =>{
      // console.log(res)
      if(res.code !=200){return}
      let main = res.response[0];
      let skuMap = new Map()
      main.forEach((item) =>{
        skuMap.set(item.id,item.iconPath)
      })
      let total = 0; 
      children.forEach((item) =>{
        let iconurl = skuMap.get(item.skuId);
        item['iconurl'] = iconurl;
        // console.log(item)
        // console.log('fsfssf')
        total +=item.itemsNum *item.itemsPrice
      })
 
      children = {children,total:(total/100)}
      // console.log(children)
      self.setData({children})
    })
  },

  // 倒计时
  // 20<status<=40可退款
  getTimer(createTime) {
    let self = this;
    let expand = 0;
    createTime = '2020-06-10 16:40:10';
    let timedf = (new Date().getTime()) - self.formatg(createTime);
    // console.log(timedf)
    if (timedf / 1000 / 60 > 5) {
      this.setData({
        isNotify: false
      })
      return;
    }
  },
  formatg(str) {
    return new Date(str.replace(/-/g, '/')).getTime()
  }
})