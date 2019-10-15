<template>
    <div class="phonelogin-page">
        <header>
            <a class="icon" href="javascript:;" @click="$router.goBack(-1)"></a>
            <h2></h2>
            <router-link class="btn" to="register">注册</router-link>
        </header>
        <div class="main">
            <div class="logo">
                <ImgTag url="static/images/rbyx_logo.png" />
            </div>
            <yd-cell-group v-show="!isNote">
                <yd-cell-item>
                    <img src="../../assets/images/icon/phone_icon.png" style="vertical-align: middle" slot="icon" />
                    <input slot="right" type="number" v-model="postObj.mobile" placeholder="请输入手机号">
                </yd-cell-item>
                <yd-cell-item>
                    <img src="../../assets/images/icon/password_icon.png" style="vertical-align: middle" slot="icon" />
                    <yd-input slot="right" type="password" v-model="postObj.password" placeholder="请输入密码"></yd-input>
                </yd-cell-item>
            </yd-cell-group>
            <yd-cell-group v-show="isNote">
                <yd-cell-item>
                    <img src="../../assets/images/icon/phone_icon.png" style="vertical-align: middle" slot="icon" />
                    <input type="number" v-model="postObj.mobile" slot="right" placeholder="请输入手机号码">
                    <yd-sendcode slot="right" 
                                v-model="start" 
                                @click.native="sendCode"
                    ></yd-sendcode>
                </yd-cell-item>
                <yd-cell-item>
                    <img src="../../assets/images/icon/shield_icon.png" style="vertical-align: middle" slot="icon" />
                    <input type="number" v-model="postObj.verificationcode" slot="right" placeholder="请输入短信验证码">
                </yd-cell-item>
            </yd-cell-group>
            <yd-button size="large" bgcolor="#c33" @click.native="login" color="#fff">登　录</yd-button>
            <div class="forgetpsd clearfix">
                <a class="login-switch" v-show="!isNote" @click="isNote = true">短信登录</a>
                <a class="login-switch" v-show="isNote" @click="isNote = false">密码登录</a>
                <router-link v-show="!isNote" to="findpassword">忘记密码？</router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isNote: true,
            start: false,
            postObj: {
                code: "dologin",
                mobile: "",
                password: "",
                verificationcode: "",
            }
        }
    },
    methods: {
        login() {
            if(!this.isNote) {
                this.postObj.verificationcode = "";
            }else {
                if(this.postObj.verificationcode.trim() == "") {
                    this.$dialog.toast({
                        mes: "短信验证码不能为空",
                        icon: "error"
                    })
                    return;
                }
            }
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,this.postObj).then((data) => {
                if(data.ztm == 1) {
                    this.$dialog.toast({
                        mes: data.msg,
                        timeout: 1500,
                        icon: 'success',
                        callback: () => {
                            if(this.$route.query.back) {
                                this.$router.goBack(-2);
                            }else {
                                this.$router.push("home");
                            }
                        }
                    })
                    localStorage.setItem("zzz",data.tokenID);
                    try{
                        plus.storage.setItem("zzz",data.tokenID);
                    }catch(err) {}
                    
                }else {
                    this.$dialog.toast({
                        mes: data.msg,
                        icon: 'error',
                    })
                }
            })
        },
        sendCode() {
            this.$dialog.loading.open('发送中...');
            this.$http.post(this.apiUrl,{
                code: "VerificationCode",
                mobile: this.postObj.mobile
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
    }
}
</script>

<style lang="less">
.phonelogin-page {
    display: flex;
    flex-direction: column;
    background-color: #fafafa;
    height: 100%;
    overflow: hidden;

    header {
        display: flex;
        background-color: #fafafa;
        height: .88rem;
        .icon {
            width: .88rem;
            background: url("../../assets/images/icon/arrow_back_black.png") no-repeat center;
            background-size: 50%;
        }
        .btn {
            color: #707070;
            line-height: .88rem;
            padding: 0 .2rem;
            font-size: .3rem;
            font-weight: bold;
        }
        h2 {
            flex: 1;
        }
    }
    .main {
        flex: 1;
        .logo {
            img {
                display: block;
                height: 2rem;
                margin: .5rem auto;
            }
        }
        .yd-cell-box {
            .yd-btn {
                background-color: #c33;
            }
            .yd-cell {
                background-color: transparent;
                &:after {
                    border: none;
                }
                .yd-cell-item {
                    &:after {
                        margin-left: .24rem;
                        content: "";
                        position: absolute;
                        z-index: 0;
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        border-bottom: 1px solid #999;
                        -webkit-transform: scaleY(.5);
                        transform: scaleY(.5);
                        -webkit-transform-origin: 0 0;
                        transform-origin: 0 0;
                    }
                }
            }
        }
        .yd-btn-block  {
            width: 95%;
            height: 1rem;
            margin: .5rem auto .2rem;
        }
        .forgetpsd {
            padding: 0 2.5%;
            font-size: .3rem;
            a {
                float: right;
                padding: .2rem 0;
            }
            .login-switch {
                float: left;
            }
        }
    }
}
</style>