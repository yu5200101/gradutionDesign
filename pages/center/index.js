// pages/center/index.js
var Bmob=require("../../utils/bmob.js");
var common = require('../template/getCode.js');
var that;
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    that = this;
    that.setData({    
          upImg: true,
          loading: false,
          isdisabled: false,
          modifyLoading: false,
          nickCollege:"未设置"
        })  
  },
  onReady:function(){
    // 页面渲染完成
    wx.hideToast()
  },
  onShow:function(){
   // var that = this;
    // 页面显示
    var user_id = wx.getStorageSync('user_id')
    var objectId = user_id//currentUser._id;
    var me = new Bmob.User();
    me.id = objectId;
    var myInterval = setInterval(getReturn, 500);
    function getReturn() {
      wx.getStorage({
        key: 'user_id',
        success: function (ress) {
          if (ress.data) {
            clearInterval(myInterval)
            wx.getStorage({
              key: 'my_avatar',
              success: function (res) {
                that.setData({
                  userPic: res.data,
                  loading: true
                })
              }
            })
            wx.getStorage({
              key: 'my_nick',
              success: function (res) {
                that.setData({
                  userName: res.data,
                  nickName: res.data

                })
              }
            })
            wx.getStorage({
              key: 'my_college',
              success: function (res) {
                that.setData({
                  userCollege: res.data,
                  nickCollege: res.data

                })
              }
            })
          }

        }
      })
    }
    },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  modify_addr:function(){
    wx.navigateTo({ 
      url: '../modify_addr/index' 
    })
  },
  cart:function(){
    wx.switchTab({ 
      url: '../cart/index' 
    })
  },
  enter_administrator:function(){
    wx.navigateTo({
      url:'../administrator/administrator'
    })
  },
   hiddenComment: function () {
    //var that = this;
    that.setData({
      isModifyNick: false,
      nickName: that.data.userName
    })
  },
  bindKeyInput: function (e) {//同步input和昵称显示
    //var that = this;
    that.setData({
      nickName: e.detail.value
    })
  },
  modifyNick: function () {
    //var that = this;
    that.setData({
      isModifyNick: true,
    })
  },
   hiddenCollege: function () {
    //var that = this;
    that.setData({
      isModifyCollege: false,
      nickCollege: that.data.userCollege
    })
  },
  bindCollegeInput: function (e) {//同步input和昵称显示
    //var that = this;
    that.setData({
      nickCollege: e.detail.value
    })
  },
  modify_college: function () {
    //var that = this;
    that.setData({
      isModifyCollege: true,
    })
  },
  modif_college:function(e){
     that.setData({
      isdisabled: true,
      sModifyNick: true,
      modifyLoading: true
    })
    wx.getStorage({
      key: 'my_username',
      success: function (ress) {
        if (ress.data) {
          var my_username = ress.data;
          wx.getStorage({
            key: 'user_openid',
            success: function (openid) {
              var openid = openid.data;
              var user = Bmob.User.logIn(my_username, openid, {
                success: function (users) {
                  users.set('userCollege', e.detail.value.changeCollege);  // attempt to change username
                  users.save(null, {
                    success: function (user) {
                      wx.setStorageSync('my_college', e.detail.value.changeCollege);
                      that.setData({
                        userCollege: that.data.inputValue,
                        isModifyCollege: false,
                        isdisabled: false,
                        modifyLoading: false
                      })
                      common.dataLoading("修改大学成功", "success");

                    },
                    error: function (error) {
                      common.dataLoading(res.data.error, "loading");
                      that.setData({
                        isModifyCollege: false,
                        isdisabled: false,
                        modifyLoading: false,
                        nickCollege: that.data.userCollege
                      })
                    }
                  });
                }
              });
            }, function(error) {
              console.log(error);
            }
          })
        }

      }
    })
  },
   modyfiNick: function (e) {//修改昵称
   // var that = this;
    that.setData({
      isdisabled: true,
      sModifyNick: true,
      modifyLoading: true
    })
    wx.getStorage({
      key: 'my_username',
      success: function (ress) {
        if (ress.data) {
          var my_username = ress.data;
          wx.getStorage({
            key: 'user_openid',
            success: function (openid) {
              var openid = openid.data;
              var user = Bmob.User.logIn(my_username, openid, {
                success: function (users) {
                  users.set('nickName', e.detail.value.changeNick);  // attempt to change username
                  users.save(null, {
                    success: function (user) {
                      wx.setStorageSync('my_nick', e.detail.value.changeNick);
                      that.setData({
                        userName: that.data.inputValue,
                        isModifyNick: false,
                        isdisabled: false,
                        modifyLoading: false
                      })
                      common.dataLoading("修改昵称成功", "success");

                    },
                    error: function (error) {
                      common.dataLoading(res.data.error, "loading");
                      that.setData({
                        isModifyNick: false,
                        isdisabled: false,
                        modifyLoading: false,
                        nickName: that.data.userName
                      })
                    }
                  });
                }
              });
            }, function(error) {
              console.log(error);
            }
          })
        }

      }
    })

  },
   modifyImg: function () {//修改头像
    //var that = this;
    wx.getStorage({
      key: 'user_id',
      success: function (ress) {
        var key = ress.data
        if (key) {
          wx.showActionSheet({
            itemList: ['相册', '拍照'],
            success: function (res) {
              if (!res.cancel) {
                var sourceType = [];
                if (res.tapIndex == 0) {
                  sourceType = ['album']//从相册选择
                }
                else if (res.tapIndex == 1) {
                  sourceType = ['camera']//拍照
                }
                wx.chooseImage({
                  count: 1, // 默认9
                  sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                  sourceType: sourceType, // 可以指定来源是相册还是相机，默认二者都有
                  success: function (imageResult) {
                    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                    that.setData({
                      upImg: false
                    })
                    var tempFilePaths = imageResult.tempFilePaths;
                    if (tempFilePaths.length > 0) {
                      var name = tempFilePaths;//上传的图片的别名
                      var file = new Bmob.File(name, tempFilePaths);
                      file.save().then(function (resu) {
                        wx.setStorageSync('my_avatar', resu.url());
                        that.setData({
                          upImg: true
                        });
                        var newImge = resu.url();
                        wx.getStorage({
                          key: 'my_username',
                          success: function (ress) {
                            var my_username = ress.data;
                            wx.getStorage({
                              key: 'user_openid',
                              success: function (openid) {
                                var openid = openid.data
                                var user = Bmob.User.logIn(my_username, openid, {
                                  success: function (users) {
                                    users.set('userPic', newImge);  // attempt to change username
                                    users.save(null, {
                                      success: function (user) {
                                        that.setData({
                                          userImg: newImge
                                        })
                                        common.dataLoading("修改头像成功", "success");
                                      }
                                    });
                                  }
                                });
                              }, function(error) {
                                console.log(error);
                              }
                            })
                          }, function(error) {
                            console.log(error);
                          }
                        })
                      }, function (error) {
                        that.setData({
                          upImg: true
                        })
                        common.dataLoading(error, "loading");
                        console.log(error);
                      })
                    }

                  }
                })
              }
            }
          })
        }

      }
    })

  },
})