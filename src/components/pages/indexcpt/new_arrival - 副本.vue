<template>
    <div class="newarrival-component" ref="newarrivalcomponent">
        <div class="main" ref="main">
            <PullDown ref="pulldown"/>
            <div class="swiper-container" ref="newarrivalswiper">
                <div class="swiper-wrapper">
                    <div class="swiper-slide">
                        <ImgTag url="http://yanxuan.nosdn.127.net/de110c16fd15d9693df087d8ac3b58fd.jpg?imageView&thumbnail=750x0&quality=75" />
                    </div>
                </div>
            </div>
            <div v-if="pageData">
                <GoodsList :goodslist="pageData.goods" />
            </div>
        </div>
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
            myScroll: null
        }
    },
    mounted() {
        var that = this;

        this.mySwiper = new Swiper(this.$refs.newarrivalswiper, {
            autoplay: 5000,//可选选项，自动滑动
        }) 

        this.myScroll = new iScroll(this.$refs.newarrivalcomponent,{
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
        
        this.getData();
    },
    methods: {
        getData() {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "newGoodsThefirst"
            }).then((data) => {
                if(data.ztm == 1) {
                    this.pageData = data;
                    setTimeout(() => {
                        this.myScroll.refresh();
                    },300)
                }
            })
        }
    },
    components: {
        GoodsList
    }
}
</script>

<style lang="less">
.newarrival-component {
    height: 100%;
    .main {
        background-color: #fff;
        .swiper-container {
            height: 4.2rem;
            margin-bottom: .2rem;
            .swiper-wrapper {
                .swiper-slide {
                    img {
                        width: 100%;
                    }
                }
            }
        }
    }
}
</style>
