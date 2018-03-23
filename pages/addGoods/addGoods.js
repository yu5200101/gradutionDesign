var app = getApp()
var Bmob=require("../../utils/bmob.js");
var common = require('../template/getCode.js')
var that;
Page({
	data:{
	    menutype:['商品类型','教育','文艺','小说','生活','童书','科学','经营','动漫'],
        menutypeIndex:0,
        isSuit:['是否套装','是','否'],
        isSuitIndex:0,
        src:"",
        isSrc:false,
        src1:"",
        isSrc1:false,
        src2:"",
        isSrc2:false,
        loading:true,
        autoFocus:true,
        isLoading:false,
        isdisabled:false,
    },
    onLoad:function(){
    	that = this;
    },
	onmenuTypeChange: function (e) {
	    this.setData({
	      menutypeIndex: e.detail.value
	    });
    },
    isSuitChange: function (e) {
	    this.setData({
	      isSuitIndex: e.detail.value
	    });
    },
    uploadPic:function(){//选择图标
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) { 
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({
          isSrc:true,
          src:tempFilePaths
        })
      }
    })
  },
  clearPic:function(){//删除图片
    that.setData({
      isSrc:false,
      src:""
    })
  },

  uploadPic1:function(){//选择图标
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) { 
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({
          isSrc1:true,
          src1:tempFilePaths
        })
      }
    })
  },
  clearPic1:function(){//删除图片
    that.setData({
      isSrc1:false,
      src1:""
    })
  },
  uploadPic2:function(){//选择图标
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) { 
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({
          isSrc2:true,
          src2:tempFilePaths
        })
      }
    })
  },
  clearPic2:function(){//删除图片
    that.setData({
      isSrc2:false,
      src2:""
    })
  },
  sendNewGood: function(e) {//添加商品
    var menu_name=e.detail.value.menu_name;
    var good_number=e.detail.value.good_number;
    var seller_number=e.detail.value.seller_number;
    var price = e.detail.value.price;
    var menutypeIndex = e.detail.value.menutypeIndex;
    var edition = e.detail.value.edition;
    var editDate = e.detail.value.editDate;
    var format = e.detail.value.format;
    var paper = e.detail.value.paper;
    var pack = e.detail.value.pack;
    var isSuitIndex = e.detail.value.isSuitIndex;
    var bookNum = e.detail.value.bookNum;
    var isSuit = "";
    if(isSuitIndex == 1){
    	that.setData({
    		isSuit:"是"
    	})
    }
	if(isSuitIndex == 2){
		that.setData({
			isSuit:"否"
		})
    }
    var parameter = {edition:edition,editDate:editDate,format:editDate,
    paper:paper,pack:pack,isSuit:that.data.isSuit,bookNum:bookNum}
    var relation = "";
    switch(menutypeIndex){
    	case "1":
    	that.setData({
    		relation:"MB3Y555G"
    	});
    	break;
    	case "2":
    	that.setData({
    		relation:"fAhV999J"
    	});
    	break;
    	case "3":
    	that.setData({
    		relation:"zqFU777A"
    	});
    	break;
    	case "4":
    	that.setData({
    		relation:"rnuv444H"
    	});
    	break;
    	case "5":
    	that.setData({
    		relation:"SWUg1115"
    	});
    	break;
    	case "6":
    	that.setData({
    		relation:"Jov4222L"
    	});
    	break;
    	case "7":
    	that.setData({
    		relation:"UZ0zQQQZ"
    	});
    	break;
    	case "8":
    	that.setData({
    		relation:"IvdsLLLX"
    	});
    	break;
    }
    if(menu_name==""){
      common.dataLoading("书名不能为空","loading");
    }
    else{
        that.setData({
          isLoading:true,
          isdisabled:true
        }) 
          var good = Bmob.Object.extend("good");
          var good = new good();
          console.log(good.objectId);
          var good_type = Bmob.Object.extend("good_type");
          var goodType = new good_type();
          goodType.id = that.data.relation;
          good.set("menu_name",menu_name);
          good.set("good_number",good_number);
          good.set("seller_number",seller_number);
          good.set("price",price);
          good.set("menu_type",menutypeIndex);
          good.set("parameter",parameter);
          good.set("is_delete",0);
          good.set("is_rec",0);
          good.set("relation",goodType);
          console.log("111");
          if(that.data.isSrc==true){
              var name=that.data.src;//上传的图片的别名
              var file=new Bmob.File(name,that.data.src);
              file.save();
              good.set("menu_logo",file);
          }
          if(that.data.isSrc1==true){
              var name1=that.data.src1;//上传的图片的别名
              var file1=new Bmob.File(name1,that.data.src1);
              file1.save();
              good.set("pic1",file1);
          }
          if(that.data.isSrc2==true){
              var name2=that.data.src2;//上传的图片的别名
              var file2=new Bmob.File(name2,that.data.src2);
              file2.save();
              good.set("pic2",file2);
          }
          good.save(null, {
            success: function(result) {
              that.setData({
                isLoading:false,
                isdisabled:false
              }) 
              // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
              common.dataLoading("添加商品成功","success",function(){
                  wx.navigateBack({
                      delta: 2
                  })
              });
            },
            error: function(result, error) {
              // 添加失败
              console.log(error)
              common.dataLoading("添加商品失败","loading");
              that.setData({
                isLoading:false,
                isdisabled:false
              }) 
            }  
        })
    }
    
  },
})