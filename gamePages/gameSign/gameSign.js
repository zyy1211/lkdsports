let http = require('../../utils/request')
let Api = require('../../utils/config.js');
let bhv_pay = require('../../pages/component/behavior/bhv_pay')
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fields: [

    ],
    arr: [1, 2]
  },
  behaviors: [bhv_pay],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let num = this.data.arr.slice(0, options.num)
    app.isLogin(() => {
      let item = app.getGameItem();
      this.setData({
        id: options.id,
        type: options.type,
        proGroupId: options.proGroupId,
        num,
        item
      });
      console.log(item);
      this.getDetail();
      this.computeMoney();
    })
  },
  computeMoney() {
    let {
      item,
      num
    } = this.data;
    let totalNum = 0;
    // console.log(item.price)
    // console.log(num)
    if (item.priceStyle == 0) {
      totalNum = (item.price / 100 * num.length).toFixed(2);
    } else {
      totalNum = (item.price / 100).toFixed(2);
    }
    this.setData({
      totalNum
    })
  },
  getDetail() {
    let self = this;
    let {
      id
    } = this.data;
    http.get('/games/detail/' + id).then((res) => {
      if (res.code != 200) {
        return
      }
      let main = res.response[0];
      let {
        singleFielsdInfo
      } = main;
      singleFielsdInfo.forEach((item) => {
        item[item.ename + '1'] = '';
        item['enumArr'] = [];
        if (item.type == 'radio') {
          let arr = item.enumValue ?.split(',')
          let newarr = arr.map((itm) => {
            let keyv = itm.split(':')
            return {
              text: keyv[0],
              value: keyv[1]
            }
          })
          item['enumArr'] = newarr;
        }
      })
      self.setData({
        main,
        singleFielsdInfo
      })
    });
  },

  bindDate(e) {
    let key = e.currentTarget.dataset.key;
    let index = e.currentTarget.dataset.index;
    let value = e.detail;
    console.log(index)
    let iskey = 'fields[' + index + '].' + key;
    this.setData({
      [iskey]: value
    })
  },
  bindDatephone(e) {
    let key = e.currentTarget.dataset.key;
    let value = e.detail;
    value = app.validateNumber(value);
    this.setData({
      [key]: value
    })
  },

  submit() {
    let self = this;
    let {
      fields,
      id: gamesId,
      proGroupId,
      type,
      phone,
      totalNum
    } = this.data;
    let params = {
      fields,
      gamesId,
      proGroupId,
      type,
      phone
    }

    http.post('/games/apply/single', params, 1).then((res) => {
      console.log(res);
      let main = res.response[0];
      let {
        bussId,
        oid
      } = main;

      self.ordersubmit({
        bussid: bussId,
        oid,
        payprice: totalNum
      }, 'signup');
    })
  },
  show() {
    this.setData({
      isAlert: true
    })
  },
  hide() {
    setTimeout(() => {
      this.setData({
        isAlert: false
      })
    }, 300);

  }

})