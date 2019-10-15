<template>
    <div class="intgoodsdetails-page">
        <ComHeaderbar text="商品详情"></ComHeaderbar>
        <div class="main" v-if="pageData">
            <yd-slider autoplay="3000">
                <yd-slider-item v-for="item,index in pageData.goodsbanner" :key="index">
                    <a href="http://www.ydcss.com">
                        <ImgTag :url="imgUrl + item.pic" />
                    </a>
                </yd-slider-item>
            </yd-slider>
            <div class="goodsinfo">
                <h2>{{pageData.data.title}}</h2>
                <p>{{pageData.data.desc}}</p>
                <div class="price">
                    <span>{{integral}}积分</span>
                    <s>￥{{oldPrice}}</s>
                </div>
            </div>
            <yd-cell-group class="mt20">
                <yd-cell-item arrow @click.native="$store.state.popupIsShow = true">
                    <span slot="left">已选择:</span>
                    <span slot="right">{{ggName}}</span>
                </yd-cell-item>
                <yd-cell-item arrow @click.native="serviceBox = true">
                    <span slot="left">服务:</span>
                    <span slot="right">点击查看</span>
                </yd-cell-item>
            </yd-cell-group>
            <yd-cell-group class="mt20">
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
            <GDCpt class="mt20" :detailshtml="pageData.data.content" />
            <yd-popup class="service-shade" v-model="serviceBox" position="bottom" height="auto">
                <div class="service-box">
                    <h2 style="line-height: 1rem;text-align: center;font-size: .3rem;border-bottom: 1px solid #d9d9d9">服务</h2>
                    <ul>
                        <li v-for="item in pageData.home_service">
                            <label>• {{item.servicename}}</label>
                            <p>{{item.content}}</p>
                        </li>
                    </ul>
                </div>
            </yd-popup>
            <yd-popup class="specifications-shade" v-model="$store.state.popupIsShow" height="auto" position="bottom">
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
        </div>
        <footer v-if="pageData">
            <a :href="'tel:' + tel" class="service">
                <img src="../../assets/images/icon/service_icon.png" alt="">
            </a>
            <a href="javascript:;" class="exchange" @click="buy">立即兑换</a>
        </footer>
    </div>
</template>

<script>
import GDCpt from '@/components/common/gd_component'
export default {
    data() {
        return {
            serviceBox: false,
            pageData: null,
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
            integral: "", //积分
            tel: localStorage.getItem("tel") || ""
        }
    },
    mounted() {
        this.getData();
    },
    methods: {
        getData() {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "goodsDetail",
                id: this.$route.query.id
            }).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    this.pageData = data;
                }
            })
        },
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
                                specificationsid: this.ggId,
                                integral: this.integral
                            }],
                            total: this.price,
                            address: data.data[0],
                            // usecouponid: ""
                        }})
                        this.$router.push('intwriteorder');
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
                        this.integral = this.pageData.goodsSpeVal[i].integral;
                        this.amount = 1;
                        break;
                    }
                }
            },
            deep: true
        },
        amount: function(val, oldVal) {
            this.price = this.onePrice * val;
            this.integral = this.integral * val;
        }
    },
    components: {
        GDCpt
    }
}
</script>

<style lang="less">
.intgoodsdetails-page {
    display: flex;
    flex-direction: column;
    .main {
        flex: 1;
        -webkit-overflow-scrolling: touch;
        overflow-y: scroll;
        .mt20 {
            margin-top: .2rem;
        }
        .goodsinfo {
            background-color: #fff;
            text-align: center;
            h2 {
                padding: .25rem 0;
                font-size: .35rem;
            }
            p {
                color: #787878;
                font-size: .3rem;
            }
            .price {
                padding: .35rem 0;
                span {
                    font-size: .44rem;
                    color: #c33;
                    font-weight: bold;
                }
                s {
                    font-size: .3rem;
                    color: #787878;
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
                        hieght: .68rem;
                        vertical-align: middle;
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
        .specifications-shade {
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
    }
    footer {
        display: flex;
        line-height: 1rem;
        border-top: 1px solid #999;
        .service {
            background-color: #fff;
            img {
                display: block;
                width: .48rem;
                height: .48rem;
                margin: .25rem .55rem 0;
            }
        }
        .exchange {
            flex: 1;
            background-color: #c33;
            color: #fff;
            text-align: center;
            font-size: .3rem;
            font-weight: bold;
        }
    }
}
</style>

