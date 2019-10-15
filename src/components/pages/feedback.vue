<template>
    <div class="feedback-page">
        <ComHeaderbar text="意见反馈">
            <a href="javascript:;" class="other" @click="submit">提交</a>
        </ComHeaderbar>
        <div class="main">
            <yd-cell-group>
                <yd-cell-item arrow type="label">
                    <span slot="left">反馈类型：</span>
                    <select slot="right" v-model="postObj.typeid">
                        <option value="">请选择反馈类型</option>
                        <option :value="item.id" v-for="item in pageData">{{item.name}}</option>
                    </select>
                </yd-cell-item>
                <yd-cell-item>
                    <span slot="left">手机号：</span>
                    <input slot="right" v-model="postObj.mobile" type="number" placeholder="请填写手机号码，方便我们与你联系">
                </yd-cell-item>
                <yd-cell-item>
                    <yd-textarea slot="right" v-model="postObj.content" placeholder="对我们网站、商品、服务，你还有什么建议吗？你还希望在商城买到什么？请告诉我们..." maxlength="500"></yd-textarea>
                </yd-cell-item>
            </yd-cell-group>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pageData: null,
            postObj: {
                code: "feedbackInsert",
                mobile: "",
                typeid: "",
                content: ""
            },
            mobileReg: /^(13|15|17|18|19)+\d{9}$/
        }
    },
    mounted() {
        this.getData();
    },
    methods: {
        getData() {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "getFeedbackType"
            }).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    this.pageData = data.data;
                }
            })
        },
        submit() {
            if(this.postObj.typeid == "") {
                this.$dialog.toast({mes: "请选择要反馈的问题类型"});
                return;
            }
            if(!this.mobileReg.test(this.postObj.mobile)) {
                this.$dialog.toast({mes: "手机号码格式有误"});
                return;
            }
            if(this.postObj.content.trim() == "") {
                this.$dialog.toast({mes: "反馈内容不能为空"});
                return;
            }
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,this.postObj).then((data) => {
                console.log(data)
                if(data.ztm == 1) {
                    this.$dialog.toast({
                        mes: data.msg,
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
        }
    }
}
</script>

<style lang="less">
.feedback-page {
    .main {
        .yd-cell-box {
            .yd-cell {
                background-color: transparent;
                .yd-cell-item {
                    background-color: #fff;
                    margin-top: .2rem;
                    .yd-textarea {
                        &>textarea {
                            height: 2.5rem;
                        }
                    }
                }
            }
        }
    }
}
</style>
