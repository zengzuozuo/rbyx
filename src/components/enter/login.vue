<template>
    <div class="login-page">
        <header>
            <a class="icon" href="javascript:;" @click="closePage"></a>
            <h2></h2>
            <a class="btn" href="#/register">注册</a>
        </header>
        <div class="main">
            <div id="content-wrap">
                <div class="logo">
                    <ImgTag url="static/images/rbyx_logo.png"/>
                </div>
                <div class="swiper-container" id="login-swiper">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide" v-for="item in pageData">
                            <ImgTag :url="imgUrl + item" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <footer>
            <yd-button size="large" bgcolor="#c33" @click.native="phoneLogin" color="#fff">手机号登录</yd-button>
            <ul>
                <li @click="authLogin('weixin')" v-show="isWX">
                    <img src="../../assets/images/icon/wx_icon2.png" />
                    <span>微信</span>
                </li>
                <li @click="authLogin('qq')">
                    <img src="../../assets/images/icon/qq_icon2.png" />
                    <span>QQ</span>
                </li>
                <li @click="authLogin('sinaweibo')">
                    <img src="../../assets/images/icon/wb_icon2.png" />
                    <span>微博</span>
                </li>
            </ul>
        </footer>
    </div>
</template>

<script>
export default {
    data() {
        return {
            mySwiper: null,
            auths: null,   //第三方登录通道
            isWX: true,
            pageData: [],
        }
    },
    mounted() {
        this.mySwiper = new Swiper('#login-swiper', {
            autoplay: 5000,
            effect : 'fade',
            fade: {
                crossFade: false,
            },
            autoplayDisableOnInteraction: false
        })

        this.getOuths();
        this.getData();

        this.setHeight("content-wrap");  //动态设置元素高度
    },
    methods: {
		getOuths() { //获取第三方登录服务
			var that = this;
			try{
				plus.oauth.getServices( function(services){
					that.auths = services;
				}, function(e){
                    that.$dialog.alert({mes: "获取登录设备失败"})
				} );
				//检测是否安装微信
				if(plus.runtime.isApplicationExist({pname:'com.tencent.mm',action:'weixin://'})){
					that.isWX = true;
				}else{
					that.isWX = false;
				}
			}catch(e){
				
			}
		},
        authLogin(type){  //第三方登录
            this.$store.commit("openWait");
			var that = this;
			var s = null;
			that.auths.forEach(function(value,index){
				if(value.id == type){
					s = value;
				}
			})
			if(s){		
				s.login( function(e){
					var result = e.target.authResult;
                    var unionid = result.unionid;
                    if(type == "weixin") {
                        if(unionid) {
                            that.login(result.openid,type,unionid);
                        }else {
                            s.getUserInfo( function(e){
                                that.login(result.openid,type,s.userInfo.unionid);
                            }, function(e){
                                that.$dialog.alert({mes: "登录失败,unionid无法获取"});
                                that.$store.commit("closeWait")
                            } );
                        }
                    }else {
                        that.login(result.openid,type,unionid);
                    }
                    
				}, function(e){
                    that.$dialog.alert({mes: "登录失败"});
                    that.$store.commit("closeWait")
				} );
			}else {
				plus.nativeUI.toast("未检测到相关应用");
                this.$store.commit("closeWait")
			}
        },
        closePage() {
            if(this.$route.query.back) {
                this.$router.goBack(-1);
            }else {
                this.$router.push("home");
            }
        },
        phoneLogin() {
            if(this.$route.query.back) {
                this.$router.push('phonelogin?back=1');
            }else {
                this.$router.push('phonelogin');
            }
        },
        login(openid,type,unionid) {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "dologin",
                openid: openid,
                unionid: unionid,
                type: type
            }).then((data) => {
                console.log(data);
                switch(data.ztm) {
                    case 1: 
                        this.$dialog.toast({
                            mes: data.msg,
                            timeout: 1500,
                            icon: 'success',
                            callback: () => {
                                if(this.$route.query.back) {
                                    this.$router.goBack(-1);
                                }else {
                                    this.$router.push("home");
                                }
                            }
                        })
                        localStorage.setItem("zzz",data.tokenID);
                        try{
                            plus.storage.setItem("zzz",data.tokenID);
                        }catch(err) {}
                        break;
                    case 2:
                        break;
                    case 3: 
                        // 绑定手机号
                        if(this.$route.query.back) {
                            this.$router.push('bindphone?back=1&openid=' + data.openid + "&typea=" + data.typea + "&unionid=" + unionid);
                        }else {
                            this.$router.push('bindphone?openid=' + data.openid + "&typea=" + data.typea + "&unionid=" + unionid);
                        }
                        break;
                    default:
                        this.$dialog.toast({
                            mes: data.msg,
                            icon: 'error',
                        })
                }
            })
        },
        getData() {
            this.$http.post(this.apiUrl, {
                code: "loginpag"
            }).then((data) => {
                console.log(data)
                if(data.ztm == 1) {
                    this.pageData = data.data;
                    setTimeout(() => {
                        this.mySwiper.update();
                    },300)
                }
            })
        }
    }
}
</script>

<style lang="less">
.login-page {
    display: flex;
    flex-direction: column;
    background-color: #fafafa;
    height: 100%;
    overflow: hidden;

    header {
        display: flex;
        background-color: #fafafa;
        height: .88rem;
        .icon {
            width: .88rem;
            background: url("../../assets/images/icon/close_icon.png") no-repeat center;
            background-size: 50%;
        }
        .btn {
            color: #707070;
            line-height: .88rem;
            padding: 0 .2rem;
            font-size: .3rem;
            font-weight: bold;
        }
        h2 {
            flex: 1;
        }
    }
    .main {
        flex: 1;
        overflow: hidden;
        .logo {
            height: 30%;
            overflow: hidden;
            padding: .5rem 0;
            img {
                display: block;
                height: 100%;
                margin: 0 auto;
            }
        }
        .swiper-container {
            height: 60%;
            width: 80%;
            margin: 0 auto;
            .swiper-slide {
                img {
                    width: 100%;
                    height: 100%;
                    background-color: #fafafa;
                }
            }
        }
    }
    footer {
        .yd-btn-block  {
            width: 95%;
            height: 1rem;
            margin: 0 auto;
        }
        ul {
            display: flex;
            justify-content: center;
            margin: .8rem 0 .4rem;
            li {
                padding: 0 .3rem;
                border-right: 1px solid #707070;
                &:last-child {
                    border: none;
                }
                img {
                    width: .5rem;
                    vertical-align: middle;
                }
                span {
                    color: #707070;
                    vertical-align: middle;
                }
            }
        }
    }
}    
</style>