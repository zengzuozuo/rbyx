<template>
    <div class="detailsclassgoods-page">
        <ComHeaderbar :text="pageData.name">
            <a class="other" @click="$router.push('/search')" href="javascript:;"></a>
        </ComHeaderbar>
        <div class="main">
            <div class="swiper-container" id="dc-swier-container1">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" :class="{'active' : tabActive == index}" v-for="(item,index) in pageData.level2data">
                        <span>{{item.name}}</span>
                    </div>
                </div>
            </div>
            <div class="swiper-container" id="dc-swiper-container2">
                <div class="swiper-wrapper" id="home-swiper-wrapper">
                    <div class="swiper-slide" v-for="item in pageData.level2data">
                        <div class="class-title">{{item.typedesc}}</div>
                        <GoodList :goodslist="item.goods"></GoodList>
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
            tabActive: this.$route.query.i || 0,
            pageData: [],
            mySwiper2: null,
            mySwiper3: null,
            dom: null
        }
    },
    mounted() {
        var that = this;
        this.mySwiper2 = new Swiper('#dc-swier-container1',{
            watchSlidesProgress : true,
            watchSlidesVisibility : true,
            slidesPerView : 3.8,
            onTap: function(){
                that.mySwiper3.slideTo( that.mySwiper2.clickedIndex)
                that.tabActive = that.mySwiper2.clickedIndex;
                that.bindScroll();
            }
        })

        this.mySwiper3 = new Swiper('#dc-swiper-container2',{
            passiveListeners : false,
            // threshold : 80,
            onSlideChangeStart: function(){
                that.mySwiper2.slideTo(that.mySwiper3.activeIndex)
                that.tabActive = that.mySwiper3.activeIndex;
                that.bindScroll();
            },
            onInit: function(swiper){
                // that.bindScroll();
                if(that.pageData.length != 0) {
                    console.log(document.getElementsByClassName('swiper-slide-active'))
                }
            }
        })

        // this.setHeight("home-swiper-wrapper");
        

        
    },
    methods: {
        getData() {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "getcategoryDetail",
                typeid: this.$route.query.id
            }).then((data) => {
                console.log(data)
                if(data.ztm == 1) {
                    this.pageData = data.category;
                    setTimeout(() => {
                        this.mySwiper2.update();
                        this.mySwiper3.update();
                        this.bindScroll();
                        this.mySwiper3.slideTo(this.tabActive);
                    },100)
                }
            })
        },
        bindScroll() {
            sessionStorage.setItem('ggScrollTop', 0);
            this.dom = document.getElementsByClassName('swiper-slide-active')[1];
            if(!this.dom) {
                this.dom = document.getElementsByClassName('swiper-slide-active')[0];
            }
            this.dom.removeEventListener("scroll",this.scrollFn,false);
            this.dom.addEventListener("scroll",this.scrollFn,false);
        },
        scrollFn() {
            sessionStorage.setItem('ggScrollTop', this.dom.scrollTop);
        }
    },
    activated() {
        if(sessionStorage.getItem("frompath") == "/class") {
            this.tabActive = this.$route.query.i || 0;
        }else {
            if(this.dom) {
                this.dom.scrollTop = sessionStorage.getItem("ggScrollTop");
            }
        }
        this.getData()
    },
    components: {
        GoodList
    }
}
</script>

<style lang="less">
.detailsclassgoods-page {
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
        #dc-swier-container1 {
            width: 100%;
            -webkit-overflow-scrolling: touch;
            overflow-y: scroll;
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
        #dc-swiper-container2 {
            width: 100%;
            overflow: hidden;
            flex: 1;
            .swiper-slide {
                background-color: #fff;
                height: 100%;
                text-align: center;
                -webkit-overflow-scrolling: touch;
                overflow-y: scroll;
                .class-title {
                    border-top: .2rem solid #fafafa;
                    line-height: 1rem;
                    font-size: .26rem;
                }
            }
        }
    }
}
</style>