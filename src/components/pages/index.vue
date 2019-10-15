<template>
    <div class="index-page">
        <keep-alive>
            <router-view class="index-router-view" />
        </keep-alive>
        <footer>
            <router-link to="/home">
                <i class="icon home"></i>
                <span>首页</span>
            </router-link>
            <router-link to="/special">
                <i class="icon special"></i>
                <span>专题</span>
            </router-link>
            <router-link to="/class">
                <i class="icon goodsclass"></i>
                <span>分类</span>
            </router-link>
            <router-link to="/shopingcart">
                <yd-badge bgcolor="#c33" v-show="$store.state.shopCartNum > 0" color="#FFF">{{$store.state.shopCartNum}}</yd-badge>
                <i class="icon shopingcart"></i>
                <span>购物车</span>
            </router-link>
            <router-link to="/my">
                <i class="icon my"></i>
                <span>个人</span>
            </router-link>
        </footer>
    </div>
</template>

<script>
export default {
    mounted() {
    },
}
</script>

<style lang="less">
.index-page {
    display: -webkit-flex; /* Safari */
    display: flex;
    flex-direction: column;
    .index-router-view {
        flex: 1;
    }
    footer {
        display: flex;
        padding: .18rem 0;
        background-color: #fafafa;
        border-top: 1px solid #d5d5d5;
        a {
            position: relative;
            flex: 1;
            text-align: center;
            .icon {
                display: block;
                width: .45rem;
                height: .45rem;
                margin: 0 auto;
                background-size: cover;
                &.home {
                    background-image: url('../../assets/images/icon/home_icon_black.png');
                }
                &.special {
                    background-image: url('../../assets/images/icon/special_icon_black.png');
                }
                &.goodsclass {
                    background-image: url('../../assets/images/icon/class_icon_black.png');
                }
                &.shopingcart {
                    background-image: url('../../assets/images/icon/shopingcart_icon_black.png');
                }
                &.my {
                    background-image: url('../../assets/images/icon/my_icon_black.png');
                }
            }
            span {
                color: #747474;
                font-size: .28rem;
            }
            &.router-link-active {
                .icon {
                    &.home {
                        background-image: url('../../assets/images/icon/home_icon_red.png');
                    }
                    &.special {
                        background-image: url('../../assets/images/icon/special_icon_red.png');
                    }
                    &.goodsclass {
                        background-image: url('../../assets/images/icon/class_icon_red.png');
                    }
                    &.shopingcart {
                        background-image: url('../../assets/images/icon/shopingcart_icon_red.png');
                    }
                    &.my {
                        background-image: url('../../assets/images/icon/my_icon_red.png');
                    }
                }
                span {
                    color: #c33;
                }
            }
            .yd-badge {
                position: absolute;
                top: -0.1rem;
                right: .25rem;
                font-size: .18rem;
            }
        }
    }
}
</style>