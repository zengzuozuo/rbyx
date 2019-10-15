<template>
    <div class="discountcoupon-page">
        <ComHeaderbar text="优惠券"></ComHeaderbar>
        <div class="main">
            <div class="swiper-container" id="swiper-container2">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" :class="{'active' : tabActive == 0}">
                        <span>未使用</span>
                    </div>
                    <div class="swiper-slide" :class="{'active' : tabActive == 1}">
                        <span>已使用</span>
                    </div>
                    <div class="swiper-slide" :class="{'active' : tabActive == 2}">
                        <span>已失效</span>
                    </div>
                </div>
            </div>
            <div class="swiper-container" id="swiper-container3">
                <div class="swiper-wrapper" id="home-swiper-wrapper">
                    <div class="swiper-slide">
                        <ul class="coupon-list" v-if="pageData">
                            <li v-for="item in pageData.notuse">
                                <div class="ctn-top">
                                    <div class="facevalue"><span>{{item.welfare}}</span>元</div>
                                    <div class="info">
                                        <div class="name">{{item.title}}</div>
                                        <p>{{item.starttime}} - {{item.endtime}}</p>
                                    </div>
                                    <!-- <a href="javascript:;">去使用</a> -->
                                </div>
                                <div class="ctn-btm">
                                    <div class="text" :class="{'fold' : foldId != item.couponid}">{{item.desc}}</div>
                                    <div class="btn" :class="{'fold' : foldId != item.couponid}"><i @click="foldBtn(item.couponid)"></i></div>
                                </div>
                            </li>
                            <div class="empty" v-if="pageData.notuse.length == 0">
                                <img src="../../assets/images/icon/discount_coupon_icon.png" alt="">
                                <span>每个月都有领券活动</span>
                            </div>
                        </ul>
                    </div>
                    <div class="swiper-slide">
                        <ul class="coupon-list" v-if="pageData">
                            <li v-for="item in pageData.used" class="bad">
                                <div class="ctn-top">
                                    <div class="facevalue"><span>{{item.welfare}}</span>元</div>
                                    <div class="info">
                                        <div class="name">{{item.title}}</div>
                                        <p>{{item.starttime}} - {{item.endtime}}</p>
                                    </div>
                                    <!-- <a href="javascript:;">去使用</a> -->
                                </div>
                                <div class="ctn-btm">
                                    <div class="text" :class="{'fold' : foldId != item.couponid}">{{item.desc}}</div>
                                    <div class="btn" :class="{'fold' : foldId != item.couponid}"><i @click="foldBtn(item.couponid)"></i></div>
                                </div>
                            </li>
                            <div class="empty" v-if="pageData.used.length == 0">
                                <img src="../../assets/images/icon/discount_coupon_icon.png" alt="">
                                <span>每个月都有领券活动</span>
                            </div>
                        </ul>
                    </div>
                    <div class="swiper-slide">
                        <ul class="coupon-list" v-if="pageData">
                            <li v-for="item in pageData.overdue" class="bad">
                                <div class="ctn-top">
                                    <div class="facevalue"><span>{{item.welfare}}</span>元</div>
                                    <div class="info">
                                        <div class="name">{{item.title}}</div>
                                        <p>{{item.starttime}} - {{item.endtime}}</p>
                                    </div>
                                    <!-- <a href="javascript:;">去使用</a> -->
                                </div>
                                <div class="ctn-btm">
                                    <div class="text" :class="{'fold' : foldId != item.couponid}">{{item.desc}}</div>
                                    <div class="btn" :class="{'fold' : foldId != item.couponid}"><i @click="foldBtn(item.couponid)"></i></div>
                                </div>
                            </li>
                            <div class="empty" v-if="pageData.overdue.length == 0">
                                <img src="../../assets/images/icon/discount_coupon_icon.png" alt="">
                                <span>每个月都有领券活动</span>
                            </div>
                        </ul>
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
            foldId: 0,
            pageData: null
        }
    },
    mounted() {
        var that = this;
        var mySwiper2 = new Swiper('#swiper-container2',{
            watchSlidesProgress : true,
            watchSlidesVisibility : true,
            slidesPerView : 3,
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

        this.getData();
    },
    methods: {
        foldBtn(id) {
            this.foldId = this.foldId == id ? 0 : id;
        },
        getData() {
            this.$http.post(this.apiUrl,{
                code: "userCoupon",
            }).then((data) => {
                console.log(data)
                if(data.ztm == 1) {
                    this.pageData = data.data;
                }else {
                    this.pageData = null;
                }
            })
        }
    },
    components: {
        GoodList
    }
}
</script>

<style lang="less">
.discountcoupon-page {
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
                .coupon-list {
                    padding: .3rem .3rem 0;
                    li {
                        &.bad {
                            .ctn-top {
                                background-color: #b6bac3;
                            }
                            .ctn-btm {
                                background: #a9acb5 url('../../assets/images/icon/border_bg2.png') repeat-x left top;
                            }
                        }
                        border-radius: .1rem;
                        overflow: hidden;
                        margin-bottom: .3rem;
                        color: #fff;
                        font-size: .28rem;
                        .ctn-top {
                            display: flex;
                            padding: .4rem 0;
                            background-color: #ec7476;
                            .facevalue {
                                padding: 0 .6rem;
                                align-self: center;
                                span {
                                    font-size: .46rem;
                                }
                            }
                            .info {
                                flex: 1;
                                text-align: left;
                                overflow: hidden;
                                p {
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    font-size: .24rem;
                                }
                            }
                            a {
                                align-self: center;
                                background-color: #fff;
                                color: #f07c7d;
                                padding: .1rem .35rem;
                                border-radius: 0.1rem;
                                margin: 0 .3rem;
                            }
                        }
                        .ctn-btm {
                            display: flex;
                            background: #da696d url('../../assets/images/icon/border_bg1.png') repeat-x left top;
                            padding: .3rem 0;
                            overflow: hidden;
                            .text {
                                flex: 1;
                                text-align: left;
                                padding-left: .4rem;
                                font-size: .26rem;
                                &.fold {
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    overflow: hidden;
                                }
                            }
                            .btn {
                                padding: 0 .4rem;
                                &.fold {
                                    i {
                                        background-image: url('../../assets/images/icon/arrow_down_white.png');
                                    }
                                }
                                i {
                                    display: inline-block;
                                    width: .3rem;
                                    height: .3rem;
                                    background: url('../../assets/images/icon/arrow_up_white.png') no-repeat center;
                                    background-size: cover;
                                }
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
