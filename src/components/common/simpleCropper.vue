<template> 
    <div class="v-simple-cropper"> 
        <slot> 
            <button @click="upload">上传图片</button> 
        </slot> 
        <!--<input class="file" ref="file" type="file" accept="image/*" @change="uploadChange">-->
        <!--<input class="file" ref="file2" type="file" name="file" capture="camera" @change="uploadChange">-->
        <input class="file" ref="file" type="file" accept="image/*" @change="uploadChange">
        <div class="v-cropper-layer" ref="layer"> 
            <div class="layer-header"> 
                <button class="cancel" @click="cancelHandle">取消</button> 
                <button class="confirm" @click="confirmHandle">裁剪</button> 
            </div> 
            <img ref="cropperImg"> 
        </div> 
        <yd-actionsheet :items="myItems" v-model="show" cancel="取消"></yd-actionsheet>
    </div> 
</template> 
  
<script> 
import Cropper from 'cropperjs' 
import 'cropperjs/dist/cropper.min.css' 
export default { 
    name: 'v-simple-cropper', 
    props: { 
        initParam: Object, 
        successCallback: { 
            type: Function, 
            default: () => {} 
        } 
    }, 
    data () { 
        return { 
            cropper: {}, 
            filename: '',
            show: false,
            myItems: [
                {
                    label: '拍照',
                    callback: () => {
                        var that = this;
                        try {
                            var cmr = plus.camera.getCamera(1);
                            cmr.captureImage(function(p) {
                                
                                plus.io.resolveLocalFileSystemURL(p, function(entry) {
                                    // let URL = window.URL || window.webkitURL 
                                    that.$refs['layer'].style.display = 'block' ;
                                    that.cropper.replace(entry.toLocalURL());
                                }, function(e) {
                                    plus.nativeUI.toast("读取拍照文件错误：" + e.message);
                                });
                            }, function(e) {}, {
                                filename: "_doc/camera/",
                                index: 1
                            });
                        } catch (error) {
                            that.$refs['file2'].click();
                        }
                        
                    }
                },
                {
                    label: '从相册中选取',
                    callback: () => {
                        return this.$refs['file'].click();
                    }
                }
            ] 
        } 
    }, 
    mounted () { 
        this.init() 
    }, 
    methods: { 
    // 初始化裁剪插件 
    init () { 
        let cropperImg = this.$refs['cropperImg'] 
        this.cropper = new Cropper(cropperImg, { 
            aspectRatio: 1 / 1, 
            dragMode: 'move' 
        }) 
    }, 
    // 点击上传按钮 
    upload () { 
        this.show = true;
    }, 
    // 选择上传文件 
    uploadChange (e) { 
        let file = e.target.files[0] 
        this.filename = file['name'] 
        let URL = window.URL || window.webkitURL 
        this.$refs['layer'].style.display = 'block'
        this.cropper.replace(URL.createObjectURL(file)) 
    }, 
    // 取消上传 
    cancelHandle () { 
        this.cropper.reset() 
        this.$refs['layer'].style.display = 'none' 
        this.$refs['file'].value = '' 
        this.$refs['file2'].value = ''
    }, 
    // 确定上传 
    confirmHandle () { 
        this.$store.commit("openWait");
        let cropBox = this.cropper.getCropBoxData() 
        let scale = this.initParam['scale'] || 1 
        let cropCanvas = this.cropper.getCroppedCanvas({ 
            width: cropBox.width * scale, 
            height: cropBox.height * scale 
        }) 
        let imgData = cropCanvas.toDataURL('image/jpeg');
        this.$http.post(this.initParam.uploadURL,{
            code: "updateUserAvatar",
            avatar: imgData
        }).then((data) => {
            if(data.ztm == 1) {
                this.successCallback(data.url); 
                this.cancelHandle();
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
.v-simple-cropper { 
    .file { 
    	position: absolute;
    	top: 1.5rem;
    	left: 50%;
    	margin-left: -0.85rem;
    	cursor: pointer;
        width: 1.7rem;
        height: 1.7rem;
        border-radius: 50%;
        display: block;
        opacity: 0;
    } 
    .v-cropper-layer { 
        position: fixed; 
        top: 0; 
        bottom: 0; 
        left: 0; 
        right: 0; 
        background: #fff; 
        z-index: 99999999; 
        display: none; 
        .layer-header { 
            position: absolute; 
            top: 0; 
            left: 0; 
            z-index: 99999999; 
            background: #fafafa; 
            width: 100%; 
            height: .9rem; 
            padding: 0 .3rem; 
            box-sizing: border-box; 
        } 
        .cancel, 
        .confirm { 
            line-height: .9rem; 
            font-size: .28rem; 
            background: inherit; 
            font-weight: bold;
            border: 0; 
            outline: 0; 
            float: left; 
        } 
        .confirm { 
            float: right; 
        } 
        img { 
            position: inherit!important; 
            border-radius: inherit!important; 
            float: inherit!important; 
        } 
    } 
} 
</style> 