var that;
var Bmob=require("../../utils/bmob.js");
Page({
	data: {
		comments:[],
		lastid:0,
    moreHidden:'none'
	},
  onLoad:function(options){
    that = this;

    that.setData({    
      good_id: options.id    
    }) 
    //查询评价详情
    var good_id = this.data.good_id;
    console.log(good_id);
    var good_comment = Bmob.Object.extend("good_comment");
    var query = new Bmob.Query(good_comment);
    query.equalTo("good_id",good_id);
    query.descending("createdAt"); //降序排列
    query.include("publisher");
    query.find({
      success:function(result){
        var commentDetail = new Array();
        for(var i = 0; i<result.length;i++){
          var object = result[i];
          var t = {
            goodPic:object.get('goodPic')._url,
            content:object.get('content'),
            createdAt:object.createdAt,
            userNick:object.get('publisher').get('nickName'),
            userPic: object.get('publisher').get('userPic')
          }
          commentDetail.push(t);
        }
        console.log(commentDetail);
        that.setData({
            commentList:commentDetail
          })

      },
      error:function(error){
        console.log(error);
      }
    })   
  },
	
})
