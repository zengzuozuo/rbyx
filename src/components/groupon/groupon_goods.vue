<template>
    <div class="groupongoods-page">
        <ComHeaderbar text="团购商品"></ComHeaderbar>
        <div class="main" >
            <div id="flex-wrap-box">
                <div class="scroll-wrap" v-if="pageData">
                    <div class="banner">
                        <ImgTag :url="imgUrl + pageData.data.pic" />
                    </div>
                    <div class="goods-info">
                        <h3>{{pageData.data.title}}</h3>
                        <p class="describe">{{pageData.data.desc}}</p>
                        <div class="price">
                            <span>¥{{price}}</span>
                            <s>单买价¥{{oldPrice}}</s>
                        </div>
                        <div class="label-wrap">
                            <span>包邮</span>
                        </div>
                        <p class="tip">欢迎积极参团</p>
                    </div>
                    <yd-cell-group>
                        <yd-cell-item arrow type="label" @click.native="$store.state.popupIsShow = true">
                            <span slot="left">查看规格</span>
                            <span slot="right">{{ggName}}</span>
                        </yd-cell-item>
                        <yd-cell-item arrow>
                            <span slot="left" @click="$store.commit('openUrl',webh5 + '/help/help_center.html')">支付开团并邀请{{pageData.data.number}}人参团，人数不足自动退款</span>
                        </yd-cell-item>
                        <ul class="gg-list">
                            <li v-for="item in pageData.nowgroup">
                                <ImgTag :url="appImgUrl + item.avatar"/>
                                <div>
                                    <h4>{{item.username}}</h4>
                                    <p>还差<span>{{item.po}}</span>人成团，剩余<yd-countdown :time="item.endtime" format="{%d}天{%h}:{%m}:{%s}" done-text="0秒"></yd-countdown>结束。</p>
                                </div>
                                <router-link :to="'joingroupon?oid=' + item.ordersn + '&goid=' + item.id">去成团</router-link>
                            </li>
                        </ul>
                    </yd-cell-group>
                    <GDCpt :detailshtml="pageData.data.content" />
                </div>
                
                <yd-popup class="specifications-shade" v-if="pageData" v-model="$store.state.popupIsShow" height="auto" position="bottom">
                    <div class="specifications-box">
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
                    </div>
                    <i class="close-icon" @click="$store.state.popupIsShow = false"></i>
                </yd-popup>
            </div>
            
        </div>
        <footer>
            <a href="javascript:;" v-if="pageData" class="buy" @click="$router.push('goodsdetails?id=' + pageData.data.goodsid)">单独购买¥{{oldPrice}}</a>
            <!-- <a href="javascript:;" class="full">开团已达上限</a> -->
            <a href="javascript:;" v-if="pageData" class="jiatuan" @click="openGroup">{{pageData.data.number}}人团 ¥{{onePrice}}</a>
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

        this.setHeight("flex-wrap-box");
    },
    methods: {
        getData() {
            this.$http.post(this.apiUrl,{
                code: "groupsDetail",
                id: this.$route.query.id
            }).then((data) => {
                console.log(data)
                if(data.ztm == 1) {
                    this.pageData = data;
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
                            address: data.data[0]
                        }})
                        this.$router.push('grouponwriteorder?sfid=' + this.ggId + "&id=" + this.$route.query.id);
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
                        if(this.pageData.data.istimelimit > 0) {  //判断是否为限时购商品
                            this.oldPrice = this.pageData.goodsSpeVal[i].activityprice;
                        }else {
                            this.oldPrice = this.pageData.goodsSpeVal[i].price;
                        } 
                        this.onePrice = this.pageData.goodsSpeVal[i].groupprice; 
                        this.price = this.onePrice * this.amount;
                        this.ggName = this.pageData.goodsSpeVal[i].vs;
                        this.stock = this.pageData.goodsSpeVal[i].groupstock;
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
    components: {
        GDCpt
    }
}
</script>

<style lang="less">
.groupongoods-page {
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
        .banner {
            img {
                width: 100%;
            }
        }
        .goods-info {
            padding: .4rem .2rem;
            background-color: #fff;
            text-align: center;
            h3 {
                font-size: .3rem;
            }
            .describe {
                line-height: .6rem;
                font-size: .25rem;
                color: #959595;
            }
            .price {
                span {
                    font-size: .4rem;
                    color: #c33;
                    font-weight: bold;
                }
                s {
                    font-size: .25rem;
                    color: #666;
                }
            }
            .label-wrap {
                padding: .25rem 0;
                span {
                    display: inline-block;
                    color: #f48f18;
                    border: 1px solid #f48f18;
                    padding: .05rem .1rem;
                    font-size: .25rem;
                    border-radius: .1rem;
                }
            }
            .tip {
                color: #c33;
                font-size: .25rem;
            }
        }
        .yd-cell-box {
            margin-top: .2rem;
            margin-bottom: 0;
            .gg-list {
                background-color: #fff;
                padding-left: .24rem;
                li {
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid #d9d9d9;
                    padding: .2rem .24rem .2rem 0;
                    img {
                        width: .8rem;
                        height: .8rem;
                        border-radius: 50%;
                    }
                    div {
                        flex: 1;
                        padding: 0 .1rem;
                        h4 {
                            font-weight: normal;
                            font-size: .26rem;
                        }
                        p {
                            font-size: .25rem;
                            span {
                                color: #c33;
                            }
                        }
                    }
                    a {
                        color: #fff;
                        background-color: #c33;
                        padding: .1rem .4rem;
                        font-size: .3rem;
                        border-radius: .05rem;
                    }
                }
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
        line-height: .9rem;
        height: .9rem;
        border-top: 1px solid #ccc;
        border-bottom: 0;
        a {
            flex: 1;
            text-align: center;
            font-size: .25rem;
            background-color: #fff;
            &.full {
                background-color: #cccccc;
                color: #fff;
            }
            &.jiatuan {
                background-color: #c33;
                color: #fff;
            }
        }
    }
}
</style>

