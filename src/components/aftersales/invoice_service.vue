<template>
    <div class="invoiceservice-page">
        <ComHeaderbar text="发票服务" />
        <div class="main">
            <div class="nav-bar">
                <a href="javascript:;" :class="{'active': activeTab == 0}" @click="switchBar(0)">已开票订单</a>
                <a href="javascript:;" :class="{'active': activeTab == 1}" @click="switchBar(1)">未开票订单</a>
            </div>
            <div class="nav-content">
                <div class="swiper-container" id="swiper-container">
                    <div class="swiper-wrapper" id="home-swiper-wrapper">
                        <div class="swiper-slide">
                            <ul>
                                <li v-for="(item,index) in ykOrder">
                                    <div class="ct-top">
                                        <p>订单编号：{{index}}</p>
                                        <!-- <i class="icon" @click="removeDindan(item[0].id)"></i> -->
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
                                        <a href="javascript:;" @click="$router.push('logistics?type=1&oid=' + index)">追踪物流</a>
                                    </div>
                                </li>
                                <div class="empty" v-show="ykOrder.length == 0">
                                    <img src="../../assets/images/icon/empty_dindan.png" />
                                    <span>还没有相关的订单呢</span>
                                </div>
                            </ul>
                        </div>
                        <div class="swiper-slide">
                            <div class="tip">订单在确认收货后可补开发票</div>
                            <ul>
                                <li v-for="(item,index) in wkOrder">
                                    <div class="ct-top">
                                        <p>订单编号：{{index}}</p>
                                        <!-- <i class="icon" @click="removeDindan(item[0].id)"></i> -->
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
                                        <a href="javascript:;" @click="$router.push('invoice?money=' + item[0].payment + '&oid=' + item[0].ordersn)">补开发票</a>
                                    </div>
                                </li>
                                <div class="empty" v-show="wkOrder.length == 0">
                                    <img src="../../assets/images/icon/empty_dindan.png" />
                                    <span>还没有相关的订单呢</span>
                                </div>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            mySwiper: null,
            activeTab: 0,
            wkOrder: [],
            ykOrder: []
        }
    },
    mounted() {
        var that = this;
        this.mySwiper = new Swiper('#swiper-container',{
            passiveListeners : false,
            onSlideChangeStart: function(){
                that.activeTab = that.mySwiper.activeIndex;
            }

        })
        this.getData();
    },
    methods: {
        getData() {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "repairInvoiceOrder"
            }).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    this.wkOrder = data.data;
                    this.ykOrder = data.datay;
                }else {
                    this.wkOrder = [];
                    this.ykOrder = [];
                }
            })
        },
        switchBar(i) {
            this.activeTab = i;
            this.mySwiper.slideTo(i);   
        }
    }
}
</script>

<style lang="less">
.invoiceservice-page {
    display: flex;
    flex-direction: column;
    .main {
        position: relative;
        flex: 1;
        overflow: hidden;
        .nav-bar {
            display: flex;
            position: fixed;
            top: .9rem;
            left: 0;
            width: 100%;
            height: .8rem;
            line-height: .8rem;
            background-color: #fff;
            a {
                flex: 1;
                position: relative;
                text-align: center;
                font-size: .3rem;
                &.active {
                    color: #c33;
                    &::after {
                        content: "";
                        position: absolute;
                        width: 60%;
                        bottom: 0;
                        left: 20%;
                        border-bottom: .04rem solid #c33;
                    }
                }
            }
        }
        .nav-content {
            padding-top: .8rem;
            height: 100%;
            .swiper-container {
                height: 100%;
            }
            .swiper-slide {
                height: 100%;
                text-align: center;
                overflow-y: auto;
                .tip {
                    color: #fa9b05;
                    background-color: #e9ea7a;
                    font-size: .28rem;
                    line-height: .6rem;
                }
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
