//index.js
//获取应用实例
let util = require('../../utils/util');
let QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
let Api = require('../../utils/config');
let http = require('../../utils/request.js');
let App = getApp();
let bhv_refresh = require('../component/behavior/bhv_refresh')

Page({
    data: {
        typeList: [{
            sportsName: '羽毛球'
        }, {
            sportsName: '篮球'
        }, {
            sportsName: '网球'
        }, {
            sportsName: '羽毛球'
        }, {
            sportsName: '篮球'
        }, {
            sportsName: '网球'
        }, {
            sportsName: '羽毛球'
        }, {
            sportsName: '篮球'
        }, {
            sportsName: '网球'
        }, {
            sportsName: '羽毛球'
        }, {
            sportsName: '篮球'
        }, {
            sportsName: '网球'
        }],
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
        data: {
            "bVenueFieldCopyList": [{
                    "lockList": [{
                            "originalPrice": 45,
                            "configId": 3,
                            "price": 45,
                            "id": 1,
                            "status": 1,
                            "dataCode": "0010111-12"
                        },
                        {
                            "originalPrice": 45,
                            "configId": 5,
                            "price": 60,
                            "id": 2,
                            "status": 1,
                            "dataCode": "0010109-10"
                        },
                        {
                            "originalPrice": 45,
                            "configId": 5,
                            "price": 60,
                            "id": 3,
                            "status": 2,
                            "dataCode": "0010110-11"
                        }
                    ],
                    "name": "1号馆",
                    "id": 1,
                    "configList": [{
                            "seniorConfigId": 2,
                            "baseConfigId": 1,
                            "mergeIdentification": "2-0",
                            "id": 1,
                            "dataCode": "0010109-10",
                            "basePrice": 45,
                            "peice": 60
                        },
                        {
                            "seniorConfigId": 2,
                            "baseConfigId": 1,
                            "mergeIdentification": "2-0",
                            "id": 2,
                            "dataCode": "0010110-11",
                            "basePrice": 45,
                            "peice": 60
                        },
                        {
                            "seniorConfigId": 0,
                            "baseConfigId": 1,
                            "mergeIdentification": "",
                            "id": 3,
                            "dataCode": "0010111-12",
                            "basePrice": 45,
                            "peice": 0
                        },
                        {
                            "seniorConfigId": 2,
                            "baseConfigId": 1,
                            "mergeIdentification": "2-1",
                            "id": 4,
                            "dataCode": "0010114-15",
                            "basePrice": 50,
                            "peice": 110
                        },
                        {
                            "seniorConfigId": 2,
                            "baseConfigId": 1,
                            "mergeIdentification": "2-1",
                            "id": 5,
                            "dataCode": "0010115-16",
                            "basePrice": 50,
                            "peice": 110
                        },
                        {
                            "seniorConfigId": 2,
                            "baseConfigId": 1,
                            "mergeIdentification": "2-1",
                            "id": 5,
                            "dataCode": "0010116-17",
                            "basePrice": 50,
                            "peice": 110
                        }
                    ],
                    "type": 0
                },
                {
                    "lockList": [],
                    "name": "散客1号馆",
                    "id": 2,
                    "configList": [{
                        "seniorConfigId": 2,
                        "baseConfigId": 1,
                        "mergeIdentification": "",
                        "id": 10,
                        "dataCode": "0010110-20",
                        "basePrice": 45,
                        "peice": 25
                    }],
                    "type": 1
                }
            ],
            "matchList": [{
                    "businessHours": "09:00~22:00",
                    "name": "羽毛球",
                    "id": 1
                },
                {
                    "businessHours": "11:00~23:00",
                    "name": "篮球",
                    "id": 2
                }
            ],
            "name": "西湖体育馆",
            "id": 1,
            "type": 0
        }
    },
    behaviors: [bhv_refresh],
    onLoad: function () {
        let self = this;
        App.isLogin(function () {
            // console.log('res')
            self.initPageLogin()
        })
    },

    onPullDownRefresh: function () {
        let self = this;
        self.initPageLogin();
        setTimeout(() => {
            wx.stopPullDownRefresh();
        }, 300);
    },

    initPageLogin: function () {
        let self = this;
        this.selectComponent("#authorize").getAuthorizeLocation(self.getLocationName);
    },

    // 位置
    getLocationName: function (t) {
        var self = this;
        let map = new QQMapWX({
            key: Api.QQmapsdkKey
        });
        let latitude = t.latitude;
        let longitude = t.longitude;
        // console.log(App)
        App.globalData.latitude = latitude;
        App.globalData.longitude = longitude;
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
    toActiveList(e){
        let url = e.currentTarget.dataset.key;
        wx.navigateTo({
            url: url
        })
    }


})