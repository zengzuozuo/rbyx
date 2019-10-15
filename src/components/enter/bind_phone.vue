<template>
    <div class="bindphone-page">
        <ComHeaderbar text="绑定手机号"></ComHeaderbar>
        <div class="main">
            <yd-cell-group>
                <yd-cell-item>
                    <img src="../../assets/images/icon/phone_icon.png" style="vertical-align: middle" slot="icon" />
                    <input type="text" slot="right" v-model="postData.mobile" placeholder="请输入手机号码">
                    <yd-sendcode slot="right" 
                                v-model="start" 
                                @click.native="sendCode"
                    ></yd-sendcode>
                </yd-cell-item>
                <yd-cell-item>
                    <img src="../../assets/images/icon/shield_icon.png" style="vertical-align: middle" slot="icon" />
                    <input type="number" v-model="postData.verificationcode" slot="right" placeholder="请输入短信验证码">
                </yd-cell-item>
            </yd-cell-group>
            <yd-button size="large" bgcolor="#c33" color="#fff" @click.native="bind">绑　定</yd-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            start: false, 
            postData: {
                code: "bind",
                mobile: "15549064894",
                verificationcode: "",
                type: this.$route.query.typea,
                openid: this.$route.query.openid,
                unionid: this.$route.query.unionid
            }
        }
    },
    mounted() {
    },
    methods: {
        sendCode() {
            this.$dialog.loading.open('发送中...');
            this.$http.post(this.apiUrl,{
                code: "VerificationCode",
                mobile: this.postData.mobile
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
        bind() {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,this.postData).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    this.$dialog.toast({
                        mes: data.msg,
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
                }else {
                    this.$dialog.toast({
                        mes: data.msg,
                        icon: 'error',
                    })
                }
            })
        }
    }
}
</script>

<style lang="less">
.bindphone-page {
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