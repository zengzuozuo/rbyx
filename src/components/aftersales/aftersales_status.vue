<template>
    <div class="aftersalesstatus-page">
        <ComHeaderbar text="售后状态" />
        <div class="main" v-if="pageData">
            <h2 class="zt">{{pageData.orderstatus}}</h2>
            <ul v-if="pageData">
                <li>
                    <div class="content">
                        <div class="img-wrap">
                            <ImgTag v-for="item,index in pageData.data" :url="imgUrl + item.pic" :key="index" />
                            <div v-if="pageData.data.length == 1">
                                <h3>{{pageData.data[0].title}}</h3>
                                <h4>{{pageData.data[0].specifications}}</h4>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <yd-cell-item class="mt" v-if="pageData">
                <span slot="left">退款原因:</span>
                <span slot="right">{{pageData.Applydata.reason}}</span>
            </yd-cell-item>
            <yd-cell-item v-if="pageData">
                <span slot="left">退款金额:</span>
                <span slot="right">{{pageData.total}}元</span>
            </yd-cell-item>
            <yd-cell-item class="mt">
                <span slot="left">退款说明:</span>
                <span slot="right">{{pageData.Applydata.explain}}</span>
            </yd-cell-item>

            <div class="th-address" v-if="pageData.address">
                <div class="label">退货地址</div>
                <ul>
                    <li>
                        <span class="left">收件人姓名</span>
                        <span class="right">{{pageData.address.username}}</span>
                    </li>
                    <li>
                        <span class="left">收件人电话</span>
                        <span class="right">{{pageData.address.mobile}}</span>
                    </li>
                    <li>
                        <span class="left">收件人地址</span>
                        <span class="right">{{pageData.address.address}}</span>
                    </li>
                </ul>
            </div>
            <div class="tip" v-if="pageData.address">
                <p>提示：如货品已寄出请点击确认退货并填写物流单号。</p>
            </div>
            <yd-popup v-model="$store.state.popupIsShow" position="center" width="90%">
                <p>请填写物流单号</p>
                <yd-cell-item arrow type="label">
                    <span slot="left">物流公司：</span>
                    <select slot="right" v-model="postObj.expressid">
                        <option value="">请选择</option>
                        <option :value="item.id" v-for="item in pageData.kuaidilist">{{item.name}}</option>
                    </select>
                </yd-cell-item>
                <input type="text" v-model="postObj.expressnumber" placeholder="快递单号">
                <div class="btn-wrap">
                    <a href="javascript:;" @click="$store.state.popupIsShow = false">取消</a>
                    <a href="javascript:;" @click="returnGoodsKuaidi">确认</a>
                </div>
            </yd-popup>
        </div>
        <div class="footer" v-if="pageData">
            <a href="javascript:;" v-if="pageData.status == 90" @click="$store.state.popupIsShow = true">确认退货退款</a>
            <a href="javascript:;" v-if="pageData.status == 71" @click="$store.state.popupIsShow = true">确认换货</a>
            
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pageData: null,
            postObj: {  //提交退款、退货
                code: "returnGoodsKuaidi",
                ordersn: this.$route.query.oid,
                expressid: "",
                expressnumber: ""
            },
            kuaidi: []
        }
    },
    mounted() {
        this.getData();
        // this.getkuaidiType();
    },
    methods: {
        getData() {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "ApplyReturnOrderDetail",
                ordersn: this.$route.query.oid
            }).then((data) => {
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
        tuikuan() {
            this.$dialog.confirm({
                title: '提示',
                mes: '确定需要取消订单并退款吗？',
                opts: () => {
                    this.$dialog.toast({mes: '你点了确定', timeout: 1000});
                }
            });
        },
        getkuaidiType() {  //获取物流公司列表
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "getkuaidiType"
            }).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    this.kuaidi = data.data;
                }else {
                    
                }
            })
        },
        returnGoodsKuaidi() {   //提交退款、退货
            console.log(this.postObj);
            if(this.postObj.expressid == "" || this.postObj.expressnumber.trim() == "") {
                this.$dialog.toast({mes: "请填写物流发货信息"});
                return;
            }
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,this.postObj).then((data) => {
                console.log(data)
                if(data.ztm == 1) {
                    this.$store.state.popupIsShow = false;
                    this.$dialog.toast({
                        mes: data.msg,
                        icon: "success"
                    })
                    this.getData();
                }else {
                    this.$dialog.toast({
                        mes: data.msg,
                        icon: "error"
                    })
                }
            })
        }
    }
}
</script>

