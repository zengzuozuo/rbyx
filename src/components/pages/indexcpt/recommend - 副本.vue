<template>
    <div class="recommend-component scroll-wrap" id="recommend-component">
        <div style="position: relative;" ref="main">
            <PullDown ref="pulldown" />
            <div class="swiper-container recommend-swiper" id="recommend-swiper">
                <div class="swiper-wrapper" v-if="pageData">
                    <div class="swiper-slide" v-for="item in pageData.banner" @click="$store.commit('openUrl',item.url)">
                        <ImgTag :url="imgUrl + item.pic" />
                    </div>
                </div>
                <div class="swiper-pagination"></div>
            </div>
            <div class="note" v-if="pageData">
                <p v-for="(item,index) in pageData.home_service" v-if="index <= 2">
                    <img src="../../../assets/images/icon/right_icon.png" />
                    <span>{{item.servicename}}</span>
                </p>
            </div>
            <ul class="nav" v-if="pageData">
                <li v-for="item in pageData.home_orderplate" @click="$store.commit('openUrl',item.url)">
                    <ImgTag :url="imgUrl + item.icon" />
                    <span>{{ item.name }}</span>
                </li>
            </ul>
            <div class="advertising" v-if="pageData && pageData.ad">
                <img :src="imgUrl + pageData.ad.pic" @click="$store.commit('openUrl',pageData.ad.url)" />
            </div>
            <!-- <div class="newbie" v-if="pageData">
                <div class="content">
                    <h2>-- {{pageData.goods.xrzx.title}} --</h2>
                    <ul>
                        <router-link tag="li" :to="{path: 'goodsdetails',query: {id: item.id}}" v-for="(item,index) in pageData.goods.xrzx.data" v-if="index <= 2" :key="index">
                            <ImgTag :url="imgUrl + item.pic" />
                            <span>{{ item.title }}</span>
                        </router-link>
                    </ul>
                    <div class="btn">
                        <a href="javascript:;" @click="$store.commit('undone')">立即开启新人之旅</a>
                    </div>
                </div>
            </div> -->
            <div class="prefecture manufacturer" v-if="pageData">
                <h2 @click="$router.push('manufacturer')"><span>品牌制造商直供</span><img src="../../../assets/images/icon/arrow_right_icon.png" /></h2>
                <ul>
                    <li v-for="item in pageData.brand" @click="$router.push('mftdetails?id=' + item.id)">
                        <h3>{{ item.brand }}</h3>
                        <div class="content">
                            <div class="ctn-l">
                                <span>{{ item.desc }}</span>
                                <label v-if="item.isnew == 1">上新</label>
                            </div>
                            <ImgTag :url="imgUrl + item.pic" />
                        </div>
                    </li>
                </ul>
            </div>
            <div class="prefecture new-arrival" v-if="pageData">
                <h2 @click="$router.push('newarrival')"><span>{{ pageData.goods.xpsf.title }}</span><img src="../../../assets/images/icon/arrow_right_icon.png" /></h2>
                <ul>
                    <li v-for="(item,index) in pageData.goods.xpsf.data" @click="$router.push('goodsdetails?id=' + item.id)" v-if="index <= 5">
                        <ImgTag :url="imgUrl + item.pic" />
                        <p class="label-list clearfix">
                            <label v-for="subitem in item.activity">{{subitem.title}}</label>
                        </p>
                        <p class="goodsname">{{ item.title }}</p>
                        <p class="price">
                            <span>¥368</span>
                        </p>
                    </li>
                </ul>
            </div>
            <div class="prefecture ztjx" v-if="pageData && pageData.special">
                <h2 @click="$router.push('special')"><span>专题精选</span><img src="../../../assets/images/icon/arrow_right_icon.png" /></h2>
                <div class="swiper-container" id="ztjx-swiper">
                    <ul class="swiper-wrapper">
                        <li class="swiper-slide" v-for="item in pageData.special" @click="$store.commit('openUrl',item.url + '?ztid=' + item.id + '&bm=' + token)">
                            <ImgTag :url="imgUrl + item.pic" />
                            <div class="content">
                                <div class="ctn-l">
                                    <span>{{ item.title }}</span>
                                    <label>{{ item.price }}元起</label>
                                </div>
                                <p>{{ item.desc }}</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="popularity" v-if="pageData && pageData.goods.rqtj">
                <h2 @click="$router.push('hot')"><span>{{pageData.goods.rqtj.title}}</span><img src="../../../assets/images/icon/arrow_right_icon.png" /></h2>
                <GoodsList :goodslist="pageData.goods.rqtj.data" />
            </div>
            <Like></Like>
        </div>
    </div>
