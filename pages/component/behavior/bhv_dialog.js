module.exports = Behavior({
  data: {},
  methods: {
    modalAgree: function () {
      let dialogAgree = this.data.dialogAgree;
      this.setData({
        dialogAgree: !dialogAgree
      })
    },
    closeDialogAgree: function () {
      this.setData({
        dialogAgree: true
      })
    },
    checkBoxChange: function (e) {
      let agree = this.data.agree;
      this.setData({
        agree: !agree
      })
    },
    _touchmove: function () {},
    // 我同意
    _defaultAgree: function () {
      this.setData({
        agree: true
      })
    },
  },

})