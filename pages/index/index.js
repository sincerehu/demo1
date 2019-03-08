// pages/index/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isshow:true,
    act: 1,
    designation:'',
    leftArr: [{
      name: '厂花',
      act: 1
    }, {
      name: '小花',
      act: 2
    }, {
      name: '校草',
      act: 3
    }, {
      name: '水手',
      act: 4
    }, {
      name: '大力士',
      act: 5
    }],
    // 中间
    midArr: [{
      name: '校长',
      act: 6
    }, {
      name: '校草',
      act: 7
    }, {
      name: '小不点',
      act: 8
    }, {
      name: '汪汪汪',
      act: 9
    }, {
      name: '小猪',
      act: 10
    }],
    // 右边
    rightArr: [{
      name: '外星人',
      act: 11
    }, {
      name: '萌少女',
      act: 12
    }, {
      name: '铁汉子',
      act: 13
    }],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var info = wx.getStorageSync('user');
    if(info){
      this.setData({
        isshow:false
      })
      wx.redirectTo({
        url: '../home/home?s=1',
      })
    }else{
      this.setData({
        isshow: true
      })
    }
    wx.loadFontFace({
      family: 'kzh',
      source: 'url("/iconfont/text.ttf")',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {}
    });
  },
  getname: function(e) {
    console.log(e);
    this.setData({
      act: e.currentTarget.dataset.item.act,
      designation: e.currentTarget.dataset.item.name
    })
  },
  login: function(e) {
    var that = this;
    wx.setStorageSync('user', e.detail.userInfo)
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://fan.smallzhou.cn/index.php?s=/api/user/login',
            method: 'POST',
            data: {
              code: res.code,
              user_info: e.detail.userInfo,
              signature: e.detail.signature,
              wxapp_id: 10001,
              designation: that.data.designation || "厂花"
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function(res) {
              wx.setStorageSync('data', res.data.data)
              wx.redirectTo({
                url: '../home/home?s=0',
              })
            }
          })
        } else {}
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})