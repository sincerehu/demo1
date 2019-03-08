App({
  loc:'https://fan.smallzhou.cn/index.php?',
  onLaunch: function(options) {

  },
  onShow: function() {

  },
  onHide: function() {},
  onError: function(msg) {},
  globalData: {
    userInfo: null
  },
  //渐入，渐出实现 
  show: function(that, param, opacity) {
    var animation = wx.createAnimation({
      //持续时间800ms
      duration: 800,
      timingFunction: 'ease',
    });
    //var animation = this.animation
    animation.opacity(opacity).step()
    //将param转换为key
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = animation.export()
    //设置动画
    that.setData(json)
  },

  //滑动渐入渐出
  slideupshow: function(that, param, px, opacity) {
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-in',
    });
    animation.translateX(px).opacity(opacity).step()
    //将param转换为key
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = animation.export()
    //设置动画
    that.setData(json)
  },

  //向右滑动渐入渐出
  scale: function(that, param, px, opacity) {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
    });
    animation.scale(2, 2).opacity(opacity).step()
    //将param转换为key
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = animation.export()
    //设置动画
    that.setData(json)
  }

})