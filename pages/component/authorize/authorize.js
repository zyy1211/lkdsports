// var t = require("../utils/util.js");

Component({
    data: {
        title: "地理位置未授权",
        modalHidden: !0
    },
    methods: {
        onOpensetting: function () {
            wx.hideLoading(), this.setData({
                modalHidden: !0
            });
        },
        getAuthorizeLocation: function (e) {
            var o = this;
            wx.getLocation({
                type: "gcj02",
                success: function (t) {
                    // console.log(t)
                    e(t);
                },
                fail: function () {
                    wx.getSetting ? wx.getSetting({
                        success: function (s) {
                            s.authSetting["scope.userLocation"] ? wx.getLocation({ 
                                type: "gcj02",
                                success: function (t) {
                                    // console.log(t)
                                    let ts = {latitude:30.25961,longitude:120.13026};
                                    e(ts);
                                },
                                fail: function () {
                                    let ts = {latitude:30.25961,longitude:120.13026};
                                    e(ts);
                                    // wx.showToast({
                                    //     title: "未开启微信定位！",
                                    //     icon:'none',
                                    //     duration: 2000
                                    // });
                                   
                                }
                            }) : o.setData({
                                modalHidden: !1
                            });
                        }
                    }) : wx.showModal({
                        title: "提示",
                        content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
                        showCancel: !1
                    });
                }
            });
        },
        getPhotosAlbum: function (e, o) {
            var s = wx.getSystemInfoSync().SDKVersion;
            if (s = s.replace(/\./g, ""), parseInt(s) < 120) return wx.showModal({
                title: "提示",
                content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
                showCancel: !1
            }), !1;
            var n = this;
            wx.saveImageToPhotosAlbum({
                filePath: o,
                success: function (o) {
                    t.showToast("已保存至相册", "success"), e();
                },
                fail: function () {
                    wx.getSetting ? wx.getSetting({
                        success: function (s) {
                            s.authSetting["scope.writePhotosAlbum"] ? wx.saveImageToPhotosAlbum({
                                filePath: o,
                                success: function (o) {
                                    t.showToast("已保存至相册", "success"), e();
                                }
                            }) : n.setData({
                                modalHidden: !1,
                                title: "保存到相册未授权"
                            });
                        }
                    }) : wx.showModal({
                        title: "提示",
                        content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
                        showCancel: !1
                    });
                }
            });
        }
    }
});