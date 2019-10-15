<template>
    <div class="zhongchoudindan-page">
        <ComHeaderbar text="众筹"></ComHeaderbar>
        <div class="main">
            <div class="swiper-container" id="swiper-container2">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" :class="{'active' : tabActive == 0}">
                        <span>我的众筹</span>
                    </div>
                    <div class="swiper-slide" :class="{'active' : tabActive == 1}">
                        <span>我的关注</span>
                    </div>
                </div>
            </div>
            <div class="swiper-container" id="swiper-container3">
                <div class="swiper-wrapper" id="home-swiper-wrapper">
                    <div class="swiper-slide">
                        <ul class="dindan-list" v-if="orderList.length != 0">
                            <li v-for="(item,index) in orderList">
                                <div class="ct-top">
                                    <p>订单编号：{{item.ordersn}}</p>
                                    <i class="icon" v-if="item.status == 0" @click="removeDindan(item.id)"></i>
                                </div>
                                <div class="content" @click="$router.push('zcorderdetails?oid=' + item.ordersn)">
                                    <div class="img-wrap">
                                        <ImgTag :url="imgUrl + item.pic" :key="index" />
                                        <div>
                                            <h3>{{item.title}}</h3>
                                            <h4>{{item.vs}}</h4>
                                            <h3>¥{{item.payment}}</h3>
                                        </div>
                                    </div>
                                    <span>{{item.sta}}</span>
                                </div>
                                <div class="btn-wrap clearfix">
                                    <a href="javascript:;" v-if="item.status == 0" style="color: #c33;border-color: #c33" @click="$router.push('payment?back=1&oid=' + item.ordersn)">立即支付</a>
                                    <a href="javascript:;" v-if="item.status == 2" @click="ConfirmationCollect(item.ordersn)">确认收货</a>
                                    <a href="javascript:;" v-if="item.status == 2" @click="$router.push('logistics?oid=' + item.ordersn)">追踪物流</a>
                                    <a href="javascript:;" @click="$router.push('zcdetails?id=' + item.iscfid)">众筹详情</a>
                                    <a href="javascript:;" @click="$router.push('zcorderdetails?oid=' + item.ordersn)">订单详情</a>
                                </div>
                            </li>
                        </ul>
                        <div class="empty" v-if="orderList.length == 0">
                            <img src="../../assets/images/icon/empty_dindan.png" alt="">
                            <span>暂无订单</span>
                        </div>
                    </div>
                    <div class="swiper-slide">
                        <ul class="follow-list" v-if="followdata">
                            <li v-for="item in followdata" @click="$router.push('zcdetails?id=' + item.id)">
                                <div class="ctn-l">
                                    <ImgTag :url="imgUrl + item.pic" />
                                </div>
                                <div class="ctn-r">
                                    <h3>{{item.title}}</h3>
                                    <h4>¥<span>{{item.price}}</span>起</h4>
                                    <div class="progressbar">
                                        <yd-progressbar type="line" :progress="item.schedule > 1 ? 1 : item.schedule" trail-width="4" trail-color="#c33"></yd-progressbar>
                                        <span class="value">{{(item.schedule * 100).toFixed()}}%</span>
                                    </div>
                                    <div class="participation">
                                        <span><i></i>{{item.people}}人已支持</span>
                                        <a href="javascript:;">支持项目</a>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div class="empty" v-if="followdata.length == 0">
                            <img src="../../assets/images/icon/empty_dindan.png" alt="">
                            <span>还没有关注任何东西</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import GoodList from '../common/goodslist_component';
export default {
    data() {
        return {
            tabActive: 0,
            orderList: [],
            followdata: []
        }
    },
    mounted() {
        var that = this;
        var mySwiper2 = new Swiper('#swiper-container2',{
            watchSlidesProgress : true,
            watchSlidesVisibility : true,
            slidesPerView : 2,
            onTap: function(){
                mySwiper3.slideTo( mySwiper2.clickedIndex)
                that.tabActive = mySwiper2.clickedIndex;
            }
        })

        var mySwiper3 = new Swiper('#swiper-container3',{
            // resistanceRatio : 0,
            passiveListeners : false,
            threshold : 80,
            onSlideChangeStart: function(){
                mySwiper2.slideTo(mySwiper3.activeIndex)
                that.tabActive = mySwiper3.activeIndex;
            }

        })

        this.setHeight("home-swiper-wrapper");

        this.getOrderList();
    },
    methods: {
        getOrderList() {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "CrowdFundingOrderList"
            }).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    this.orderList = data.data;
                    this.followdata = data.followdata;
                }else {
                    this.orderList = [];
                    this.followdata = [];
                }
            })
        },
        /**
         * 删除订单
         * 
         * @param    id    订单号
         */
        removeDindan(id) {
            this.$dialog.confirm({
                title: '提示',
                mes: '确定删除此订单？',
                opts: () => {
                    this.$http.post(this.apiUrl,{
                        code: "deleteOrder",
                        id: id
                    }).then((data) => {
                        if(data.ztm == 1) {
                            this.getOrderList();
                        }
                        this.$dialog.toast({
                            mes: data.msg
                        })
                    })
                }
            });
        },
        /**
         * 订单确认收货
         * 
         * @param    oid    订单号
         */
        ConfirmationCollect(oid) {
            this.$dialog.confirm({
                title: '提示',
                mes: '确定货品已收到？',
                opts: () => {
                    this.$store.commit("openWait");
                    this.$http.post(this.apiUrl,{
                        code: "ConfirmationCollect",
                        ordersn: oid
                    }).then((data) => {
                        console.log(data);
                        if(data.ztm == 1) {
                            this.getOrderList();
                        }
                        this.$dialog.toast({
                            mes: data.msg
                        })
                    })
                }
            })
        },
    },
    components: {
        GoodList
    }
}
</script>

