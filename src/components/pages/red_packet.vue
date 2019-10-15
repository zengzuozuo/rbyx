<template>
    <div class="redpacket-page">
        <ComHeaderbar text="红包"></ComHeaderbar>
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
                        <div class="class-title">
                            <div class="empty">
                                <img src="../../assets/images/icon/redpacket_icon.png" alt="">
                                <span>暂无相关红包</span>
                            </div>
                        </div>

                    </div>
                    <div class="swiper-slide">
                        <div class="class-title">
                            <div class="empty">
                                <img src="../../assets/images/icon/redpacket_icon.png" alt="">
                                <span>暂无相关红包</span>
                            </div>
                        </div>
                    </div>
                    <div class="swiper-slide">
                        <div class="class-title">
                            <div class="empty">
                                <img src="../../assets/images/icon/redpacket_icon.png" alt="">
                                <span>暂无相关红包</span>
                            </div>
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
            tabActive: 0
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
    },
    components: {
        GoodList
    }
}
</script>

<style lang="less">
.redpacket-page {
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
