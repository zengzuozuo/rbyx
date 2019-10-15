<template>
    <div class="goodsdetails-page" ref="goodsdetailsPage">
        <header class="clearfix">
            <a class="icon arrow-back" href="javascript:;" @click="$router.goBack(-1)"></a>
            <div class="tabbar">
                <span :class="{'active' : activeNum == 0}" @click="slideTo(0)">商品</span>
                <span :class="{'active' : activeNum == 1}" @click="slideTo(1)">详情</span>
            </div>
            <a class="icon share" href="javascript:;" @click="$store.state.shareIsShow = true"></a>
            <a class="icon go-home" @click="$router.push('/home')" href="javascript:;"></a>
        </header>
        <div class="main" ref="main">
            <div class="swiper-container" id="goodsdetails-swiper">
                <div class="swiper-wrapper">
                    <div class="swiper-slide swiper-no-swiping goodsScroll" id="goodsScroll" style="overflow: hidden">
                        <div class="scroll-wrap" style="min-height: 100.1%;position: relative;">
                            <div class="pullbar-down">
                                <img v-show="isMoreDown" src="../../assets/images/icon/arrow_down2_icon.png" />
                                <span v-show="isMoreDown">下拉查看更多精彩</span>
                                <img v-show="!isMoreDown" src="../../assets/images/icon/arrow_up2_icon.png" />
                                <span v-show="!isMoreDown">释放查看更多精彩</span>
                            </div>
                            <yd-slider autoplay="3000" v-if="pageData">
                                <yd-slider-item v-for="(item,index) in pageData.goodsbanner" :key="index">
                                    <a href="javascript:;">
                                        <ImgTag :url="imgUrl + item.pic" />
                                    </a>
                                </yd-slider-item>
                            </yd-slider>
                            <div v-if="pageData">
                                <div class="clearfix timebar" v-if="pageData.data.istimelimit > 0">
                                    <h3>限时购 <span>抢购中</span></h3>
                                    <p>距离结束还剩<yd-countdown :time="pageData.data.times" :callback="getData"></yd-countdown></p>
                                </div>
                            </div>
                            <ul class="label" v-if="pageData">
                                <li v-for="item in pageData.goodslabel">
                                    <ImgTag :url="imgUrl + item.icon" />
                                    <p>{{item.labelone}}{{item.labeltwo}}</p>
                                </li>
                            </ul>
                            <div class="goodsinfo" v-if="pageData">
                                <div class="ctn-l">
                                    <h3>{{ pageData.data.title }}</h3>
                                    <p>{{ pageData.data.desc }}</p>
                                    <span>¥{{ onePrice }}</span>
                                    <s v-if="onePrice < oldPrice">¥{{oldPrice}}</s>
                                </div>
                                <div class="ctn-r">
                                    <span>{{pageData.evacount}}</span>
                                    <span>用户评论</span>
                                    <a href="javascript:;" @click="$router.push('comment?id=' + pageData.data.id)">查看</a>
                                </div>
                            </div>
                            <yd-cell-group v-if="pageData">
                                <yd-cell-item arrow type="a" @click.native="$store.state.popupIsShow = true;">
                                    <span slot="left">规格数量选择</span>
                                    <span slot="right">{{ggName}} ×{{amount}}</span>
                                </yd-cell-item>
                                <yd-cell-item arrow type="label" @click.native="promotionIsShow = true" v-if="pageData.activity.length != 0">
                                    <span slot="left">促销：</span>
                                    <span slot="right" class="orange"><span v-for="item,index in pageData.activity">{{item.name}} </span></span>
                                </yd-cell-item>
                                <yd-cell-item v-if="pageData">
                                    <span slot="left">积分：</span>
                                    <span slot="right">购买最高得{{pageData.data.integral}}积分</span>
                                </yd-cell-item>
                                <yd-cell-item arrow @click.native="service = true">
                                    <span slot="left">服务：</span>
                                    <span slot="right"><span v-for="item in pageData.home_service">• {{item.servicename}}　</span></span>
                                </yd-cell-item>
                            </yd-cell-group>
                            <yd-cell-group v-if="pageData">
                                <yd-cell-item arrow @click.native="$router.push('comment?id=' + pageData.data.id)">
                                    <span slot="left">用户评价（{{pageData.evacount}}）</span>
                                    <span slot="right">{{pageData.goodrate}}%好评</span>
                                </yd-cell-item>
                                <div class="comment" v-for="item in pageData.evaluate">
                                    <div class="userinfo">
                                        <ImgTag :url="appImgUrl + item.avatar" />
                                        <span>{{item.username}}</span>
                                        <i></i>
                                    </div>
                                    <p class="orderinfo">
                                        <span>{{item.createtime}}</span>
                                        <span>{{item.vs}}</span>
                                    </p>
                                    <p class="remark">{{item.content}}</p>
                                    <div class="img-box">
                                        <yd-lightbox>
                                            <yd-lightbox-img v-for="subItem,key in item.img" :key="key" :src="appImgUrl + subItem"></yd-lightbox-img>
                                        </yd-lightbox>
                                    </div>
                                </div>
                            </yd-cell-group>
                            <div class="pullbar">
                                <span v-show="isPullUp">下拉查看更多详情</span>
                                <img v-show="isPullUp" src="../../assets/images/icon/arrow_down2_icon.png" />
                                <span v-show="!isPullUp">释放查看更多详情</span>
                                <img v-show="!isPullUp" src="../../assets/images/icon/arrow_up2_icon.png" />
                            </div>
                        </div>
                    </div>
                    <div class="swiper-slide swiper-no-swiping detailsscroll" id="detailsscroll" style="overflow: hidden">
                        <div class="scroll-wrap" style="min-height: 100.1%;position: relative;z-index: -1">
                            <!-- <ul class="parameters">
                                <li v-for="item in 5">
                                    <label>适用环境</label>
                                    <p>家用</p>
                                </li>
                            </ul> -->
                            <div v-if="pageData">
                                <div v-html='pageData.data.content'></div>
                            </div>
                            <div class="pullbar">
                                <img v-show="isPullDown" src="../../assets/images/icon/arrow_down2_icon.png" />
                                <span v-show="isPullDown">下拉返回顶部</span>
                                <img v-show="!isPullDown" src="../../assets/images/icon/arrow_up2_icon.png" />
                                <span v-show="!isPullDown">释放返回顶部</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <yd-popup class="specifications-shade" v-model="$store.state.popupIsShow" position="bottom">
                <div class="specifications-box" v-if="pageData">
                    <div class="ctn-top">
                        <ImgTag :url="imgUrl + pageData.data.pic" />
                        <div>
                            <span>价格：¥{{ price }}</span>
                            <p>{{ggName}}</p>
                            <P>库存 {{stock}}</P>
                        </div>
                    </div>
                    <div class="ctn-mld-wrap" style="max-height: 5rem;overflow-y:scroll;">
                        <div class="ctn-mld" v-for="(item,index) in pageData.specifications">
                            <label>{{item.spename}}</label>
                            <ul class="clearfix">
                                <li :class="{'active' : subitem.keys == item.art}" v-for="subitem in item.data" @click="item.art = subitem.keys">{{subitem.vals}}</li>
                            </ul>
                        </div>
                    </div>
                    <div class="ctn-btm">
                        <label>数量</label>
                        <yd-spinner :max="stock" unit="1" v-model="amount"></yd-spinner>
                    </div>
                </div>
                <i class="close-icon" @click="$store.state.popupIsShow = false"></i>
            </yd-popup>
            <yd-popup class="promotion-shade" v-model="promotionIsShow" position="bottom" height="auto">
                <div class="promotion-box" v-if="pageData">
                    <h2 style="line-height: 1rem;text-align: center;font-size: .3rem;border-bottom: 1px solid #d9d9d9">{{pageData.activity.length}}个促销</h2>
                    <yd-cell-group>
                        <yd-cell-item arrow type="label" v-for="item,index in pageData.activity" :key="index" @click.native="$router.push('pmtgoodslist?id=' + item.id + '&title=' + item.name)">
                            <span slot="left" style="color: #f6a23f;">{{item.name}}</span>
                        </yd-cell-item>
                    </yd-cell-group>
                </div>
            </yd-popup>
            <yd-popup class="service-shade" v-model="service" position="bottom" height="auto">
                <div class="service-box">
                    <h2 style="line-height: 1rem;text-align: center;font-size: .3rem;border-bottom: 1px solid #d9d9d9">服务</h2>
                    <ul v-if="pageData">
                        <li v-for="item in pageData.home_service">
                            <label>• {{item.servicename}}</label>
                            <p>{{item.content}}</p>
                        </li>
                    </ul>
                </div>
            </yd-popup>
            <div class="footprint" v-show="footprintBox" @click="footprintBox = false">
                <div class="content animated slideInDown" @click="$event.cancelBubble = true" v-show="footprintBox" v-bind:key="1">
                    <div class="swiper-container" id="footprint-swiper" ref="footprintswiper">
                        <div class="swiper-pagination">我的足迹</div>
                        <div class="swiper-wrapper" v-if="pageData">
                            <div class="swiper-slide" v-for="item in pageData.footgoods" @click="footprintGo(item.id)">
                                <img :src="imgUrl + item.pic" alt="" />
                                <p>{{item.title}}</p>
                                <span>￥{{item.minprice}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <transition-group name="bounce">
                <ShareBox :shareSendObj="shareSendObj" v-show="$store.state.shareIsShow" v-bind:key="1"></ShareBox>
            </transition-group>
        </div>
        <footer>
            <div v-if="pageData">
                <a class="icon service" :href="'tel:' + tel"></a>
                <router-link to="shopingcart" class="icon goodscart" href="javascript:;"></router-link>
                <a class="icon star" :class="{'yellow' : pageData.collection == 1}" href="javascript:;" @click="collection"></a>
                <a class="btn buy" href="javascript:;" @click="buy">立即购买</a>
                <a class="btn addcart" href="javascript:;" @click="joinCart">加入购物车</a>
            </div>
        </footer>
    </div>
</template>

<script>
export default {
    data() {
        return {
            mySwiper: null,
            footprintSwiper: null,
            activeNum: 0,
            goodsScroll: null,
            isPullUp: true,
            isPullDown: true,
            isMoreDown: true,  //下拉查看足迹
            footprintBox: false,  //足迹列表是否显示
            detailsScroll: null,
            amount: 1,  //商品数量
            stock: 0,  //库存
            promotionIsShow: false,  //促销
            service: false,  //服务
            shareShow: false,
            pageData: null,
            ggArr: [],  //已选中规格数组
            price: 0,  //商品总价
            onePrice: 0,  //单价
            oldPrice: 0,  //原价
            ggName: "",  //已选规格名
            ggId: "",  //已选规格id
            shareSendObj: {
                title : "融博优选",
                content : "【融博优选】为您提供优质的购物体验",
                href : this.serversUrl + "/h5/index.html#/goodsdetails?id=" + this.$route.query.id,
                pictures : "",
                thumbs: ""
            },
            tel: localStorage.getItem("tel") || ""
        }
    },
    watch: {
        pageData: {
            handler: function (val, oldVal) {
                for(var i in this.pageData.specifications) {
                    this.ggArr[i] = this.pageData.specifications[i].art;
                }
                for(var i in this.pageData.goodsSpeVal) {
                    if(this.ggArr.sort(function(a,b){return a-b}).join(",") == this.pageData.goodsSpeVal[i].path) {
                        if(this.pageData.data.istimelimit > 0) {  //判断是否为限时购商品
                            this.onePrice = this.pageData.goodsSpeVal[i].activityprice; 
                        }else if(this.pageData.data.isactivity > 0){
                            this.onePrice = this.pageData.goodsSpeVal[i].promotionprice;
                        }else {
                            this.onePrice = this.pageData.goodsSpeVal[i].price;
                        }
                        this.oldPrice = this.pageData.goodsSpeVal[i].price;
                        this.price = this.onePrice * this.amount;
                        this.ggName = this.pageData.goodsSpeVal[i].vs;
                        this.stock = this.pageData.goodsSpeVal[i].stock;
                        this.ggId = this.pageData.goodsSpeVal[i].id;
                        this.amount = 1;

                        if(this.stock <= 0) { //库存不足
                            this.$dialog.toast({mes: "暂无库存"}); 
                        }
                        break;
                    }
                }
            },
            deep: true
        },
        amount: function(val, oldVal) {
            this.price = this.onePrice * val;
        }
    },
    mounted() {
        var that = this;

        this.getData();   //请求页面数据

        this.setHeight("goodsdetails-swiper");

        this.mySwiper = new Swiper('#goodsdetails-swiper',{
            direction : 'vertical',
            resistanceRatio : 0,
            onSlideChangeStart: function(){
                that.activeNum = that.mySwiper.activeIndex;
            }
        })

        

        this.goodsScroll = new iScroll("#goodsScroll",{
            preventDefault: false,
			probeType: 3,
        });
        this.goodsScroll.on("scroll",function(){
            if((this.maxScrollY - this.y) > 100) {
                that.isPullUp = false;
            }else {
                that.isPullUp = true;
            }

            if(this.y >= 100) {   //下拉到100px时更改状态
                that.isMoreDown = false;
            }else {
                that.isMoreDown = true;
            }
        })
        

        this.detailsScroll = new iScroll("#detailsscroll",{
            preventDefault: false,
			probeType: 3,
        })

        this.detailsScroll.on("scroll",function(){
            if(this.y > 100) {
                that.isPullDown = false;
            }else {
                that.isPullDown = true;
            }
        })

        this.$refs.main.addEventListener("touchend",function(e){
            if(!that.isPullUp) {
                that.mySwiper.slideTo(1);
            }
            if(!that.isPullDown) {
                that.mySwiper.slideTo(0);
            }
            if(!that.isMoreDown) {
                that.footprintBox = true;
                setTimeout(() => {
                    that.initSwiper();
                },300)
                
            }
        })
        setTimeout(() => {
            this.goodsScroll.refresh();
            this.detailsScroll.refresh();
        },300)
        // 移除页面的默认移动事件行为
        this.$refs.goodsdetailsPage.addEventListener('touchmove', function(e){e.preventDefault()}, false);
    },
    methods: {
        buy() {
            if(!localStorage.getItem("zzz")) {
                this.$dialog.confirm({
                    title: "提示",
                    mes: "暂未登录，是否立即登录？",
                    opts: () => {
                        this.$router.push("login?back=1");
                    }
                });
                return;
            }
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "getDufaultAddress",
            }).then((data) => {
                switch(data.ztm) {
                    case 1:
                        this.$store.commit("setShopingCart",{data:{
                            goodslist: [{
                                goodsid: this.pageData.data.id,
                                number: this.amount,
                                pic: this.pageData.data.pic,
                                price: this.onePrice,
                                specifications: this.ggName,
                                stock: this.stock,
                                total: this.price,
                                title: this.pageData.data.title,
                                desc: this.pageData.data.desc,
                                specificationsid: this.ggId
                            }],
                            total: this.price,
                            address: data.data[0],
                            // usecouponid: ""
                        }})
                        this.$router.push('writeorder?gd=1');
                        break;
                    case 0:
                        this.$dialog.confirm({
                            title: data.msg,
                            mes: "是否马上添加",
                            opts: () => {
                                this.$router.push("address");
                            }
                        });
                        break;
                    default: 
                }
            })
            
        },
        joinCart() {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "joinShoppingCart",
                goodsid: this.pageData.data.id,
                specifications: this.ggName, 
                number: this.amount,
                price: this.price,
                specificationsid: this.ggId
            }).then((data) => {
                if(data.ztm == 1) {
                    this.$dialog.toast({
                        mes: data.msg,
                        icon: "success"
                    })
                }
            })
        },
        slideTo(num) {
            this.mySwiper.slideTo(num);
        },
        getData() {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "goodsDetail",
                id: this.$route.query.id || "",
                spbh: this.$route.query.spbh || "",
            }).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    this.pageData = data;

                    // 设置分享内容
                    this.shareSendObj.content = data.data.title; 
                    this.shareSendObj.thumbs = this.imgUrl + data.data.pic;

                    setTimeout(() => {
                        this.goodsScroll.refresh();
                        this.detailsScroll.refresh();
                    },300)
                }else {
                    this.$dialog.toast({mes: data.msg});
                }
            })
        },
        collection() {
            this.$http.post(this.apiUrl,{
                code: "collection",
                type: 1,
                id: this.$route.query.id
            }).then((data) => {
                console.log(data)
                if(data.ztm == 1) {
                    this.pageData.collection = this.pageData.collection == 1 ? 0 : 1;
                }else {
                    this.$dialog.toast({
                        mes: data.msg,
                        icon: "error"
                    })
                }
                
            })
        },
        initSwiper() {
            this.footprintSwiper = new Swiper(this.$refs.footprintswiper,{
                effect : 'coverflow',
                slidesPerView: "auto",
                centeredSlides: true,
                pagination : '.swiper-pagination',
                paginationType : 'fraction',
                paginationFractionRender: function (swiper, currentClassName, totalClassName) {
                    return '我的足迹（<span class="' + currentClassName + '"></span>' +
                            '/' +
                            '<span class="' + totalClassName + '"></span>）';
                },
                coverflow: {
                    rotate: 0,
                    stretch: -10,
                    depth: 60,
                    modifier: 2,
                    slideShadows : true
                }
            })
        },
        footprintGo(id) {
            this.$router.replace("goodsdetails?id=" + id);
            this.footprintBox = false;
            this.getData();
        }
    }
}
</script>

