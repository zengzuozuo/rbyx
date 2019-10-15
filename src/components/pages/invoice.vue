<template>
    <div class="invoice-page">
        <ComHeaderbar text="发票信息">
            <a href="javascript:;" class="other" @click="save">保存</a>
        </ComHeaderbar>
        <div class="main">
            <yd-cell-group>
                <yd-cell-item arrow type="label">
                    <span slot="left" class="pl">发票类型</span>
                    <select slot="right" v-model="invoice.invoicetype">
                        <option value="1">电子普通发票</option>
                        <option value="2">纸质普通发票</option>
                        <option value="3">增值税专用发票</option>
                    </select>
                </yd-cell-item>
                <p v-show="invoice.invoicetype == 1">电子普通发票是税局认可的有效凭证，其法律效力、基本用途及使用规定同纸质发票</p>
                <p v-show="invoice.invoicetype == 2">部分纸质普通发票无法随箱寄出，将在最后一个包裹发货后15-30个工作日单独寄出，建议选择电子普通发票，确认收货后即可下载</p>
                <p v-show="invoice.invoicetype == 3">我公司依法开具发票，如你购买的商品按税法规定属于不得从增值税销项税额中抵扣的项目（如集体福利或个人消费等），请选择普通发票</p>
            </yd-cell-group>
            <yd-cell-group>
                <yd-cell-item>
                    <span slot="left">*发票抬头</span>
                    <span slot="left" class="radio" v-show="invoice.invoicetype != 3" :class="{'active': invoice.invoiceraised == 1}" @click="invoice.invoiceraised = 1">个人</span>
                    <span slot="left" class="radio" :class="{'active': invoice.invoiceraised == 2}" @click="invoice.invoiceraised = 2">单位</span>
                </yd-cell-item>
                <yd-cell-item v-show="invoice.invoiceraised == 1">
                    <input slot="right" type="text" v-model="invoice.name" placeholder="请输入个人或姓名">
                </yd-cell-item>
                <yd-cell-item v-show="invoice.invoiceraised == 2">
                    <input slot="right" type="text" v-model="invoice.companyname" placeholder="请输入单位名称">
                </yd-cell-item>
                <yd-cell-item v-show="invoice.invoiceraised == 2">
                    <span slot="left" class="pl">*纳税人识别号</span>
                    <input slot="right" type="text" v-model="invoice.rnumber" placeholder="或统一社会信用代码">
                </yd-cell-item>
                <yd-cell-item v-show="invoice.invoicetype == 3">
                    <span slot="left" class="pl">*注册地址</span>
                    <input slot="right" type="text" v-model="invoice.regaddress" placeholder="请确保与贵司税务登记征信信息一致">
                </yd-cell-item>
                <yd-cell-item v-show="invoice.invoicetype == 3">
                    <span slot="left" class="pl">*注册电话</span>
                    <input slot="right" type="text" v-model="invoice.regtel" placeholder="请输入注册电话">
                </yd-cell-item>
                <yd-cell-item v-show="invoice.invoicetype == 3">
                    <span slot="left" class="pl">*开户银行</span>
                    <input slot="right" type="text" v-model="invoice.bank" placeholder="请输入开户银行">
                </yd-cell-item>
                <yd-cell-item v-show="invoice.invoicetype == 3">
                    <span slot="left" class="pl">*银行账户</span>
                    <input slot="right" type="number" v-model="invoice.bankaccount" placeholder="请输入银行账户">
                </yd-cell-item>
                <yd-cell-item type="label">
                    <span slot="left" class="pl">发票内容</span>
                    <span slot="left">{{invoice.content}}</span>
                </yd-cell-item>
                <yd-cell-item type="label">
                    <span slot="left" class="pl">发票金额</span>
                    <span slot="left">￥{{invoice.money}}</span>
                </yd-cell-item>
            </yd-cell-group>
            <yd-cell-group>
                <yd-cell-item type="label">
                    <span slot="left" class="pl">*收票人手机</span>
                    <input slot="right" type="number" v-model="invoice.mobile" placeholder="开好发票通知您"/>
                </yd-cell-item>
                <yd-cell-item type="label">
                    <span slot="left" class="pl">收票人邮箱</span>
                    <input slot="right" type="text" v-model="invoice.email" placeholder="用于接收电子发票"/>
                </yd-cell-item>
            </yd-cell-group>
            <div class="address" v-if="address" v-show="invoice.invoicetype != 1" @click="$router.push('address?invoice=1')">
                <label>*收票地址</label>
                <div>
                    <span>{{address.realname}}</span>
                    <span>{{address.mobile}}</span>
                    <span>{{address.region}}{{address.address}}</span>
                </div>
                <img src="../../assets/images/icon/arrow_go_black.png" />
            </div>
            <div class="notice" v-if="pageData">
                <span class="label">发票须知:</span>
                <p v-html="pageData"></p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pageData: null,
            invoice: {
                status: 1,
                invoicetype: 1,
                invoiceraised: 1,
                name: "",
                companyname: "",  //公司名
                money: this.$route.query.money || "",
                content: "明细",
                mobile: "",  //收票人手机
                email: "",  //收票人邮箱
                aid: "",  //地址id
                rnumber: "",  //纳税人识别号
                regaddress: "",  //注册地址
                regtel: "",  //注册电话
                bank: "",  //注册银行
                bankaccount: ""  //银行账户
            },
            address: null
        }
    },
    mounted() {
        
    },
    watch: {
        invoice: {
            handler: function (val, oldVal) {
                if(val.invoicetype == 3) {
                    val.invoiceraised = 2;
                }
            },
            deep: true
        }
    },
    methods: {
        getData() {
            this.$http.post(this.apiUrl,{
                code: "invoiceExplain"
            }).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    this.pageData = data.data.invoiceexplain;
                    
                    if(sessionStorage.getItem("invoiceAddress")) {
                        this.address = JSON.parse(sessionStorage.getItem("invoiceAddress"));
                    }else {
                        this.address = data.address;
                    }
                    this.invoice.aid = this.address.id;
                }
                if(data.ztm == 2) {
                    this.pageData = data.data.invoiceexplain;
                    this.$dialog.confirm({
                        title: '提示',
                        mes: '您还没有添加收货地址，是否马上添加？',
                        opts: () => {
                            this.$router.push("address");
                        }
                    });
                }
            })
        },
        save() {
            console.log({
                    code: "repairInvoice",
                    ordersn: this.$route.query.oid || "",
                    invoice: JSON.stringify(this.invoice)
                });
            if(this.invoice.invoicetype == 1 && this.invoice.invoiceraised == 1) {  //电子个人
                if(this.invoice.email.trim() == "" || this.invoice.name.trim() == "" || this.invoice.mobile.trim() == "") {
                    this.$dialog.toast({mes: "信息填写不完整"});
                    return;
                }
            }
            if(this.invoice.invoicetype == 1 && this.invoice.invoiceraised == 2) {  //电子单位
                if(this.invoice.email.trim() == "" || this.invoice.companyname.trim() == "" || this.invoice.rnumber.trim() == "" || this.invoice.mobile.trim() == "") {
                    this.$dialog.toast({mes: "信息填写不完整"});
                    return;
                }
            }
            if(this.invoice.invoicetype == 2 && this.invoice.invoiceraised == 1) {  //纸质个人
                if(this.invoice.name.trim() == "" || (this.invoice.aid + "").trim() == "" || this.invoice.mobile.trim() == "") {
                    this.$dialog.toast({mes: "信息填写不完整"});
                    return;
                }
            }
            if(this.invoice.invoicetype == 2 && this.invoice.invoiceraised == 2) {  //纸质单位
                if(this.invoice.rnumber.trim() == "" || this.invoice.companyname.trim() == "" || (this.invoice.aid + "").trim() == "" || this.invoice.mobile.trim() == "") {
                    this.$dialog.toast({mes: "信息填写不完整"});
                    return;
                }
            }
            if(this.invoice.invoicetype == 3) {  //增值税
                if(this.invoice.bankaccount.trim() == "" || this.invoice.bank.trim() == "" || this.invoice.regtel.trim() == "" || this.invoice.regaddress.trim() == "" || this.invoice.rnumber.trim() == "" || this.invoice.companyname.trim() == "" || (this.invoice.aid + "").trim() == "" || this.invoice.mobile.trim() == "") {
                    this.$dialog.toast({mes: "信息填写不完整"});
                    return;
                }
            }
            
            if(this.$route.query.oid) {
                this.$dialog.confirm({
                    title: '确定保存？',
                    mes: '请确认发票信息正确',
                    opts: () => {
                        this.$http.post(this.apiUrl,{
                            code: "repairInvoice",
                            ordersn: this.$route.query.oid || "",
                            invoice: JSON.stringify(this.invoice)
                        }).then((data) => {
                            console.log(data);
                            this.$dialog.toast({mes: data.msg});
                            if(data.ztm == 1) {
                                this.$router.goBack(-1);
                            }
                        })
                    }
                });
                
            }else {
                this.$store.commit("setShopingCart",{
                    invoice: this.invoice
                })
                this.$router.goBack(-1);
            }
            
        }
    },
    activated() {
        this.getData();
        this.invoice.money = this.$route.query.money;
    }
}
</script>

<style lang="less">
.invoice-page {
    display: flex;
    flex-direction: column;

    .main {
        -webkit-overflow-scrolling: touch;
        overflow-y: scroll;
        .yd-cell-box {
            margin-bottom: .2rem;
            p {
                padding: .2rem;
                font-size: .26rem;
            }
            .yd-cell-item {
                .yd-cell-left {
                    .radio {
                        border: 1px solid #c5c5c5;
                        line-height: .55rem;
                        padding: 0 .26rem;
                        margin-left: .34rem;
                        &.active {
                            border-color: #c33;
                            color: #c33;
                        }
                    }
                    .pl {
                        padding-right: .34rem;
                    }
                }
            }
        }
        .address {
            padding: .24rem;
            display: flex;
            align-items: center;
            background-color: #fff;
            font-size: .3rem;
            label {
                padding-right: .34rem;
            }
            div {
                flex: 1;
                padding-right: .2rem;
                span {
                    display: block;
                }
            }
            img {
                width: .3rem;
                height: .3rem;
            }
        }
        .notice {
            padding: .2rem;
            font-size: .26rem;
            .label {
                display: block;
            }
        }
    }
}
</style>