<style lang="less">
.aftersalesstatus-page {
    display: flex;
    flex-direction: column;
    
    .main {
        flex: 1;
        -webkit-overflow-scrolling: touch;
        overflow-y: scroll;
        .zt {
            text-align: center;
            color: #c33;
            font-size: .45rem;
            padding: .6rem 0;
        }
        ul {
            li {
                border-left: .2rem solid #fff;
                background-color: #fff;
                .ct-top {
                    display: flex;
                    border-bottom: 1px solid #d5d5d5;
                    p {
                        flex: 1;
                        
                        font-size: .28rem;
                        line-height: .88rem;
                        text-align: left;
                        padding-right: .2rem;
                    }
                    .icon {
                        width: .88rem;
                        height: .88rem;
                        background: url("../../assets/images/icon/delete_icon.png") no-repeat center;
                        background-size: 40%;
                    }
                }
                .content {
                    display: flex;
                    align-items: center;
                    padding-right: .2rem;
                    border-bottom: 1px solid #d5d5d5;
                    .img-wrap {
                        flex: 1;
                        img {
                            float: left;
                            width: 1.5rem;
                            height: 1.5rem;
                            margin: .2rem .2rem .2rem 0;
                        }
                        div {
                            float: left;
                            max-width: 3.5rem;
                            padding-top: .6rem;
                            font-size: .25rem;
                            overflow: hidden; 
                            h3 {
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                overflow: hidden; 
                            }
                            h4 {
                                font-weight: normal;
                                padding-top: .1rem;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                overflow: hidden;
                            }
                        }
                    }
                    span {
                        color: #c33;
                        
                    }
                }
                .btn-wrap {
                    padding: .2rem;
                    a {
                        float: right;    
                        padding: .1rem .2rem;
                        border: 1px solid #999;
                        margin: 0 .1rem;
                        border-radius: .05rem;
                    }
                }
            }
        }
        .yd-cell-item {
            background-color: #fff;
            &.mt {
                margin-top: .2rem;
            }
            select {
                padding-left: .5rem;
            }
            input {
                padding-left: .5rem;
            }
        }
        .th-address {
            background-color: #fff;
            margin-top: .2rem;
            padding: 0 .3rem .2rem;
            .label {
                font-size: .3rem;
                line-height: .8rem;
            }
            ul {
                li {
                    display: flex;
                    font-size: .3rem;
                    border-bottom: 1px dashed #999;
                    line-height: .6rem;
                    .right {
                        flex: 1;
                        padding-left: .2rem;
                        color: #666;
                        font-weight: bold;
                    }
                }
            }
        }
        .tip {
            padding: .3rem;
            font-size: .25rem;
            color: #c33;
        }
        .yd-popup-content {
            padding: .3rem;
            p {
                text-align: center;
                font-size: .3rem;
                color: #c33;
                line-height: .6rem;
            }
            input {
                width: 100%;
                height: .8rem;
                margin: .2rem 0;
                font-size: .3rem;
                text-align: center;
            }
            .btn-wrap {
                display: flex;
                justify-content: space-between;
                a {
                    width: 48%;
                    text-align: center;
                    line-height: .8rem;
                    border-radius: .1rem;
                    color: #fff;
                    font-size: .35rem;
                    &:nth-child(1) {
                        background-color: #666;
                    }
                    &:nth-child(2) {
                        background-color: #c33;

                    }
                }
            }
        }
    }
    .footer {
        a {
            display: block;
            background-color: #c33;
            color: #fff;
            text-align: center;
            line-height: .95rem;
            font-size: .35rem;
        }
    }
}
</style>