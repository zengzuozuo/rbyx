<template>
    <div class="my-component" ref="main" id="my-component">
        <header v-if="pageData">
            <ImgTag class="userlogo" :url="appImgUrl + pageData.data.avatar"  @click.native="$router.push('mycenter')" />
            <div class="text-info">
                <p @click="$router.push('mycenter')">{{pageData.data.username}}</p>
                <div>
                    <span>
                        <img src="../../../assets/images/icon/vip1_icon.png" />
                    </span>
                    <router-link tag="span" to="/integral">每日签到＞</router-link>
                </div>
            </div>
            <div class="qrcode">
                <img src="../../../assets/images/icon/qrcode_icon.png" @click="$router.push('invite')" />
            </div>
        </header>
        <div class="main" v-if="pageData">
            <div class="dindan-mdl">
                <yd-cell-item arrow type="a" href="javascript:;" @click.native="$router.push('dindan')">
                    <span slot="left">我的订单</span>
                    <span slot="right"></span>
                </yd-cell-item>
                <ul>
                    <router-link tag="li" :to="{path: 'dindan',query: {active: 1}}">
                        <img src="../../../assets/images/icon/dfk_icon.png" />
                        <span>待付款</span>
                    </router-link>
                    <router-link tag="li" :to="{path: 'dindan',query: {active: 2}}">
                        <img src="../../../assets/images/icon/dfh_icon.png" />
                        <span>待发货</span>
                    </router-link>
                    <router-link tag="li" :to="{path: 'dindan',query: {active: 3}}">
                        <img src="../../../assets/images/icon/yfh_icon.png" />
                        <span>已发货</span>
                    </router-link>
                    <router-link tag="li" :to="{path: 'dindan',query: {active: 4}}">
                        <img src="../../../assets/images/icon/dpj_icon.png" />
                        <span>待评价</span>
                    </router-link>
                    <router-link tag="li" to="aftersales">
                        <img src="../../../assets/images/icon/sh_icon.png" />
                        <span>退换/售后</span>
                    </router-link>
                </ul>
            </div>
            <div class="share-link" v-if="pageData.systemdata.activitystatus == 1" @click="$router.push('shoutu')">
                <img class="img-left" src="../../../assets/images/icon/hb_icon.png">
                <div>
                    <p>{{pageData.systemdata.title}}</p>
                    <p>{{pageData.systemdata.desc}}</p>
                </div>
                <img class="arrow" src="../../../assets/images/icon/arrow_go_black.png">
            </div>
            <yd-slider autoplay="3000" v-if="pageData">
                <yd-slider-item v-for="item,index in pageData.activitydata" :key="index">
                    <a href="javascript:;" @click="$store.commit('openUrl',item.url + '?id=' + item.id)">
                        <img :src="imgUrl + item.pic" />
                    </a>
                </yd-slider-item>
            </yd-slider>
            <div class="server-mdl">
                <h2>我的服务</h2>
                <ul>
                    <router-link tag="li" to="pintuan">
                        <img src="../../../assets/images/icon/tuan_icon.png" />
                        <span>拼团订单</span>
                        <i></i>
                    </router-link>
                    <router-link tag="li" to="zhongchoudindan">
                        <img src="../../../assets/images/icon/zcdd_icon.png" />
                        <span>众筹订单</span>
                        <i></i>
                    </router-link>
                    <li @click="$router.push('shoutu')">
                        <img src="../../../assets/images/icon/yqhy_icon.png" />
                        <span>邀请好友</span>
                        <i></i>
                    </li>
                    <router-link tag="li" to="income">
                        <img src="../../../assets/images/icon/purse_icon.png" />
                        <span>我的收入</span>
                        <i></i>
                    </router-link>
                    <!-- <router-link to="redpacket" tag="li">
                        <img src="../../../assets/images/icon/hb_icon.png" />
                        <span>红包</span>
                        <i></i>
                    </router-link> -->
                    <!-- <li @click="$store.commit('undone')">
                        <img src="../../../assets/images/icon/yxg_icon.png" />
                        <span>优先购</span>
                        <i></i>
                    </li> -->
                    <!-- <li @click="$store.commit('undone')">
                        <img src="../../../assets/images/icon/lpk_icon.png" />
                        <span>礼品卡</span>
                        <i></i>
                    </li> -->
                    <!-- <router-link tag="li" to="vipclub">
                        <img src="../../../assets/images/icon/hyjlb_icon2.png" />
                        <span>会员俱乐部</span>
                        <i></i>
                    </router-link> -->
                    <router-link tag="li" to="/integral">
                        <img src="../../../assets/images/icon/ji_icon.png" />
                        <span>积分中心</span>
                        <i></i>
                    </router-link>
                    <!-- <li @click="$store.commit('undone')">
                        <img src="../../../assets/images/icon/zuanshi_icon.png" />
                        <span>我的好物</span>
                        <i></i>
                    </li> -->
                    <router-link tag="li" to="discountcoupon">
                        <img src="../../../assets/images/icon/yhq_icon.png" />
                        <span>优惠券</span>
                        <i></i>
                    </router-link>
                    <router-link tag="li" to="/footprint">
                        <img src="../../../assets/images/icon/zuji_icon.png" />
                        <span>足迹</span>
                        <i></i>
                    </router-link>
                    <router-link tag="li" to="favorite">
                        <img src="../../../assets/images/icon/collect_icon.png" />
                        <span>收藏</span>
                        <i></i>
                    </router-link>
                </ul>
                <ul>
                    <router-link tag="li" to="address">
                        <img src="../../../assets/images/icon/address_icon.png" />
                        <span>地址</span>
                        <i></i>
                    </router-link>
                    <li @click="tel">
                        <img src="../../../assets/images/icon/kefu_icon.png" />
                        <span>客服</span>
                        <i></i>
                    </li>
                    <li @click="$store.commit('openUrl',webh5 + '/help/help_center.html')">
                        <img src="../../../assets/images/icon/help_icon.png" />
                        <span>帮助</span>
                        <i></i>
                    </li>
                    <router-link tag="li" to="set">
                        <img src="../../../assets/images/icon/set_icon.png" />
                        <span>设置</span>
                        <i></i>
                    </router-link>
                </ul>
            </div>
            <yd-popup class="ad-box" v-model="adBox" position="center" width="90%">
                <ImgTag class="ad-img" v-if="adImg.pic" :url="imgUrl + adImg.pic" @click.native="$store.commit('openUrl', adImg.url)" />
                <img class="close-btn" @click="adBox = false" src="../../../assets/images/icon/close_icon_white.png" alt="" />
            </yd-popup>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pageData: null,
            info: {},
            adBox: false,
            adImg: {}
        }
    },
    methods: {
        getData() {
            try {
                this.info = plus.push.getClientInfo();
            } catch (error) {}
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "getUserinfo",
                cid: this.info.clientid || ""
            }).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    this.pageData = data;
                    localStorage.setItem("userAvatar",data.data.avatar);
                    localStorage.setItem("tuisongstatus",data.data.tuisongstatus);
                    localStorage.setItem("uid",data.data.uid);
                }
            })
        },
        tel() {
            location.href = "tel:" + localStorage.getItem("tel");
        },
        getContentJumpImg() {
            this.$http.post(this.shareApiUrl,{
                code: "contentJumpImg"
            }).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    this.adImg = data.data;
                    this.adBox = true;
                }
            })
        }
    },
    activated() {
        this.getData();
        
        const frompath = sessionStorage.getItem('frompath');
        var dom = this.$refs.main;
        if(frompath == "/set" || frompath == "/address") {
            try{
                dom.scrollTop = sessionStorage.getItem('scrollTop');
            }catch(err) {
                alert(err)
            } 
            
        }
        this.$store.commit("showUrl");  //恢复显示webview

        if(sessionStorage.getItem("MYAD") == "true") {
            this.getContentJumpImg();
            sessionStorage.setItem("MYAD", "false");
        }else {
            this.adBox = false;
        }
    },
    deactivated() {
        sessionStorage.setItem('scrollTop', this.$refs.main.scrollTop);
    }
}
</script>

