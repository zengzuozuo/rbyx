<template>
  <div class="manufacturer-details-page">
      <header>
          <i class="icon arrow-back" @click="$router.goBack(-1)"></i>
          <transition-group name="fade">
            <h2 v-show="titileIsShow" v-bind:key="1">{{pageData.brand.brand}}</h2>
          </transition-group>
          <i class="icon share" @click="$store.state.shareIsShow = true"></i>
      </header>
      <div class="main" ref="main" v-if="pageData.brand">
          <ImgTag :url="imgUrl + pageData.brand.banner" class="banner" ref="banner"/>
          <div class="goods-info">
              <h2>{{pageData.brand.brand}}<label @click="$store.state.popupIsShow = true">上新提醒</label></h2>
              <p>{{pageData.brand.content}}</p>
          </div>
          <div class="goods-list">
              <GoodsList :goodslist="pageData.data"></GoodsList>
          </div>
          <yd-popup v-model="$store.state.popupIsShow" position="center" width="90%">
                <div class="ctn-top">
                    <h3>设置上新提醒</h3>
                    <p>请留下你的手机号码，上新会第一时间通知您！</p>
                    <input type="number" v-model="mobile" placeholder="请输入接收通知的手机号" />
                    <p style="color: #999;">有效期90天</p>
                </div>
                <div class="btn-wrap">
                    <a href="javascript:;" @click="$store.state.popupIsShow = false">取消</a>
                    <a href="javascript:;" @click="setRemind">确定</a>
                </div>
          </yd-popup>
      </div>
      <transition-group name="bounce">
        <ShareBox :shareSendObj="shareSendObj" v-show="$store.state.shareIsShow" v-bind:key="1"></ShareBox>
      </transition-group>
  </div>
</template>

<script>
import GoodsList from "../common/goodslist_component";
export default {
    data() {
        return {
            titileIsShow: false,
            pageData: {
                brand: {
                    brand: ""
                }
            },
            mobile: "",
            shareSendObj: {
                title : "融博优选",
                content : "【融博优选】为您提供优质的购物体验",
                href : "https://scapp.szrbht.com/h5/index.html#/mftdetails?id=" + this.$route.query.id,
                pictures : "",
                thumbs: ""
            }
        }
    },
    mounted() {
        var that = this;
        this.$nextTick(function(){
            var bannerH = this.$refs.banner.$el.clientHeight;
            this.$refs.main.addEventListener("scroll",function(e) {
                if(bannerH < this.scrollTop) {
                    that.titileIsShow = true;
                }else {
                    that.titileIsShow = false;
                }


            })
        })

        this.getData();
    },
    methods: {
        getData() {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "brand",
                id: this.$route.query.id
            }).then((data) => {
                if(data.ztm == 1) {
                    this.pageData = data;

                    // 设置分享内容
                    this.shareSendObj.content = data.brand.brand; 
                    this.shareSendObj.thumbs = this.imgUrl + data.data.pic;
                }else {
                    this.$dialog.toast({mes: data.msg})
                }
            })
        },
        setRemind() {  //设置提醒
            if(!/^1(3|5|7|8|9)+\d{9}$/.test(this.mobile)) {
                this.$dialog.toast({mes: "手机号格式有误"});
                return;
            }
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "setRemindr",
                mobile: this.mobile,
                id: this.$route.query.id || ""
            }).then((data) => {
                console.log(data);
                this.$dialog.toast({mes: data.msg})
                if(data.ztm == 1) {
                    this.$store.state.popupIsShow = false;
                }
            })
        }
    },
    components: {
        GoodsList
    }
}
</script>

<style lang="less" scoped>
.manufacturer-details-page {
    position: relative;
    
    header {
        position: absolute;
        width: 100%;
        height: .88rem;
        left: 0;
        top: 0;
        h2 {
            line-height: .88rem;
            text-align: center;
            background-color: #fafafa;
            font-size: .3rem;
        }
        .icon {
            position: absolute;
            z-index: 99;
            width: .7rem;
            height: .7rem;
            top: .07rem;
            border-radius: 50%;
            &.arrow-back {
                left: .14rem;
                background: #fafafa url("../../assets/images/icon/arrow_back_black.png") no-repeat center;
                background-size: 60%;
            }
            &.share {
                right: .14rem;
                background: #fafafa url("../../assets/images/icon/transmit_icon.png") no-repeat center;
                background-size: 60%;
            }
        }
    }
    .main {
        height: 100%;
        -webkit-overflow-scrolling: touch;
        overflow-y: scroll;
        background-color: #fff;
        .banner {
            display: block;
            width: 100%;
            height: 4.5rem;
        }
        .goods-info {
            background-color: #fff;
            padding: .3rem;
            h2 {
                overflow: hidden;
                label {
                    float: right;
                    border: 1px solid #999;
                    padding: .05rem .1rem;
                }
            }
            p {
                margin-top: .1rem;
                line-height: .5rem;
                font-size: .24rem;
            }
        }
        .goods-list {
            background-color: #fff;
            margin-top: .2rem;
        }
        .yd-popup-content {
            .ctn-top {
                padding: .2rem .4rem;
                h3 {
                    text-align: center;
                    font-size: .3rem;
                }
                p {
                    font-size: .26rem;
                    line-height: .5rem;
                }
                input {
                    width: 100%;
                    text-align: center;
                    height: .7rem;
                    margin: .1rem 0;
                    font-size: .28rem;
                    border: 1px solid #999;
                }
            }
            .btn-wrap {
                display: flex;
                line-height: 1rem;
                border-top: 1px solid #999;
                a {
                    flex: 1;
                    text-align: center;
                    font-size: .3rem;
                    &:nth-child(2) {
                        color: #c33;
                        border-left: 1px solid #999;
                    }
                }
            }
        }
    }
}
</style>

