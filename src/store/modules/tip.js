import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog';
const moduleTip = {
    state: {
        tiptext: "模板提示文字",
        loading: false
    },
    mutations: {
        openWait(state) {
            state.loading = true;
        },
        closeWait(state) {
            state.loading = false;
        }
    }
}

export default moduleTip;