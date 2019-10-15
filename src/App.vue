<template>
  <div id="app" ref="app">
       <transition :name="$store.state.transitionName">
          <keep-alive>
            <router-view class="child-view" v-if="$route.meta.keepAlive" ref="childview"></router-view>
          </keep-alive>
        </transition>
      <transition :name="$store.state.transitionName">
      <router-view class="child-view" v-if="!$route.meta.keepAlive" ref="childview"></router-view>
      </transition>
    <div class="yd-dialog-white-mask" v-show="$store.state.mTip.loading">
      <div class="loading-box">
          <embed src='static/svg/loading1.svg' type='image/svg+xml' pluginspage='http://www.adobe.com/svg/viewer/install/' />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  mounted() {
  },
}
</script>

<style lang="less">
html,body{
  height: 100%;
  -moz-user-select: none;
	-khtml-user-select: none;
	user-select: none;
}
.clearfix::after {
    content: ".";
    clear: both;
    display: block;
    overflow: hidden;
    font-size: 0;
    height: 0;
}
.yd-dialog-white-mask {
  z-index: 121213 !important;
}
.yd-datetime-mask {
  z-index: 121213 !important;
}
.yd-datetime {
  z-index: 121214 !important;
}
.yd-lightbox {
  z-index: 121214 !important;
}
.clearfix {
    zoom: 1;
}

#app {
  font-family: 'Microsoft YaHei','Avenir', Helvetica, Arial, sans-serif;
  height: 100%;
  .loading-box {
      width: 1.5rem;
      height: 1.5rem;
  }

  .mbc {
    background-color: #ff67a1;
  }
}
.child-view {
  position: absolute;
  width:100%;
  height: 100%;
  transition: all .4s cubic-bezier(.55,0,.1,1);
}
.slide-left-enter, .slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(50px, 0);
  transform: translate(50px, 0);
}
.slide-left-leave-active, .slide-right-enter {
  opacity: 0;
  -webkit-transform: translate(-50px, 0);
  transform: translate(-50px, 0);
}

.vux-pop-out-enter-active,
 .vux-pop-out-leave-active,
 .vux-pop-in-enter-active,
 .vux-pop-in-leave-active {
 will-change: transform;
 transition: all 250ms;
 height: 100%;
 top: 0;
 position: absolute;
 backface-visibility: hidden;
 perspective: 1000;
 }
 
 .vux-pop-out-enter {
 opacity: 0;
 transform: translate3d(-100%, 0, 0);
 }
 
 .vux-pop-out-leave-active {
 opacity: 0;
 transform: translate3d(100%, 0, 0);
 }
 
 .vux-pop-in-enter {
 opacity: 0;
 transform: translate3d(100%, 0, 0);
 }
 
 .vux-pop-in-leave-active {
 opacity: 0;
 transform: translate3d(-100%, 0, 0);
 }

 .rotate-enter-active,.fade-leave-active{
    transition: all 0.5s ease-out;
}
.rotate-enter{
    transform: rotateY(180deg);
    opacity: 0;
}
.rotate-leave-active{
    transform: rotateY(-90deg);
    opacity: 0;
}
</style>
