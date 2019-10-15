<template>
    <div class="shoutu-page">
        <ComHeaderbar text="邀请伙伴奖励"></ComHeaderbar>
        <div class="main">
            <yd-slider autoplay="3000" v-if="pageData">
                <yd-slider-item v-for="item,index in pageData.data" :key="index">
                    <a href="javascript:;" @click="$store.commit('openUrl',item.url + '?id=' + item.id)">
                        <img :src="imgUrl + item.pic" />
                    </a>
                </yd-slider-item>
            </yd-slider>
            <yd-tab :callback="switcherCallback" v-if="pageData">
                <yd-tab-panel label="邀请伙伴" :active="active == 1" @click="active = 1" class="invite-prentice">
                    <div class="mdl-title">
                        <p>通过以下方式<br />邀请伙伴让您赚更多</p>
                    </div>
                    <ul class="share-list">
                        <li @click="getServices('weixin')">
                            <img src="../../assets/images/icon/wx_icon.png" alt="">
                            <span>微信邀请</span>
                        </li>
                        <li @click="getServices('pengyouquan')">
                            <img src="../../assets/images/icon/pyq_icon.png" alt="">
                            <span>朋友圈邀请</span>
                        </li>
                        <li @click="getServices('qq')">
                            <img src="../../assets/images/icon/qicq_icon.png" alt="">
                            <span>QQ邀请</span>
                        </li>
                        <li @click="getServices('sinaweibo')">
                            <img src="../../assets/images/icon/wb_icon.png" alt="">
                            <span>微博邀请</span>
                        </li>
                        <router-link tag="li" to="invite">
                            <img src="../../assets/images/icon/rwm_icon.png" alt="">
                            <span>面对面邀请</span>
                        </router-link>
                    </ul>
                    <!-- <a href="javascript:;" class="mycode">您的邀请码 A32453214</a> -->
                    <div class="other-btn">
                        <a href="javascript:;" @click="$store.commit('openUrl',webh5 + '/share/share_img.html')"><img src="../../assets/images/icon/gold_icon.png" />晒收入</a>
                        <a href="javascript:;" @click="active = 2;switcher = 2;"><img src="../../assets/images/icon/bell_icon.png" />唤醒伙伴</a>
                    </div>
                    <div class="advantage">
                        <img class="title-img" src="../../assets/images/stdhc.png" alt="" />
                        <p>邀请伙伴加入，拼团、购物 <span>省　省　省</span>，积分兑换礼品 <span>多　多　多</span></p>
                        <ul v-if="pageData">
                            <li v-for="item in pageData.overduedata">
                                <p>{{item.desc}}</p>
                                <a href="javascript:;" @click="$store.commit('openUrl',item.url)">活动详情</a>
                            </li>
                        </ul>
                    </div>
                </yd-tab-panel>
                <yd-tab-panel label="我的伙伴" :active="active == 2" class="my-prentice">
                    <p class="tip">每唤醒1位伙伴，您得<span>1000积分</span>，伙伴获得<span>300积分</span>。</p>
                    <div class="prentice-list-wrap">
                        <div class="switcher">
                            <a href="javascript:;" :class="{'active' : switcher == 1}" @click="switcher = 1">伙伴进贡榜</a>
                            <a href="javascript:;" :class="{'active' : switcher == 2}" @click="switcher = 2">待唤醒伙伴({{pageData.awaken.length}})</a>
                        </div>
                        <div class="list-wrap" v-show="switcher == 1">
                            <div class="tb tb-title">
                                <span>前50</span>
                                <span>昵称</span>
                                <span>用户ID</span>
                                <span>贡献积分</span>
                            </div>
                            <ul>
                                <li class="tb" v-for="item,index in pageData.userApprenticeList">
                                    <span><img v-if="index < 3" :src="'static/images/no' + (index + 1) + '_icon.png'" /><i v-if="index >= 3">{{index + 1}}</i></span>
                                    <span>{{item.username}}</span>
                                    <span>{{item.uid}}</span>
                                    <span>{{item.contributionintegral}}</span>
                                </li>
                            </ul>
                        </div>
                        <div class="list-wrap" v-show="switcher == 2">
                            <div class="tb2 tb-title">
                                <span>昵称</span>
                                <span>手机号</span>
                                <span>操作</span>
                            </div>
                            <ul>
                                <li class="tb2" v-for="item,index in pageData.awaken">
                                    <span>{{item.username}}</span>
                                    <span>{{item.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}}</span>
                                    <span><a href="javascript:;" @click="rouse(item.uid)">唤醒Ta</a></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <a href="javascript:;" class="hxgz" @click="$store.state.popupIsShow = true"></a>
                    
                </yd-tab-panel>
            </yd-tab>
            <yd-popup v-model="$store.state.popupIsShow" class="hxgz-box" position="center" width="90%">
                <img src="static/images/hxtdhd.png" class="hxtdhd" />
                <a href="javascript:;" class="close" @click="$store.state.popupIsShow = false"></a>
                <h3>成功唤醒后本人得<span>1000</span>积分，伙伴得<span>300</span>积分，唤醒伙伴越多，奖励越多</h3>
                <p>
                    什么是成功唤醒？<br />
                    · 本人需点击“唤醒TA”按钮，并通过QQ或微信发送链接给伙伴<br />
                    · 伙伴需点击本人得链接并登录融博优选<br />
                    · 本人点击“唤醒TA”按钮后，分享的链接3天有效<br />
                    · 若伙伴还未回来，3天后需要重新唤醒哦！
                </p>
                <a href="javascript:;" class="ljcy" @click="$store.state.popupIsShow = false">立即参与</a>
            </yd-popup>
            <yd-popup v-model="rouseBox" class="hxhy-box" position="center" width="90%">
                <a href="javascript:;" class="close" @click="rouseBox = false"></a>
                <h3>唤醒好友</h3>
                <p>马上发消息唤醒Ta</p>
                <yd-cell-item>
                    <yd-textarea slot="right" v-model="rouseSendObj.content" placeholder="请输入..." maxlength="100"></yd-textarea>
                </yd-cell-item>
                <p>点击下面的按钮分享给</p>
                <div class="btn-wrap">
                    <a href="javascript:;" @click="getServices('weixin','rouse')">
                        <img src="../../assets/images/icon/wx_icon.png" />
                        <span>微信好友</span>
                    </a>
                    <a href="javascript:;" @click="getServices('qq','rouse')">
                        <img src="../../assets/images/icon/qicq_icon.png" />
                        <span>QQ好友</span>
                    </a>
                </div>
            </yd-popup>
            <div class="fixed-btn" v-show="active == 2">
                <a href="javascript:;" @click="seeTudi">识别伙伴</a>
                <a href="javascript:;" @click="$store.state.shareIsShow = true">立即邀请</a>
            </div>
            <transition-group name="bounce">
                <ShareBox v-show="$store.state.shareIsShow" v-bind:key="1"></ShareBox>
            </transition-group>
        </div>
    </div>
