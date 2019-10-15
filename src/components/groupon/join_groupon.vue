<template>
    <div class="joingroupon-page">
        <ComHeaderbar text="优选拼团"></ComHeaderbar>
        <div class="main" v-if="pageData">
            <div class="scroll-wrap">
                <div class="goods">
                    <ImgTag :url="imgUrl + pageData.goods.pic" class="goodsimg" />
                    <div class="content">
                        <p>{{pageData.goods.title}}</p>
                        <p>¥{{onePrice}}<s>¥{{oldPrice}}</s></p>
                        <img src="../../assets/images/icon/underway.png" v-if="pageData.po > 0" alt="">
                        <img src="../../assets/images/icon/rally.png" v-if="pageData.po <= 0">
                    </div>
                </div>
                <div class="condition">
                    <div class="img-wrap">
                        <ImgTag v-for="item,index in pageData.joinuser" :url="appImgUrl + item.avatar" :key="index" />
                    </div>
                    <p v-if="pageData.po > 0">剩余<yd-countdown :time="pageData.endtime" done-text="0秒" format="{%d}天{%h}:{%m}:{%s}"></yd-countdown>结束</p>
                    <span v-if="pageData.po > 0">还差{{pageData.po}}个人，享受拼团价</span>
                </div>
                <yd-cell-group>
                    <yd-cell-item arrow type="label" @click.native="$store.state.popupIsShow = true">
                        <span slot="left">查看规格</span>
                        <span slot="right">{{ggName}}</span>
                    </yd-cell-item>
                    <yd-cell-item arrow>
                        <span slot="left" @click="$store.commit('openUrl',webh5 + '/help/help_center.html')">支付开团并邀请{{pageData.number}}人参团，人数不足自动退款</span>
                    </yd-cell-item>
                </yd-cell-group>
                <div class="goods-info-wrap">
                    <!-- <h2>商品参数</h2>
                    <ul class="parameters">
                        <li v-for="item in 5">
                            <label>适用环境</label>
                            <p>家用</p>
                        </li>
                    </ul> -->
                    <GDCpt :detailshtml="pageData.goods.content" />
                </div>
            </div>
            <yd-popup class="specifications-shade" v-model="$store.state.popupIsShow" height="auto" position="bottom">
                <div class="specifications-box">
                    <div class="ctn-top">
                        <ImgTag :url="imgUrl + pageData.goods.pic" />
                        <div>
                            <span>价格：¥{{ onePrice }}</span>
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
                </div>
                <i class="close-icon" @click="$store.state.popupIsShow = false"></i>
            </yd-popup>
            
        </div>
        <footer v-if="pageData">
            <router-link to="pintuan">商品列表</router-link>
            <a href="javascript:;" v-show="pageData.sign == 0" @click="openGroup">参与拼价</a>
            <a href="javascript:;" v-show="pageData.sign == 1">已参团</a>
        </footer>
    </div>
</template>