<style lang="less">
.my-component {
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    header {
        display: flex;
        background: #000 url("../../../assets/images/my_bg.jpg") no-repeat center;
        background-size: cover;
        color: #fff;
        padding: .64rem .32rem;
        .userlogo {
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 50%;
        }
        .text-info {
            flex: 1;
            margin-left: .3rem;
            p {
                font-size: .4rem;
                line-height: .85rem;
            }
            div {
                span {
                    display: inline-block;
                    background-color: #b4a078;
                    padding: .05rem .1rem;
                    border-radius: .05rem;
                    font-size: .28rem;
                    img {
                        width: .3rem;
                        height: .3rem;
                    }
                }
            }
        }
        .qrcode {
            img {
                margin-top: .34rem;
                width: .82rem;
                height: .82rem;
            }
        }
    }
    .main {
        .dindan-mdl {
            background-color: #fff;
            ul {
                display: flex;

                li {
                    flex: 1;
                    text-align: center;
                    padding: .25rem 0;
                    img {
                        display: block;
                        margin: 0 auto;
                        width: .6rem;
                        height: .6rem;
                    }
                    span {
                        font-size: .22rem;
                    }
                }
            }
        }
        .server-mdl {
            background-color: #fff;
            h2 {
                font-size: .3rem;
                line-height: 1rem;
                font-weight: normal;
                padding: 0 .28rem;
            }
            ul {
                display: flex;
                flex-wrap: wrap;
                li {
                    text-align: center;
                    width: 25%;
                    padding: .4rem 0;
                    border-top: 1px solid #d6d6d6;
                    img {
                        display: block;
                        width: .5rem;
                        height: .5rem;
                        margin: 0 auto .18rem;
                    }
                }
            }
        }
        .ad-box {
            .yd-popup-center {
                background-color: transparent;
                .yd-popup-content {
                    .ad-img {
                        width: 100%;
                        max-height: 8rem;
                    }
                    .close-btn {
                        display: block;
                        margin: .2rem auto 0;
                        width: .7rem;
                        height: .7rem;
                    }
                }
            }
        }
        .share-link {
            display: flex;
            background-color: #fff;
            margin-top: .2rem;
            padding: .3rem .2rem .3rem .4rem;
            align-items: center;
            .img-left {
                width: .6rem;
                height: .7rem;
            }
            .arrow {
                height: .3rem;
            }
            div {
                flex: 1;
                padding: 0 .35rem;
                overflow: hidden;
                p {
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                    &:nth-child(1) {
                        font-size: .3rem;
                    }
                    &:nth-child(2) {
                        font-size: .24rem;
                        color: #ce201f;
                    }
                }
            }
        }
    }
}
</style>