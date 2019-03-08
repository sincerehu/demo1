var app = getApp()
var datas = wx.getStorageSync('data')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputvalue: "",
    tip: true,
    x: 50,
    y: 100,
    isPopping: false, //是否已经弹出
    animPlus: {}, //旋转动画
    animCollect: {}, //item位移,透明度
    animTranspond: {}, //item位移,透明度
    animInput: {}, //item位移,透明度
    listId: -1,
    list: {},
    act: 0, //控制navbar的切换
    isshow: true, //控制正在播放的背景样式
    gift: false, //控制礼物中心
    cov: false,
    codes: ["10", "50", "100", "300"],
    isCheck: 0,
    center: {},
    isShow: false, //控制emoji表情是否显示
    isLoad: true, //解决初试加载时emoji动画执行一次
    content: "", //评论框的内容
    isLoading: true, //是否显示加载数据提示
    disabled: true,
    cfBg: false,
    scrollTop: 300,
    giftList: {},
    getscore: false,
    howPlay: false,
    _index: 0,
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
      designation: 'BOSS',
      isMe: false
    }],
    // userInfo: wx.getStorageSync('user'),
    chatHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    datas = wx.getStorageSync('data')
    var that = this
    if (options.s == 1) {
      that.setData({
        tip: false
      })
    }
    that.getCenter()
    that.getUserInfo()


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
    query.select('.navbar').boundingClientRect()
    query.exec(function(res) {
      //取高度
      otherHeight = res[0].height + res[1].height
      wx.getSystemInfo({
        success: function(res) {
          that.setData({
            chatHeight: res.windowHeight - otherHeight - 10
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
  // 控制顶部navbar
  isact: function(e) {
    var that = this
    var act = e.currentTarget.dataset.index
    this.setData({
      act: act
    })
    if (act == 1) {
      that.getList()
    } else if (act == 2) {
      that.getCenter()
    }
  },
  closeShow: function() {
    this.takeback()
    this.setData({
      isPopping: false
    })
  },
  sendScore: function() {
    var that = this;
    var score;
    console.log(that.data.isCheck)
    if (that.data.isCheck > that.data.center.score) {
      wx.showToast({
        title: '对不起，当前积分不足～',
        icon: 'none',
        duration: 2000
      })
      return
    } else if (that.data.isCheck <= 0) {
      wx.showToast({
        title: '请您选择积分',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (that.data.isCheck == 'all') {
      score = that.data.center.score
    } else {
      score = that.data.isCheck
    }
    wx.request({
      url: app.loc + 's=/api/program/bet',
      method: 'POST',
      data: {
        wxapp_id: 10001,
        token: datas.token,
        program_id: that.data.listId,
        user_id: that.data.center.user_id,
        score: score
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        wx.showToast({
          title: '恭喜您，下注已成功～',
          icon: 'none',
          duration: 2000
        })
        that.getCenter()
        that.setData({
          cov: false,
        })
      }
    })
  },
  // 获取个人信息
  getCenter: function() {
    var that = this;
    wx.request({
      url: app.loc + 's=/api/user.index/detail',
      method: 'POST',
      data: {
        wxapp_id: 10001,
        token: datas.token
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        wx.setStorageSync('user', res.data.data.userInfo)
        that.setData({
          center: res.data.data.userInfo,
          reward: res.data.data.rewardinfo
        })
      }
    })
  },
  gettip: function() {
    this.setData({
      tip: false
    })
  },
  // 获取节目列表
  getList: function() {
    var that = this;
    wx.request({
      url: app.loc + 's=/api/program/lists',
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
          list: res.data.data.list
        })
      }
    })
  },

  check: function(e) {
    console.log(e)
    this.setData({
      isCheck: e.currentTarget.dataset.item,
      inputvalue: ""
    })
  },
  blur: function(e) {
    console.log(e.detail.value)
    this.setData({
      isCheck: e.detail.value
    })
  },
  showCover: function(e) {
    var status = e.currentTarget.dataset.status;
    if (status == 0) {
      wx.showToast({
        title: '活动马上开始～',
        icon: 'none',
        duration: 2000
      })
    } else if (status == 1) {
      this.setData({
        cov: true,
        listId: e.currentTarget.dataset.listid
      })
    } else {
      wx.showToast({
        title: '竞猜已结束～',
        icon: 'none',
        duration: 2000
      })
    }
  },

  closeCover: function() {
    this.setData({
      cov: false
    })
  },
  navGift: function() {
    var gift = this.data.gift
    this.setData({
      gift: !gift
    })
    this.getcenterlist()
  },
  //获取礼物列表
  getcenterlist: function(e) {
    var that = this
    wx.request({
      url: app.loc + 's=/api/ScoreGoods/lists',
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
  // 礼物兑换
  setGift: function(e) {
    var that = this
    wx.showModal({
      title: '确定要兑换以下商品么',
      content: e.currentTarget.dataset.goods,
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.loc + 's=/api/ScoreGoods/exchange',
            method: 'POST',
            data: {
              wxapp_id: 10001,
              token: datas.token,
              goods_id: e.currentTarget.dataset.id,
              score: that.data.center.score,
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function(res) {
              console.log(res)
              if (res.data.code == 1) {
                wx.showToast({
                  title: '兑换成功',
                  icon: 'none',
                  duration: 2000
                })
              }else{
                wx.showToast({
                  title: '积分不足',
                  icon: 'none',
                  duration: 2000
                })
              }
            },
            fail: function() {
              wx.showToast({
                title: '积分不足',
                icon: 'none',
                duration: 2000
              })
            }

          })
        } else if (res.cancel) {}
      }
    })
  },
  navRecharge: function() {
    wx.navigateTo({
      url: '../recharge/recharge',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.setNavigationBarTitle({
      title: this.data.title
    })
  },

  navget: function(e) {
    if (e.currentTarget.dataset.add == 'add') {
      wx.navigateTo({
        url: '../recharge/recharge'
      })
    } else {

      wx.navigateTo({
        url: '../interact/interact?gift=' + e.currentTarget.dataset.gift,
      })

    }
  },
  score: function() {
    this.setData({
      getscore: true
    })
  },
  howPlay() {
    this.setData({
      howPlay: true
    })
  },
  closeinter: function() {
    this.setData({
      howPlay: false,
      getscore: false
    })
  },
  //点击弹出
  plus: function() {
    if (this.data.isPopping) {
      //缩回动画
      this.takeback();
      // this.popp();
      this.setData({
        isPopping: false
      })
    } else if (!this.data.isPopping) {
      //弹出动画
      this.popp();
      // this.takeback();
      this.setData({
        isPopping: true
      })
    }
  },
  //弹出动画
  popp: function() {
    //plus顺时针旋转
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationcollect = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationTranspond = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationInput = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(180).step();
    animationcollect.translate(-40, -40).rotateZ(180).opacity(1).step();
    animationTranspond.translate(-60, 0).rotateZ(180).opacity(1).step();
    animationInput.translate(-40, 40).rotateZ(180).opacity(1).step();
    this.setData({
      animPlus: animationPlus.export(),
      animCollect: animationcollect.export(),
      animTranspond: animationTranspond.export(),
      animInput: animationInput.export(),
    })
  },
  //收回动画
  takeback: function() {
    //plus逆时针旋转
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationcollect = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationTranspond = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationInput = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(0).step();
    animationcollect.translate(0, 0).rotateZ(0).opacity(0).step();
    animationTranspond.translate(0, 0).rotateZ(0).opacity(0).step();
    animationInput.translate(0, 0).rotateZ(0).opacity(0).step();
    this.setData({
      animPlus: animationPlus.export(),
      animCollect: animationcollect.export(),
      animTranspond: animationTranspond.export(),
      animInput: animationInput.export(),
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

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
  getUserInfo: function(e) {
    var that = this;
    var obj = {
      'nickname': '管理员',
      'headimg': '../../images/login.png',
      'message': "欢迎" + that.data.center.nickName + "加入聊天室"
    }
    that.socket(obj)
  },
  onShow() {
    var that = this;
    that.getInfo()
    if (that.data.center) {
      that.socket(that.data.center)
    }
  },
  socket: function(obj, e) {
    var that = this
    var user = that.data.center
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
    wx.onSocketMessage(function(res) {
      that.setData({
        message: JSON.parse(res.data)
      })
      that.addList(that.data.message)

    })
  },
  addList: function(e) {
    var that = this
    var arrs = []
    var info = that.data.center
    var isMe = false,
      names = e.nickname;
    if (info.avatarUrl == e.headimg) {
      isMe = true;
      // names = '我'
    }
    console.log(e)
    arrs.push({
      name: names,
      img: e.headimg,
      content: e.message,
      designation: e.designation,
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
    var that = this
    var user = that.data.center
    console.log(user)
    var userObj = {
      'headimg': user.avatarUrl,
      'nickname': user.nickName,
      'message': that.data.content,
      'designation': user.designation
    }
    wx.onSocketClose(function(res) {
      console.log(123)
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