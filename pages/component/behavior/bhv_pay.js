let http = require('../../../utils/request')

module.exports = Behavior({
  data: {},
  methods: {
    // 支付
    ordersubmit(e, signup) {
      let self = this;
      console.log(signup);
      let params = e;
      if (!signup) {
        params = e.currentTarget.dataset;
      }
      let {
        oid,
        bussid,
        payprice
      } = params;

      payprice = payprice * 100;
      // console.log(params)
      if (payprice == 0) {
        self.orderSubmitNoPrice(oid, bussid);
        return
      }
      // console.log('fsfsfsf去支付')
      self.show();
      http.get('/pay/wxPay/' + oid).then((res) => {
        if (res.code != 200) {
          self.hide();
          return
        }
        let main = res.response[0];
        let {
          timeStamp,
          paySign,
          signType,
          nonceStr,
          package: package1
        } = main;
        wx.requestPayment({
          timeStamp: timeStamp,
          nonceStr: nonceStr,
          package: package1,
          signType: signType,
          paySign: paySign,
          success(res) {
            // console.log(res)
            // console.log(self.data.iscurrent)
            if (self.data.iscurrent != 1) {
              self.subscribeMsg(() => {
                if (self.data.isList) {
                  wx.navigateTo({
                    url: '/myList/orderpay/orderpay?isOnce=!1&bussId=' + bussid + '&oid=' + oid
                  })
                } else {
                  wx.redirectTo({
                    url: '/myList/orderpay/orderpay?isOnce=!1&bussId=' + bussid + '&oid=' + oid
                  })
                }

              })

            } else {
              self.subscribeMsg(() => {
                self.setData({
                  isOnce: !1,
                  showToActivity: true
                });
              })
            }

          },
          fail(res) {
            console.log('fs')
            wx.showToast({
              title: '订单未支付',
              icon: 'none',
              duration: 1000
            });
            if (self.data.isList) {
              wx.navigateTo({
                url: '/myList/orderpay/orderpay?isOnce=!1&bussId=' + bussid + '&oid=' + oid
              })
            } else {
              wx.redirectTo({
                url: '/myList/orderpay/orderpay?isOnce=!1&bussId=' + bussid + '&oid=' + oid
              })
            }

          },
          complete() {
            self.hide();
          }
        })
      })
    },
    orderSubmitNoPrice(oid, bussId) {
      let self = this;
      self.show();
      http.get('/pay/noPay/' + oid).then((res) => {
        // console.log(res)
        self.hide();
        if (res.code != 200) {
          return
        }

        if (self.data.iscurrent != 1) {
          self.subscribeMsg(() => {
            if (self.data.isList) {
              wx.navigateTo({
                url: '/myList/orderpay/orderpay?isOnce=!1&bussId=' + bussId + '&oid=' + oid
              })
            } else {
              wx.redirectTo({
                url: '/myList/orderpay/orderpay?isOnce=!1&bussId=' + bussId + '&oid=' + oid
              })
            }

          })
        } else {
          self.subscribeMsg(() => {
            self.setData({
              isOnce: !1,
              showToActivity: true
            });
          })

        }

      })
    },
    // 退款
    orderRefund(e) {
      let self = this;
      let currentItem = e.currentTarget.dataset;
      // console.log(currentItem);
      let payprice = currentItem?.payprice;
      let text = '确定要退款吗？'
      if(payprice==0){
        text = '确定要取消吗？'
      }
      self.setData({
        noteText: text,
        noteShow: true,
        currentItem
      });
    },
    noteConfirm() {
      this.orderRefundPrice();
    },
    orderRefundPrice() {
      let self = this;
      let currentItem = self.data.currentItem;
      let {
        oid,
        payprice,
        bussid: bussId
      } = currentItem;
      if (payprice == 0) {
        self.orderRefundNoPrice(oid, bussId)
        return;
      }
      self.show();
      http.post('/order/refund', {
        oid,
        refundPrice: payprice,
        refundOpt: 1
      }, 1).then((res) => {

        self.hide();
        if (res.code != 200) {
          return
        }

        if (self.data.iscurrent != 1) {
          self.subscribeMsg(() => {
            if (self.data.isList) {
              wx.navigateTo({
                url: '/myList/orderpay/orderpay?isOnce=!1&bussId=' + bussId + '&oid=' + oid
              })
            } else {
              wx.redirectTo({
                url: '/myList/orderpay/orderpay?isOnce=!1&bussId=' + bussId + '&oid=' + oid
              })
            }

          })

        } else {
          self.subscribeMsg(() => {
            self.setData({
              successShow: true
            })
          })

        }

      })
    },

    orderRefundNoPrice(oid, bussId) {
      let self = this;
      self.show();
      http.get('/order/cancel/' + oid).then((res) => {
        console.log(res)
        self.hide();
        if (res.code != 200) {
          return
        }

        console.log(self.data.iscurrent)
        if (self.data.iscurrent != 1) {
          // console.log('fsfsfsfsfsfs')
          self.subscribeMsg(() => {
            if (self.data.isList) {
              wx.navigateTo({
                url: '/myList/orderpay/orderpay?isOnce=!1&bussId=' + bussId + '&oid=' + oid
              })
            } else {
              wx.redirectTo({
                url: '/myList/orderpay/orderpay?isOnce=!1&bussId=' + bussId + '&oid=' + oid
              })
            }

          })

        } else {
          self.subscribeMsg(() => {
            self.setData({
              successShow: true
            })
          })
        }

      })
    },

    // 成功弹窗
    showSuccess() {

      this.initData();
    },
    // 去活动弹窗
    toActivity() {
      wx.navigateTo({
        url: '/activityPages/issue_a/issue_a',
      })
    },
    notoActivity() {
      this.initData();
    },
    subscribeMsg(callback) {
      wx.requestSubscribeMessage({
        tmplIds: ['VyY1O6w7tyrP3CI0s11Xam6W95dxdFzcFwQSHzPCqwk', 'WHldGPQ6PCcXLfqHvPnV9vV-0RHk4bjRPKeRcI-K7Lg', 'PouLZYkXLDpxSY0nXqVNsKMH3uVlW3NwtJQjaEVWL_4'],
        success(res) {},
        complete() {
          callback();
        }
      })
    },

  },

})