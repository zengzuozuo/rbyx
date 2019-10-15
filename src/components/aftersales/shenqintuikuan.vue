<template>
    <div class="sqtk-page">
        <ComHeaderbar text="申请退货" />
        <div class="main">
            <ul v-if="pageData">
                <li>
                    <div class="content">
                        <div class="img-wrap">
                            <ImgTag v-for="item,index in pageData.data" :url="imgUrl + item.pic" :key="index" />
                            <div v-if="pageData.data.length == 1">
                                <h3>{{pageData.data[0].title}}</h3>
                                <h4>{{pageData.data[0].specifications}}</h4>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <yd-cell-item class="mt" arrow type="label" v-if="pageData">
                <span slot="left">退款原因:</span>
                <select slot="right" v-model="postObj.reasonid">
                    <option v-for="item in pageData.Reason" :value="item.id">{{item.reason}}</option>
                </select>
            </yd-cell-item>
            <yd-cell-item v-if="pageData">
                <span slot="left">退款金额:</span>
                <input slot="right" type="number" v-model="pageData.total" disabled placeholder="请输入退款金额">
                <span slot="right">元</span>
            </yd-cell-item>
            <yd-cell-item class="mt">
                <span slot="left">退款说明:</span>
                <input slot="right" type="text" v-model="postObj.explain" placeholder="请输入">
            </yd-cell-item>

            <div class="upload-img">
                <div class="label">上传凭证</div>
                <ImgTag class="sct" v-for="item,index in imgArr" :url="appImgUrl + item" :key="index"/>
                <img src="../../assets/images/select_pic.png" v-if="imgArr.length < 6" @click="actionSheetShow = true">
            </div>
            <yd-actionsheet :items="myItems" v-model="actionSheetShow" cancel="取消"></yd-actionsheet>
        </div>
        <div class="footer">
            <a href="javascript:;" @click="submit">提交</a>
        </div>
    </div>
</template>

<script>
//ApplyReturnGoods  这个要传两个参数，一个是订单号，一个是type，1是退款申请，2是退货申请，3是换货申请
//ApplyReturnGoods 这个接口要 ordersn、type、img、total（总价）、reasonid（原因ID）、explain（说明）
export default {
    data() {
        return {
            pageData: null,
            actionSheetShow: false,
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
            postObj: {
                code: "ApplyReturnGoods",
                ordersn: this.$route.query.oid,
                type: this.$route.query.t, 
                reasonid: "",
                explain: "",
                total: "",
                img: ""
            },
            imgArr: []
        }
    },
    mounted() {
        this.getData();
    },
    methods: {
        getData() {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "ApplyPage",
                ordersn: this.$route.query.oid
            }).then((data) => {
                console.log(data)
                if(data.ztm == 1) {
                    this.pageData = data;
                }else {
                    
                }
            })
        },
        submit() {
            console.log(this.postObj)
            if(this.postObj.reasonid == "") {
                this.$dialog.toast({mes: "请选择退款原因"});
                return;
            }
            this.postObj.img = this.imgArr.join(",");
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,this.postObj).then((data) => {
                console.log(data)
                if(data.ztm == 1) {
                    this.$dialog.toast({mes: data.msg, icon: "success", callback: () => {
                        this.$router.goBack(-1);
                    }});
                }else {
                    this.$dialog.toast({mes: data.msg});
                }
            })
        },
        tuikuan() {
            this.$dialog.confirm({
                title: '提示',
                mes: '确定需要取消订单并退款吗？',
                opts: () => {
                    this.$dialog.toast({mes: '你点了确定', timeout: 1000});
                }
            });
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
                    that.imgArr.push(data.url);
                } else {
                    that.$store.commit("closeWait");
                    plus.nativeUI.toast("上传失败" + status);
                }
            });
            task.addFile(avatar, {
                key: "avatar"
            }); //所上传文件
            task.start(); //开始上传任务
        }
    }
}
</script>

<style lang="less">
.sqtk-page {
    display: flex;
    flex-direction: column;
    
    .main {
        flex: 1;
        ul {
            li {
                border-left: .2rem solid #fff;
                background-color: #fff;
                .ct-top {
                    display: flex;
                    border-bottom: 1px solid #d5d5d5;
                    p {
                        flex: 1;
                        
                        font-size: .28rem;
                        line-height: .88rem;
                        text-align: left;
                        padding-right: .2rem;
                    }
                    .icon {
                        width: .88rem;
                        height: .88rem;
                        background: url("../../assets/images/icon/delete_icon.png") no-repeat center;
                        background-size: 40%;
                    }
                }
                .content {
                    display: flex;
                    align-items: center;
                    padding-right: .2rem;
                    border-bottom: 1px solid #d5d5d5;
                    .img-wrap {
                        flex: 1;
                        img {
                            float: left;
                            width: 1.5rem;
                            height: 1.5rem;
                            margin: .2rem .2rem .2rem 0;
                        }
                        div {
                            float: left;
                            max-width: 3.5rem;
                            padding-top: .6rem;
                            font-size: .25rem;
                            overflow: hidden; 
                            h3 {
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                overflow: hidden; 
                            }
                            h4 {
                                font-weight: normal;
                                padding-top: .1rem;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                overflow: hidden;
                            }
                        }
                    }
                    span {
                        color: #c33;
                        
                    }
                }
                .btn-wrap {
                    padding: .2rem;
                    a {
                        float: right;    
                        padding: .1rem .2rem;
                        border: 1px solid #999;
                        margin: 0 .1rem;
                        border-radius: .05rem;
                    }
                }
            }
        }
        .yd-cell-item {
            background-color: #fff;
            &.mt {
                margin-top: .2rem;
            }
            select {
                padding-left: .5rem;
            }
            input {
                padding-left: .5rem;
            }
        }
        .upload-img {
            background-color: #fff;
            margin-top: .2rem;
            padding: 0 .3rem .2rem;
            .label {
                font-size: .3rem;
                line-height: .8rem;
                
            }
            img {
                width: 1.6rem;
                height: 1.6rem;
            }
        }
    }
    .footer {
        a {
            display: block;
            background-color: #c33;
            color: #fff;
            text-align: center;
            line-height: .95rem;
            font-size: .35rem;
        }
    }
}
</style>

