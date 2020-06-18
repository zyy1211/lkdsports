module.exports = Behavior({
  data: {},
  methods: {
    makeCall(e) {
      let phone = e.currentTarget.dataset.key;
      wx.makePhoneCall({
        phoneNumber: phone
      })
    },
    openMap() {
      let self = this;
      // this.selectComponent("#authorize").getAuthorizeLocation((location) => {
      //   let longitude = location.longitude;
      //   let latitude = location.latitude;
      //   let locationLongitude = self.data.main.locationLongitude;
      //   let locationLatitude = self.data.main.locationLatitude;
      //   self.setData({
      //     latitude,
      //     longitude
      //   })
      //   wx.openLocation({
      //     longitude: locationLongitude,
      //     latitude: locationLatitude
      //   });
      // });
      let locationLongitude = self.data.main.locationLongitude;
      let locationLatitude = self.data.main.locationLatitude;

      wx.openLocation({
        longitude: locationLongitude,
        latitude: locationLatitude
      });

    },
  },

})