<template>
    <div class="usercomment-page">
        <ComHeaderbar text="评价"></ComHeaderbar>
        <div class="main">
            <ul>
                <li v-for="item in pageData">
                    <div class="goods-info">
                        <ImgTag :url="imgUrl + item.pic" />
                        <div class="ctn-right">
                            <h3>{{item.title}}</h3>
                            <div>
                                <label>规格/颜色： {{item.specifications}}</label>
                            </div>
                        </div>
                    </div>
                    <div class="grade">
                        <span>评分</span>
                        <yd-rate slot="left" :readonly="item.createtime > 0" size=".42rem" v-model="item.score" active-color="#f0b952" :show-text="['很差','还行','一般','挺好','非常满意']"></yd-rate>
                    </div>
                    <yd-textarea slot="right" v-show="item.createtime <= 0" v-model="item.content" placeholder="填写高质量的评价即可参与抽奖哦~" maxlength="100"></yd-textarea>
                    <p class="time" v-show="item.createtime > 0">{{item.time}}</p>
                    <p class="pl-text" v-show="item.createtime > 0">{{item.content}}</p>
                    <div class="img-box">
                        <ImgTag v-for="subItem,index in item.img" class="pjt" :url="appImgUrl + subItem" :key="index" />
                        <img v-show="item.createtime <= 0 && item.img.length < 4" class="upload-img" @click="uploadImgClick(item)" src="../../assets/images/select_pic.png" alt="">
                    </div>
                    <div class="btn-wrap">
                        <a href="javascript:;" v-show="item.createtime <= 0" @click="insertEvaluate(item)">提交</a>
                    </div>
                </li>
            </ul>
            <yd-actionsheet :items="myItems" v-model="actionSheetShow" cancel="取消"></yd-actionsheet>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            actionSheetShow: false,
            pageData: [],
            myItems: [
                {
                    label: '拍照',
                    callback: () => {
                        this.paizhao();
                    }
                },
                {
                    label: '从相册中选取',
                    callback: () => {
                        this.selectxc();
                    }
                }
            ],
            activeGoods: null
        }
    },
    mounted() {
        this.getData();
    },
    methods: {
        uploadImgClick(item) {
            this.activeGoods = item;
            this.actionSheetShow = true;
        },
        insertEvaluate(item) {  //插入
            if(item.content.trim() == "") {
                this.$dialog.toast({mes: "请填写评论内容"})
                return;
            }

            this.$store.commit('openWait');
            this.$http.post(this.apiUrl,{
                code: "insertEvaluate",
                data: JSON.stringify(item),
            }).then((data) => {
                if(data.ztm == 1) {
                    this.$dialog.toast({mes: data.msg,icon: "success",callback: () => {
                        this.$router.goBack(-1);
                    }});
                }else {
                    this.$dialog.toast({mes: data.msg,icon: "error"});
                }
            })
        },
        getData() {
            this.$store.commit('openWait');
            this.$http.post(this.apiUrl,{
                code: "evaluate",
                ordersn: this.$route.query.ordersn
            }).then((data) => {
                switch(data.ztm) {
                    case 1:
                        this.pageData = data.data;
                        break;
                    case 2:     
                        this.$router.goBack(-1);
                        this.$dialog.toast({mes: data.msg});
                        break;
                    default:
                        this.$dialog.toast({mes: data.msg});
                        break;
                }
            })
        },
        paizhao() {  //拍照
            var that = this;
            var cmr = plus.camera.getCamera(1);
            cmr.captureImage(function(p) {
                plus.io.resolveLocalFileSystemURL(p, function(entry) {
                    that.compressImage(entry.toLocalURL(), entry.name);
                }, function(e) {
                    plus.nativeUI.toast("读取拍照文件错误：" + e.message);
                });
            }, function(e) {}, {
                filename: "_doc/camera/",
                index: 1
            });
        },
        selectxc() {
            var that = this;
            plus.gallery.pick(function(p) {
                plus.io.resolveLocalFileSystemURL(p, function(entry) {
                    that.compressImage(entry.toLocalURL(), entry.name);
                }, function(e) {
                    plus.nativeUI.toast("读取拍照文件错误：" + e.message);
                });
            }, function(e) {}, {
                filename: "_doc/camera/",
                filter: "image"
            });
        },
        compressImage(url,filename){   
            var that = this;
            plus.zip.compressImage({  
                    src:url,//src: (String 类型 )压缩转换原始图片的路径  
                    dst:url,//压缩转换目标图片的路径  
                    quality:20,//quality: (Number 类型 )压缩图片的质量.取值范围为1-100  
                    overwrite:true,//overwrite: (Boolean 类型 )覆盖生成新文件  
                    width : '400px',
                },  
                function(event) {   
                    that.$store.commit("openWait");
                    that.avatarUpload(event.target);
                    //event.target获取压缩转换后的图片url路
                },function(error) {  
                    plus.nativeUI.toast("压缩图片失败，请稍候再试");  
            });  
        },
        avatarUpload(avatar) {
            var that = this;
            var task = plus.uploader.createUpload(this.uploadUrl, {
                method: "POST"
            }, function(t, status) { //创建上传任务
                if(status == 200) { //返回状态
                    that.$store.commit("closeWait");
                    var data = JSON.parse(t.responseText || '{}');
                    if(data.ztm == 0) {
                        plus.nativeUI.toast("图片上传失败");
                        return;
                    }
                    that.activeGoods.img.push(data.url);
                } else {
                    that.$store.commit("closeWait");
                    plus.nativeUI.toast("上传失败" + status);
                }
            });
            task.addFile(avatar, {
                key: "avatar"
            }); //所上传文件
            task.start(); //开始上传任务
        },
    }
}
</script>

<style lang="less">
.usercomment-page {
    display: flex;
    flex-direction: column;
    .main {
        flex: 1;
        overflow-y: auto;
        ul {
            overflow: hidden;
            li {
                padding: .24rem .3rem;
                background-color: #fff;
                margin-top: .2rem;
                .goods-info {
                    display: flex;
                    align-items: center;
                    img {
                        width: 1.48rem;
                        height: 1.48rem;
                    }
                    .ctn-right {
                        flex: 1;
                        padding: 0 .18rem;
                        h3 {
                            font-size: .26rem;
                        }
                        div {
                            line-height: .5rem;
                            color: #7a7a7a;
                        }

                    }
                }
                .grade {
                    padding-top: .2rem;
                    span {
                        display: inline-block;
                        margin-right: .2rem;
                    }
                }
                .time {
                    font-size: .24rem;
                    color: #999;
                    line-height: .5rem;
                }
                .pl-text {
                    font-size: .3rem;
                    color: #000;
                    line-height: .5rem;
                }
                .img-box {
                    img {
                        width: 1.5rem;
                        height: 1.5rem;
                        margin-left: .1rem;
                    }
                    .pjt {

                    }
                }
                .btn-wrap {
                    border-top: 1px solid #d8d8d8;
                    padding: .22rem .22rem 0;
                    overflow: hidden;
                    a {
                        float: right;
                        border: 1px solid #999;
                        width: 1.75rem;
                        height: .66rem;
                        text-align: center;
                        line-height: .66rem;
                        color: #000;
                        font-weight: bold;
                        border-radius: .05rem;
                    }
                }
            }
        }
    }
}
</style>

