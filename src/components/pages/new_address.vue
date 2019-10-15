<template>
    <div class="newaddress-page">
        <ComHeaderbar :text="titleText">
            <a class="other" href="javascript:;" @click="save">保存</a>
        </ComHeaderbar>
        <div class="main">
            <yd-cell-group>
                <yd-cell-item>
                    <input slot="right" type="text" @click.stop="show1 = true" v-model="model" readonly placeholder="请选择收货地址">
                </yd-cell-item>
                <yd-cell-item>
                    <input slot="right" v-model="address" type="text" placeholder="详细地址，如街道、楼牌号等">
                </yd-cell-item>
                <yd-cell-item>
                    <input slot="right" type="text" v-model="realname" placeholder="姓名">
                </yd-cell-item>
                <yd-cell-item>
                    <input slot="right" type="number" v-model="mobile" placeholder="手机号码">
                </yd-cell-item>
                <yd-cell-item type="a" href="javascript:;">
                    <span slot="left">设为默认地址</span>
                    <yd-switch slot="right" v-model="sign" color="#c33"></yd-switch>
                </yd-cell-item>
            </yd-cell-group>
            <yd-cityselect v-model="show1" :callback="result1" :items="district" 
                provance=""
                city=""
                area="">
            </yd-cityselect>
        </div>
        <footer v-if="$route.query.data">
            <a href="javascript:;" @click="remove">删除地址</a>
        </footer>
    </div>
</template>

<script type="text/babel">
    import District from 'ydui-district/dist/jd_province_city_area_id';

    export default {
        data() {
            return {
                show1: false,
                district: District,
                model: "",
                address: "",
                mobile: "",
                realname: "",
                sign: false,
                id: "",
                titleText: "新建地址"
            }
        },
        mounted() {
            if(this.$route.query.data) {
                this.model = JSON.parse(this.$route.query.data).region;
                this.address = JSON.parse(this.$route.query.data).address;
                this.mobile = JSON.parse(this.$route.query.data).mobile;
                this.realname = JSON.parse(this.$route.query.data).realname;
                this.sign = JSON.parse(this.$route.query.data).sign == 1 ? true : false;
                this.id =  JSON.parse(this.$route.query.data).id;
                this.titleText = "修改地址";
            }
        },
        methods: {
            save() {
                const postObj = {
                    code: "insertAddress",
                    region: this.model,
                    address: this.address,
                    mobile: this.mobile,
                    realname: this.realname,
                    sign: this.sign == true ? 1 : 0,
                    id: this.id || ""
                }
                for(var i in postObj) {
                    if((postObj[i].toString()).trim() == "" && i != "id") {
                        this.$dialog.toast({
                            mes: "信息填写不完整",
                            timeout: 1500,
                        });
                        return;
                    }
                }
                console.log(postObj)
                this.$store.commit("openWait");
                this.$http.post(this.apiUrl,postObj).then((data) => {
                    if(data.ztm == 1) {
                        this.$dialog.toast({
                            mes: data.msg,
                            timeout: 1500,
                            icon: 'success',
                            callback: () => {
                                this.$router.goBack(-1);
                            }
                        });
                    }else {
                        this.$dialog.toast({
                            mes: data.msg,
                            timeout: 1500,
                            icon: 'error'
                        });
                    }
                })
            },
            remove() {
                this.$dialog.confirm({
                    title: '提示',
                    mes: '确定要删除此地址？',
                    opts: () => {
                        this.$http.post(this.apiUrl,{
                            code: "deleteUserAddress",
                            id: this.id
                        }).then((data) => {
                            if(data.ztm == 1) {
                                this.$dialog.toast({
                                    mes: data.msg,
                                    timeout: 1500,
                                    icon: 'success',
                                    callback: () => {
                                        this.$router.goBack(-1);
                                    }
                                });
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
            result1(ret) {
                this.model = ret.itemName1 + ' ' + ret.itemName2 + ' ' + ret.itemName3;
            }
        }
    }
</script>

<style lang="less">
.newaddress-page {
    display: flex;
    flex-direction: column;
    .main {
        flex: 1;
        overflow-y: auto;
        .yd-cell-box {
            input {
                color: #000;
            }
            
        }
    }
    footer {
        padding: .2rem;
        a {
            display: block;
            border: 1px solid #c33;
            text-align: center;
            padding: .2rem 0;
            color: #c33;
        }
    }
}
</style>