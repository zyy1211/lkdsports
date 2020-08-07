let http = require('../../../utils/request')
let API = require('../../../utils/config')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    sid: {
      value: null,
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showpost: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getAvaterInfo() {
      let self = this;
      wx.showLoading({
        title: '生成中...',
        mask: true,
      });
      this.setData({
        showpost: true
      })
      self.requestInfo();
    },

    async requestInfo() {

      let lka = await this.getDetail();
      let lkb = await this.getQRCode();
      let lkc = await this.promiseAll();
      this.scanSignCanvas();
      // console.log(lka)
      // console.log(lkb)
      // console.log(lkc)

    },

    getDetail() {
      let self = this;
      let {
        sid: activityId,
      } = self.data;

      http.get('/activities/selectActivity/' + activityId).then((res) => {
        // console.log(res)
        if (res.code != 200) {
          return;
        }
        let main = res.response[0];
        let {
          cUserDTO,
          activities,
          activityHeadImage,
          lowPrice
        } = main;
        self.setData({
          cUserDTO,
          activities,
          activityHeadImage,
          lowPrice
        })
      })
      return 'a'
    },

    getQRCode() {
      let self = this;
      return new Promise((reslove, reject) => {
        http.getBuffer('/user/actAcode/'+self.data.sid).then(function (res) {
          // console.log(res);
          if(res.statusCode != 200){
            reject();
          }
          let productCode =  "data:image/png;base64," +wx.arrayBufferToBase64(res.data);
          // console.log(wx.arrayBufferToBase64(res.data))
          if (productCode) {
            self.setData({
              productCode
            })
          }
          reslove('b');
        })
      })
    },
    promiseAll() {
      let self = this;
      let {
        cUserDTO: {
          headImage
        },
        activityHeadImage,
      } = this.data;
      activityHeadImage = API.API_IMG + activityHeadImage[0].path;
      let res = Promise.all([this.downImg('headImage', headImage), this.downImg('activityHeadImage', activityHeadImage)]);
      return res;

    },

    downImg(key, url) {
      let self = this;
      return new Promise((reslove) => {
        wx.downloadFile({
          url: url,
          success(res) {
            // console.log(res)
            if (res.statusCode != 200) {
              wx.showToast({
                title: '图片下载失败！',
                icon: 'none',
                duration: 2000
              })
            }
            let headimg = res.tempFilePath;
            self.setData({
              [key]: headimg
            })
          },
          complete: function () {
            reslove('c')
          }
        })
      })
    },
    scanSignCanvas() {
      let self = this;
      let {
        activityHeadImage,
        headImage,
        activities: {
          title,
          location,
          filedNo,
          startTime,
          endTime,
          appliedNum,
          participantsNum,
          chargeMode,
        },
        lowPrice,
        cUserDTO: {
          nickname
        },
        productCode
      } = this.data;
      if (!filedNo) {
        filedNo = '待定'
      }

      const ctx = wx.createCanvasContext('myCanvas', self);
      const query = wx.createSelectorQuery().in(self);
      query.select('#canvas-container').boundingClientRect(function (rect) {
        // console.log(rect)
        // console.log(activityHeadImage)
        let x = (rect.width - 690 / 2) / 2;
        let width = 690 / 2;
        let height = 514 / 2;
        let mainx = x + 20;
        let mainh = x + height;
        let imgsize = 17;
        ctx.drawImage(activityHeadImage, x, x, width, height);
        ctx.drawImage(productCode, x +10, x +10, 96, 96);
        ctx.setFillStyle('#FFFFFF')
        ctx.fillRect(x, mainh, width, rect.height - height - x * 2);

        // 文案
        ctx.setTextAlign('left');
        ctx.setFillStyle('#333');
        ctx.setFontSize(16);
        ctx.fillText(title, mainx, mainh + 26);
        ctx.fillText(title, mainx, mainh + 26);

        ctx.setTextAlign('left');
        ctx.setFillStyle('#333');
        ctx.setFontSize(13);
        ctx.drawImage('/static/actvd3.png', mainx, mainh + 26 + 16, imgsize, imgsize);
        ctx.drawImage('/static/actvd6.png', mainx, mainh + 26 + 30 + 16, imgsize, imgsize);
        ctx.drawImage('/static/actvd4.png', mainx, mainh + 26 + 30 + 30 + 16, imgsize, imgsize);
        ctx.fillText(location, mainx + 25, mainh + 26 + 30);
        ctx.fillText(self.formatTime(startTime, endTime), mainx + 25, mainh + 26 + 30 + 30);
        ctx.fillText(filedNo, mainx + 25, mainh + 26 + 30 + 30 + 30);
        ctx.fillText('已报名：' + appliedNum + '/' + participantsNum, mainx, mainh + 26 + 30 + 30 + 30 + 30);
        ctx.setFillStyle('red');
        ctx.setFontSize(16);
        let modetext = '';
        if (chargeMode == 0) {
          modetext = '免费'
        } else if (chargeMode == 20) {
          modetext = '线下收费'
        } else if (chargeMode == 30) {
          modetext = 'AA收款'
        } else {
          modetext = lowPrice / 100 + '元起';
        }
        ctx.fillText(modetext, rect.width - 30 - 70, mainh + 26 + 30 + 30 + 15);
        ctx.fillText(modetext, rect.width - 30 - 70, mainh + 26 + 30 + 30 + 15);
        ctx.setFillStyle('#f4f4f4');
        ctx.setFontSize(13);
        ctx.fillText(nickname + '：我分享了个活动，快来参加吧!', x + 20 + 30, height);

        // 用户
        ctx.setFillStyle('rgba(255,255,255,0.3)');
        ctx.fillRect(x + 16, height - 20, width - x * 2, 28);
        ctx.beginPath();
        ctx.arc(x + 20 + 10, height - 20 + 4 + 10, 10, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(headImage, x + 20, height - 20 + 4, 20, 20);
        ctx.restore();

      }).exec()
      setTimeout(function () {
        ctx.draw();
        wx.hideLoading();
      }, 1000)
    },

    formatTime(star, end, noweek) {

      if (star && end) {
        star = star.replace(/-/g, '/');
        end = end.replace(/-/g, '/');
        let str = ''
        let time_st = new Date(star)
        let time_end = new Date(end)
        let month1 = time_st.getMonth() + 1;
        let month2 = time_end.getMonth() + 1;
        let day1 = time_st.getDate()
        let day2 = time_end.getDate()
        let star_arr = star.split(' ')
        let end_arr = end.split(' ')
        let weekNo = time_st.getDay();
        let week = "周" + "日一二三四五六日".charAt(weekNo);

        if (day1 == day2) {
          str = week + '  ' + month1 + '/' + day1 + ' ' + star_arr[1] + '--' + end_arr[1]
        } else {
          str = week + '  ' + month1 + '/' + day1 + ' ' + star_arr[1] + '--' + month2 + '/' + day2 + ' ' + end_arr[1]
        }
        if (noweek == 1) {
          str = str.substring(3)
        }
        if (noweek == 0) {
          str = str.slice(0, 3)
        }
        return str;
      }
      return ''
    },

    saveShareImg: function () {
      let self = this;
      wx.showLoading({
        title: '正在保存',
        mask: true,
      })
      setTimeout(function () {
        wx.canvasToTempFilePath({
          canvasId: 'myCanvas',
          success: function (res) {
            let tempFilePath = res.tempFilePath;
            wx.saveImageToPhotosAlbum({
              filePath: tempFilePath,
              success(res) {
                wx.hideLoading()
                wx.showModal({
                  content: '图片已保存到相册，赶紧晒一下吧~',
                  showCancel: false,
                  confirmText: '好的',
                  confirmColor: '#333',
                  success: function (res) {
                    self.closePoste();
                  }
                })
              },
              fail: function (res) {
                wx.showToast({
                  title: '保存失败',
                  icon: 'none'
                })
              },
              complete: function () {
                setTimeout(() => {
                  wx.hideLoading();
                }, 100);
              }
            })
          }
        }, self);
      }, 1000);
    },
    //关闭海报
    closePoste: function () {
      this.setData({
        showpost: false
      });
    },

  }
})