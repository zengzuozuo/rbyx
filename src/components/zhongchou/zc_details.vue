<template>
    <div class="zcdetails-page">
        <ComHeaderbar text="众筹详情页"></ComHeaderbar>
        <div class="main" v-if="pageData">
            <yd-slider autoplay="3000">
                <yd-slider-item v-for="item,index in pageData.banner" :key="index">
                    <a href="javascript:;">
                        <ImgTag :url="imgUrl + item.pic" />
                    </a>
                </yd-slider-item>
            </yd-slider>
            <div class="goods-content">
                <h3 class="gd-name">{{pageData.data.title}}</h3>
                <p class="gd-des">{{pageData.data.desc}}</p>
                <div class="existing-money">已筹金额: <span>{{pageData.data.cf_total.toFixed(2)}}元</span></div>
                <div class="progressbar">
                    <yd-progressbar type="line" :progress="pageData.data.schedule > 1 ? 1 : pageData.data.schedule" trail-width="4" trail-color="#c33"></yd-progressbar>
                    <span class="value">{{(pageData.data.schedule * 100).toFixed()}}%</span>
                </div>
                <div class="active-data">
                    <div>
                        <h3>{{pageData.data.cf_targetamount}}元</h3>
                        <span>目标金额</span>
                    </div>
                    <div>
                        <h3>{{pageData.data.people}}人</h3>
                        <span>支持人数</span>
                    </div>
                    <div>
                        <h3><span v-if="pageData.sign == 1">已结束</span><yd-countdown v-if="pageData.sign != 1" :time="pageData.data.cf_endtime" format="{%d}天{%h}时"></yd-countdown></h3>
                        <span>剩余时间</span>
                    </div>
                </div>
            </div>
            <yd-cell-item arrow class="specification" v-if="pageData.sign != 1" @click.native="$store.state.popupIsShow = true">
                <span slot="left">¥{{pageData.data.price}}起</span>
                <span slot="right">去支持</span>
            </yd-cell-item>
            <yd-cell-item arrow class="specification" v-if="pageData.sign == 1">
                <span slot="left">¥{{pageData.data.price}}起</span>
                <span slot="right">已结束</span>
            </yd-cell-item>
            <yd-tab>
                <yd-tab-panel label="详情">
                    <GDCpt :detailshtml="pageData.data.content"/>
                </yd-tab-panel>
                <yd-tab-panel label="进度">
                    <div class="empty">
                        <img src="../../assets/images/icon/empty_dindan.png" />
                        <span>暂无项目进度，请耐心等待</span>
                    </div>
                </yd-tab-panel>
            </yd-tab>
            <yd-popup class="specifications-shade" v-model="$store.state.popupIsShow" position="bottom">
                <div class="specifications-box">
                    <div class="ctn-top" v-if="pageData">
                        <ImgTag :url="imgUrl + pageData.data.pic" />
                        <div>
                            <span>价格：¥{{price}}</span>
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
                <a class="enter-btn" href="javascript:;" @click="enter">确定认筹</a>
                <i class="close-icon" @click="$store.state.popupIsShow = false"></i>
            </yd-popup>
        </div>
        <footer v-if="pageData">
            <a href="javascript:;" v-if="pageData.data.follow == 0 && pageData.sign != 1" @click="CrowdfundingFollow">关注</a>
            <a href="javascript:;" v-if="pageData.data.follow == 1 && pageData.sign != 1" @click="CrowdfundingFollow">已关注</a>
            <a href="javascript:;" class="red" v-if="pageData.sign != 1" @click="$store.state.popupIsShow = true">我要支持</a>
            <a href="javascript:;" class="red" style="background-color: #999" v-if="pageData.sign == 1">众筹已结束</a>
        </footer>
    </div>
</template>

