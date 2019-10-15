<template>
    <div class="setphone-page">
        <ComHeaderbar text="验证身份"></ComHeaderbar>
        <div class="main">
            <div class="bz">
                <a href="javascript:;" :class="{'active' : bzActive == 1}">1验证身份</a>
                <a href="javascript:;" :class="{'active' : bzActive == 2}">2绑定新手机</a>
            </div>
            <yd-cell-group v-show="bzActive == 1">
                <yd-cell-item>
                    <img src="../../assets/images/icon/phone_icon.png" style="vertical-align: middle" slot="icon" />
                    <input type="text" slot="right" v-model="postObj1.mobile" placeholder="请输入手机号码" disabled>
                    <yd-sendcode slot="right" 
                                v-model="start" 
                                @click.native="sendCode1" 
                    ></yd-sendcode>
                </yd-cell-item>
                <yd-cell-item>
                    <img src="../../assets/images/icon/shield_icon.png" style="vertical-align: middle" slot="icon" />
                    <input type="number" slot="right" v-model="postObj1.verificationcode" placeholder="请输入短信验证码">
                </yd-cell-item>
            </yd-cell-group>
            <yd-button size="large" v-show="bzActive == 1" bgcolor="#c33" @click.native="updateUsernameMobile" color="#fff">确定</yd-button>
            <transition-group name="bounceDown">
                <div v-show="bzActive == 2" v-bind:key="1">
                    <yd-cell-group>
                        <yd-cell-item>
                            <img src="../../assets/images/icon/phone_icon.png" style="vertical-align: middle" slot="icon" />
                            <input type="number" slot="right" v-model="postObj2.mobile" placeholder="请输入手机号码" >
                            <yd-sendcode slot="right" 
                                        v-model="start" 
                                        @click.native="sendCode2" 
                            ></yd-sendcode>
                        </yd-cell-item>
                        <yd-cell-item>
                            <img src="../../assets/images/icon/shield_icon.png" style="vertical-align: middle" slot="icon" />
                            <input type="number" slot="right" v-model="postObj2.verificationcode" placeholder="请输入短信验证码">
                        </yd-cell-item>
                    </yd-cell-group>
                    <yd-button size="large" bgcolor="#c33" @click.native="checkUpdateUserMobile" color="#fff">确定</yd-button>
                </div>
            </transition-group>
            
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            start: false,
            bzActive: 1,
            postObj1: {
                code: "updateUsernameMobile",
                verificationcode: "",
                mobile: ""
            },
            postObj2: {
                code: "checkUpdateUserMobile",
                verificationcode: "",
                verificationtoken: "",
                mobile: ""
            },
        }
    },
    mounted() {
        this.getData();
    },
    methods: {
        sendCode1() {
            this.$dialog.loading.open('发送中...');
            this.$http.post(this.apiUrl,{
                code: "VerificationCode",
                mobile: this.postObj1.mobile
            }).then((data) => {
                console.log(data)
                this.$dialog.loading.close();
                if(data.ztm == 1) {
                    this.start1 = true;
                    this.$dialog.toast({
                        mes: data.msg,
                        icon: 'success',
                        timeout: 1500
                    });
                }else {
                    this.$dialog.toast({
                        mes: data.msg,
                        icon: 'error',
                        timeout: 1500
                    });
                }
            }).catch((err) => {
                this.$dialog.loading.close();
            })
        },
        sendCode2() {
            this.$dialog.loading.open('发送中...');
            this.$http.post(this.apiUrl,{
                code: "VerificationCode",
                mobile: this.postObj2.mobile
            }).then((data) => {
                console.log(data)
                this.$dialog.loading.close();
                if(data.ztm == 1) {
                    this.start1 = true;
                    this.$dialog.toast({
                        mes: data.msg,
                        icon: 'success',
                        timeout: 1500
                    });
                }else {
                    this.$dialog.toast({
                        mes: data.msg,
                        icon: 'error',
                        timeout: 1500
                    });
                }
            }).catch((err) => {
                this.$dialog.loading.close();
            })
        },
        updateUsernameMobile() {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,this.postObj1).then((data) => {
                if(data.ztm == 1) {
                    this.$dialog.toast({
                        mes: data.msg,
                        timeout: 1000,
                        callback: () => {
                            this.bzActive = 2;
                        }
                    })
                    this.postObj2.verificationtoken = data.verificationtoken;
                }else {
                    this.$dialog.toast({
                        mes: data.msg,
                        icon: "error"
                    })
                }
            })
        },
        checkUpdateUserMobile() {
            this.$store.commit("openWait");
            console.log(this.postObj2)
            this.$http.post(this.apiUrl,this.postObj2).then((data) => {
                if(data.ztm == 1) {
                    this.$dialog.toast({
                        mes: data.msg,
                        timeout: 1000,
                        icon: "success",
                        callback: () => {
                            this.$router.goBack(-1);
                        }
                    })
                }else {
                    this.$dialog.toast({
                        mes: data.msg,
                        icon: "error"
                    })
                }
            })
        },
        getData() {
            this.$http.post(this.apiUrl,{
                code: "getUserinfo"
            }).then((data) => {
                if(data.ztm == 1) {
                    this.postObj1.mobile = data.data.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'); 
                }
            })
        },
    }
}
</script>

<style lang="less">
.setphone-page {
    display: flex;
    flex-direction: column;
    .main {
        flex: 1;
        background-color: #fff;
        .bz {
            display: flex;
            height: .72rem;
            background: url('../../assets/images/bz_bg.png') no-repeat center;
            background-size: cover;
            a {
                flex: 1;
                text-align: center;
                line-height: .72rem;
                font-size: .28rem;
                &.active {
                    color: #c33;
                }
            }
        }
        .yd-cell-box {
            margin-top: 1rem;
            .yd-btn {
                background-color: #c33;
            }
        }
    }
}
</style>
