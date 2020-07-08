const http = require('../../../utils/request.js');
module.exports = Behavior({
  data: {},
  methods: {
    makeCall(e) {
      let phone = e.currentTarget.dataset.key;
      
      wx.makePhoneCall({
        phoneNumber: phone
      })
    },
    makeWx: function (e) {
      let vxNum = e.currentTarget.dataset.key;
      wx.setClipboardData({
        data: vxNum,
        success: function () {
          // wx.showModal({
          //   title: "提示",
          //   content: "微信号已复制到剪切板",
          //   showCancel: !1,
          //   confirmText: "知道了"
          // });
        }
      });
    },
    openMap() {
      let self = this;
      let locationLongitude = self.data.main.locationLongitude;
      let locationLatitude = self.data.main.locationLatitude;

      wx.openLocation({
        longitude: locationLongitude,
        latitude: locationLatitude
      });

    },
    chooseLocation() {
      let self = this;
      self.selectComponent("#authorize").getAuthorizeLocation(function (a) {
        if (!self.data.editId) {
          let latitude = self.data.addressLatitude;
          let longitude = self.data.addressLongitude;
          wx.chooseLocation({
            type: "gcj02",
            latitude: latitude,
            longitude: longitude,
            success: function (a) {
              self.setData({
                location: a.name,
                addressLongitude: a.longitude,
                addressLatitude: a.latitude
              })
            }
          });
        } else {
          wx.chooseLocation({
            type: "gcj02",
            success: function (a) {
              self.setData({
                location: a.name,
                addressLongitude: a.longitude,
                addressLatitude: a.latitude
              })
            }
          });
        }
      });
    },
    getPhoneNumber: function (e) {
      console.log('fs')
      let self = this;
      console.log(e)
      let params = {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }
      http.post('/user/getPhone', params).then(function (res) {
        console.log(res)
        let phone = res.response[0];
        self.setData({
          phoneNum: phone
        });
      })
    },
    string_to_arr(str){
      if(str != '' && str != null){
        str = str.substring(0,str.length-1);
        return str.split(',')
      }
    }



  },

})