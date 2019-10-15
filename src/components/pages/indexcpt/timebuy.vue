<template>
    <div class="timebuy-component" id="timebuy-component" ref="timebuyComponent">
        <yd-pullrefresh :callback="getData" ref="pullrefresh">
            <PullDown ref="pulldown" />
            <div class="top-banner" v-if="pageData.banner">
                <ImgTag :url="imgUrl + pageData.banner[0].pic" />
            </div>
            
            <div class="swiper-container timebuy-swiper" id="timebuy-swiper">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" :class="{'active' : tabActive == index}" v-for="(item,index) in pageData.data" @click="selectTab(item.id,index)">
                        <span>{{item.ch}}{{item.start_time}}:{{item.minute}}</span>
                        <span v-if="item.flag == 0">已结束</span>
                        <span v-if="item.sign">抢购中</span>
                        <span v-if="!item.sign && item.flag == 1">即将开始</span>
                    </div>
                </div>
            </div>
            <div class="slogan">
                <hr />
                <span>限时限量，先到先得</span>
            </div>
            <ul class="goods-list">
                <li v-for="item in goodsList">
                    <ImgTag :url="imgUrl + item.pic" />
                    <div class="content">
                        <p class="goodsname">{{item.title}}</p>
                        <p class="goodsinfo">{{item.desc}}</p>
                        <p class="goodsprice">限时价<span>¥{{item.minactityprice}}</span><span>原价 <s> ¥{{item.price}}</s></span></p>
                        <div class="btm-wrap clearfix">
                            <div class="progress-bar">
                                <span>仅剩{{item.surplus}}件</span>
                                <yd-progressbar type="line" :progress="item.surplus/item.allcount" trail-width="10" trail-color="#f9ce9b"></yd-progressbar>
                            </div>
                            <a class="btn" href="javascript:;" @click="$router.push('goodsdetails?id=' + item.id)">去看看</a>
                        </div>
                    </div>
                </li>
            </ul>
        </yd-pullrefresh>
    </div>
</template>

<script>
export default {
    props: ["tipid",'selfindex','activeindex'],
    data() {
        return {
            tabActive: 0,
            mySwiper: null,
            pageData: {
                data: []
            },
            id: "",
            goodsList: [],
            scrollTop: 0,  //页面滚动高度
        }
    },
    watch: {
        activeindex(val,oldval) {
            if(this.selfindex == val && this.pageData.data.length == 0) {
                this.getData();
            }
        }
    },
    mounted() {
        var that = this;
        this.mySwiper = new Swiper('#timebuy-swiper',{
            watchSlidesProgress : true,
            watchSlidesVisibility : true,
            slidesPerView : 4.5,
        })
        
        this.$refs.timebuyComponent.addEventListener("scroll",function() {
            that.scrollTop = this.scrollTop;
        })
        
    },
    methods: {
        getData() {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "timelimitbuy",
            }).then((data) => {
                this.$refs.pullrefresh.$emit('ydui.pullrefresh.finishLoad');
                if(data.ztm == 1) {
                    this.pageData = data;
                    this.selectTab(data.data[0].id,0);
                }
                setTimeout(() => {
                    this.mySwiper.update();
                },300)
            }).catch(() => {
                this.$refs.pullrefresh.$emit('ydui.pullrefresh.finishLoad');
            }) 
        },
        selectTab(id,i) {
            this.tabActive = i;
            this.mySwiper.slideTo(i);
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "getTimeLimitDetail",
                id: id
            }).then((data) => {
                if(data.ztm == 1) {
                    this.goodsList = data.data;
                }else {
                    this.goodsList = [];
                }
            })
        }
    },
    activated() {
        this.$refs.timebuyComponent.scrollTop = this.scrollTop;
    },
}
</script>

<style lang="less">
.timebuy-component {
    height: 100%;
    -webkit-overflow-scrolling: touch;
    overflow-y: scroll;
    overflow-x: hidden;
    .top-banner {
        img {
            display: block;
            width: 100%;
        }
    }
    .timebuy-swiper {
        overflow: initial;
        .swiper-wrapper {
            .swiper-slide {
                position: relative;
                padding: .1rem 0;
                background-color: #f9ddc5;
                span {
                    display: block;
                    border-right: 1px solid #d0b89e;
                    color: #000;
                    font-weight: bold;
                    &:nth-child(2) {
                        color: #8b948d;
                    }
                }
                &.active {
                    background-color: #f59119;
                    span {
                        color: #fff;
                        border: none;
                    }
                    &:after {
                        content: "";
                        position: absolute;
                        bottom: -0.24rem;
                        left: 50%;
                        transform: translateX(-50%);
                        border: .12rem solid transparent;
                        border-top-color: #f59119;
                    }
                }
            }
        }
    }
    .slogan {
        position: relative;
        line-height: 1rem;
        background-color: #fff;
        hr {
            position: absolute;
            width: 84%;
            left: 8%;
            top: .5rem;
        }
        span {
            position: relative;
            display: inline-block;
            font-size: .26rem;
            font-weight: bold;
            background-color: #fff;
            padding: 0 .3rem;
        }
    }
    .goods-list {
        li {
            display: flex;
            background-color: #fff;
            margin-top: .2rem;
            padding: .2rem;
            img {
                width: 2.65rem;
                height: 2.65rem;
            }
            .content {
                flex: 1;
                text-align: left;
                padding: 0 0 0 .2rem;
                overflow: hidden;
                p {
                    width: 100%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    
                }
                .goodsname {
                    font-size: .3rem;
                    color: #000;
                    font-weight: bold;
                    padding-top: .16rem;
                }
                .goodsinfo {
                    color: #a4a4a4;
                    font-size: .26rem;
                    padding-top: .16rem;
                }
                .goodsprice {
                    font-size: .26rem;
                    padding-top: .26rem;
                    span {
                        padding-left: .1rem;
                        color: #a4a4a4;
                        &:nth-child(1) {
                            font-size: .35rem;
                            color: #c33;
                            font-weight: bold;
                        }
                    }
                }
                .btm-wrap {
                    padding-top: .2rem;
                    .progress-bar {
                        position: relative;
                        margin-top: .1rem;
                        float: left;
                        width: 1.78rem;
                        height: .4rem;
                        line-height: .4rem;
                        border: 2px solid #f59119;
                        border-radius: .2rem;
                        overflow: hidden;
                        text-align: center;
                        span {
                            display: inline-block;
                            position: relative;
                            font-size: .15rem;  
                            z-index: 1;  
                            color: #f59119;
                        }
                        .yd-progressbar {
                            position: absolute;
                            top: 0;
                            left: 0;
                            svg {
                                height: 100%;
                            }
                        }
                    }
                    .btn {
                        float: right;
                        padding: .12rem .36rem;
                        background-color: #f59119;
                        color: #fff;
                        border-radius: .05rem;
                    }
                }
            }
        }
    }
}
</style>