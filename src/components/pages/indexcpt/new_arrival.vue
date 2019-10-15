<template>
    <div class="newarrival-component" ref="newarrivalcomponent">
        <yd-pullrefresh class="main" :callback="getData" ref="pullrefresh">
            <div class="swiper-container" ref="newarrivalswiper">
                <div class="swiper-wrapper" v-if="pageData">
                    <div class="swiper-slide" v-for="item in pageData.banner" @click="bannerGo(item)">
                        <ImgTag :url="imgUrl + item.pic" />
                    </div>
                </div>
            </div>
            <div v-if="pageData">
                <GoodsList :goodslist="pageData.goods" />
            </div>
        </yd-pullrefresh>
    </div>
</template>

<script>
import GoodsList from "../../common/goodslist_component";
export default {
    props: ["tipid",'selfindex','activeindex'],
    data() {
        return {
            pageData: null,
            mySwiper: null,
            scrollTop: 0,  //页面滚动高度
        }
    },
    mounted() {
        var that = this;

        this.mySwiper = new Swiper(this.$refs.newarrivalswiper, {
            autoplay: 5000,//可选选项，自动滑动
        }) 
        this.$refs.newarrivalcomponent.addEventListener("scroll", function() {
            that.scrollTop = this.scrollTop;
        })
        
        this.getData();
    },
    methods: {
        getData() {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "newGoodsThefirst"
            }).then((data) => {
                console.log("新品")
                console.log(data)
                this.$refs.pullrefresh.$emit('ydui.pullrefresh.finishLoad');
                if(data.ztm == 1) {
                    this.pageData = data;
                }
            }).catch(() => {
                this.$refs.pullrefresh.$emit('ydui.pullrefresh.finishLoad');
            })
        },
        bannerGo(item) {  //广告图跳转
            console.log(item)
            switch(item.type) {
                case 1:  //网址型
                    this.$store.commit("openUrl", item.url);
                    break;
                case 2:  //商品型
                    this.$router.push('goodsdetails?id=' + item.goodsid);
                    break;
                default:
            }
        }
    },
    activated() {
        this.$refs.newarrivalcomponent.scrollTop = this.scrollTop;
    },
    components: {
        GoodsList
    }
}
</script>

<style lang="less">
.newarrival-component {
    height: 100%;
    -webkit-overflow-scrolling: touch;
    overflow-y: scroll;
    overflow-x: hidden;
    .main {
        background-color: #fff;
        .swiper-container {
            height: 4.2rem;
            margin-bottom: .2rem;
            .swiper-wrapper {
                .swiper-slide {
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
    }
}
</style>