<style lang="less">
.zhongchoudindan-page {
    display: flex;
    flex-direction: column;
    .com-headerbar {
        h2 {
            border: none;
        }
        .other {
            background: url("../../assets/images/icon/search_icon.png") no-repeat center;
            background-size: 50%;
        }
    }
    .main {
        flex: 1;
        display: flex;
        flex-direction: column;
        #swiper-container2 {
            width: 100%;
            overflow: hidden;
            background-color: #fafafa;
            border-bottom: 1px solid #d5d5d5;
            .swiper-slide {
                text-align: center;
                span {
                    display: inline-block;
                    padding: 0 .1rem;
                    line-height: .6rem;
                    border-bottom: .04rem solid transparent;
                }
                &.active {
                    span {
                        border-color: #c33;
                        color: #c33;
                    }
                }
            }
        }
        #swiper-container3 {
            width: 100%;
            overflow: hidden;
            flex: 1;
            .swiper-slide {
                height: 100%;
                text-align: center;
                overflow-y: auto;
                .dindan-list {
                    li {
                        border-left: .2rem solid #fff;
                        background-color: #fff;
                        margin-top: .2rem;
                        .ct-top {
                            display: flex;
                            border-bottom: 1px solid #d5d5d5;
                            p {
                                flex: 1;
                                font-size: .28rem;
                                line-height: .88rem;
                                text-align: left;
                                padding-right: .2rem;
                            }
                            .icon {
                                width: .88rem;
                                height: .88rem;
                                background: url("../../assets/images/icon/delete_icon.png") no-repeat center;
                                background-size: 40%;
                            }
                        }
                        .content {
                            display: flex;
                            align-items: center;
                            padding-right: .2rem;
                            border-bottom: 1px solid #d5d5d5;
                            .img-wrap {
                                flex: 1;
                                img {
                                    float: left;
                                    width: 1.5rem;
                                    height: 1.5rem;
                                    margin: .2rem .2rem .2rem 0;
                                }
                                div {
                                    float: left;
                                    max-width: 3.5rem;
                                    padding-top: .6rem;
                                    font-size: .25rem;
                                    overflow: hidden; 
                                    text-align: left;
                                    h3 {
                                        white-space: nowrap;
                                        text-overflow: ellipsis;
                                        overflow: hidden; 
                                        s {
                                            display: inline-block;
                                            padding-left: .2rem;
                                            color: #999;
                                        }
                                    }
                                    h4 {
                                        font-weight: normal;
                                        padding-top: .1rem;
                                        white-space: nowrap;
                                        text-overflow: ellipsis;
                                        overflow: hidden;
                                    }
                                }
                            }
                            span {
                                color: #c33;
                            }
                        }
                        .btn-wrap {
                            padding: .2rem;
                            a {
                                float: right;    
                                padding: .1rem .2rem;
                                border: 1px solid #999;
                                margin: 0 .1rem;
                                border-radius: .05rem;
                            }
                        }
                    }
                }
                .empty {
                    img {
                        display: block;
                        width: 2.8rem;
                        margin: 2rem auto .3rem;
                    }
                    span {
                        color: #a9a9a9;
                    }
                }
                .follow-list {
                    background-color: #fff;
                    li {
                        display: flex;
                        padding: .3rem;
                        text-align: left;
                        .ctn-l {
                            width: 2.1rem;
                            height: 2.1rem;
                            border-radius: .1rem;
                            overflow: hidden;
                            background-color: #f9f9f9;
                            img {
                                display: block;
                                width: 100%;
                                height: 100%;
                            }
                        }
                        .ctn-r {
                            flex: 1;
                            padding-left: .3rem;
                            overflow: hidden;
                            h3 {
                                font-size: .28rem;
                                line-height: .6rem;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                overflow: hidden;
                            }
                            h4 {
                                font-size: .26rem;
                                color: #c33;
                                span {
                                    font-size: .34rem;
                                }
                            }
                            .progressbar {
                                .yd-progressbar {
                                    display: inline-block;
                                    width: 80%;
                                }
                                .value {
                                    display: inline-block;
                                    font-size: .28rem;
                                    padding-left: .1rem;
                                    color: #c33;
                                }
                            }
                            .participation {
                                display: flex;
                                margin-top: .1rem;
                                span {
                                    flex: 1;
                                    align-self: center;
                                    font-size: .28rem;
                                    i {
                                        display: inline-block;
                                        width: .4rem;
                                        height: .4rem;
                                        background: url("../../assets/images/icon/crowd_icon.png") no-repeat center;
                                        background-size: cover;
                                        vertical-align: bottom;
                                    }
                                }
                                a {
                                    color: #c33;
                                    display: inline-block;
                                    border: 1px solid #c33;
                                    padding: .1rem .2rem;
                                    font-size: .28rem;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
