let http = require('../../../utils/request')

module.exports = Behavior({
  data: {},
  methods: {
    // 支付
    ordersubmit(e) {
      let self = this;
      let {
        oid,
        bussId,
        payprice
      } = e.currentTarget.dataset;
      if (payprice == 0) {
        self.orderSubmitNoPrice(oid);
        return
      }
      console.log('fsfsfsf去支付')
      http.get('/pay/wxPay/' + oid).then((res) => {
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
            self.setData({
              isOnce: !1,
              show: true
            });
            if (self.data.iscurrent !== 1) {
              wx.navigateTo({
                url: '/venuePages/orderpay/orderpay?isOnce=!1&bussId=' + bussId + '&oid=' + oid
              })
   
            }else{
              self.initData();
            }
            
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
    // 退款
    orderRefund(e) {
      let self = this;
      self.show();
      let {
        oid,
        payprice,
        bussId
      } = e.currentTarget.dataset;
      if (payprice == 0) {
        self.orderCancel(oid)
        return;
      }
      http.post('/order/refund', {
        oid,
        refundPrice: payprice,
        refundOpt: 1
      }, 1).then((res) => {
        console.log(res)
        self.hide();
        if (res.code != 200) {
          return
        }
        if (self.data.iscurrent !== 1) {
          wx.navigateTo({
            url: '/venuePages/orderpay/orderpay?isOnce=!1&bussId=' + bussId + '&oid=' + oid
          })

        }else{
          self.initData();
        }

      })
    },
    orderCancel(oid) {
      let self = this;
      self.show();
      http.get('/order/cancel/' + oid).then((res) => {
        console.log(res)
        self.hide();
        if (res.code != 200) {
          return
        }
        if (self.data.iscurrent !== 1) {
          wx.navigateTo({
            url: '/venuePages/orderpay/orderpay?isOnce=!1&bussId=' + bussId + '&oid=' + oid
          })
          return
        }else{
          self.initData();
        }

      })
    },
    orderSubmitNoPrice(oid) {
      let self = this;
      self.show();
      http.get('/pay/noPay/' + oid).then((res) =>{
        console.log(res)
        self.hide();
        if (res.code != 200) {
          return
        }
        if (self.data.iscurrent !== 1) {
          wx.navigateTo({
            url: '/venuePages/orderpay/orderpay?isOnce=!1&bussId=' + bussId + '&oid=' + oid
          })
          return
        }else{
          self.initData();
        }

      })
    }

  },

})