</template>

<script>
import ShareBox from "../common/share_component";
export default {
    data() {
        return {
            switcher: 1,   //1: 徒弟进贡榜  2: 唤醒徒弟
            active: 1,  //
            shares : {},    //分享通道列表
            rouseBox: false,
            pageData: null,
            activePid: "",
            shareSendObj: {
                title : "融博优选",
                content : "【融博优选】注册领红包",
                href : "https://scapp.szrbht.com/app.html",
                pictures : "",
            },
            rouseSendObj: {
                title : "融博优选",
                content : "好友给你送金币了，点击立即领取300金币!",
                href : "http://sc.szrbht.com/public/storeother/share/regression.html",
                pictures : "",
            }
        }
    },
    mounted() {
        this.getData();

        this.$store.commit("showUrl");  //恢复显示webview
    },
    methods: {
        getServices(type,shareType) {
            var that = this;
            // 判断是否为唤醒回归分享
            if(shareType == 'rouse') {
                this.shareSendObj.href = this.webh5 + "/share/regression.html?mid=" + this.pageData.uid + "&pid=" + this.activePid;
                this.shareSendObj.content = this.rouseSendObj.content;
            }else {
                this.shareSendObj.href = this.pageData.url + "?uid=" + this.pageData.uid;   //生成带参分享链接
                this.shareSendObj.content = "【融博优选】注册领红包";
            }
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
        },
        switcherCallback(val) {
            console.log(val)
            if(val == "邀请收徒") {
                this.active = 1;
            }else {
                this.active = 2;
            }
        },
        getData() {
            this.$http.post(this.shareApiUrl,{
                code: "share"
            }).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    this.pageData = data;
                    this.shareSendObj.href = data.url + "?uid=" + data.uid;   //生成带参分享链接
                }
            })
        },
        rouse(pid) {  //唤醒按钮 
            this.rouseBox = true;
            this.activePid = pid;
        },
        seeTudi() {
            this.$dialog.confirm({
                title: '提示',
                mes: '此功能将访问用户手机通讯录信息，确定使用？',
                opts: () => {
                    this.$router.push('contacts');
                }
            });
        }
    },
    components: {
        ShareBox
    }
}
</script>

