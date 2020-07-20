const http = require('../../../utils/request.js');
let app = getApp();
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
      // console.log('fs')
      let self = this;
      let keys = e.currentTarget.dataset.key;
      // console.log(e)
      let params = {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }
      // console.log(e.detail.iv);
      if (app.isNull(e.detail.iv)) {
        return
      }
      http.post('/user/getPhone', params).then(function (res) {
        // console.log(res)
        if (res.code != 200) {
          return
        }
        let phone = res.response[0];
        self.setData({
          [keys]: phone
        });
      })
    },
    string_to_arr(str) {
      if (str != '' && str != null) {
        str = str.substring(0, str.length - 1);
        return str.split(',')
      }
    },
    bMapTransqqMap(lng, lat) {
      let x_pi = (3.14159265358979324 * 3000.0) / 180.0;
      let x = lng - 0.0065;
      let y = lat - 0.006;
      let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
      let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
      let lngs = z * Math.cos(theta);
      let lats = z * Math.sin(theta);
      return {
        longitude: lngs,
        latitude: lats
      };
    }




  },

})