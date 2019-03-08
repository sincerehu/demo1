// pages/recharge/recharge.js
var datas = wx.getStorageSync('data')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    masonry:wx.getStorageSync('user').masonry,
    fee:'10',
    inputfee:'',
    act:1,
    arr:[
      {a:'10钻石',b:'10',act:1},
      { a: '100钻石', b: '100', act: 2},
      { a: '1000钻石', b: '1000', act: 3},
      { a: '200钻石', b: '10', act: 4},
      { a: '1', b:'',act: 5},
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  nav:function(){
    wx.navigateTo({
      url: '../list/list',
    })
  },
  getcode:function(e){
    this.setData({
      act: e.currentTarget.dataset.code,
      fee: e.currentTarget.dataset.fee
    })
  },
  isok:function(e){
    console.log(e.detail.value)
    this.setData({
      inputfee: e.detail.value
    })
  },
  pay:function(){
    var that = this
    if (that.data.fee == '' && that.data.inputfee==""){
      wx.showToast({
        title: '请选择充值数量'
      })
      return
    } else if (that.data.fee == '' && that.data.inputfee != ""){
      that.setData({
        fee: that.data.inputfee
      })
    }
    console.log(that.data.fee)
    wx.request({
      url: app.loc + 's=/api/charge/pay',
      method: 'POST',
      data: {
        wxapp_id: 10001,
        token: datas.token,
        openid:wx.getStorageSync('user').open_id,
        fee: that.data.fee 
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: 'MD5',
          paySign: res.data.paySign,
          success(res) { 
            console.log(res)
          },
          fail(res) { }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})