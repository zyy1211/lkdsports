const Rx = require('../../utils/rxjs');
const {
    Observable,
    pipe,
    debounceTime,
    asObservable,
    throttle
} = Rx.operators;
//获取应用实例
// let util = require('../../utils/util');
// let QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
let Api = require('../../utils/config');
let http = require('../../utils/request.js');
let App = getApp();
let bhv_refresh = require('../component/behavior/bhv_refresh')

// var observable = Rx.Observable
// .create(function(observer) {
//     observer.next('Jerry'); 
//     observer.next('Anna');
// }).pipe(debounceTime(3000))

// var observable = Rx.Observable
// .create(function(observer) {
//     observer.next('Jerry'); 
//     observer.next('Anna');
// }).pipe(throttle(3000))

Page({
    data: {
        activityIndex: 0,
        mainList: [{
            name: '活动报名',
            icon: Api.cvs_img + '/cduan/huodong.png',
            url: '../activityList/index',
        }, {
            name: '赛事报名',
            icon: Api.cvs_img + '/cduan/saishi.png',
            url: '/gamePages/pages/gameList/gameList',
        }, {
            name: '场馆预约',
            icon: Api.cvs_img + '/cduan/changguan.png',
            url: '../venuesList/venuesList',
        }, {
            name: '我要入驻',
            icon: Api.cvs_img + '/cduan/shangjia.png',
            url: '',
        }],
    },
    behaviors: [bhv_refresh],
    onLoad: function () {
        let self = this;
        App.isLogin(function () {
            self.initData()
        })
    },

    initData() {
        let self = this;
        self.getBanner();
        this.selectComponent("#authorize").getAuthorizeLocation((loca) => {
            let longitude = loca.longitude;
            let latitude = loca.latitude;
            self.setData({
                latitude,
                longitude,
            })
            self.getVenue();
            self.getActivity();
        });
    },
    getBanner() {
        let self = this;
        http.get('/index/getPrepareApplet').then((res) => {
            console.log(res)
            let main = res.response[0]
            self.setData({
                banner: main.baners,
                sprotTypes: main.sprotTypes
            })
        })
    },
    getVenue() {
        let self = this;
        self.show();
        let {
            latitude,
            longitude
        } = this.data;
        http.get('/venue/venueList', {
            latitude,
            longitude,
            pageSize: 3,
            pageNum: 1
        }).then((res) => {
            // console.log(res)
            self.hide();
            if (res.code != 200) {
                return
            }
            let main = res.response[0].records;
            let total = res.response[0].total;
            self.setData({
                dataList: main,
                total
            })
        })
    },
    getActivity() {

    },
    toBannerMain(e) {
        let key = e.currentTarget.dataset.key;
        let url = key.path;
        if (key.type == 10) {
            wx.navigateTo({
                url: url,
            })
        } else if (key.type == 20) {
            // app
        } else if (key.type == 30) {
            wx.navigateTo({
                url: '/pages/webview/webview',
            })
            wx.setStorageSync('webview', JSON.stringify(url))
        } else if (key.type == 40) {
            // 小程序
        }
    },
    // 切换
    tabVenuesList: function (e) {
        let activityIndex = e.currentTarget.dataset.index;
        let sportType = e.currentTarget.dataset.sporttype;
        this.setData({
            activityIndex
        })
    },
    // 更多
    toActiveList(e) {
        let url = e.currentTarget.dataset.key;
        wx.navigateTo({
            url: url
        })
    }

})