<style lang="less">
.shoutu-page {
    display: flex;
    flex-direction: column;
    .main {
        flex: 1;
        -webkit-overflow-scrolling: touch;
        overflow-y: scroll;
        background-color: #fff;
        .yd-tab {
            .yd-tab-nav {
                font-weight: bold;
                &:after {
                    display: none;
                }
                .yd-tab-active {
                    color: #f33636;
                    &:before {
                        width: 20%;
                        margin-left: -10%;
                    }
                }
            }
            // 邀请徒弟
            .invite-prentice {
                .mdl-title {
                    position: relative;
                    padding: .4rem 0;
                    text-align: center;
                    p {
                        position: relative;
                        z-index: 2;
                        display: inline-block;
                        line-height: .42rem;
                        font-size: .26rem;
                        padding: 0 .2rem;
                        background-color: #fff;
                    }
                    &:after {
                        content: "";
                        width: 80%;
                        position: absolute;
                        left: 10%;
                        top: .82rem;
                        border-bottom: 1px solid #999;
                    }
                }
                .share-list {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-around;
                    padding: .3rem;
                    li {
                        padding: 0 .3rem;
                        text-align: center;
                        font-size: .26rem;
                        margin-bottom: .3rem;
                        img {
                            display: block;
                            width: 1.16rem;
                            height: 1.16rem;
                            margin-bottom: .2rem;
                        }
                        
                    }
                }
                .mycode {
                    display: inline-block;
                    color: #3c8af2;
                    border: 1px solid #3c8af2;
                    font-size: .24rem;
                    line-height: .7rem;
                    border-radius: .35rem;
                    padding: 0 .3rem;
                    margin: 0 0 .6rem 50%;
                    transform: translateX(-50%);
                }
                .other-btn {
                    display: flex;
                    justify-content: space-around;
                    background-color: #f2f2f2;
                    padding: .22rem 0;
                    a {
                        width: 40%;
                        background-color: #fff;
                        line-height: .8rem;
                        font-size: .28rem;
                        font-weight: bold;
                        text-align: center;
                        border-radius: .4rem;
                        img {
                            width: .56rem;
                            vertical-align: middle;
                            margin-right: .1rem;
                        }
                    }
                }
                .advantage {
                    padding: .45rem .7rem;
                    .title-img {
                        display: block;
                        margin: 0 auto;
                        width: 3.85rem;
                    }
                    p {
                        font-size: .28rem;
                        line-height: .42rem;
                        padding: .24rem 0;
                        span {
                            color: #f93958;
                        }
                    }
                    ul {
                        border-top: 1px solid #999;
                        li {
                            display: flex;
                            p {
                                flex: 1;
                                margin-right: .15rem;
                            }
                            a {
                                align-self: center;
                                margin: 0 .15rem;
                                line-height: .64rem;
                                text-align: center;
                                padding: 0 .3rem;
                                font-size: .26rem;
                                color: #a06511;
                                border-radius: .32rem;
                                background: #ffed37; /* Old browsers */
                                background: -moz-linear-gradient(top, #ffed37 0%, #ffd100 100%); /* FF3.6-15 */
                                background: -webkit-linear-gradient(top, #ffed37 0%,#ffd100 100%); /* Chrome10-25,Safari5.1-6 */
                                background: linear-gradient(to bottom, #ffed37 0%,#ffd100 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
                                filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffed37', endColorstr='#ffd100',GradientType=0 ); /* IE6-9 */
                            }
                        }
                    }
                }
            }
            // 我的徒弟
            .my-prentice {
                .tip {
                    background-color: #f3f3f3;
                    font-size: .26rem;
                    color: #000;
                    padding: .16rem .36rem;
                    border-radius: .2rem;
                    margin: .4rem .2rem;
                    span {
                        font-weight: bold;
                        color: #e90011;
                    }
                }
                .prentice-list-wrap {
                    padding: 0 .36rem;
                    .switcher {
                        display: flex;
                        a {
                            flex: 1;
                            border: 1px solid #fd6766;
                            line-height: .8rem;
                            text-align: center;
                            color: #fd6766;
                            font-size: .3rem;
                            border-radius: .25rem .25rem 0 0;
                            &.active {
                                background-color: #fd6766;
                                color: #fff;
                            }
                        }
                    }
                    .list-wrap {
                        border: 1px solid #fd6766;
                        min-height: 5.5rem;
                        .tb {
                            display: flex;
                            span {
                                text-align: center;
                                padding: .22rem .15rem;
                                font-size: .3rem;
                                color: #000;
                                img {
                                    width: .45rem;
                                    
                                }
                                &:nth-child(1) {
                                    width: 1rem;
                                }
                                &:nth-child(2) {
                                    flex: 1;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    overflow: hidden;
                                }
                                &:nth-child(3) {
                                    flex: 1;
                                }
                                &:nth-child(4) {
                                    width: 1.6rem;
                                }
                            }
                            &.tb-title {
                                background-color: #f5f5f5;
                                span {
                                    color: #adadad;
                                }
                            }
                        }
                        ul {
                            li {
                                &:nth-child(2n + 1) {
                                    background-color: #f8f8f8;
                                }
                            }
                        }
                        .tb2 {
                            display: flex;
                            overflow: hidden;
                            span {
                                align-self: center;
                                text-align: center;
                                padding: .22rem .15rem;
                                font-size: .3rem;
                                color: #000;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                overflow: hidden;
                                img {
                                    width: .45rem;
                                    
                                }
                                &:nth-child(1) {
                                    width: 2.5rem;
                                }
                                &:nth-child(2) {
                                    flex: 1;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    overflow: hidden;
                                }
                                &:nth-child(3) {
                                    width: 2rem;
                                    a {
                                        background-color: #fd6766;
                                        color: #fff;
                                        display: inline-block;
                                        padding: .1rem;
                                        border-radius: .1rem;
                                    }
                                }
                            }
                            &.tb-title {
                                background-color: #f5f5f5;
                                span {
                                    color: #adadad;
                                }
                            }
                        }
                    }
                }
                .hxgz {
                    position: fixed;
                    left: 0;
                    top: 2rem;
                    height: 2.15rem;
                    width: .56rem;
                    background: url("../../../static/images/hxgz.png") no-repeat center;
                    background-size: cover;
                }
                
            }
        }
        .hxgz-box {
            .yd-popup-center {
                border-radius: .2rem;
            }
            .yd-popup-content {
                padding: .3rem;
                overflow-y: inherit;
                .hxtdhd {
                    position: relative;
                    top: -.5rem;
                    display: block;
                    margin: 0 auto;
                    width: 4.2rem;
                    height: .95rem;
                    
                }
                .close {
                    position: absolute;
                    top: .3rem;
                    right: .3rem;
                    width: .6rem;
                    height: .6rem;
                    background: url("../../assets/images/icon/close_icon.png") no-repeat center;
                    background-size: 70%;
                }
                h3 {
                    font-size: .38rem;
                    font-weight: normal;
                    span {
                        color: #fd6766;
                    }
                }
                p {
                    background-color: #f7f7f7;
                    margin: .24rem 0;
                    font-size: .26rem;
                    color: #929292;
                    line-height: .45rem;
                    padding: .23rem;
                }
                .ljcy {
                    display: block;
                    width: 94%;
                    margin: 0 auto .4rem;
                    background-color: #fd6766;
                    line-height: .88rem;
                    color: #fff;
                    text-align: center;
                    font-size: .36rem;
                    border-radius: .44rem;
                }
            }
        }
        .hxhy-box {
            .yd-popup-center {
                border-radius: .2rem;
            }
            .yd-cell-item {
                border: 1px solid #999;
            }
            .yd-popup-content {
                padding: .3rem;
                overflow-y: inherit;
                .hxtdhd {
                    position: relative;
                    top: -.5rem;
                    display: block;
                    margin: 0 auto;
                    width: 4.2rem;
                    height: .95rem;
                    
                }
                .close {
                    position: absolute;
                    top: .3rem;
                    right: .3rem;
                    width: .6rem;
                    height: .6rem;
                    background: url("../../assets/images/icon/close_icon.png") no-repeat center;
                    background-size: 70%;
                }
                h3 {
                    text-align: center;
                    font-size: .4rem;
                    padding-top: .2rem;
                }
                p {
                    margin: .24rem 0;
                    font-size: .26rem;
                    color: #929292;
                    line-height: .45rem;
                    text-align: center;
                }
                .btn-wrap {
                    display: flex;
                    justify-content: space-between;
                    a {
                        width: 45%;
                        line-height: .8rem;
                        border: 1px solid #999;
                        border-radius: .4rem;
                        text-align: center;
                        font-size: .3rem;
                    }
                    img {
                        width: .4rem;
                        vertical-align: middle;
                    }
                }
            }
        }
        .fixed-btn {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            line-height: .94rem;
            color: #f75854;
            font-size: .3rem;
            background-color: #fff;
            border-top: 1px solid #f3f3f3;
            a {
                flex: 1;
                text-align: center;
            }
        }
    }
}
</style>

