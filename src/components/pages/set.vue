<template>
    <div class="set-page">
        <ComHeaderbar text="设置"></ComHeaderbar>
        <div class="main">
            <yd-cell-group>
                <yd-cell-item>
                    <span slot="left">消息推送</span>
                    <yd-switch slot="right" v-model="tuisongstatus" color="#c33"></yd-switch>
                </yd-cell-item>
                <yd-cell-item @click.native="clearCache">
                    <span slot="left">清除缓存</span>
                    <span slot="right">{{ cacheSize }}MB</span>
                </yd-cell-item>
                <yd-cell-item arrow @click.native="$router.push('feedback')">
                    <span slot="left">意见反馈</span>
                </yd-cell-item>
                <yd-cell-item arrow @click.native="$router.push('about')">
                    <span slot="left">关于我们</span>
                </yd-cell-item>
                <yd-cell-item arrow type="label" @click.native="$store.state.shareIsShow = true">
                    <span slot="left">分享APP</span>
                </yd-cell-item>
            </yd-cell-group>
            <yd-button size="large" @click.native="goOut" bgcolor="#c33" color="#FFF">退出登录</yd-button>
            <transition-group name="bounce">
                <ShareBox v-show="$store.state.shareIsShow" v-bind:key="1"></ShareBox>
            </transition-group>
        </div>
    </div>
</template>

<script type="text/babel">
import ShareBox from "../common/share_component";
    export default {
        data() {
            return {
                cacheSize: 0,
                tuisongstatus: localStorage.getItem("tuisongstatus") || true,
            }
        },
        watch: {
            tuisongstatus(val,oldval) {
                console.log(val)
                this.$http.post(this.apiUrl,{
                    code: "setTuiSong",
                    tuisongstatus: this.tuisongstatus
                }).then((data) => {
                    console.log(data);
                    if(data.ztm == 1) {
                        localStorage.setItem("tuisongstatus",this.tuisongstatus);
                    }
                })
            }
        },
        mounted() {
            this.getCache();   //获取应用缓存大小
        },
        methods: {
            getCache() {
                var that = this;
                try{
                    plus.cache.calculate(function(size) {
                        that.cacheSize = size;
                    });
                }catch(err) {
                    that.cacheSize = 0;
                }
            },
            clearCache() {
                var that = this;
                try{
                    plus.cache.clear( function() {
                        that.$dialog.toast({mes: "缓存清除成功"})
                        that.getCache();
                    } );
                }catch(err) {
                    that.$dialog.toast({
                        mes: "当前环境不支持"
                    })
                }
            },
            goOut() {
                this.$dialog.confirm({
                    title: '提示',
                    mes: '退出登录？',
                    opts: () => {
                        this.$store.commit("openWait");
                        this.$http.post(this.apiUrl,{
                            code: "loginout"
                        }).then((data) => {
                            if(data.ztm == 1) {
                                localStorage.removeItem("zzz");
                                this.$router.replace("login");
                                try{plus.storage.removeItem("zzz")}catch(err) {};
                            }else {
                                this.$dialog.toast({mes: data.msg});
                            }
                        })
                        
                    }
                });
                
            },
        },
        components: {
            ShareBox
        }
    }
</script>

<style lang="less">
.set-page {
    display: flex;
    flex-direction: column;
    .com-headerbar {

    }
    .main {
        flex: 1;
        .yd-cell-box {
            margin-top: .2rem;
        }
        .yd-btn-block {
            width: 95%;
            margin: 0 auto;
        }
    }
}
</style>