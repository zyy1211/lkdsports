
module.exports = Behavior({
  data: {
  },
  methods: {
    onReachBottom: function() {
      // console.log(this.data.dataList.length)
      // console.log(this.data.total)
      if (this.data.dataList.length == this.data.total) {
        return;
      }
      let pageNum = (this.data.pageNum) + 1;
      this.setData({pageNum})
      this.getData(!0);
    },
  },

})
