module.exports = Behavior({
  data: {},
  methods: {
    slideToggle() {
      let {
        isBlock
      } = this.data;
      isBlock ? this.slideSportsBlock() : this.slideSportsBlockHidden()
      this.setData({
        isBlock: !isBlock
      })
    },
    slideSportsBlock() {
      let {
        start,
        end
      } = this.data;
      let midd = end / 2;
      this.animate('#sportsBlock', [{
          height: start + 'rpx'
        },
        {
          height: midd + 'rpx'
        },
        {
          height: end + 'rpx'
        },
      ], 300, function () {}.bind(this))
    },
    slideSportsBlockHidden() {
      let {
        start,
        end
      } = this.data;
      let midd = end / 2;
      this.animate('#sportsBlock', [{
          height: end + 'rpx'
        },
        {
          height: midd + 'rpx'
        },
        {
          height: start + 'rpx'
        },
      ], 300, function () {}.bind(this))
    },


    moreToggle() {
      let {
        isMore
      } = this.data;
      isMore ? this.moreBlock() : this.moreBlockHidden()
      this.setData({
        isMore: !isMore
      })
    },
    moreBlock() {
      let {
        moreStart,
        moreEnd
      } = this.data;
      let midd = moreEnd / 2;
      this.animate('#moreSetup', [{
          height: moreStart + 'rpx'
        },
        {
          height: midd + 'rpx'
        },
        {
          height: moreEnd + 'rpx'
        },
      ], 300, function () {}.bind(this))
    },
    moreBlockHidden() {
      let {
        moreStart,
        moreEnd
      } = this.data;
      let midd = moreEnd / 2;
      this.animate('#moreSetup', [{
          height: moreEnd + 'rpx'
        },
        {
          height: midd + 'rpx'
        },
        {
          height: moreStart + 'rpx'
        },
      ], 300, function () {}.bind(this))
    },

  },

})