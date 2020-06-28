const device = wx.getSystemInfoSync()
const width = device.windowWidth;
let cutw = width - 4;
let cuth = width / (750 / 560)

Page({
    data: {
        imgSrc: '',
        width: cutw, //宽度
        height: cuth, //高度
    },
    onLoad: function (options) {
        this.cropper = this.selectComponent("#image-cropper");
        this.setData({
            imgSrc: options.imgSrc,
        });
        wx.showLoading({
            title: '加载中'
        })
    },
    cropperload(e) {
        console.log("cropper初始化完成");
    },
    loadimage(e) {
        wx.hideLoading();
    },
    clickcut(e) {
        this.cropper.getImg((url) => {
            let pages = getCurrentPages();
            let prevPage = pages[pages.length - 2];
            prevPage.setData({
                imagePath: url.url,
            })
            // console.log(url.url)
            // console.log(url)
            prevPage.uploadImg(url.url,'headImage');
            wx.navigateBack({
                delta: 1,
            })
        });
    },
    toback() {
        wx.navigateBack({
            delta: 1,
        })
    },


})