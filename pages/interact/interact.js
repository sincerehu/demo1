var datas = wx.getStorageSync('data')
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    masonry:'',
    getshowlist: '',
    giftShow: '',
    isstart: true,
    giftshow: [],
    giftTop: 0,
    newdata: '',
    istime: 1000,
    x: 50,
    y: 100,
    playgift: false,
    a: false,
    ww: '',
    tit: '',
    isgift: false,
    isShow: false, //控制emoji表情是否显示
    isLoad: true, //解决初试加载时emoji动画执行一次
    content: "", //评论框的内容
    isLoading: true, //是否显示加载数据提示
    disabled: true,
    cfBg: false,
    scrollTop: 300,
    giftList: [{
      img: "/images/9jia.png",
      zuan: 50,
      tit: '加油'
    }, {
      img: "/images/9heart.png",
      zuan: 500,
      tit: '喜欢',
      ismid: true
    }, {
      img: "/images/9rain.png",
      zuan: 500,
      tit: '特喜欢'
    }],
    _index: 0,
    giftarr: [],
    emojiChar: "☺-😋-😌-😍-😏-😜-😝-😞-😔-😪-😭-😁-😂-😃-😅-😆-👿-😒-😓-😔-😏-😖-😘-😚-😒-😡-😢-😣-😤-😢-😨-😳-😵-😷-😸-😻-😼-😽-😾-😿-🙊-🙋-🙏-✈-🚇-🚃-🚌-🍄-🍅-🍆-🍇-🍈-🍉-🍑-🍒-🍓-🐔-🐶-🐷-👦-👧-👱-👩-👰-👨-👲-👳-💃-💄-💅-💆-💇-🌹-💑-💓-💘-🚲",
    //0x1f---
    emoji: [
      "60a", "60b", "60c", "60d", "60f",
      "61b", "61d", "61e", "61f",
      "62a", "62c", "62e",
      "602", "603", "605", "606", "608",
      "612", "613", "614", "615", "616", "618", "619", "620", "621", "623", "624", "625", "627", "629", "633", "635", "637",
      "63a", "63b", "63c", "63d", "63e", "63f",
      "64a", "64b", "64f", "681",
      "68a", "68b", "68c",
      "344", "345", "346", "347", "348", "349", "351", "352", "353",
      "414", "415", "416",
      "466", "467", "468", "469", "470", "471", "472", "473",
      "483", "484", "485", "486", "487", "490", "491", "493", "498", "6b4"
    ],
    emojis: [], //qq、微信原始表情
    alipayEmoji: [], //支付宝表情
    title: '', //页面标题
    arr: [{
      name: '管理员',
      img: '/images/biaoqing.png',
      content: '欢迎来到聊天室',
      isMe: false
    }],
    userInfo: wx.getStorageSync('user'),
    chatHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    datas = wx.getStorageSync('data')
    var that = this
    var ww = wx.getSystemInfoSync().windowWidth;
    that.setData({
      ww: ww
    })
    that.getGiftList()
    that.videoContext = wx.createVideoContext('vid')
    that.sedgift(2000)
    if (options.gift == "gift") {
      console.log(options)
      that.navget()
    }
    that.getshow()

    // 引入外部字体
    wx.loadFontFace({
      family: 'kzh',
      source: 'url("/iconfont/text.ttf")',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {}
    });

    var otherHeight = 0
    //创建节点选择器
    var query = wx.createSelectorQuery();
    query.select('.comment-fixed').boundingClientRect()
    query.select('.show-gift').boundingClientRect()
    query.exec(function(res) {
      //取高度
      otherHeight = res[0].height + res[1].height
      wx.getSystemInfo({
        success: function(ww) {
          that.setData({
            chatHeight: ww.windowHeight - otherHeight - 10
          })
        }
      })
    })


    // emoji表情
    var em = {},
      that = this,
      emChar = that.data.emojiChar.split("-");
    that.data.emoji.forEach(function(v, i) {
      em = {
        char: emChar[i],
        emoji: "0x1f" + v
      };
      that.data.emojis.push(em)
    });
    that.setData({
      emojis: that.data.emojis
    })
  },
  getshow: function() {
    var that = this
    wx.request({
      url: app.loc + 's=/api/program/show',
      method: 'POST',
      data: {
        wxapp_id: 10001,
        token: datas.token,
        user_id:wx.getStorageSync('user').user_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        that.setData({
          getshowlist: res.data.data.list[0],
          masonry: res.data.data.masonry
        })
        if (res.data.data.state != 1) {
          that.setData({
            isstart: false
          })
        }
      }
    })
  },
  getGiftList: function() {
    var that = this
    wx.request({
      url: app.loc + 's=/api/gifts/lists',
      method: 'GET',
      data: {
        wxapp_id: 10001,
        token: datas.token
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        that.setData({
          giftList: res.data.data.list
        })
      }
    })
  },
  closeadd: function() {
    if (this.data.isstart) {
      this.setData({
        isgift: false
      })
    }
  },
  goout: function() {
    wx.navigateBack()
  },
  getGifts: function(e) {
    console.log(e)
    this.setData({
      tit: e.currentTarget.dataset.datas.gifts_name,
      giftShow: e.currentTarget.dataset.datas.is_show,
      giftShowData: e.currentTarget.dataset.datas
    })
  },
  // 控制动画进度
  click: function() {
    this.sedgift(7000)
  },
  sedgift: function(e) {
    var that = this
    // app.slideupshow(this, 'slide_up1', this.data.ww + 10, 1)
    app.scale(this, 'slide_upe2', '', 1)
    this.videoContext.play()
    clearTimeout(s);
    var s = setTimeout(function() {
      that.videoContext.pause()
    }, e);
    this.setData({
      isgift: false,
    })
  },
  isend: function() {
    this.sedgift(2000)
    wx.showModal({
      title: '友情提示',
      content: '本场互动已结束～感谢您的参与～',
      success(res) {
        if (res.confirm) {
          wx.navigateBack()
        } else if (res.cancel) {
          wx.navigateBack()
        }
      }
    })
    this.setData({
      playgift: false
    })
  },
  sedgifts: function(datas) {
   
    var that = this;
    if (!that.data.isstart) {
      wx.showToast({
        title: '互动尚未开始，请稍候',
        icon: 'none',
        duration: 2000
      })
      return
    } else if (that.data.masonry <= 0){
      wx.showToast({
        title: '钻石不足，请充值',
        icon: 'none',
        duration: 2000
      })
      return
    }
    //这是发送礼物提醒
    var thisgift = that.data.giftshow;
    if (!datas.type) {
      thisgift.push({
        img: datas.giftsIcon,
        zuan: 50,
        giftsName: datas.giftsName,
        tit: datas.nickname,
        headimg: datas.headimg
      })
      that.setData({
        giftshow: thisgift,
        giftTop: that.data.giftTop + 300
      })
      wx.request({
        url: app.loc + 's=/api/program/sendgift',
        method: 'POST',
        data: {
          wxapp_id: 10001,
          token: datas.token,
          user_id: wx.getStorageSync('user').user_id,
          program_id: that.data.getshowlist.id,
          price: that.data.giftShowData.price,
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function(res) {
          console.log(res)
          that.setData({
            masonry:res.data.data.list
          })
        }
      })

    }
    //结束
    //发送请求
    var user = that.data.userInfo || wx.getStorageSync('user')
    var giftsBox = that.data.giftShowData
    var userObj = {
      'headimg': user.avatarUrl,
      'nickname': user.nickName,
      'giftsName': giftsBox.gifts_name,
      'giftsIcon': giftsBox.icon,
      'isgift': true,
      'type': false
    }
    if (datas.type) {
      wx.sendSocketMessage({
        data: JSON.stringify(userObj)
      })
    }
    // 动画3特效
    if (that.data.giftShow == 1) {
      var newdata = new Date();
      this.setData({
        playgift: true,
        newdata: newdata,
      })
      setTimeout(function() {
        that.setData({
          playgift: false,
        })
      }, 3400);
    }
    that.setData({
      isgift: false,
    })
  },
  isends: function() {
    this.videoContext.pause()
    this.setData({
      playgift: false
    })
  },

  aixin: "",
  videoContext: '',
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this
    wx.onSocketClose(function (res) {
      wx.connectSocket({
        url: 'wss://www.hunterslab.cn/chat',
        method: "GET"
      })
      // that.socket('',false)
    })
    wx.onSocketMessage(function(res) {
      if (JSON.parse(res.data).isgift) {
        that.sedgifts(JSON.parse(res.data))
      } else {
        that.setData({
          message: JSON.parse(res.data)
        })
        that.addList(that.data.message)
      }
    })
    wx.setNavigationBarTitle({
      title: this.data.title
    })
  },
  navadd: function() {
    wx.navigateTo({
      url: '../recharge/recharge',
    })
  },
  navget: function() {
    this.setData({
      isgift: true
    })
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

  },
  getInfo() {
    var that = this
    wx.request({
      url: 'https://www.hunterslab.cn/chatconfig', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        that.setData({
          imgUrls: res.data.data.adimgs
        })
      }
    })
  },
  // 获取用户信息
  // getUserInfo: function(e) {
  //   var that = this;
  //   that.setData({
  //     userInfo: wx.getStorageSync('user')
  //   })
  //   var obj = {
  //     'nickname': '管理员',
  //     'headimg': '../../images/login.png',
  //     'message': "欢迎" + that.data.nickName + "加入聊天室"
  //   }
  //   that.socket(obj)
  // },
  onShow() {
    var that = this;
    that.getInfo()
    if (that.data.userInfo) {
      that.socket(that.data.userInfo, true)
    }
  },
  socket: function(obj, e) {
    var that = this
    var user = that.data.userInfo
    // 建立连接
    if (!e) {
      wx.connectSocket({
        url: 'wss://www.hunterslab.cn/chat',
        method: "GET"
      })
      wx.onSocketOpen(function(res) {
        if (obj) {
          wx.sendSocketMessage({
            data: JSON.stringify(obj)
          })
        }
      })
      wx.onSocketError(function(res) {
        wx.connectSocket({
          url: 'wss://www.hunterslab.cn/chat',
          method: "GET"
        })
      })
    }

  },
  addList: function(e) {
    var that = this
    var arrs = []
    var info = wx.getStorageSync('user')
    var isMe = false,
      names = e.nickname;
    if (info.avatarUrl == e.headimg) {
      isMe = true;
      // names = '我'
    }
    arrs.push({
      name: names,
      img: e.headimg,
      content: e.message,
      isMe: isMe
    })
    if (info.avatarUrl == e.headimg) {
      that.setData({
        arr: that.data.arr.concat(arrs),
        content: '',
        isShow: false,
        cfBg: false,
        scrollTop: this.data.scrollTop + 300
      })
    } else {
      that.setData({
        arr: that.data.arr.concat(arrs),
        isShow: false,
        cfBg: false,
        scrollTop: this.data.scrollTop + 300
      })
    }
  },

  //解决滑动穿透问题
  emojiScroll: function(e) {},
  //文本域失去焦点时 事件处理
  textAreaBlur: function(e) {
    //获取此时文本域值
    this.setData({
      content: e.detail.value
    })

  },
  //文本域获得焦点事件处理
  textAreaFocus: function(e) {
    this.setData({
      isShow: false,
      cfBg: false
    })
  },
  //点击表情显示隐藏表情盒子
  emojiShowHide: function() {
    this.setData({
      isShow: !this.data.isShow,
      isLoad: false,
      cfBg: !this.data.false
    })
  },
  //表情选择
  emojiChoose: function(e) {
    //当前输入内容和表情合并
    this.setData({
      content: this.data.content + e.currentTarget.dataset.emoji
    })
  },
  //点击emoji背景遮罩隐藏emoji盒子
  cemojiCfBg: function() {
    this.setData({
      isShow: false,
      cfBg: false
    })
  },
  textArea: function(e) {
    this.setData({
      content: e.detail.value
    })
  },

  checkBlankSpace(str) {
    while (str.lastIndexOf(" ") >= 0) {
      str = str.replace(" ", "");
    }
    if (str.length == 0) {
      wx.showToast({
        title: '不能全部为空格'
      })
    }
  }, //检测输入内容全为空格

  //发送评论评论 事件处理
  send: function() {
    var that = this;
    var user = that.data.userInfo || wx.getStorageSync('user')
    var userObj = {
      'headimg': user.avatarUrl,
      'nickname': user.nickName,
      'message': that.data.content
    }
    wx.onSocketClose(function(res) {
      wx.connectSocket({
        url: 'wss://www.hunterslab.cn/chat',
        method: "GET"
      })
      // that.socket('',false)
    })
    var str = that.data.content
    while (str.lastIndexOf(" ") >= 0) {
      str = str.replace(" ", "");
    }
    if (str.length == 0) {
      wx.showToast({
        title: '输入信息不能为空哦～',
        icon: 'none'
      })
    } else {
      wx.sendSocketMessage({
        data: JSON.stringify(userObj)
      })
    }
  },
  photo: function(options) {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
      }
    })
  },

})