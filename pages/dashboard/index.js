var Bmob=require("../../utils/bmob.js");
var that;
Page({
  data: {
    indicatorDots: true,//是否出现焦点  
    autoplay: true,//是否自动播放轮播图  
    interval: 4000,//时间间隔
    duration: 1000,//延时时间
    hiddenModal: true,
    position:"点击定位"
  },

  onLoad: function () {
  },

  get_pos:function(){
    var that = this
    var college = Bmob.Object.extend("college");
    var college = new Bmob.Query(college);
    college.find({
      success:function(result){
        for(var i = 0; i < result.length; i++){
          var table_longitude = result[i].get('longitude');
          var table_latitude = result[i].get('latitude');
          var table_college = result[i].get('college');
          wx.getLocation({
          type: 'gcj02', //返回可以用于wx.openLocation的经纬度
          success: function(res) {
            var current_latitude = res.latitude
            var current_longitude = res.longitude
            console.log("纬度:"+current_latitude+" 经度:"+current_longitude);
             if(current_latitude < (table_latitude+0.5) &&
             current_latitude > (table_latitude-0.5)
             && current_longitude < (table_longitude+0.5)  
             && current_longitude > (table_longitude-0.5)){
              that.setData({
                  position:table_college
                })
            wx.setStorage({
              key:"position",
              data:that.data.position
            })
            }
          }
        })
        }
      },
      error:function(error){
        console.log(error);
      }
    })
    
  },

  onShow: function() {
    that = this;
    //查询出推荐的商品
    var Good = Bmob.Object.extend("good");
    var query = new Bmob.Query(Good);
    query.equalTo("is_rec",1); 
    query.find({
        success: function(result) {
            var goodsArray = new Array();
            for (var i = 0; i < result.length; i++) {
                var object = result[i];
                var class_value = '';
                if(i ==0 || i%2 == 0){
                    //如果是0或者偶数class就为left-box,否则为right-box
                    class_value = 'left-box';
                }else{
                    class_value = 'right-box';
                }
                var t = {menu_logo:object.get('menu_logo'),menu_name:object.get('menu_name'),
                id:object.id,price:object.get('price'),class_value:class_value}
                goodsArray.push(t);
            }
            that.setData({
                goods:goodsArray,
            })
        },
        error: function(error) {
            
        }
    })
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
  more : function(){
       wx.switchTab({
            url: '../type/index'
        })
  }
})
