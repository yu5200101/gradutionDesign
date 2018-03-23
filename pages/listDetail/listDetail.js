
//获取应用实例
var app = getApp()
var that;
var optionId;
var common = require('../template/getCode.js')
var Bmob = require("../../utils/bmob.js");
var commentlist;
Page({
  data: {
    limit: 5,
    showImage: false,
    loading: false,
    isdisabled: false,
    commentLoading: false,
    isdisabled1: false,
    recommentLoading: false,
    commentList: [],
    agree: 0,
    typetra:['交易类型','想买','想卖'],
    typetraIndex:0
  },

  onLoad: function (options) {
    that = this;
    optionId = options.moodId;

  },
  onReady: function () {
    wx.hideToast()

  },
  onShow: function () {
    var myInterval = setInterval(getReturn, 500);
    function getReturn() {
      wx.getStorage({
        key: 'user_id',
        success: function (ress) {
          if (ress.data) {
            clearInterval(myInterval)
            var Public = Bmob.Object.extend("Public");
            var pub = new Bmob.Query(Public);
            pub.equalTo("objectId", optionId);
            pub.include("publisher");
            pub.find({
              success: function (result) {
                var title = result[0].get("title");
                var content = result[0].get("content");
                var dorm = result[0].get("dorm");
                var price = result[0].get("price");
                var typetraIndex = result[0].get("typetraIndex");
                var isDonate = result[0].get("isDonate");
                var isdonCon = result[0].get("isdonCon");
                var college = result[0].get("college");
                var publisher = result[0].get("publisher");
                var agreeNum = result[0].get("likeNum");
                var commentNum = result[0].get("commentNum");
                var liker = result[0].get("liker");
                var created_at = result[0].createdAt;
                var userNick = publisher.get("nickName");
                var objectIds = publisher.id;
                var isPublic;
                var userPic;
                var url;
                if (publisher.get("userPic")) {
                  userPic = publisher.get("userPic");
                }
                else {
                  userPic = null;
                }
                if (result[0].get("pic")) {
                  url = result[0].get("pic")._url;
                }
                else {
                  url = null;
                }
                if (publisher.id == ress.data) {
                  that.setData({
                    isMine: true
                  })
                }
                that.setData({
                  listTitle: title,
                  listContent: content,
                  listDorm:dorm,
                  listPrice:price,
                  listTypetraIndex:typetraIndex,
                  listCollege:college,
                  listPic: url,
                  created_at:created_at,
                  isDonate:isDonate,
                  isdonCon:isdonCon,
                  agreeNum: agreeNum,
                  commNum: commentNum,
                  userPic: userPic,
                  userNick: userNick,
                  objectIds: objectIds,
                  loading: true
                })
                for (var i = 0; i < liker.length; i++) {
                  var isLike = 0;
                  if (liker[i] == ress.data) {
                    isLike = 1;
                    that.setData({
                      agree: isLike
                    })
                    break;
                  }

                }
                that.commentQuery(result[0]);

              },
              error: function (error) {
                // common.dataLoading(error,"loading");
                that.setData({
                  loading: true
                })
                console.log(error)
              }
            });
          }

        }
      })
    }

  },
  changeDonate:function(){
    var isDonate = that.data.isDonate;
    var isdonCon = that.data.isdonCon;
    if (!isDonate) {
      that.setData({
        isDonate: true,
        isdonCon:"已交易"
      })
    }
    else if (isDonate) {
      that.setData({
        isDonate: false,
        isdonCon: "未交易"
      })
    }    
        var Public = Bmob.Object.extend("Public");
        var pub = new Bmob.Query(Public);    
        console.log(optionId);
      // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
          pub.get(optionId,{
            success: function (result) {        
              console.log(result);
              console.log(that.data.isDonate);
              // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
              result.set('isDonate', that.data.isDonate);
              result.set('isdonCon', that.data.isdonCon);
              result.save();
            },
            error: function (object, error) {
              console.log(error);
            }
          });     
},
  commentQuery: function (mood) {
    // 查询评论
    commentlist = new Array();
    var Comments = Bmob.Object.extend("Comments");
    var queryComment = new Bmob.Query(Comments);
    queryComment.equalTo("mood", mood);
    queryComment.include("publisher");
    queryComment.descending("createdAt");
    queryComment.find({
      success: function (result) {
        for (var i = 0; i < result.length; i++) {
          var id = result[i].id;
          var pid = result[i].get("olderComment");
          var uid = result[i].get("publisher").id;
          var content = result[i].get("content");
          var created_at = result[i].createdAt;
          var olderUserName;
          var userPic = result[i].get("publisher").get("userPic");
          var nickname = result[i].get("publisher").get("nickName");
          if (pid) {
            pid = pid.id;
            olderUserName = result[i].get("olderUserName");
          }
          else {
            pid = 0;
            olderUserName = "";
          }
          var jsonA;
          jsonA = '{"id":"' + id + '","content":"' + content + '","pid":"' + pid + '","uid":"' + uid + '","created_at":"' + created_at + '","pusername":"' + olderUserName + '","username":"' + nickname + '","avatar":"' + userPic + '"}';
          var jsonB = JSON.parse(jsonA);
          commentlist.push(jsonB)
          that.setData({
            commentList: commentlist,
            loading: true
          })
        }
      },
      error: function () {
        common.dataLoading("加载完成");
      }
    });

  },
  changeLike: function (event) {//点赞
    var isLike = that.data.agree
    var likeNum = parseInt(this.data.agreeNum)
    if (isLike == "0") {
      likeNum = likeNum + 1;
      that.setData({
        agree: 1,
        agreeNum: likeNum
      })

    }
    else if (isLike == "1") {

      likeNum = likeNum - 1;
      that.setData({
        agree: 0,
        agreeNum: likeNum
      })
    }
    wx.getStorage({
      key: 'user_id',
      success: function (ress) {
        var Public = Bmob.Object.extend("Public");
        var queryLike = new Bmob.Query(Public);
        queryLike.equalTo("objectId", optionId);
        queryLike.find({
          success: function (result) {
            var likerArray = result[0].get("liker");
            var isLiked = false;
            if (likerArray.length > 0) {
              for (var i = 0; i < likerArray.length; i++) {
                if (likerArray[i] == ress.data) {
                  likerArray.splice(i, 1);
                  isLiked = true;
                  result[0].set('likeNum', result[0].get("likeNum") - 1);
                  break;
                }
              }
              if (isLiked == false) {

                likerArray.push(ress.data);
                result[0].set('likeNum', result[0].get("likeNum") + 1);
              }
            }
            else {
              likerArray.push(ress.data);
              result[0].set('likeNum', result[0].get("likeNum") + 1);
            }
            result[0].save();
          },
          error: function (error) {

          }
        });
      }
    })



  },
  changeComment: function () {
    that.setData({
      autoFo: true
    })
  },
  changeFocus: function () {
    that.setData({
      autoFo: true
    })
  },
  toResponse: function (event) {//去回复
    var commentId = event.target.dataset.id;
    var userId = event.target.dataset.uid;
    var name = event.target.dataset.name;
    if (!name) {
      name = "";
    }
    if (userId == wx.getStorageSync('user_id')) {
      common.dataLoading("不能对自己的评论进行回复", "loading");
    }
    else {
      var toggleResponse;
      if (that.data.isToResponse == "true") {
        toggleResponse = false;
      }
      else {
        toggleResponse = true;
      }
      that.setData({
        pid: commentId,
        isToResponse: toggleResponse,
        plaContent: "回复" + name + ":",
        resopneName: name
      })
    }

  },
  hiddenResponse: function () {
    this.setData({
      isToResponse: false
    })
  },
  deleteThis: function () {//删除捐赠
    wx.showModal({
      title: '是否删除该捐赠？',
      content: '删除后将不能恢复',
      showCancel: true,
      confirmColor: "#a07c52",
      cancelColor: "#646464",
      success: function (res) {
        if (res.confirm) {
          // 删除此捐赠后返回上一页
          var Public = Bmob.Object.extend("Public");
          var queryPublic = new Bmob.Query(Public);
          queryPublic.get(optionId, {
            success: function (result) {
              result.destroy({
                success: function (myObject) {
                  // 删除成功
                  common.dataLoading("删除成功", "success", function () {
                    wx.navigateBack({
                      delta: 1
                    })
                  });
                },
                error: function (myObject, error) {
                  // 删除失败
                  console.log(error)
                  // common.dataLoading(error,"loading");
                }
              });
            },
            error: function (object, error) {

            }
          });

        }
        else {
        }
      }
    })
  },
  publishComment: function (e) {//评论书籍
    if (e.detail.value.commContent == "") {
      common.dataLoading("评论内容不能为空", "loading");
    }
    else {
      that.setData({
        isdisabled: true,
        commentLoading: true
      })


      wx.getStorage({
        key: 'user_id',
        success: function (ress) {
          that.setData({
            commentLoading: false
          })
          var queryUser = new Bmob.Query(Bmob.User);
          //查询单条数据，第一个参数是这条数据的objectId值
          queryUser.get(ress.data, {
            success: function (userObject) {
              // 查询成功，调用get方法获取对应属性的值
              var Comments = Bmob.Object.extend("Comments");
              var comment = new Comments();
              var Public = Bmob.Object.extend("Public");
              var pub = new Public();
              pub.id = optionId;
              var me = new Bmob.User();
              me.id = ress.data;
              comment.set("publisher", me);
              comment.set("mood", pub);
              comment.set("content", e.detail.value.commContent);
              if (that.data.isToResponse) {
                var olderName = that.data.resopneName;
                var Comments1 = Bmob.Object.extend("Comments");
                var comment1 = new Comments1();
                comment1.id = that.data.pid;
                comment.set("olderUserName", olderName);
                comment.set("olderComment", comment1);
              }
              //添加数据，第一个入口参数是null
              comment.save(null, {
                success: function (res) {
                  var queryPublic = new Bmob.Query(Public);
                  //查询单条数据，第一个参数是这条数据的objectId值
                  queryPublic.get(optionId, {
                    success: function (object) {
                      object.set('commentNum', object.get("commentNum") + 1);
                      object.save();
                      var isme = new Bmob.User();
                      isme.id = ress.data;
                      var value = wx.getStorageSync('my_avatar')
                      var my_username = wx.getStorageSync('my_username')
                      var Reply = Bmob.Object.extend("reply");
                      var reply = new Reply();
                      var Public = Bmob.Object.extend("Public");
                      var pub = new Public();
                      pub.id = optionId;
                      reply.set("behavior", 3);
                      reply.set("avatar", value);
                      reply.set("username", my_username);
                      reply.set("uid", isme);
                      reply.set("wid", pub);
                      reply.set("is_read", 0);
                      //添加数据，第一个入口参数是null
                      reply.save(null, {
                        success: function (result) {
                          // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
                          console.log("捐赠创建成功, objectId:" + result.id);
                        },
                        error: function (result, error) {
                          // 添加失败
                          console.log('创建捐赠失败');

                        }
                      });

                      that.onShow();
                    },
                    error: function (object, error) {
                      // 查询失败
                    }
                  });
                  that.setData({
                    publishContent: "",
                    isToResponse: false,
                    responeContent: "",
                    isdisabled: false,
                    commentLoading: false
                  })
                },
                error: function (gameScore, error) {
                  common.dataLoading(error, "loading");
                  that.setData({
                    publishContent: "",
                    isToResponse: false,
                    responeContent: "",
                    isdisabled: false,
                    commentLoading: false
                  })
                }
              });

            },
            error: function (object, error) {
              // 查询失败
            }
          });

        }
      })

    }
  },
  bindKeyInput: function (e) {
    this.setData({
      publishContent: e.detail.value
    })
  },
  onHide: function () {
    // Do something when hide.
  },
  onUnload: function (event) {

  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  seeBig: function (e) {
    wx.previewImage({
      current: that.data.listPic, // 当前显示图片的http链接
      urls: [that.data.listPic] // 需要预览的图片http链接列表
    })
  }
})