</template>

<script>
import Like from "../../common/like_component";
import GoodsList from "../../common/goodslist_component";
export default {
    props: ["tipid"],
    data() {
        return  {
            mySwiper: null,
            myScroll: null,
            ztjxSwiper: null,
            pageData: null,
            token: localStorage.getItem('zzz') || ""
        }
    },
    updated() {
        this.mySwiper = new Swiper('#recommend-swiper', {
            autoplay: 5000,//可选选项，自动滑动
            pagination : '.swiper-pagination',
            autoplayDisableOnInteraction : false,
        })  
        this.ztjxSwiper = new Swiper("#ztjx-swiper", {
            slidesPerView: 1.2,
            spaceBetween : 20,
            freeMode : true,
        })
    },
    mounted() {
        var that = this;
        this.$dialog.loading.open('载入中...');
        this.getData();

        this.myScroll = new iScroll("#recommend-component",{
            preventDefault: false,
			probeType: 3,
        });

        var size = 0;
        this.myScroll.on("scroll",function() {
            size =  this.y >= 100 ? 100 : this.y;
            that.$refs.pulldown.$el.style.transform = "scale("+ size/100 +")";
        })

        this.$refs.main.addEventListener("touchend",function(e){
            if(that.myScroll.y >= 100){
                that.getData();
            }
        })

        setTimeout(() => {
            this.myScroll.refresh();
        },300)
        
    },
    methods: {
        getData() {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "index"
            }).then((data) => {
                this.$dialog.loading.close();
                if(data.ztm == 1) {
                    this.pageData = data;
                    setTimeout(() => {
                        this.myScroll.refresh();
                    },300)
                }
            }).catch((err) => {
                this.$dialog.loading.close();
            })
        }
    },
    activated() {
        setTimeout(() => {
            this.myScroll.refresh();
        },300)
        this.$store.commit("showUrl");  //恢复显示webview
    },
    components: {
        Like,
        GoodsList
    }
}
</script>

