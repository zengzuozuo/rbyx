<template>
    <div class="dindan-page">
        <ComHeaderbar text="我的订单">
            <!-- <a class="other" @click="$router.push('/search')" href="javascript:;"></a> -->
        </ComHeaderbar>
        <div class="main">
            <div class="swiper-container" id="swiper-container2">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" :class="{'active' : tabActive == 0}">
                        <span>全部</span>
                    </div>
                    <div class="swiper-slide" :class="{'active' : tabActive == 1}">
                        <span>待付款</span>
                    </div>
                    <div class="swiper-slide" :class="{'active' : tabActive == 2}">
                        <span>待发货</span>
                    </div>
                    <div class="swiper-slide" :class="{'active' : tabActive == 3}">
                        <span>已发货</span>
                    </div>
                    <div class="swiper-slide" :class="{'active' : tabActive == 4}">
                        <span>待评价</span>
                    </div>
                </div>
            </div>
            <div class="swiper-container" id="swiper-container3">
                <div class="swiper-wrapper" id="home-swiper-wrapper">
                    <div class="swiper-slide">
                        <ul>
                            <li v-for="(item,index) in allOrder">
                                <div class="ct-top">
                                    <p>订单编号：{{index}}</p>
                                    <i class="icon" v-if="item[0].status == 0 || item[0].status == 8" @click="removeDindan(item[0].id)"></i>
                                </div>
                                <div class="content"  @click="$router.push('orderdetails?oid=' + index)">
                                    <div class="img-wrap">
                                        <ImgTag v-for="subitem,index in item" :url="imgUrl + subitem.pic" :key="index" />
                                        <div v-if="item.length == 1">
                                            <h3>{{item[0].title}}</h3>
                                            <h4>{{item[0].specifications}}</h4>
                                        </div>
                                    </div>
                                    <span>{{item[0].zt}}</span>
                                </div>
                                <div class="btn-wrap clearfix">
                                    <a href="javascript:;" style="color: #c33;border-color: #c33" v-if="item[0].status == 2">确认收货</a>
                                    <a href="javascript:;" v-if="item[0].status == 2" @click="$router.push('logistics?oid=' + index)">追踪物流</a>
                                    <a href="javascript:;" v-if="item[0].status == 1" @click="againBuy(index)">再次购买</a>
                                    <a href="javascript:;" style="color: #c33;border-color: #c33"  @click="$router.replace('payment?oid=' + index)" v-if="item[0].status == 0">立即支付</a>
                                    <a href="javascript:;" v-if="item[0].status == 3" @click="$router.push('usercomment?ordersn=' + index)" style="color: #c33;border-color: #c33">评价有礼</a>
                                </div>
                            </li>
                            <div class="empty" v-show="allOrder.length == 0">
                                <img src="../../assets/images/icon/empty_dindan.png" />
                                <span>还没有相关的订单呢</span>
                            </div>
                        </ul>
                    </div>
                    <div class="swiper-slide">
                        <ul>
                            <li v-for="(item,index) in dfkOrder">
                                <div class="ct-top">
                                    <p>订单编号：{{index}}</p>
                                    <i class="icon" @click="removeDindan(item[0].id)"></i>
                                </div>
                                <div class="content" @click="$router.push('orderdetails?oid=' + index)">
                                    <div class="img-wrap">
                                        <ImgTag v-for="subitem,index in item" :url="imgUrl + subitem.pic" :key="index" />
                                        <div v-if="item.length == 1">
                                            <h3>{{item[0].title}}</h3>
                                            <h4>{{item[0].specifications}}</h4>
                                        </div>
                                    </div>
                                    <span>{{item[0].zt}}</span>
                                </div>
                                <div class="btn-wrap clearfix">
                                    <a href="javascript:;" style="color: #c33;border-color: #c33" v-if="item[0].status == 2">确认收货</a>
                                    <a href="javascript:;" style="color: #c33;border-color: #c33" @click="$router.replace('payment?oid=' + index)" v-if="item[0].status == 0">立即支付</a>
                                </div>
                            </li>
                            <div class="empty" v-show="dfkOrder.length == 0">
                                <img src="../../assets/images/icon/empty_dindan.png" />
                                <span>还没有相关的订单呢</span>
                            </div>
                        </ul>
                    </div>
                    <div class="swiper-slide">   <!-- 待发货 -->
                        <ul>
                            <li v-for="item,index in dfhOrder">
                                <div class="ct-top">
                                    <p>订单编号：{{index}}</p>
                                    <!-- <i class="icon" @click="removeDindan(item[0].id)"></i> -->
                                </div>
                                <div class="content" @click="$router.push('orderdetails?oid=' + index)">
                                    <div class="img-wrap">
                                        <ImgTag v-for="subitem,index in item" :url="imgUrl + subitem.pic" :key="index" />
                                        <div v-if="item.length == 1">
                                            <h3>{{item[0].title}}</h3>
                                            <h4>{{item[0].specifications}}</h4>
                                        </div>
                                    </div>
                                    <span>{{item[0].zt}}</span>
                                </div>
                                <div class="btn-wrap clearfix">
                                    <a href="javascript:;" @click="againBuy(index)">再次购买</a>
                                </div>
                            </li>
                            <div class="empty" v-show="dfhOrder.length == 0">
                                <img src="../../assets/images/icon/empty_dindan.png" />
                                <span>还没有相关的订单呢</span>
                            </div>
                        </ul>
                    </div>
                    <div class="swiper-slide">  <!-- 已发货 -->
                        <ul>
                            <li v-for="item,index in yfhOrder">
                                <div class="ct-top">
                                    <p>订单编号：{{index}}</p>
                                    <!-- <i class="icon" @click="removeDindan(item[0].id)"></i> -->
                                </div>
                                <div class="content" @click="$router.push('orderdetails?oid=' + index)">
                                    <div class="img-wrap">
                                        <ImgTag v-for="subitem,index in item" :url="imgUrl + subitem.pic" :key="index" />
                                        <div v-if="item.length == 1">
                                            <h3>{{item[0].title}}</h3>
                                            <h4>{{item[0].specifications}}</h4>
                                        </div>
                                    </div>
                                    <span>{{item[0].zt}}</span>
                                </div>
                                <div class="btn-wrap clearfix">
                                    <a href="javascript:;" style="color: #c33;border-color: #c33" @click="ConfirmationCollect(index)">确认收货</a>
                                    <a href="javascript:;" @click="$router.push('logistics?oid=' + index)">追踪物流</a>
                                    <a href="javascript:;" @click="againBuy(index)">再次购买</a>
                                </div>
                            </li>
                            <div class="empty" v-show="yfhOrder.length == 0">
                                <img src="../../assets/images/icon/empty_dindan.png" />
                                <span>还没有相关的订单呢</span>
                            </div>
                        </ul>
                    </div>
                    <!-- 待评价 -->
                    <div class="swiper-slide">
                        <ul>
                            <li v-for="item,index in dpjOrder">
                                <div class="ct-top">
                                    <p>订单编号：{{index}}</p>
                                    <!-- <i class="icon" @click="removeDindan(item[0].id)"></i> -->
                                </div>
                                <div class="content" @click="$router.push('orderdetails?oid=' + index)">
                                    <div class="img-wrap">
                                        <ImgTag v-for="subitem,index in item" :url="imgUrl + subitem.pic" :key="index" />
                                        <div v-if="item.length == 1">
                                            <h3>{{item[0].title}}</h3>
                                            <h4>{{item[0].specifications}}</h4>
                                        </div>
                                    </div>
                                    <span>{{item[0].zt}}</span>
                                </div>
                                <div class="btn-wrap clearfix">
                                    <a href="javascript:;" @click="$router.push('usercomment?ordersn=' + index)" style="color: #c33;border-color: #c33">评价有礼</a>
                                    <a href="javascript:;" @click="againBuy(index)">再次购买</a>
                                </div>
                            </li>
                            <div class="empty" v-if="dpjOrder.length == 0">
                                <img src="../../assets/images/icon/empty_dindan.png" />
                                <span>还没有相关的订单呢</span>
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/**
 *  0 = 未付款
    1 = 待发货
    2 = 已发货
    3 = 待评价
    4 = 交易成功
    5 = 申请退款
    8 = 退款成功
    9 = 申请退货
    10=同意退货
 */
