module.exports = {
  tabStyle: {
    //触发时的文字颜色
    activeColor: '#246CFF',
    //未触发时的文字颜色
    inactiveColor: '#666666',
  },

  tabs: [
    {
      "content": "首页", //显示的文字（可选）
      "activeImg": "/static/index_a.png", //触发时的图片（可选，如没有的话不会显示图片）
      "inactiveImg": "/static/index.png", //未触发时的图片（如果没有activeImg不会生效）
      "data": "/pages/home/home", //按钮对应的路径
    },
    {
      "content": "",
      "activeImg": "/static/add.png",
      "inactiveImg": "/static/add.png"
    },
    {
      "content": "我的",
      "activeImg": "/static/mine_a.png",
      "inactiveImg": "/static/mine.png",
      "data": "/pages/mine/mine"
    },
  ],
}