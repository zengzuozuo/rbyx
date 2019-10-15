<template>
    <div class="special-component" ref="specialComponent">
        <header>
             专题
        </header>
        <div class="main" id="special-component">
            <div class="scroll-wrap">
                <div class="swiper-container" id="special-swiper1">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide" v-for="item in pageData.banner" @click="$store.commit('openUrl',item.url + '?ztid=' + item.id + '&bm=' + token)">
                            <ImgTag :url="imgUrl + item.pic" />
                        </div>
                    </div>
                </div>
                <div class="nav swiper-container" id="special-swiper2">
                    <ul class="swiper-wrapper">
                        <li class="swiper-slide" v-for="item in pageData.specialTpey" @click="$router.push('speciallist?id=' + item.id + '&title=' + item.title)">
                            <div class="img-box">
                                <ImgTag :url="imgUrl + item.pic" />
                                <span>{{ item.count }}篇文章</span>
                            </div>
                            <h3>{{ item.title }}</h3>
                        </li>
                    </ul>
                </div>
                <div class="weinituijian" v-if="pageData.recommend">
                    <h2 class="md-title">为你推荐</h2>
                    <div class="style1" @click="$store.commit('openUrl',pageData.recommend[0].url + '?ztid=' + pageData.recommend[0].id + '&bm=' + token)">
                        <ImgTag :url="imgUrl + pageData.recommend[0].pic" />
                        <div class="info1">
                            <p>{{pageData.recommend[0].title}}</p>
                            <span>{{pageData.recommend[0].price}}元起</span>
                        </div>
                        <p class="info2">{{pageData.recommend[0].desc}}</p>
                    </div>
                    <div class="style2" v-for="item,index in pageData.recommend" v-if="index != 0" @click="$store.commit('openUrl',item.url + '?ztid=' + item.id + '&bm=' + token)">
                        <div class="info-wrap">
                            <div class="userinfo">
                                <img src="../../../assets/images/icon/hyjlb_icon.png" />
                                <span>研发组：左左</span>
                            </div>
                            <p class="info-title">{{item.title}}</p>
                            <p class="info-content">{{item.desc}}</p>
                        </div>
                        <ImgTag class="goodsimg" :url="imgUrl + item.pic" />
                    </div>
                </div>
                <div class="more">
                    <h4>
                        <hr />
                        <span>更多精彩</span>
                    </h4>
                    <ul>
                        <li v-for="item in pageData.list" @click="$store.commit('openUrl',item.url + '?ztid=' + item.id + '&bm=' + token)">
                            <ImgTag :url="imgUrl + item.pic" />
                            <p>{{ item.desc }}</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            mySwiper1: null,
            mySwiper2: null,
            myScroll: null,
            pageData: [],
            token: localStorage.getItem('zzz') || ""
        }
    },
    mounted() {
        this.mySwiper1 = new Swiper("#special-swiper1",{
            effect : 'coverflow',
            slidesPerView: 1.2,
            centeredSlides: true,
            autoplay : 4000,
            // loop: true,
            autoplayDisableOnInteraction : false,
            coverflow: {
                rotate: 30,
                stretch: 10,
                depth: 60,
                modifier: 1.5,
                slideShadows : false
            }
        })
        
        this.mySwiper2 = new Swiper("#special-swiper2",{
            slidesPerView: "auto",
        })

        this.myScroll = new iScroll("#special-component",{
            preventDefault: false,
			probeType: 3,
        });

        

        this.getData();

        // 移除页面的默认移动事件行为
        this.$refs.specialComponent.addEventListener('touchmove', function(e){e.preventDefault()}, false);
    },
    methods: {
        getData() {
            this.$http.post(this.apiUrl,{
                code: "specialHome"
            }).then((data) => {
                if(data.ztm == 1) {
                    this.pageData = data;
                }
                setTimeout(() => {
                    this.myScroll.refresh();
                    this.mySwiper1.update();
                    this.mySwiper2.update();
                },300)
            })
        }
    },
    activated() {
        setTimeout(() => {
            this.myScroll.refresh();
            this.mySwiper1.update();
            this.mySwiper2.update();
        },300)
        this.$store.commit("showUrl");  //恢复显示webview
    }
}
</script>

