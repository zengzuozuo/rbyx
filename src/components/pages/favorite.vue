<template>
    <div class="favorite-page">
        <ComHeaderbar text="我的收藏"></ComHeaderbar>
        <div class="main">
            <div class="swiper-container" id="swiper-container2">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" :class="{'active' : tabActive == 0}">
                        <span>商品（{{goodsListCount}}）</span>
                    </div>
                    <div class="swiper-slide" :class="{'active' : tabActive == 1}">
                        <span>专题（{{specialCount}}）</span>
                    </div>
                </div>
            </div>
            <div class="swiper-container" id="swiper-container3">
                <div class="swiper-wrapper" id="home-swiper-wrapper">
                    <div class="swiper-slide">
                        <ul class="goodslist">
                            <li v-for="item in goodsList" @click="$router.push('goodsdetails?id=' + item.id)">
                                <ImgTag :url="imgUrl + item.pic" />
                                <div class="content">
                                    <h3>{{item.title}}</h3>
                                    <p>{{item.desc}}</p>
                                    <h3>¥{{item.minprice}}</h3>
                                </div>
                            </li>
                        </ul>
                        <div class="empty" v-if="goodsList.length == 0">
                            <img src="../../assets/images/icon/favorite.png" alt="">
                            <span>还没收藏任何商品</span>
                        </div>
                        <Like />
                    </div>
                    <div class="swiper-slide">
                        <ul class="speciallist">
                            <li v-for="item in special" @click="$store.commit('openUrl', item.url + '?ztid=' + item.id)">
                                <ImgTag :url="imgUrl + item.pic" />
                                <div class="content">
                                    <h3>{{item.title}}</h3>
                                    <p>{{item.desc}}</p>
                                </div>
                            </li>
                        </ul>
                        <div class="empty" v-if="special.length == 0">
                            <img src="../../assets/images/icon/favorite.png" alt="">
                            <span>还没收藏任何专题</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Like from '../common/like_component';
export default {
    data() {
        return {
            tabActive: 0,
            goodsList: [],
            special: [],
            goodsListCount: 0,
            specialCount: 0
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

        this.getData();
        this.getSpecial();
    },
    methods: {
        getData() {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "collectionList",
                type: 1
            }).then((data) => {
                if(data.ztm == 1) {
                    this.goodsList = data.data;
                    this.goodsListCount = data.goodscount;
                }else {
                    this.goodsList = [];
                }
            })
        },
        getSpecial() {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "collectionList",
                type: 0
            }).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    this.special = data.data;
                    this.specialCount = data.specialcount;
                }else {
                    this.special = [];
                }
            })
        }
    },
    components: {
        Like
    }
}
</script>

<style lang="less">
.favorite-page {
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
                .goodslist {
                    li {
                        display: flex;
                        background-color: #fff;
                        padding: .2rem;
                        margin-bottom: .05rem;
                        img {
                            width: 1.8rem;
                            height: 1.8rem;
                        }
                        .content {
                            flex: 1;
                            text-align: left;
                            padding-left: .2rem;
                            overflow: hidden;
                            h3 {
                                font-size: .3rem;
                                color: #000;
                                padding: .1rem 0;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                overflow: hidden;
                            }
                            p {
                                color: #999;
                                font-size: .26rem;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                overflow: hidden;
                                line-height: .5rem;
                            }
                        }
                    }
                }
                .speciallist {
                    li {
                        display: flex;
                        background-color: #fff;
                        margin-top: .2rem;
                        padding: .2rem;
                        img {
                            width: 2rem;
                            height: 2rem;
                        }
                        .content {
                            flex: 1;
                            align-self: center;
                            padding-left: .2rem;
                            text-align: left;
                            h3 {
                                font-size: .3rem;
                            }
                            p {
                                font-size: .26rem;
                                color: #999;
                            }
                        }
                    }
                }
                .empty {
                    margin: 1rem 0;
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
