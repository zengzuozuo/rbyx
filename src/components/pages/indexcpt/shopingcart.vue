<template>
    <div class="shopingcart-component" ref="shopingcartComponent">
        <header v-if="pageData">
            <h2>
                <span>购物车</span>
                <a href="javascript:;" v-show="!isCompile" @click="isCompile = true">编辑</a>
                <a href="javascript:;" v-show="isCompile" @click="isCompile = false">完成</a>
            </h2>
            <div class="tip1" v-show="pageData.length == 0">
                <span>◎ 30天无忧退换货</span>
                <span>◎ 48小时快速退款</span>
                <span>◎ 满88元免邮费</span>
            </div>
            <div v-show="man > 0">
                <div class="tip2" v-show="total < man">满{{man}}元免邮费　还差{{(man - total).toFixed(2)}}元</div>
                <div class="tip2" v-show="total >= man">已满足{{man}}免邮费条件</div>
            </div>
        </header>
        <div class="main" id="shopingcart-scroll">
            <div class="scroll-wrap">
                <div class="cart-content">
                    <yd-checklist v-model="checklist" :label="false" color="#c33" ref="checklist" :callback="change">
                        <yd-checklist-item :val="item.id" v-for="(item,index) in pageData" key="index">
                            <yd-flexbox>
                                <ImgTag :url="imgUrl + item.pic" @click.native="$router.push('goodsdetails?id=' + item.goodsid)" />
                                <yd-flexbox-item align="top">
                                    <h2>{{item.title}}</h2>
                                    <p>{{ item.specifications }}</p>
                                    <div class="price-wrap">
                                        <span class="price">¥{{ item.price }}</span>
                                        <!-- <yd-spinner :max="item.stock" unit="1" v-model="item.number"></yd-spinner> -->
                                        <span class="spinner">
                                            <a href="javascript:;" @click="amountChange('minus',item)"></a>
                                            <input type="number" @change="amountChange('input',item)" v-model="item.number" class="yd-spinner-input"/>
                                            <a href="javascript:;" @click="amountChange('add',item)"></a>
                                        </span>
                                    </div>
                                </yd-flexbox-item>
                            </yd-flexbox>
                        </yd-checklist-item>
                    </yd-checklist>
                    <div class="empty" v-show="pageData.length == 0">
                        <img src="../../../assets/images/icon/enptycart_icon.png" />
                        <span>去添加点什么吧</span>
                    </div>
                </div>
                <Like></Like>
            </div>
        </div>
        <div class="footerbar" v-if="pageData.length != 0">
            <div class="ct-l">
                <yd-checkbox v-model="isCheckAll" shape="circle" color="#c33" :change="checkAll"> 已选( {{checklist.length}} )</yd-checkbox>
                <span class="total" v-show="!isCompile">¥{{total}}</span>
            </div>
            <yd-button class="toorder" v-show="!isCompile" @click.native="toOrder" :disabled="checklist.length == 0">下单</yd-button>
            <yd-button class="toorder" href="javascript:;" @click.native="removeGoods" :disabled="checklist.length == 0" v-show="isCompile">删除所选</yd-button>
        </div>
    </div>
</template>

<script>
import Like from "../../common/like_component";
export default {
    data() {
        return {
            myScroll: null,
            checklist: [],
            spinner: 1,
            isCheckAll: false,
            isCompile: false,
            pageData: [],
            discount: 0,
            istotal: 0,
            total: 0,
            address: "",
            firstIn: true,
            man: 0
        }
    },
    mounted() {
		
    },
    methods: {
        getData(type) {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "getShoppingCartData"
            }).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    // 记录购物车商品数量

                    this.$store.state.shopCartNum = data.data.length;

                    this.pageData = data.data;
                    this.address = data.address;
                    this.total = data.total;
                    this.discount = data.discount;
                    this.istotal = data.istotal;
                    this.man = data.man
                    if(this.firstIn) {   //首次加载更新选中状态
                        this.firstIn = false;
                        var arr = [];
                        this.pageData.forEach((v,i) => {
                            if(v.status == 1) {
                                arr.push(v.id)
                            }
                        }) 
                        this.checklist = arr;
                    }
                }else {
                    this.pageData = [];
                    this.$store.state.shopCartNum = data.data.length;
                }
            })
        },
        toOrder() {
            var arr = [];
            this.checklist.forEach((v,i) => {
                this.pageData.forEach((value,index) => {
                    if(value.id == v) {
                        arr.push(value)
                    }
                })
            })
            this.$store.commit("setShopingCart",{data: {
                total: this.total,
                goodslist: arr,
                address: this.address,
                discount: this.discount,
                istotal: this.istotal,
                }});
            this.$router.push('writeorder')
        },
        change(value, isCheckAll) {
            if(value.length == 0) {
                this.isCheckAll = false;
            }else if(value.length == this.pageData.length){
                this.isCheckAll = true;
            }else {
                this.isCheckAll = isCheckAll;
            }
            this.$http.post(this.apiUrl,{
                code: "ShoppingCartStatus",
                id: value.join(",")
            }).then((data) => {
                this.getData();
            })
        },
        checkAll() {  //全选
            this.isCheckAll = !this.isCheckAll;
            this.$refs.checklist.$emit('ydui.checklist.checkall', this.isCheckAll);
        },
        removeGoods() {
            this.$dialog.confirm({
                title: '提示',
                mes: '确定删除所选商品？',
                opts: () => {
                    this.$http.post(this.apiUrl,{
                        code: "deleteShoppingCart",
                        ids: this.checklist.join(",")
                    }).then((data) => {
                        if(data.ztm == 1) {
                            this.checklist = [];
                            this.getData();
                        }else {
                            this.$dialog.toast({
                                mes: data.msg,
                                timeout: 1500,
                                icon: 'error'
                            });
                        }
                    })
                }
            });
        },
        amountChange(type,res) {
            if(type == 'minus') {
                res.number--;
            }else if(type == 'add'){
                res.number++;
            }
            res.number = res.number <= 0 ? 1 : (res.number > res.stock ? res.stock : res.number);
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "updateShoppingCart",
                id: res.id,
                number: res.number
            }).then((data) => {
                if(data.ztm == 1) {
                    this.getData();
                }
            })
        }
    },
    components: {
        Like
    },
    activated() {
        this.isCompile = false;
        this.getData();
    }
}
</script>

