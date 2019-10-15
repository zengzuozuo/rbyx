<template>
    <div class="goodslist-component">
        <ul class="goodslist-wrap">
            <li v-for="item,index in goodslist" @click="$router.push('goodsdetails?id='+ item.id)">
                <ImgTag :url="imgUrl + item.pic" />
                <p class="info">{{ item.desc }}</p>
                <p class="label-list clearfix">
                    <label v-if="item.islimit > 0">限时购</label>
                    <label v-for="subitem in item.activity">{{subitem.title}}</label>
                </p>
                <p class="goodsname">{{ item.title }}</p>
                <p class="price">
                    <span>¥{{ item.minprice }}</span>
                </p>
                <a class="push-cart" href="javascript:;" @click="joinCart(item)" v-if="pushcart">加入购物车</a>
            </li>
        </ul>
        <div class="empty" v-if="goodslist.length == 0">
            <img src="../../assets/images/icon/goodsempty_icon.png" />
            <span>暂无相关商品</span>
        </div>
        <yd-popup class="specifications-shade" v-show="pushcart" v-model="$store.state.popupIsShow" position="bottom">
            <div class="specifications-box">
                <div class="ctn-top" v-if="activeGoods">
                    <ImgTag :url="imgUrl + activeGoods.pic" />
                    <div>
                        <span>价格：¥{{price}}</span>
                        <p>{{ggName}}</p>
                        <P>库存 {{stock}}</P>
                    </div>
                </div>
                <div class="ctn-mld-wrap" style="max-height: 5rem;overflow-y:scroll;">
                    <div class="ctn-mld" v-for="(item,index) in specifications">
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
            <a class="enter-btn" href="javascript:;" @click="joinCartSubmit">确定</a>
            <i class="close-icon" @click="$store.state.popupIsShow = false"></i>
        </yd-popup>
    </div>
</template>

<script>
export default {
    props: {
        goodslist : {
            default: ""
        },
        pushcart: {
            default: false
        }
    },
    data() {
        return {
            activeGoods: null,
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
    methods: {
        joinCart(res) {
            event.cancelBubble = true;
            this.activeGoods = res;
            this.specifications = res.specifications;
            this.goodsSpeVal = res.goodsSpeVal;
            this.$store.state.popupIsShow = true;
        },
        joinCartSubmit() {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "joinShoppingCart",
                goodsid: this.activeGoods.id,
                specifications: this.ggName, 
                number: this.amount,
                price: this.price,
                specificationsid: this.ggId
            }).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    this.$store.state.popupIsShow = false;
                    this.$dialog.toast({
                        mes: data.msg,
                        icon: "success"
                    })
                }
            })
        }
    },
    watch: {
        specifications: {
            handler: function (val, oldVal) {
                for(var i in val) {
                    this.ggArr[i] = val[i].art;
                }
                for(var i in this.goodsSpeVal) {
                    if(this.ggArr.sort(function(a,b){return a-b}).join(",") == this.goodsSpeVal[i].path) {
                        this.onePrice = this.goodsSpeVal[i].price;
                        this.price = this.onePrice * this.amount;
                        this.ggName = this.goodsSpeVal[i].vs;
                        this.stock = this.goodsSpeVal[i].stock;
                        this.ggId = this.goodsSpeVal[i].id;
                        this.amount = 1;
                        break;
                       
                    }
                }
            },
            deep: true
        },
        amount: function(val, oldVal) {
            this.price = this.onePrice * val;
        }
    }
}
</script>

<style lang="less">
.goodslist-component {
    background-color: #fff;
    overflow: hidden;
    .goodslist-wrap {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 0 .15rem;
        li {
            width: 48%;
            text-align: left;
            padding-bottom: .1rem;
            padding-top: .1rem;
            img {
                display: block;
                width: 100%;
                max-height: 3.44rem;
                background-color: #f4f4f4;
            }
            .info {
                background-color: #f1ece2;
                color: #9f8a5f;
                font-size: .25rem;
                line-height: .72rem;
                border-radius: 0 0 .1rem .1rem;
                padding: 0 .1rem;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            .label-list {
                padding: .15rem 0;
                label {
                    float: left;
                    padding: .05rem .18rem;
                    background-color: #e57b7b;
                    color: #fff;
                    margin-left: .1rem;
                    font-size: .2rem;
                    border-radius: .05rem;
                }
            }
            .goodsname {
                padding: 0 .1rem;
                color: #000;
                font-weight: bold;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
            .price {
                padding: 0 .1rem;
                color: #c33;
                font-size: .26rem;
                font-weight: bold;
            }
            .push-cart {
                display: inline-block;
                border: 1px solid #999;
                padding: .05rem .1rem;
                border-radius: .05rem;
                margin-top: .1rem;
            }
        }
        
    }
    .empty {
        padding: 1rem 0;
        text-align: center;
        img {
            display: block;
            width: 2.8rem;
            margin: .3rem auto;
        }
        span {
            color: #a9a9a9;
            font-size: .28rem;
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
</style>