<style lang="less">
.recommend-component {
    height: 100%;
    overflow: hidden;
    .recommend-swiper {
        height: 4.2rem;
        // background: url("../../../assets/images/lg.cutie-fox-spinner.gif") no-repeat center;
        // background-size: 30%;
        .swiper-wrapper {
            .swiper-slide {
                background-color: #f5f5f5;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
    .note {
        display: flex;
        justify-content: space-around;
        padding: .2rem 0;
        background-color: #fff;
        p {
            text-align: center;
            img {
                width: .28rem;
                height: .28rem;
                vertical-align: middle;
            }
            span {
                vertical-align: middle;
                font-size: .26rem;
            }
        }
    }
    .nav {
        display: flex;
        background-color: #fff;
        li {
            flex: 1;
            img {
                display: block;
                width: 1.05rem;
                height: 1.05rem;
                margin: 0.25rem auto 0;
            }
            span {
                display: inline-block;
                padding: .15rem 0;
                font-size: .25rem;
            }
        }
    }
    .advertising {
        padding: .4rem .2rem;
        background-color: #fff;
        img {
            width: 100%;
        }
    }
    .newbie {
        background-color: #eadcd0;
        padding: .3rem .2rem;
        .content {
            background-color: #fff;
            border-radius: .2rem;
            h2 {
                font-size: .35rem;
                color: #b19f7c;
                font-weight: normal;
                padding: .46rem 0;
            }
            ul {
                display: flex;
                li {
                    flex: 1;
                    img {
                        display: block;
                        margin: 0 auto;
                        width: 2rem;
                        height: 2rem;
                        background-color: #f4f4f4;
                    }
                    &:nth-child(2) {
                        border-left: 1px solid #dddddd;
                        border-right: 1px solid #dddddd;
                    }
                }
            }
            .btn {
                padding: .5rem 0;
                a {
                    display: inline-block;
                    background-color: #b09e7a;
                    padding: .25rem .7rem;
                    font-size: .26rem;
                    color: #fff;
                    border-radius: .1rem;
                }
            }
        }
    }
    .prefecture {
        margin-top: .2rem;
        background-color: #fff;
        h2 {
            padding: .4rem 0;
             border-bottom: 1px solid #d4d4d4;
            img {
                width: .32rem;
                height: .32rem;
                vertical-align: middle;
                margin-left: .1rem;
            }
            span {
                font-size: .3rem;
                color: #000;
                font-weight: normal;
                vertical-align: middle;
            }
        }
        &.manufacturer {
            h2 {
                border-bottom: none;
            }
            ul {
                display: flex;
                flex-wrap: wrap;
                li {
                    width: 50%;
                    border-top: 1px solid #d4d4d4;
                    border-right: 1px solid #d4d4d4;
                    padding: .15rem .25rem;
                    &:nth-child(2n) {
                        border-right: none;
                    }
                    h3 {
                        padding: .2rem 0;
                        text-align: left;
                    }
                    .content {
                        display: flex;
                        .ctn-l {
                            flex: 1;
                            text-align: left;
                            span {
                                display: block;
                                font-size: .24rem;
                            }
                            label {
                                display: inline-block;
                                background-color: #cbb693;
                                padding: .1rem .2rem;
                                color: #fff;
                                border-radius: .05rem;
                                margin-top: .2rem;
                            }
                        }
                        img {
                            width: 1.7rem;
                            height: 1.7rem;
                        }
                    }
                }
            }
        }
        &.new-arrival {
            ul {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-around;
                li {
                    width: 33%;
                    text-align: left;
                    padding: 0.15rem;
                    img {
                        display: block;
                        width: 100%;
                        background-color: #f4f4f4;
                    }
                    .info {
                        background-color: #f1ece2;
                        color: #9f8a5f;
                        font-size: .25rem;
                        line-height: .72rem;
                        border-radius: 0 0 .1rem .1rem;
                        padding: 0 .1rem;
                    }
                    .label-list {
                        padding: .15rem 0;
                        label {
                            float: left;
                            padding: .05rem .18rem;
                            background-color: #e57b7b;
                            color: #fff;
                            margin-left: .1rem;
                            font-size: .2rem;
                            border-radius: .05rem;
                        }
                    }
                    .goodsname {
                        padding: 0 .1rem;
                        color: #000;
                        font-weight: bold;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                    .price {
                        padding: 0 .1rem;
                        color: #c33;
                        font-size: .26rem;
                        font-weight: bold;
                    }
                }
            }
        }
        &.ztjx {
            ul {
                li {
                    padding-bottom: .4rem;
                    
                    img {
                        height: 3.35rem;
                        width: 100%;
                    }
                    .content {
                        text-align: left;
                        padding: 0 .2rem;
                        .ctn-l {
                            display: flex;
                            font-weight: bold;
                            line-height: .6rem;
                            span {
                                flex: 1;
                            }
                            label {
                                color: #c33;
                            }
                        }
                        p {
                            color: #a9a9a9;
                            font-size: .26rem;
                        }
                    }
                }
            }
        }
    }
    .popularity {
        margin-top: .2rem;
        background-color: #fff;
        h2 {
            padding: .4rem 0;
            border-bottom: 1px solid #d8d8d8;
            img {
                width: .32rem;
                height: .32rem;
                vertical-align: middle;
                margin-left: .1rem;
            }
            span {
                font-size: .3rem;
                color: #000;
                font-weight: normal;
                vertical-align: middle;
            }
        }
    }
}
</style>