<style lang="less">
.shopingcart-component {
    display: flex;
    flex-direction: column;
    header {
        h2 {
            position: relative;
            background-color: #fafafa;
            padding: .28rem 0;
            font-size: .34rem;
            text-align: center;
            color: #000;
            font-weight: normal;
            a {
                position: absolute;
                right: 0;
                bottom: 0;
                font-size: .3rem;
                line-height: 1rem;
                width: 1.4rem;
            }
        }
        .tip1 {
            display: flex;
            justify-content: space-around;
            padding: .28rem 0;
            font-size: .24rem;
        }
        .tip2 {
            text-align: left;
            line-height: .82rem;
            background-color: #fff8d8;
            color: #f38506;
            padding: 0 .34rem;
            font-size: .28rem;
            
        }
    }
    .main {
        flex: 1;
        -webkit-overflow-scrolling: touch;
        overflow-y: scroll;
        .scroll-wrap {
            border-top: 0.01rem solid transparent;
        }
        .cart-content {
            .yd-checklist {
                margin-top: .2rem;
                .yd-checklist-item {
                    padding: .24rem 0;
                    .yd-checklist-content {
                        overflow: hidden;
                        .yd-flexbox {
                            img {
                                width: 1.65rem;
                                height: 1.65rem;
                            }
                            .yd-flexbox-item {
                                overflow: hidden;
                                padding-left: .2rem;
                                h2 {
                                    font-size: .28rem;
                                    text-overflow: ellipsis;
                                    overflow: hidden;
                                    white-space: nowrap;
                                }
                                p {
                                    color: #808080;
                                    line-height: .5rem;
                                    text-overflow: ellipsis;
                                    overflow: hidden;
                                    white-space: nowrap;
                                }
                                .price-wrap {
                                    .price {
                                        line-height: .6rem;
                                        font-size: .3rem;
                                    }
                                    .yd-spinner {
                                        float: right;
                                    }
                                    .spinner {
                                        float: right;
                                        height: 0.6rem;
                                        width: 2rem;
                                        border: 1px solid #eae8e8;
                                        border-radius: 1px;
                                        display: inline-block;
                                        overflow: hidden;
                                        a {
                                            float: left;
                                            width: 25%;
                                            height: inherit;
                                            text-align: center;
                                            font-weight: 700;
                                            color: #666;
                                            letter-spacing: 0;
                                            position: relative;
                                            background-color: #f8f8f8;
                                            overflow: hidden;
                                            &:first-child:after {
                                                content: "\E60B";
                                            }
                                            &:last-child:after {
                                                content: "\E602";
                                            }
                                            &:after {
                                                font-family: YDUI-INLAY;
                                                color: #777;
                                                font-size: .18rem;
                                                position: absolute;
                                                top: 50%;
                                                left: 50%;
                                                -webkit-transform: translate(-50%,-50%);
                                                transform: translate(-50%,-50%);
                                            }
                                        }
                                        input {
                                            letter-spacing: 0;
                                            float: left;
                                            width: 50%;
                                            height: inherit;
                                            text-align: center;
                                            color: #666;
                                            border: none;
                                            font-size: .26rem;
                                            background-color: #fff;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                
            }
            .empty {
                text-align: center;
                padding: 2rem 0;
                img {
                    display: block;
                    margin: 0 auto;
                    width: 2.3rem;
                }
                span {
                    display: inline-block;
                    color: #a9a9a9;
                    line-height: .6rem;
                    font-size: .22rem;
                }
            }
        }
    }
    .footerbar {
        display: flex;
        border-top: 1px solid #d5d5d5;
        background-color: #fafafa;
        height: 1rem;
        .ct-l {
            flex: 1;
            line-height: 1rem;
            padding-left: .2rem;
            label {
                .yd-checkbox-icon {
                    vertical-align: text-bottom;
                }
            }
            .total {
                color: #c33;
                float: right;
                padding: 0 .2rem;
                font-size: .3rem;
                font-weight: bold;
            }
        }
        .toorder {
            color: #fff;
            line-height: 1rem;
            width: 2.4rem;
            height: 100%;
            text-align: center;
            font-size: .3rem;
            border-radius: 0;
            padding: 0;
            &.yd-btn-primary {
                background-color: #c33;
            }
        }
    }
}
</style>