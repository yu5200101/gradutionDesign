
//获取应用实例
var app = getApp()
var common = require('../template/getCode.js')
var Bmob = require("../../utils/bmob.js");
var Public = Bmob.Object.extend("Public");
var pub = new Bmob.Query(Public);
var that;
var molist = new Array();
var iNow=0
Page({
  data: {
    moodList: [],
    limit: 0,
    init: false,
    length:0,
    loading: false,
    windowHeight: 0,
    windowWidth: 0,
    typetra:['交易类型','想买','想卖'],
    typetraIndex:0
  },
  onLoad: function (options) {
    that = this;
    that.setData({
      loading: false
    })
    setTimeout(function () {
      that.onShow()
    }, 3000);
  },
  onShow: function(){
    that = this
    //判断页面是否是隐藏之后在重新进入的。如果是重新进入则重新读取数据。
    wx.getStorage({
        key: 'user_id',
        success: function (ress) {
          if (ress.data) {
            var isme = new Bmob.User();
            isme.id = ress.data;
            pub.equalTo("publisher", isme.id);
            pub.descending("createdAt");
            pub.limit(4);         
            pub.find({
              success: function (results) {
                that.setData({
                  loading: true
                });
                var molist = new Array();
                for (var i = 0; i < results.length; i++) {
                  console.log(results.length);
                  var jsonA;
                  var title = results[i].get("title");
                  var content = results[i].get("content");
                  var dorm = results[i].get("dorm");
                  var price = results[i].get("price");
                  var typetraIndex = results[i].get("typetraIndex");
                  var colleges = results[i].get("college");
                  var isDonate = results[i].get("isDonate");
                  var isdonCon = results[i].get("isdonCon");
                  var id = results[i].id;
                  var created_at = results[i].createdAt;
                  var _url;
                  var pic = results[i].get("pic");
                  if (pic) {
                    jsonA = '{"title":"' + title + '","content":"' + content + '","id":"' + id + 
                    '","created_at":"' + created_at + '","attachment":"' + pic._url + '","dorm":"'+dorm + 
                    '","price":"'+price + '","typetraIndex":"'+ typetraIndex +
                    '","isDonate":"'+ isDonate +  '","isdonCon":"'+ isdonCon + '","college":"'+ colleges + '"}'
                  }
                  else {
                    jsonA = '{"title":"' + title + '","content":"' + content + '","id":"' + id + 
                    '","created_at":"' + created_at + '","dorm":"'+dorm  + '","price":"'+price + 
                    '","typetraIndex":"'+ typetraIndex +
                    '","isDonate":"'+ isDonate +  '","isdonCon":"'+ isdonCon + '","college":"'+ colleges + '"}'
                  }
                  var jsonB = JSON.parse(jsonA);
                  molist.push(jsonB)
                }
                that.setData({
                  moodList: molist,
                  loading: true
                })
                console.log(that.data.moodList)
              },
              error: function (error) {
                common.dataLoading(error, "loading");
                that.setData({
                  loading: true
                })
                console.log(error)
              }
            });
          }
        }
      })
      wx.getSystemInfo({
        success: (res) => {
          that.setData({
            windowHeight: res.windowHeight,
            windowWidth: res.windowWidth
          })
        }
      })  
  },
  pullUpLoad: function (e) {
    var limit = this.data.limit+2;
    that.setData({
      limit: limit
    })
    this.onShow()
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }

})
