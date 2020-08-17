const Rx = require('../../utils/rxjs');
// const {
//     Observable,
//     pipe,
//     debounceTime,
//     asObservable,
//     throttle,
//     throttleTime
// } = Rx.operators;
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
// }).pipe(throttleTime(3000))

// var myObservable = new Rx.Subject();
// myObservable.pipe(throttleTime(1000)).subscribe(value => console.log(value));

// .create(function(observer) {
//     observer.next('Jerry'); 
//     observer.next('Anna');
// }).pipe(throttle(3000))

Page({
    data: {
        sportType: '',
        apiimg: Api.API_IMG,
        activityIndex: 0,
        mainList: [{
                name: '活动报名',
                icon: Api.cvs_img + '/cduan/huodong.png',
                url: '/activityPages/activityList/activityList',
            },
            {
                name: '赛事报名',
                icon: Api.cvs_img + '/cduan/saishi.png',
                url: '/gamePages/gameList/gameList',
            },
            {
                name: '场馆预约',
                icon: Api.cvs_img + '/cduan/changguan.png',
                url: '/venuePages/venueList/venueList',
            }, {
                name: '我要入驻',
                icon: Api.cvs_img + '/cduan/shangjia.png',
                url: '/venuePages/settledIn/settledIn',
            }
        ],
    },
    behaviors: [bhv_refresh],
    test() {
        // observable.subscribe(value => console.log(value));
        // this.test111();
        myObservable.next('foo');
    },
    onShow: function () {
        let self = this;
        App.isLogin(function () {
            self.initData()
        })
    },


    initData() {
        let self = this;
        App.isLogin(function () {
            self.selectComponent("#authorize").getAuthorizeLocation((loca) => {
                // console.log(loca)
                let longitude = loca.longitude;
                let latitude = loca.latitude;
                self.setData({
                    latitude,
                    longitude,
                })
                self.getBanner();
                self.getActivity();
            });
        })

    },
    getBanner() {
        let self = this;
        http.get('/index/getPrepareApplet').then((res) => {
            // console.log(res)
            let main = res.response[0]
            self.setData({
                banner: main.baners,
                sprotTypes: main.sprotTypes,
                sportType: main.sprotTypes[0],
                activityIndex: 0
            });
            self.getVenue();
        })
    },
    getVenue() {
        let self = this;
        self.show();
        let {
            latitude,
            longitude,
            sportType
        } = this.data;
        // console.log(sportType)
        http.get('/venue/venueList', {
            latitude,
            longitude,
            sportType,
            pageSize: 3,
            pageNum: 1
        }).then((res) => {
            // console.log(res)
            self.hide();
            if (res.code != 200) {
                return
            }
            let main = res.response[0].records;
            self.setData({
                dataList: main
            })
        })
    },
    getActivity() {
        let self = this;
        self.show();
        let {
            latitude,
            longitude
        } = this.data;
        http.get('/activities/activitiesList', {
            latitude,
            longitude,
            pageSize: 5,
            pageNum: 1
        }).then((res) => {
            // console.log(res)
            self.hide();
            if (res.code != 200) {
                return
            }
            let main = res.response[0].records;
            self.setData({
                activityList: main,
            })
        })
    },
    toBannerMain(e) {
        let key = e.currentTarget.dataset.key;
        let url = key.path;
        if (key.type == 10) {
            wx.navigateTo({
                url: url,
            })
        } else {
            wx.navigateTo({
                url: '/pages/webview/webview',
            })
            wx.setStorageSync('webview', JSON.stringify(url))
        }
    },
    // 切换
    tabVenuesList: function (e) {
        // console.log(e)
        let activityIndex = e.currentTarget.dataset.index;
        let sportType = e.currentTarget.dataset.sporttype;
        this.setData({
            activityIndex,
            sportType
        })
        // console.log(this.data.sportType)
        this.getVenue();
    },
    // 更多
    toActiveList(e) {
        let url = e.currentTarget.dataset.key;
        wx.navigateTo({
            url: url
        })
    },

    toModalList(e) {
        let key = e.currentTarget.dataset.key;
        wx.navigateTo({
            url: key,
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '栎刻动体育',
            path: '/pages/home/home',
        }
    }

})