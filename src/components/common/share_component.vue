<template>
    <div class="share-component">
        <ul>
            <li class="" @click="getServices('qq')">
                <img src="../../assets/images/icon/qicq_icon.png" />
                <span>腾讯QQ</span>
            </li>
            <li class="" @click="getServices('weixin')">
                <img src="../../assets/images/icon/wx_icon.png" />
                <span>微信</span>
            </li>
            <li class="" @click="getServices('pengyouquan')">
                <img src="../../assets/images/icon/pyq_icon.png" />
                <span>朋友圈</span>
            </li>
            <li class="" @click="getServices('sinaweibo')">
                <img src="../../assets/images/icon/wb_icon.png" />
                <span>微博</span>
            </li>
        </ul>
        <div class="close-btn" @click="$store.state.shareIsShow = false">
            <img src="../../assets/images/icon/close_icon_white.png" />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        shareSendObj: {
            type: Object,
            default: function() {
                return {
                    title : "融博优选",
                    content : "【融博优选】为您提供优质的购物体验",
                    href : "https://scapp.szrbht.com/storeother/share/re_download.html?uid=" + localStorage.getItem("uid"),
                    pictures : "",
                }
			}
        }
    },
    data() {
        return {
            shares : {},    //分享通道列表
        }
    },
    mounted() {
        var that = this;
    },
    methods: {
        getServices(type) {
        	var that = this;
        	try{			
				plus.share.getServices( function(s){
					s.forEach(function(value, index){
						that.shares[value.id] = value;
                    })
                    that.shareAction(type);
				}, function(e){
					plus.nativeUI.alert( "获取分享服务列表失败", function(){
					}, "提示", "关闭" );
				} );
			}catch(err) {
                this.$store.state.shareIsShow = false;
				this.$dialog.toast({mes: "当前环境暂不支持"})
			}
       },
       shareAction(type) {   //点击分享
			
			var that = this;
			var s = null;
			switch(type){
				case "weixin":    //分享到微信
					that.shareSendObj.extra = {};
					that.shareSendObj.extra.scene = "WXSceneSession";
					s = that.shares.weixin;
				break;        
				case "pengyouquan":    //分享到朋友圈
					that.shareSendObj.extra = {};
					that.shareSendObj.extra.scene = "WXSceneTimeline";
					s = that.shares.weixin;
				break;
				case "sinaweibo":    //分享到新浪微博
					delete that.shareSendObj.extra;
					s = that.shares.sinaweibo;
				break;
				case "qq":    //分享到QQ
					delete that.shareSendObj.extra;
					s = that.shares.qq;
				break;
				default :
					s = that.shares.weixin;
			}
			
			if ( !s ) {
				plus.nativeUI.alert( "未安装相应软件", function(){
				}, "提示", "关闭" );
				return;
			}
			if ( s.authenticated ) {
				this.shareMessage( s );
			} else {
				s.authorize( that.shareMessage, function(e){
					plus.nativeUI.alert( "未进行认证", function(){
					}, "提示", "关闭" );
				});
			}
		},
		shareMessage(s){    //发送分享
			var that = this;
			s.send( that.shareSendObj, function(){
				plus.nativeUI.alert( "分享成功！", function(){
				}, "提示", "关闭" );
			}, function(e){
				plus.nativeUI.alert( "分享失败！", function(){
				}, "提示", "关闭" );
			} );
		}
    }
}
</script>

<style lang="less">
.share-component {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 121215;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.7);
    ul {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        margin-top: 30%;

        li {
            width: 40%;
            text-align: center;
            margin-top: .4rem;
            img {
                width: 1.5rem;
                display: block;
                margin: .2rem auto;
            }
            span {
                color: #fff;
            }
        }
    }
    .close-btn {
        position: absolute;
        bottom: 10%;
        left: 0;
        width: 100%;
        img {
            display: block;
            width: .8rem;
            margin: 0 auto;
        }
    }
}
</style>