<template>
    <div class="pintuan-page">
        <ComHeaderbar text="优选拼团"></ComHeaderbar>
        <div class="main">
            <div class="swiper-container" id="swiper-container2">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" :class="{'active' : tabActive == 0}">
                        <span>拼团商品</span>
                    </div>
                    <div class="swiper-slide" :class="{'active' : tabActive == 1}">
                        <span>我的拼团</span>
                    </div>
                </div>
            </div>
            <div class="swiper-container" id="swiper-container3">
                <div class="swiper-wrapper" id="home-swiper-wrapper">
                    <div class="swiper-slide" ref="scrollwrap">
                        <yd-infinitescroll :callback="infiniteLoadList" ref="infinitescroll">
                            <ImgTag class="banner" slot="list" v-if="banner" :url="imgUrl + banner.pic" />
                            <div class="pt-goods" slot="list">
                                <h2>最新推荐</h2>
                                <ul>
                                    <li v-for="item in pageData">
                                        <div class="img-wrap">
                                            <ImgTag class="goods-img" :url="imgUrl + item.pic" @click.native="$router.push('groupongoods?id=' + item.id)" />
                                        </div>
                                        <div class="content">
                                            <p>{{item.title}}</p>
                                            <div class="line clearfix">
                                                <span class="price">¥{{item.minprice}}</span>
                                                <s class="originPrice">单买价¥{{item.price}}</s>
                                                <a href="javascript:;" class="btn w-button w-button-primary" @click="$router.push('groupongoods?id=' + item.id)">去参团</a>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                         </yd-infinitescroll>
                    </div>
                    <div class="swiper-slide" active>
                        <ul class="dindan-list" v-if="orderList.length != 0">
                            <li v-for="(item,index) in orderList">
                                <div class="ct-top">
                                    <p>订单编号：{{item.ordersn}}</p>
                                    <i class="icon" @click="removeDindan(item.id)" v-if="item.status == 0"></i>
                                </div>
                                <div class="content">
                                    <div class="img-wrap">
                                        <ImgTag :url="imgUrl + item.pic" :key="index" />
                                        <div>
                                            <h3>{{item.title}}</h3>
                                            <h4>{{item.specifications}}</h4>
                                            <h3>¥{{item.price}}<s>¥{{item.originalprice}}</s></h3>
                                        </div>
                                    </div>
                                    <span>{{item.sta}}</span>
                                </div>
                                <div class="btn-wrap clearfix">
                                    <a href="javascript:;" style="color: #c33;border-color: #c33" v-if="item.status == 2" @click="ConfirmationCollect(item.ordersn)">确认收货</a>
                                    <a href="javascript:;" v-if="item.status == 2" @click="$router.push('logistics?oid=' + item.ordersn)">追踪物流</a>
                                    <a href="javascript:;" @click="$router.push('joingroupon?oid=' + item.ordersn + '&goid=' + item.groupoid)">团购详情</a>
                                    <a href="javascript:;" @click="$router.push('grouponorderdetails?oid=' + item.ordersn + '&goid=' + item.groupoid)">订单详情</a>
                                </div>
                            </li>
                        </ul>
                        <div class="empty" v-if="orderList.length == 0">
                            <img src="../../assets/images/icon/empty_dindan.png" alt="">
                            <span>暂无拼团订单</span>
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
            pageData: [],
            orderList: [],
            banner: null
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
            passiveListeners : false,
            onSlideChangeStart: function(){
                mySwiper2.slideTo(mySwiper3.activeIndex)
                that.tabActive = mySwiper3.activeIndex;
            }
        })
        
        this.setHeight("home-swiper-wrapper");
    },
    methods: {
        getData() {
            this.$store.commit("openWait")
            this.$http.post(this.apiUrl,{
                code: "FightGroupList"
            }).then((data) => {
                

                if(data.ztm == 1) {
                    this.pageData = data.data;
                    this.banner = data.banner
                }else {
                    this.pageData = [];
                    this.banner = null
                }
            })
        },
        getOrderList() {
            this.$http.post(this.apiUrl,{
                code: "myFightGroup"
            }).then((data) => {
                console.log(data)
                if(data.ztm == 1) {
                    this.orderList = data.data;
                }else {
                    this.orderList = [];
                }
            })
        },
        infiniteLoadList() {
            setTimeout(() => {
                this.$refs.infinitescroll.$emit('ydui.infinitescroll.finishLoad');
                this.$refs.infinitescroll.$emit('ydui.infinitescroll.loadedDone');
            },1000)
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
    activated() {
        // this.getData();
        const frompath = sessionStorage.getItem('frompath');
        if(frompath == "/groupongoods") {
            var dom = this.$refs.scrollwrap;
            dom.scrollTop = sessionStorage.getItem('scrollTop');
        }else {
            this.getData();
            this.getOrderList();
            this.$refs.infinitescroll.$emit('ydui.infinitescroll.reInit');
        }
    },
    deactivated() {
        sessionStorage.setItem('scrollTop', this.$refs.scrollwrap.scrollTop);
    },
    components: {
        GoodList
    }
}
</script>

<style lang="less">
.pintuan-page {
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
                -webkit-overflow-scrolling: touch;
                overflow-y: scroll;
                .banner {
                    width: 100%;
                }
                .pt-goods {
                    background-color: #fff;
                    h2 {
                        line-height: 1.09rem;
                        font-size: .32rem;
                        font-weight: normal;
                    }
                    ul {
                        li {
                            .img-wrap {
                                width: 100%;
                                height: 4.18rem;
                                overflow: hidden;
                                img {
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                            .content {
                                padding: .3rem;
                                p {
                                    text-align: left;
                                    font-size: .32rem;
                                }
                                .line {
                                    text-align: left;
                                    padding-top: .2rem;
                                    .price {
                                        color: #c33;
                                        font-size: .35rem;
                                        font-weight: bold;
                                    }
                                    .originPrice {
                                        font-size: .24rem;
                                        color: #777;
                                    }
                                    .btn {
                                        float: right;
                                        background-color: #c33;
                                        padding: .15rem .6rem;
                                        color: #fff;
                                        font-size: .26rem;
                                        border-radius: .1rem;
                                    }
                                }
                            }
                        }
                    }
                }
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
                        width: 2.5rem;
                        margin: 1.5rem auto .2rem;
                    }
                    span {
                        color: #999;
                        font-size: .26rem;
                    }
                }
            }
        }
    }
}
</style>
