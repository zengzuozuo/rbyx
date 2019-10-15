<template>
    <div class="home-component" ref="homeComponent">
        <header>
            <div class="icon-wrap" @click="$router.push('/saoyisao')">
                <img src="../../../assets/images/icon/saoyisao_icon.png" />
                <span>扫一扫</span>
            </div>
            <div class="search-wrap" @click="$router.push('/search')">
                <img src="../../../assets/images/icon/search_icon.png" />
                <span>搜索商品, 这里有你想要的</span>
            </div>
            <div class="icon-wrap" @click="$router.push('/messagecenter')">
                <img src="../../../assets/images/icon/message_icon.png" />
                <span>消息</span>
            </div>
        </header>
        <div class="main">
            <div class="swiper-container" id="swiper-container2">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" :class="{'active' : tabActive == index}" v-for="(item,index) in pageData">
                        <span>{{ item.name }}</span>
                    </div>
                </div>
            </div>
            <div class="swiper-container" id="swiper-container3">
                <div class="swiper-wrapper" id="home-swiper-wrapper">
                    <div class="swiper-slide" v-for="(item,index) in pageData">
                        <component :is="item.modul" :tipid="item.id" :activeindex="tabActive" :selfindex="index"></component>
                        <a class="sign" href="javascript:;" v-if="index == 0" @click="$router.push('integral')">
                            <img src="../../../assets/images/icon/sign_icon.png" alt="">
                            <span>签到</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Recommend from "./recommend";  //推荐
import ClassGoods from "./classgoods";  //分类商品
import TimeBuy from "./timebuy";  //限时购
import NewArrival from "./new_arrival";  //新品
import ZCModule from "../../zhongchou/zc_homelist"; //众筹
export default {
    data() {
        return {
            tabActive: 0,
            pageData: [],
            mySwiper2: null,
            mySwiper3: null
        }
    },
    mounted() {
        var that = this;
        that.mySwiper2 = new Swiper('#swiper-container2',{
            watchSlidesProgress : true,
            watchSlidesVisibility : true,
            slidesPerView : 4.5,
            onTap: function(){
                that.mySwiper3.slideTo( that.mySwiper2.clickedIndex)
                that.tabActive = that.mySwiper2.clickedIndex;
                that.$store.state.popupIsShow = false;
            }
        })

        that.mySwiper3 = new Swiper('#swiper-container3',{
            // resistanceRatio : 0,
            passiveListeners : false,
            // threshold : 80,
            onSlideChangeStart: function(){
                that.mySwiper2.slideTo(that.mySwiper3.activeIndex)
                that.tabActive = that.mySwiper3.activeIndex;
                that.$store.state.popupIsShow = false;
            }

        })

        this.setHeight("home-swiper-wrapper");
    },
    methods: {
        getData() {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "getCategory"
            }).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    this.pageData = data.data;
                    setTimeout(() => {
                        this.mySwiper2.update();
                        this.mySwiper3.update();
                    },100)
                }else {
                    this.pageData = [];
                }
            })
        }
    },
    components: {
        Recommend,
        ClassGoods,
        TimeBuy,
        NewArrival,
        ZCModule
    },
    activated() {
        if(this.pageData.length == 0) {
            this.getData(); //请求数据
        }
    }
}
</script>

<style lang="less">
.home-component {
    display: -webkit-flex; /* Safari */
    display: flex;
    flex-direction: column;
    header {
        display: flex;
        padding: .1rem 0;
        background-color: #fafafa;
        .icon-wrap {
            width: 1.14rem;
            text-align: center;
            font-size: .16rem;
            img {
                width: .45rem;
                display: block;
                margin: 0 auto;
                
            }
        }
        .search-wrap {
            flex: 1;
            background-color: #ededed;
            border-radius: .1rem;
            height: .7rem;
            line-height: .7rem;
            text-align: center;
            font-size: .26rem;
            img {
                width: .4rem;
                vertical-align: middle;
            }
        }
    }
    .main {
        flex: 1;
        display: -webkit-flex; /* Safari */
        display: flex;
        flex-direction: column;
        #swiper-container2 {
            width: 100%;
            overflow: hidden;
            background-color: #fafafa;
            min-height: .6rem;
            .swiper-slide {
                text-align: center;
                overflow: hidden;
                span {
                    display: inline-block;
                    padding: 0 .1rem;
                    line-height: .6rem;
                    border-bottom: .04rem solid transparent;
                    max-width: 100%;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    font-size: .26rem;
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
            }
        }
        .sign {
            position: fixed;
            z-index: 1212;
            top: 12%;
            right: 0;
            background-color: #fff;
            padding: .1rem .2rem;
            border-radius: .3rem 0 0 .3rem;
            border: 1px solid #d4d4d4;
            border-right: none;
            img {
                width: .4rem;
                height: .4rem;
                vertical-align: middle;
            }
            span {
                display: inline-block;
                font-size: .25rem;
                vertical-align: middle;
            }
        }
    }
}
</style>