import GoodList from '../common/goodslist_component';
export default {
    data() {
        return {
            tabActive: this.$route.query.active || 0,
            allOrder: [],   //全部订单
            dfkOrder: [],   //待付款订单
            dfhOrder: [],   //待发货订单
            yfhOrder: [],   //已发货订单
            dpjOrder: [],   //待评价订单
            mySwiper3: null,
            mySwiper2: null,
            dom: null
        }
    },
    mounted() {
        var that = this;
        this.mySwiper2 = new Swiper('#swiper-container2',{
            watchSlidesProgress : true,
            watchSlidesVisibility : true,
            slidesPerView : 5,
            onTap: function(){
                that.mySwiper3.slideTo( that.mySwiper2.clickedIndex)
                that.tabActive = that.mySwiper2.clickedIndex;
                that.bindScroll();
            }
        })

        this.mySwiper3 = new Swiper('#swiper-container3',{
            passiveListeners : false,
            threshold : 80,
            onSlideChangeStart: function(){
                that.mySwiper2.slideTo(that.mySwiper3.activeIndex)
                that.tabActive = that.mySwiper3.activeIndex;
                that.bindScroll();
                that.lazyGet();
            }

        })
        
        this.setHeight("home-swiper-wrapper");  //设置内容页面高度

        
    },
    methods: {
        /**
         * 获取订单列表
         * 
         * @param   s   订单状态标识
         * 
         */
        getData(s) {
            var k = "allOrder";
            switch(s) {
                case "0":
                    k = "dfkOrder";
                    break;
                case "1":
                    k = "dfhOrder";
                    break;
                case "2":
                    k = "yfhOrder";
                    break;
                case "3":
                    k = "dpjOrder";
                    break;
                default: 
                    k = "allOrder";
                    break;
            }
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "getOrder",
                status: s
            }).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    this[k] = data.data;
                }else {
                    this[k] = [];
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
                            this.getData("");
                            this.getData("0");
                        }
                        this.$dialog.toast({
                            mes: data.msg
                        })
                    })
                }
            });
        },
        bindScroll() {
            sessionStorage.setItem('ddScrollTop', 0);
            this.dom = document.getElementsByClassName('swiper-slide-active')[1];
            if(!this.dom) {
                this.dom = document.getElementsByClassName('swiper-slide-active')[0];
            }
            this.dom.removeEventListener("scroll",this.scrollFn,false);
            this.dom.addEventListener("scroll",this.scrollFn,false);
        },
        scrollFn() {
            sessionStorage.setItem('ddScrollTop', this.dom.scrollTop);
        },
        lazyGet() {
            switch(this.tabActive) {
                case 0:   //全部订单
                    // if(this.allOrder.length == 0) {
                    //     this.getData("");
                    // }
                    this.getData("");
                    break;
                case 1:   //待付款订单
                    // if(this.dfkOrder.length == 0) {
                    //     this.getData("0");
                    // }
                    this.getData("0");
                    break;
                case 2:   //待发货订单
                    // if(this.dfhOrder.length == 0) {
                    //     this.getData("1");
                    // }
                    this.getData("1");
                    break;
                case 3:   //已发货订单
                    // if(this.yfhOrder.length == 0) {
                    //     this.getData("2");
                    // }
                    this.getData("2");
                    break;
                case 4:   //待评价订单
                    this.getData("3");
                    // if(this.dpjOrder.length == 0) {
                    //     this.getData("3");
                    // }
                    break;
                default:
            }
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
                            this.getData("2");
                            this.getData("3");
                        }
                        this.$dialog.toast({
                            mes: data.msg
                        })
                    })
                }
            })
        },
        /**
         * 再次购买(将商品加入购物车)
         * 
         * @param {oid} 订单号
         */
        againBuy(oid) {
        	this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "againBuy",
                ordersn: oid
            }).then((data) => {
                console.log(data);
                
                this.$dialog.toast({
                    mes: data.msg,
                    callback: () => {
                    	this.$router.push('shopingcart')
                    }
                })
            })
        }
    },
    activated() {
        if(sessionStorage.getItem("frompath") == "/my") {
            this.tabActive = this.$route.query.active || 0;
            this.mySwiper3.slideTo(this.tabActive);
            this.bindScroll();
        }else {
            if(this.dom) {
                this.dom.scrollTop = sessionStorage.getItem("ddScrollTop");
            }
        }
        
        if(this.$route.query.active) {
            this.lazyGet();
        }else {
            this.getData("");
            // this.allOrder = [];
        }
    },
    components: {
        GoodList
    }
}
</script>

<style lang="less">
.dindan-page {
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
                overflow-y: auto;
                ul {
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
                                    h3 {
                                        white-space: nowrap;
                                        text-overflow: ellipsis;
                                        overflow: hidden; 
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
                }
            }
        }
    }
}
</style>