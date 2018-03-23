var Bmob=require("../../utils/bmob.js");
var that;
Page({
  data: {

  },

  onLoad: function () {
  },

  onShow: function() {
    that = this;
    //查询出推荐的商品
    var Collect = Bmob.Object.extend("Collect");
    var query = new Bmob.Query(Collect);
    wx.getStorage({
        key: 'user_id',
        success: function (ress) {
          if (ress.data) {
            var isme = new Bmob.User();
            isme.id = ress.data;
            query.equalTo("uid", isme.id);
            query.equalTo("is_col",1);
            query.descending("createdAt");
            query.include("good_id");
            query.find({
                success: function(result) {
                    var goodsArray = new Array();
                    for (var i = 0; i < result.length; i++) {
                        var object = result[i];
                        var t = {menu_logo:object.get('good_id').get('menu_logo'),
                        menu_name:object.get('good_id').get('menu_name'),
                        id:object.get('good_id').id,
                        price:object.get('good_id').get('price')
                      }
                        goodsArray.push(t);
                    }
                    that.setData({
                        goods:goodsArray,
                    })
                },
                error: function(error) {
                    
                }
            })
          }
        }
      });
  },
  more : function(){
       wx.switchTab({
            url: '../type/index'
        })
  }
})
