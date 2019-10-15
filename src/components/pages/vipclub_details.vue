<template>
    <div class="vipclubdetails-page">
        <ComHeaderbar text="特权说明" />
        <div class="main" v-if="pageData">
            <div class="swiper-container">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="item in pageData">
                        <span>{{item.title}}</span>
                        <i></i>
                    </div>
                </div>
            </div>
            <div class="content" v-html="pageData[activeIdx].content"></div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            mySwiper: null,
            pageData: null,
            activeIdx: 0
        }
    },
    mounted() {
        
        this.getData();
    },
    methods: {
        getData() {
            this.$store.commit("openWait");
            this.$http.post(this.shareApiUrl,{
                code: "vipServiceDetail"
            }).then((data) => {
                console.log(data)
                if(data.ztm == 1) {
                    this.pageData = data.data;
                    setTimeout(() => {
                        this.initSwiper();
                        this.mySwiper.slideTo(this.$route.query.i);
                    },300)
                }
            })
        },
        initSwiper() {
            var that = this;
            this.mySwiper = new Swiper('.swiper-container', {
                effect : 'coverflow',
                slidesPerView: 1.5,
                centeredSlides: true,
                autoplayDisableOnInteraction : false,
                coverflow: {
                    rotate: 30,
                    stretch: 10,
                    depth: 60,
                    modifier: 1.5,
                    slideShadows : false
                },
                onSlideChangeStart: function() {
                    that.activeIdx = that.mySwiper.activeIndex;
                }
            })
        }
    }
}
</script>       

<style lang="less">
.vipclubdetails-page {
    display: flex;
    flex-direction: column;
    .main {
        flex: 1;
        -webkit-overflow-scrolling: touch;
        overflow-y: scroll;
        background-color: #fff;
        .swiper-container {
            padding: .3rem 0;
            border-bottom: 1px solid #9d9d9d;
            .swiper-slide {
                background-color: #f6efdf;
                padding: .8rem .4rem;
                span {
                    font-size: .4rem;
                    color: #b8a56b;
                }
                i {
                    display: block;
                    border-bottom: .04rem solid #b8a56b;
                    width: 1rem;
                    margin-top: .2rem;
                }
            }
        }
        .content {
            padding: .27rem;
        }
    }
}
</style>