<style lang="less">
.goodsdetails-page {
    display: flex;
    flex-direction: column;
    header {
        position: relative;
        height: .88rem;
        background-color: #fafafa;
        .icon {
            height: .88rem;
            width: .88rem;
            
            &.arrow-back {
                float: left;
                background: url("../../assets/images/icon/arrow_back_black.png") no-repeat center;
                background-size: 50%;
            }
            &.share {
                float: right;
                background: url("../../assets/images/icon/transmit_icon.png") no-repeat center;
                background-size: 50%;
            }
            &.go-home {
                float: right;
                background: url("../../assets/images/icon/home_icon.png") no-repeat center;
                background-size: 50%;
            }
        }
        .tabbar {
            position: absolute;
            top: .1rem;
            left: 50%;
            transform: translateX(-50%);
            height: .68rem;
            border: .04rem solid #7f7f7f;
            background-color: #7f7f7f;
            border-radius: .1rem;
            overflow: hidden;
            span {
                display: inline-block;
                padding: 0 .3rem;
                font-size: .3rem;
                line-height: .6rem;
                background-color: #fafafa;
                &.active {
                    background-color: #7f7f7f;
                    color: #fff;
                }
            }
        }
    }
    .main {
        flex: 1;
        overflow: hidden;
        position: relative;
        #goodsdetails-swiper {
            .swiper-wrapper {
                .goodsScroll {
                    background-color: #f5f5f5;
                    .yd-slider {
                        max-height: 7rem;
                        overflow: hidden;
                        a {
                            width: 100%;
                            height: 100%; 
                            img {
                                height: 100%;
                            }
                        }
                    }
                    .timebar {
                        width: 100%;
                        background-color: rgba(246,195,41,.8);
                        line-height: .6rem;
                        padding: 0 .2rem;
                        h3 {
                            float: left;
                            font-size: .3rem;
                            span {
                                font-size: .24rem;
                                font-weight: normal;
                            }
                        }
                        p {
                            float: right;
                            font-size: .24rem;
                        }
                    }
                    .label {
                        display: flex;
                        padding: .2rem .15rem;
                        li {
                            flex: 1;
                            display: flex;
                            padding: 0 .15rem;
                            overflow: hidden;
                            img {
                                width: .76rem;
                                height: .76rem;
                                border-radius: 50%;
                            }
                            p {
                                flex: 1;
                                margin-left: .12rem;
                                font-size: .28rem;
                            }
                        }
                    }
                    .goodsinfo {
                        display: flex;
                        background-color: #fff;
                        padding: .34rem .3rem;
                        .ctn-l {
                            flex: 1;
                            border-right: 1px dashed #8c8c8c;
                            h3 {
                                font-size: .36rem;
                                font-weight: normal;
                            }
                            p {
                                color: #8c8c8c;
                                font-size: .28rem;
                            }
                            span {
                                font-size: .4rem;
                                color: #c33;
                                font-weight: bold;
                            }
                            s {
                                font-size: .25rem;
                                color: #999;
                                display: inline-block;
                                padding-left: .1rem;
                            }
                        }
                        .ctn-r {
                            padding: 0 .3rem;
                            align-self: center;
                            span {
                                display: block;
                                color: #c33;
                                text-align: center;
                                &:nth-child(1) {
                                    font-size: .3rem;
                                    font-weight: bold;
                                }
                                
                            }
                            a {
                                display: inline-block;
                                border: 1px solid #797979;
                                padding: .05rem .25rem;
                                border-radius: .05rem;
                            }
                        }
                    }
                    .yd-cell-box {
                        margin-top: .2rem;
                        margin-bottom: 0;
                        .orange {
                            color: #f6a23f;
                        }
                        .comment {
                            padding: .3rem;
                            .userinfo {
                                img {
                                    width: .68rem;
                                    height: .68rem;
                                    vertical-align: middle;
                                    border-radius: 50%;
                                }
                                span {
                                    display: inline-block;
                                    padding: 0 .1rem;
                                    font-size: .3rem;
                                    color: #000;
                                    vertical-align: middle;
                                }
                                i {
                                    display: inline-block;
                                    border-radius: .03rem;
                                    width: .3rem;
                                    height: .3rem;
                                    background: #b4a078 url("../../assets/images/icon/vip1_icon.png") no-repeat center;
                                    background-size: 100%;
                                    vertical-align: middle;
                                }
                            }
                            .orderinfo {
                                line-height: .7rem;
                                color: #727272;
                                font-size: .28rem;
                            }
                            .remark {
                                line-height: .44rem;
                                color: #000;
                                font-size: .28rem;
                                display: -webkit-box;
                                -webkit-box-orient: vertical;
                                -webkit-line-clamp: 2;
                                overflow: hidden;
                            }
                            .img-box {
                                img {
                                    width: 23%;
                                    height: 1.56rem;
                                    margin: .2rem 2% 0 0;
                                }
                            }
                        }
                    }
                    .pullbar {
                        position: absolute;
                        width: 100%;
                        bottom: -2.2rem;
                        left: 0;
                        padding: .4rem 0;
                        text-align: center;
                        img {
                            display: block;
                            width: .6rem;
                            margin: .2rem auto;
                        }
                        span {
                            font-size: .26rem;
                        }
                    }
                    .pullbar-down {   //下拉查看足迹
                        position: absolute;
                        z-index: 99999;
                        width: 100%;
                        left: 0;
                        top: -1.35rem;
                        text-align: center;
                        line-height: 1rem;
                        img {
                            display: inline-block;
                            width: .6rem;
                            vertical-align: middle;
                        }
                        span {
                            font-size: .26rem;
                        }
                    }
                }
                .detailsscroll {
                    .pullbar {
                        position: absolute;
                        width: 100%;
                        top: -2.2rem;
                        left: 0;
                        padding: .4rem 0;
                        text-align: center;
                        img {
                            display: block;
                            width: .6rem;
                            margin: .2rem auto;
                        }
                        span {
                            font-size: .26rem;
                        }
                    }
                    .parameters {
                        background-color: #fff;
                        padding: .28rem;
                        li {
                            display: flex;
                            border-top: 1px dashed #8c8a89;
                            line-height: .6rem;
                            label {
                                width: 1.68rem;
                            }
                            p {
                                flex: 1;
                            }
                            &:last-child {
                                border-bottom: 1px dashed #8c8a89;
                            }
                        }
                    }
                    img {
                        display: block;
                        width: 100%;
                    }
                }
            }
        }
        .specifications-shade {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            .yd-mask {
                position: absolute;
            }
            .yd-popup {
                position: absolute;
                height: auto !important;
            }
            .specifications-box {
                position: relative;
                background-color: #fff;
                padding: 0 .3rem;
                .ctn-top {
                    display: flex;
                    padding: .4rem 0;
                    img {
                        width: 1.78rem;
                        height: 1.78rem;
                    }
                    div {
                        flex: 1;
                        padding: 0 .1rem;
                        font-size: .3rem;
                        span {
                            color: #c33;
                        }
                    }
                }
                .ctn-mld {
                    margin-bottom: .1rem;
                    label {
                        display: block;
                        font-size: .25rem;
                        color: #000;
                        font-weight: bold;
                    }
                    ul {
                        li {
                            float: left;
                            margin: .2rem .3rem 0 0;
                            border: 1px solid #777;
                            padding: .16rem .25rem;
                            border-radius: .1rem;
                            &.active {
                                color: #c33;
                                border-color: #c33;
                            }
                        }
                    }
                }
                .ctn-btm {
                    margin: .35rem 0;
                    label {
                        display: block;
                        font-size: .25rem;
                        color: #000;
                        font-weight: bold;
                        margin-bottom: .3rem;
                    }
                }
            }
            .close-icon {
                position: absolute;
                top: .4rem;
                right: .3rem;
                width: .4rem;
                height: .4rem;
                background: url("../../assets/images/icon/close_icon.png") no-repeat center;
                background-size: cover;
            }
        }
        .service-shade {
            .service-box {
                ul {
                    max-height: 6rem;
                    overflow-y: auto;
                    li {
                        padding: .1rem .2rem;
                        label {
                            font-size: .28rem;
                            color: #000;
                        }
                        p {
                            padding: .1rem;
                            color: #979696;
                            font-size: .25rem;
                        }
                    }
                }
            }
        }
        .footprint {   //足迹
            position: fixed;
            z-index: 999999;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(000,000,000,.4);
            .content {
                background-color: #efefef;
                &.animated {
                    animation-duration: .3s;
                }
                .swiper-container {
                    padding-bottom: .3rem;
                    padding-top: .8rem;
                    .swiper-wrapper {
                        z-index: 121212;
                    }
                    .swiper-slide {
                        width: 3.44rem;
                        background-color: #fff;
                        img {
                            width: 100%;
                            height: 3.44rem;
                        }
                        p {
                            font-size: .26rem;
                            line-height: .45rem;
                            padding: .15rem .25rem;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                        }
                        span {
                            display: inline-block;
                            color: #c33;
                            font-size: .3rem;
                            padding: 0 .25rem .2rem;
                        }
                    }
                    .swiper-pagination {
                        top: 0;
                        line-height: .8rem;
                        font-size: .3rem;
                    }
                }
            }
        }
    }
    footer {
        height: 1.13rem;
        border-top: .04rem solid #d9d9d9;
        div {
            display: flex;
            height: 100%;
            background-color: #fafafa;
        }
        .icon {
            float: left;
            width: .94rem;
            height: 100%;
            border-right: .04rem solid #d9d9d9;
            &.service {
                background: url("../../assets/images/icon/service_icon.png") no-repeat center;
                background-size: 50%;
            }
            &.goodscart {
                background: url("../../assets/images/icon/shopingcart_icon_black.png") no-repeat center;
                background-size: 50%;
            }
            &.star {
                background: url("../../assets/images/icon/star_icon_black.png") no-repeat center;
                background-size: 50%;
                &.yellow {
                    background-image: url("../../assets/images/icon/star_icon_yellow.png")
                }
            }
        }
        .btn {
            flex: 1;
            line-height: 1.09rem;
            text-align: center;
            font-size: .28rem;
            &.addcart {
                background-color: #c33;
                color: #fff;
            }
        }
    }
}
</style>