<style lang="less">
.special-component {
    display: flex;
    flex-direction: column;
    header {
        background-color: #fafafa;
        padding: .28rem 0;
        font-size: .34rem;
        text-align: center;
        color: #000;
    }
    .main {
        flex: 1;
        overflow: hidden;
        #special-swiper1 {
            height: 3.68rem;
            padding: .26rem 0;
            background-color: #fff;
            .swiper-wrapper {
                .swiper-slide {
                    width: 100%;
                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: .15rem;
                    }
                }
            }
        }
        .nav {
            padding: .5rem 0;
            background-color: #fff;
            width: 100%;
            ul {
                li {
                    width: 1.7rem;
                    margin-left: .3rem;
                    .img-box {
                        position: relative;
                        height: 1.7rem;
                        border-radius: .1rem;
                        overflow: hidden;
                        img {
                            width: 100%;
                            height: 100%;
                        }
                        span {
                            position: absolute;
                            top: 0;
                            right: 0;
                            padding: .06rem .1rem;
                            background: rgba(0,0,0,.1); /* Old browsers */
                            color: #fff;
                        }
                    }
                    h3 {
                        text-align: center;
                        line-height: .6rem;
                    }
                }
            }
        }
        .md-title {
            line-height: 1.25rem;
            font-size: .3rem;
            text-align: center;
        }
        .weinituijian {
            background-color: #fff;
            margin-top: .2rem;
            padding: 0 .3rem .4rem;
            .style1 {
                border: 1px solid #dadada;
                border-radius: .1rem;
                overflow: hidden;
                img {
                    width: 100%;
                }
                .info1 {
                    display: flex;
                    padding: .3rem .2rem;
                    font-size: .35rem;
                    p {
                        flex: 1;
                        padding-right: .2rem;
                        
                    }
                }
                .info2 {
                   padding: 0 .2rem .7rem; 
                   color: #5f5f5f;
                   font-size: .26rem;
                }
            }
            .style2 {
                display: flex;
                border: 1px solid #dadada;
                border-radius: .1rem;
                overflow: hidden;
                margin-top: .3rem;
                .info-wrap {
                    flex: 1;
                    padding: 0 .2rem;
                    color: #000;
                    overflow: hidden;
                    .userinfo {
                        padding-top: .36rem;
                        img {
                            width: .5rem;
                            height: .5rem;
                            vertical-align: middle;
                        }
                        span {
                            vertical-align: middle;
                            font-size: .22rem;
                        }
                    }
                    .info-title {
                        font-size: .3rem;
                        font-weight: bold;
                        line-height: .7rem;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .info-content {
                        font-size: .24rem;
                        line-height: .4rem;
                        color: #5f5f5f;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;
                        overflow: hidden;
                    }
                }
                .goodsimg {
                    width: 2.9rem;
                    height: 2.9rem;
                }
            }
        }
        .more {
            
            padding: 0 .3rem;
            h4 {
                position: relative;
                text-align: center;
                line-height: 1.46rem;
                span {
                    position: relative;
                    display: inline-block;
                    padding: 0 .3rem;
                    font-size: .3rem;
                    font-weight: bold;
                    color: #000;
                    background-color: #f4f4f4;
                }
                hr {
                    position: absolute;
                    width: 90%;
                    left: 5%;
                    top: 49%;
                }
            }
            ul {
                li {
                    background-color: #fff;
                    padding: 0 .27rem;
                    overflow: hidden;
                    margin-bottom: .2rem;
                    img {
                        display: block;
                        width: 100%;
                        margin-top: .27rem;
                    }
                    p {
                        padding: .34rem 0;
                        font-size: .3rem;
                    }
                }
            }
        }
    }
}
</style>