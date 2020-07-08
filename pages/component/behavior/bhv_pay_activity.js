let http = require('../../../utils/request')

module.exports = Behavior({
  data: {},
  methods: {
    // 支付
    ordersubmit(params) {
      let self = this;
      let {
        oid,
        bussId,
        payprice
      } = params;
      payprice = payprice*100;
      if (payprice == 0) {
        self.orderSubmitNoPrice(oid,bussId);
        return
      }
      // console.log('fsfsfsf去支付')
      self.show();
      http.get('/pay/wxPay/' + oid).then((res) => {
        self.hide();
        if (res.code != 200) {
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
            console.log(res)
            // if (self.data.iscurrent != 1) {
              wx.navigateTo({
                url: '/myList/orderpay/orderpay?isOnce=!1&bussId=' + bussId + '&oid=' + oid
              })

            // } else {
            //   self.setData({
            //     isOnce: !1,
            //     showToActivity: true
            //   });
            // }

          },
          fail(res) {
            wx.showToast({
              title: '订单未支付',
              icon: 'none',
              duration: 1000
            });
          },
        })
      })
    },
    orderSubmitNoPrice(oid,bussId) {
      let self = this;
      self.show();
      http.get('/pay/noPay/' + oid).then((res) => {
        console.log(res)
        self.hide();
        if (res.code != 200) {
          return
        }
        // if (self.data.iscurrent != 1) {
          wx.navigateTo({
            url: '/myList/orderpay/orderpay?isOnce=!1&bussId=' + bussId + '&oid=' + oid
          })
        //   return
        // } else {
        //   self.setData({
        //     isOnce: !1,
        //     showToActivity: true
        //   });
        // }

      })
    },
    // 退款
    orderRefund(e) {
      let self = this;
      let currentItem = e.currentTarget.dataset;
      console.log(currentItem);
      self.setData({noteShow:true,currentItem});
    },
    noteConfirm(){
      this.orderRefundPrice();
    },
    orderRefundPrice(){
      let self = this;
      let currentItem = self.data.currentItem;
      let { 
        oid,
        payprice,
        bussId
      } = currentItem;
      if (payprice == 0) {
        self.orderRefundNoPrice(oid,bussId)
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
          wx.navigateTo({
            url: '/myList/orderpay/orderpay?isOnce=!1&bussId=' + bussId + '&oid=' + oid
          })

        } else {
          self.setData({
            successShow: true
          })
        }

      })
    },

    orderRefundNoPrice(oid,bussId) {
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
          console.log('fsfsfsfsfsfs')
          wx.navigateTo({
            url: '/myList/orderpay/orderpay?isOnce=!1&bussId=' + bussId + '&oid=' + oid
          })
          return
        } else {
          self.setData({
            successShow: true
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
    }

  },

})