<script>
import GDCpt from '@/components/common/gd_component';
export default {
    data() {
        return {
            pageData: null,
            price: 0,  //商品总价
            onePrice: 0,  //单价
            oldPrice: 0,  //原价
            ggName: "",  //已选规格名
            ggId: "",  //已选规格id
            stock: 0,  //库存
            amount: 0,
            ggArr: [],  //已选中规格数组
        }
    },
    mounted() {
        this.getData();
    },
    methods: {
        getData() {
            this.$store.commit('openWait');
            console.log({
                code: "gotoFightGroup",
                ordersn: this.$route.query.oid,
                groupoid: this.$route.query.goid
            })
            this.$http.post(this.apiUrl,{
                code: "gotoFightGroup",
                ordersn: this.$route.query.oid,
                groupoid: this.$route.query.goid
            }).then((data) => {
            	console.log(111)
                console.log(data)
                if(data.ztm == 1) {
                    this.pageData = data;
                }else {
                    this.$dialog.toast({
                        mes: data.msg
                    })
                }
            })
        },
        openGroup() {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "getDufaultAddress",
            }).then((data) => {
                switch(data.ztm) {
                    case 1:
                        //向store生成订单信息
                        this.$store.commit("setShopingCart",{data:{
                            goodslist: [{
                                goodsid: this.pageData.goods.goodsid,
                                number: this.amount,
                                pic: this.pageData.goods.pic,
                                price: this.onePrice,
                                specifications: this.ggName,
                                stock: this.stock,
                                total: this.onePrice,
                                title: this.pageData.goods.title,
                                desc: this.pageData.goods.title,
                                specificationsid: this.ggId
                            }],
                            total: this.onePrice,
                            address: data.data[0]
                        }})
                        this.$router.push('grouponwriteorder?type=join&sfid=' + this.ggId + "&ordersn=" + this.$route.query.oid + "&goid=" + this.$route.query.goid);
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
                for(var i in this.pageData.specifications) {
                    this.ggArr[i] = this.pageData.specifications[i].art;
                }
                for(var i in this.pageData.goodsSpeVal) {
                    if(this.ggArr.sort(function(a,b){return a-b}).join(",") == this.pageData.goodsSpeVal[i].path) {
                        // if(this.pageData.data.istimelimit > 0) {  //判断是否为限时购商品
                        //     this.oldPrice = this.pageData.goodsSpeVal[i].activityprice;
                        // }else {
                        //     this.oldPrice = this.pageData.goodsSpeVal[i].price;
                        // } 
                        this.oldPrice = this.pageData.goodsSpeVal[i].price;
                        this.onePrice = this.pageData.goodsSpeVal[i].groupprice; 
                        this.price = this.onePrice * this.amount;
                        this.ggName = this.pageData.goodsSpeVal[i].vs;
                        this.stock = this.pageData.goodsSpeVal[i].stock;
                        this.ggId = this.pageData.goodsSpeVal[i].id;
                        this.amount = 1;
                        break;
                    }
                }
            },
            deep: true
        }
    },
    components: {
        GDCpt
    }
}
</script>

<style lang="less">
.joingroupon-page {
    display: flex;
    flex-direction: column;
    .main {
        flex: 1;
        overflow: hidden;
        position: relative;
        .scroll-wrap {
            height: 100%;
            -webkit-overflow-scrolling: touch;
            overflow-y: scroll;
        }
        .goods {
            display: flex;
            padding: .3rem;
            background-color: #fff;
            .goodsimg {
                width: 1.4rem;
                height: 1.4rem;
            }
            .content {
                flex: 1;
                position: relative;
                padding: .1rem;
                font-size: .3rem;
                p {
                    s {
                        display: inline-block;
                        padding-left: .1rem;
                        color: #999;
                        font-size: .25rem;
                    }
                }
                img {
                    width: 1.3rem;
                    position: absolute;
                    right: 0;
                    top: 0;
                }
            }
        }
        .condition {
            padding: .76rem 0;
            text-align: center;
            .img-wrap {
                img {
                    width: 1.2rem;
                    height: 1.2rem;
                    border-radius: 50%;
                    margin: 0 .1rem;
                }
            }
            p {
                text-align: center;
                padding: .4rem 0 .3rem;
                font-size: .3rem;
            }
            span {
                font-size: .3rem;
            }
        }
        .specifications-shade {
            position: absolute;
            width: 100%;
            .yd-popup {
                position: absolute;
                width: 100%;
                bottom: 0;
            }
            .specifications-box {
                position: relative;
                background-color: #fff;
                padding: 0 .3rem .3rem;
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
        .goods-info-wrap {
            margin-top: .2rem;
            background-color: #fff;
            padding: .28rem;
            h2 {
                font-size: .3rem;
                line-height: .5rem;
                padding-bottom: .2rem;
            }
            .parameters {
                
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
                width: 100%;
            }
        }
    }
    footer {
        position: relative;
        z-index: 121212;
        display: flex;
        border-top: 1px solid #bcbcbc;
        background-color: #fff;

        a {
            flex: 1;
            line-height: .9rem;
            font-weight: bold;
            font-size: .28rem;
            color: #000;
            text-align: center;
            &:nth-child(2) {
                background-color: #c33;
                color: #fff;
            }
            &:nth-child(3) {
                background-color: #999;
                color: #fff;
            }
        }
    }
}
</style>
