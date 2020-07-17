let http = require('../../utils/request')
let bhv_refresh = require('../../pages/component/behavior/bhv_refresh')
let bhv_bottom = require('../../pages/component/behavior/bhv_bottom')
let bhv_pay = require('../../pages/component/behavior/bhv_pay')
let Api = require('../../utils/config')
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: { 
    isList: true,
    noteText: '确定要退款？',
    itemsType: null,
    selectShow: true,
    sortArr: ['desc', 'asc'],
    sortCount: 0,
    sort: 'desc',
    selectArr: [
      // {
      //   name: '默认',
      //   id: 0
      // },
      {
        name: '活动报名',
        id: 5
      },
      {
        name: '场馆预约',
        id: 10
      },
      // {
      //   name: '会员卡',
      //   id: 12
      // },
      // {
      //   name: '会员卡充值',
      //   id: 15
      // },
      // {
      //   name: '赛事报名',
      //   id: 20
      // },
      // {
      //   name: '商品',
      //   id: 30
      // },
      // {
      //   name: '次数卡核销',
      //   id: 40
      // },
    ],
    isAlert: false,
    noteShow: false,
    activityNav: null,
    apiimg: Api.API_IMG,
    navData: [{
        name: '全部',
        id: null
      },
      {
        name: '待支付',
        id: [0, 10, 20]
      },

      {
        name: '待完成',
        id: [30, 35, 40]
      },
      {
        name: '已退款',
        id: 999
      },
      {
        name: '已取消',
        id: [100, 101]
      },
    ],
    pageSize: 10,
    pageNum: 1
  },
  behaviors: [bhv_refresh, bhv_bottom, bhv_pay],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
 
  },
  onShow: function () {
    let self = this;
    app.isLogin(() => {
      self.initData();
    })
  },

  initData() {
    this.setData({
      pageNum: 1
    })
    this.getData(0);
  },
  getData(concat) {
    let self = this;
    self.show();
    let {
      pageSize,
      pageNum: pageNo,
      activityNav,
      dataList,
      itemsType,
      sort
    } = this.data;
    let params = activityNav == 999 ? {
      refStatus: [20, 30]
    } : {
      status: activityNav
    }
    // console.log({      pageSize,
    //   pageNo,
    //   itemsType,
    //   sort,
    //   ...params})
    http.post('/order/list', {
      pageSize,
      pageNo,
      itemsType,
      sort,
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
            if (item.parentOid == item.oid) {
              neworder[neworder.length - 1].payPrice = item.payPrice;
              neworder[neworder.length - 1].status = item.status;
              neworder[neworder.length - 1].refStatus = item.refStatus;
              neworder[neworder.length - 1].orderPrice = item.orderPrice;
              neworder[neworder.length - 1]['isPay'] = self.payStatus(item);
              neworder[neworder.length - 1]['iscancel'] = self.cancelStatus(item);
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
      // console.log(dataList)
      self.setData({
        dataList,
        total
      })
    })
  },
  orderDetail(e) {
    // console.log(e)
    let bussId = e.currentTarget.dataset.bussid;
    let oid = e.currentTarget.dataset.oid;
    // let itemsType = e.currentTarget.dataset.itemstype;
    // console.log(bussId)
    // console.log(oid)
    // console.log(itemsType)
    // return;
    // if(itemsType==5){
    //   wx.navigateTo({
    //     url: '/myList/signpay/signpay?isOnce=!1&bussId=' + bussId + '&oid=' + oid,
    //   })
    // }else{
    wx.navigateTo({
      url: '/myList/orderpay/orderpay?isOnce=!1&bussId=' + bussId + '&oid=' + oid,
    })
    // }

  },

  payStatus(item) {
    let self = this;
    // console.log(item.status)
    if (item.status == 100 || item.status == 101) {
      return false
    }
    let time_diff = parseInt((new Date().getTime() - self.formatg(item.createTime)) / 1000);
    if (!(item.status > 20) && time_diff < 300) {
      // item.isPay = true
      return true;
    }
    return false;

  },
  cancelStatus(item) {
    let self = this;
    // item.iscancel = false;
    let time_cancel = parseInt((self.formatg(item.endCancelTime) - new Date().getTime()) / 1000);
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

  cancelSubmit(e) {

    let currentItem = {
      ...e.currentTarget.dataset,
      payprice: 0
    };
    // console.log(currentItem);
    this.setData({
      noteText: '确定要取消吗？',
      noteShow: true,
      currentItem
    });

  },
  showSelect() {
    let {
      selectShow
    } = this.data;
    this.setData({
      selectShow: !selectShow
    })
  },
  changeSort() {
    let {
      sortCount,
      sortArr
    } = this.data;
    sortCount++;
    // console.log(sortCount)
    if (sortCount == 2) {
      sortCount = 0
    }
    this.setData({
      pageNum: 1,
      sort: sortArr[sortCount],
      sortCount
    })
    this.getData(0);
  },
  choiseSelect(e) {
    let key = e.currentTarget.dataset.key;
    this.setData({
      pageNum: 1,
      itemsType: key
    })
    this.getData(0);
  },

  formatg(str) {
    if (str != '' && str != null && str != undefined) {
      return new Date(str.replace(/-/g, '/')).getTime()
    }
    return ''
  }
})