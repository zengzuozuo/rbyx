<template>
    <div class="findpassword-page">
        <ComHeaderbar text="找回密码"></ComHeaderbar>
        <div class="main">
            <yd-cell-group>
                <yd-cell-item>
                    <img src="../../assets/images/icon/phone_icon.png" style="vertical-align: middle" slot="icon" />
                    <input type="number" slot="right" v-model="postObj.mobile" placeholder="请输入手机号码">
                    <yd-sendcode slot="right" 
                                v-model="start" 
                                @click.native="sendCode"
                    ></yd-sendcode>
                </yd-cell-item>
                <yd-cell-item>
                    <img src="../../assets/images/icon/shield_icon.png" style="vertical-align: middle" slot="icon" />
                    <input type="text" slot="right" v-model="postObj.verificationcode" placeholder="请输入短信验证码">
                </yd-cell-item>
                <yd-cell-item>
                    <img src="../../assets/images/icon/password_icon.png" style="vertical-align: middle" slot="icon" />
                    <yd-input slot="right" type="password" v-model="postObj.password" placeholder="请输入密码"></yd-input>
                </yd-cell-item>
            </yd-cell-group>
            <yd-button size="large" bgcolor="#c33" color="#fff" @click.native="enter">确　定</yd-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            start: false,
            postObj: {
                code: "update_password",
                mobile: "",
                password: "",
                verificationcode: "",
            }
        }
    },
    mounted() {
    },
    methods: {
        enter() {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,this.postObj).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    this.$dialog.toast({
                        mes: data.msg,
                        icon: 'success',
                        callback: () => {
                            this.$router.goBack(-1);
                        }
                    })
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
.findpassword-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    .main {
        flex: 1;
        .yd-cell-box {
            margin-top: .5rem;
            .yd-btn {
                background-color: #c33;
            }
        }
    }
}
</style>