<script>
import GDCpt from '@/components/common/gd_component'
export default {
    data() {
        return {
            pageData: null,
            goodsSpeVal: [],
            specifications: [],
            ggArr: [],  //已选中规格数组
            price: 0,  //商品总价
            onePrice: 0,  //单价
            oldPrice: 0,  //原价
            ggName: "",  //已选规格名
            ggId: "",  //已选规格id
            stock: 0,  //库存
            amount: 1, //数量
        }
    },
    mounted() {
        this.getData();
    },
    methods: {
        getData() {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "CrowdFundingDetail",
                id: this.$route.query.id
            }).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    this.pageData = data;
                }
            })
        },
        CrowdfundingFollow() {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "CrowdfundingFollow",
                id: this.$route.query.id
            }).then((data) => {;
                if(data.ztm == 1) {
                    this.$dialog.toast({mes: data.msg})
                    this.pageData.data.follow = this.pageData.data.follow == 0 ? 1 : 0;
                }
            })
        },
        enter() {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "getDufaultAddress",
            }).then((data) => {
                switch(data.ztm) {
                    case 1:
                        //向store生成订单信息
                        this.$store.commit("setShopingCart",{data:{
                            goodslist: [{
                                goodsid: this.pageData.data.id,
                                number: this.amount,
                                pic: this.pageData.data.pic,
                                price: this.onePrice,
                                specifications: this.ggName,
                                stock: this.stock,
                                total: this.onePrice,
                                title: this.pageData.data.title,
                                desc: this.pageData.data.title,
                                specificationsid: this.ggId
                            }],
                            total: this.onePrice*this.amount,
                            address: data.data[0]
                        }})
                        this.$router.push('zcwriteorder');
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
        }
    },
    watch: {
        pageData: {
            handler: function (val, oldVal) {
                for(var i in val.specifications) {
                    this.ggArr[i] = val.specifications[i].art;
                }
                for(var i in val.goodsSpeVal) {
                    if(this.ggArr.sort(function(a,b){return a-b}).join(",") == val.goodsSpeVal[i].path) {
                        this.onePrice = val.goodsSpeVal[i].price;
                        this.price = this.onePrice * this.amount;
                        this.ggName = val.goodsSpeVal[i].vs;
                        this.stock = val.goodsSpeVal[i].stock;
                        this.ggId = val.goodsSpeVal[i].id;
                        this.amount = 1;
                        break;
                       
                    }
                }
            },
            deep: true
        },
        amount: function(val, oldVal) {
            this.price = (this.onePrice * val).toFixed(2);
        }
    },
    components: {
        GDCpt
    }
}
</script>

<style lang="less">
.zcdetails-page {
    display: flex;
    flex-direction: column;
    .main {
        flex: 1;
        -webkit-overflow-scrolling: touch;
        overflow-y: scroll;
        .goods-content {
            background-color: #fff;
            padding: .1rem .3rem;
            .gd-name {
                font-size: .34rem;
                line-height: .64rem;
            }
            .gd-des {
                font-size: .3rem;
                color: #999;
            }
            .existing-money {
                line-height: 1rem;
                font-size: .28rem;
                span {
                    font-size: .38rem;
                    color: #c33;
                }
            }
            .progressbar {
                .yd-progressbar {
                    display: inline-block;
                    width: 85%;
                }
                span {
                    display: inline-block;
                    color: #fff;
                    background-color: #c33;
                    padding: .05rem .1rem;
                    border-radius: .1rem;
                }
            }
            .active-data {
                display: flex;
                padding: .2rem 0;
                div {
                    flex: 1;
                    text-align: center;
                    border-right: 1px solid #999;
                    &:last-child {
                        border: none;
                    }
                    h3 {
                        font-size: .3rem;
                        padding-bottom: .1rem;
                    }
                    &>span {
                        color: #999;
                    }
                }
            }
        }
        .specification {
            background-color: #fff;
            margin: .2rem 0;
            .yd-cell-left {
                font-size: .3rem;
                font-weight: bold;
                color: #c33;
            }
        }
        .empty {
            text-align: center;
            padding: 2rem 0;
            img {
                height: 2.5rem;
                display: block;
                margin: 0 auto .2rem;
            }
            span {
                font-size: .28rem;
                color: #999;
            }
        }
        .specifications-shade {
            overflow: hidden;
            .yd-popup-content {
                overflow: hidden;
            }
            .yd-popup {
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
            .enter-btn {
                display: block;
                text-align: center;
                line-height: 1rem;
                background-color: #c33;
                color: #fff;
                font-size: .3rem;
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
        font-size: .26rem;
        background-color: #fff;
        a {
            flex: 1;
            text-align: center;
            color: #c33;
            font-weight: bold;
            border-top: 1px solid #999;
            &.red {
                background-color: #c33;
                color: #fff;
                border-top: 1px solid #c33;
            }
        }
    }
}
</style>



