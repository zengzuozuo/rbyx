<template>
    <div class="pull-down-component">
        <!--<img class="pullicon" src="../../assets/images/icon/arrow_down_icon.png" ref="pullicon"/>-->
        <div class="pullicon" ref="pullicon">
          <embed src='static/svg/loading3.svg' type='image/svg+xml' pluginspage='http://www.adobe.com/svg/viewer/install/' />
        </div>
        <!--<span>{{ tipText }}</span>-->
    </div>
</template>

<script>
export default {
    props: {
        pullH: {
            default: 0
        },
    },
    data() {
        return {
            tipText: "下拉刷新",
        }
    },
    watch: {
        pullH() {
            if(this.pullH >= 160){
                this.$refs.pullicon.style.transform = 'rotate(180deg)';
                this.tipText = "释放刷新";
            }else if(this.pullH <= 0){
                this.$refs.pullicon.style.transform = 'rotate(0deg)';
                this.tipText = "下拉刷新";
            }else {
                this.$refs.pullicon.style.transform = 'rotate('+ this.pullH +'deg)';
                this.tipText = "下拉刷新";
            }
        }
    }
}
</script>

<style lang="less">
.pull-down-component {
    position: absolute;
    top: -1.6rem;
    left: 0;
    width: 100%;
    text-align: center;
    transform: scale(0);
    .pullicon {
        display: inline-block;
        width: 1.5rem;
        height: 1.5rem;
        vertical-align: middle;
    }
    span {
        font-size: 0.3rem;
        vertical-align: middle;
        color: #ff67a1;
        font-weight: bold;
    }
}
</style>

