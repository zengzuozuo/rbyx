import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/store.js'
import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog'

import Index from '@/components/pages/index'
import Home from '@/components/pages/indexcpt/home'
import Special from '@/components/pages/indexcpt/special'
import GoodsClass from '@/components/pages/indexcpt/goodsclass'
import Shopingcart from '@/components/pages/indexcpt/shopingcart'
import My from '@/components/pages/indexcpt/my'
import GoodsDetails from '@/components/pages/goodsdetails'   //商品详情
import Comment from '@/components/pages/comment'  //评论
import DetailsClassGoods from '@/components/pages/detailsclassgoods'  //详细分类商品列表
import Search from '@/components/pages/search'  //商品搜索
import Login from '@/components/enter/login'  //登录
import PhoneLogin from '@/components/enter/phone_login'  //手机号登录
import Register from '@/components/enter/register'  //注册
import BindPhone from '@/components/enter/bind_phone'  //绑定手机号
import Set from '@/components/pages/set'  //设置
import Dindan from '@/components/pages/dindan'  //订单
import Aftersales from '@/components/pages/aftersales'  //售后服务
import Address from '@/components/pages/address'  //地址管理
import NewAddress from '@/components/pages/new_address'  //新建地址
import Manufacturer from '@/components/pages/manufacturer'  //品牌制造商
import MftDetails from '@/components/pages/manufacturer_details'  //制造商详情
import MessageCenter from '@/components/pages/message_center'  //消息中心
import Footprint from '@/components/pages/footprint'  //我的足迹
import Similar from '@/components/pages/similar'   //找相似
import RedPacket from '@/components/pages/red_packet'  //红包
import WriteOrder from '@/components/pages/write_order'  //填写订单
import OrderDetails from '@/components/pages/order_details'  //订单详情
import UserComment from '@/components/pages/user_comment'   //用户评价
import DiscountCoupon from '@/components/pages/discount_coupon'  //优惠券
import FindPassword from '@/components/enter/find_password'  //找回密码
import Favorite from '@/components/pages/favorite'  //收藏
import SaoYiSao from '@/components/common/saoyisao'  //扫一扫
import ZhongChouDinDan from '@/components/zhongchou/zhongchou_dindan'  //众筹订单
import Payment from '@/components/pages/payment'  //支付
import MyCenter from '@/components/user/my_center'  //个人中心
import FindManufacturer from '@/components/pages/findmanufacturer'  //制造商查找
import MyInfo from '@/components/user/my_info.vue'  //个人信息
import PinTuan from '@/components/groupon/pintuan'   //拼团
import GrouponGoods from '@/components/groupon/groupon_goods'  //团购商品
import SpecialList from '@/components/pages/special_list'   //专题列表
import Ad from '@/components/guide/ad'   //广告
import Integral from '@/components/pages/integral'  //积分中心
import Invite from '@/components/user/invite'   //我的邀请码
import GrouponWriteOrder from '@/components/groupon/groupon_write_order'  //团购填写订单
import JoinGroupon from '@/components/groupon/join_groupon'  //参团
import GrouponOrderDetails from '@/components/groupon/groupon_orderdetails'  //团购订单详情
import Welfare from '@/components/promotion/welfare'  //福利社
import PMTgoodsList from '@/components/promotion/pmt_goodslist'  //促销商品列表
import AccountSecurity from '@/components/user/account_security'   //账号安全
import SetPhone from '@/components/user/set_phone'  //修改手机号码
import Hot from '@/components/pages/hot'  //人气推荐
import NewArrival from '@/components/pages/new_arrival_page'  //新品首发
import ZCHomeList from '@/components/zhongchou/zc_details'    //众筹详情
import ZCWriteOrder from '@/components/zhongchou/zc_write_order'  //填写众筹订单
import ZCOrderDetails from '@/components/zhongchou/zc_orderdetails'  //众筹订单详情
import About from '@/components/pages/about'  //关于我们
import FeedBack from '@/components/pages/feedback'  //意见反馈
import IntGoodsDetails from '@/components/integral/int_goodsdetails'  //积分商品详情
import IntWriteOrder from '@/components/integral/int_writeorder'   //积分订单填写
import IntGoods from '@/components/integral/int_goods'  //积分商品
import IntRecord from '@/components/integral/int_record'  //兑换记录
import VipClub from '@/components/pages/vip_club'  //会员俱乐部
import InterestClass from '@/components/user/interest_class'  //感兴趣的分类
import ShouTu from '@/components/share/shoutu'  //收徒奖励
import Income from '@/components/share/income'  //我的收入
import VipClubDetails from '@/components/pages/vipclub_details'   //会员俱乐部详情
import TuiHuo from '@/components/aftersales/tuihuo'   //退货
import Huanhuo from '@/components/aftersales/huanhuo'   //申请换货
import ShouHouJiLu from '@/components/aftersales/shouhoujilu'  //售后记录
import Undergraduate from '@/components/user/undergraduate'   //在校大学生认证
import Contacts from '@/components/share/contacts'   //联系人
import MyProperty from '@/components/pages/my_property'  //我的资产
import ActivityList from '@/components/pages/activity_list'   //热门活动
import SystemInfo from '@/components/pages/systeminfo'  //系统消息
import Invoice from '@/components/pages/invoice'   //发票
import InvoiceService from '@/components/aftersales/invoice_service'   //发票服务
import ShenQinTuiKuan from '@/components/aftersales/shenqintuikuan'  //申请退款
import aftersalesStatus from '@/components/aftersales/aftersales_status'   //售后状态
import ShenQingHuanHuo from '@/components/aftersales/shenqinghuanhuo'  //申请换货
import Logistics from '@/components/pages/logistics'   //物流信息



Router.prototype.goBack = function (n) {
  store.state.isBack = true;
  store.commit("closeWait");
  store.state.popupIsShow = false;  //关闭页面弹出框
  this.go(n);
}


Vue.use(Router)

const router =  new Router({
  routes: [
    {
      path: '/',
      component: Index,
      redirect: '/ad',
      children: [
        {
          path: 'home',
          component: Home,
          meta: {
            keepAlive: true
          }
        },
        {
          path: 'special',
          component: Special,
          meta: {
            keepAlive: true
          }
        },
        {
          path: 'class',
          component: GoodsClass,
          meta: {
            keepAlive: true
          }
        },
        {
          path: 'shopingcart',
          component: Shopingcart,
          meta: {
            keepAlive: true
          }
        },
        {
          path: 'my',
          component: My,
          meta: {
            keepAlive: true,
            isLogin: true
          }
        },
      ]
    },
    {
      path: '/ad',
      component: Ad
    },
    {
      path: '/goodsdetails',
      component: GoodsDetails
    },
    {
      path: '/comment',
      component: Comment
    },
    {
      path: '/detailsclassgoods',
      component: DetailsClassGoods,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/search',
      component: Search,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/bindphone',
      component: BindPhone
    },
    {
      path: '/phonelogin',
      component: PhoneLogin
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/set',
      component: Set
    },
    {
      path: '/dindan',
      component: Dindan,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/aftersales',
      component: Aftersales
    },
    {
      path: '/address',
      component: Address
    },
    {
      path: '/newaddress',
      component: NewAddress
    },
    {
      path: '/manufacturer',
      component: Manufacturer,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/mftdetails',
      component: MftDetails
    },
    {
      path: '/messagecenter',
      component: MessageCenter
    },
    {
      path: '/footprint',
      component: Footprint,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/similar',
      component: Similar
    },
    {
      path: '/redpacket',
      component: RedPacket
    },
    {
      path: '/writeorder',
      component: WriteOrder
    },
    {
      path: '/orderdetails',
      component: OrderDetails
    },
    {
      path: '/usercomment',
      component: UserComment
    },
    {
      path: '/discountcoupon',
      component: DiscountCoupon
    },
    {
      path: '/findpassword',
      component: FindPassword
    },
    {
      path: '/favorite',
      component: Favorite
    },
    {
      path: '/saoyisao',
      component: SaoYiSao
    },
    {
      path: '/zhongchoudindan',
      component: ZhongChouDinDan
    },
    {
      path: '/payment',
      component: Payment
    },
    {
      path: '/mycenter',
      component: MyCenter
    },
    {
      path: '/findmanufacturer',
      component: FindManufacturer
    },
    {
      path: '/myinfo',
      component: MyInfo
    },
    {
      path: '/pintuan',
      component: PinTuan,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/groupongoods',
      component: GrouponGoods
    },
    {
      path: "/grouponwriteorder",
      component: GrouponWriteOrder
    },
    {
      path: '/speciallist',
      component: SpecialList
    },
    {
      path: '/integral',
      component: Integral
    },
    {
      path: '/invite',
      component: Invite
    },
    {
      path: '/joingroupon',
      component: JoinGroupon
    },
    {
      path: '/grouponorderdetails',
      component: GrouponOrderDetails
    },
    {
      path: '/welfare',
      component: Welfare
    },
    {
      path: '/pmtgoodsList',
      component: PMTgoodsList
    },
    {
      path: '/accountsecurity',
      component: AccountSecurity
    },
    {
      path: '/setphone',
      component: SetPhone
    },
    {
      path: '/hot',
      component: Hot
    },
    {
      path: '/newarrival',
      component: NewArrival
    },
    {
      path: '/zcdetails',
      component: ZCHomeList
    },
    {
      path: '/zcwriteorder',
      component: ZCWriteOrder
    },
    {
      path: '/zcorderdetails',
      component: ZCOrderDetails
    },
    {
      path: '/about',
      component: About
    },
    {
      path: '/feedback',
      component: FeedBack
    },
    {
      path: '/intgoodsdetails',
      component: IntGoodsDetails
    },
    {
      path: '/intwriteorder',
      component: IntWriteOrder
    },
    {
      path: '/intgoods',
      component: IntGoods
    },
    {
      path: '/intrecord',
      component: IntRecord
    },
    {
      path: '/vipclub',
      component: VipClub
    },
    {
      path: '/interestclass',
      component: InterestClass
    },
    {
      path: '/shoutu',
      component: ShouTu
    },
    {
      path: '/income',
      component: Income
    },
    {
      path: '/vipclubdetails',
      component: VipClubDetails
    },
    {
      path: '/tuihuo',
      component: TuiHuo
    },
    {
      path: '/huanhuo',
      component: Huanhuo
    },
    {
      path: '/shouhoujilu',
      component: ShouHouJiLu
    },
    {
      path: '/undergraduate',
      component: Undergraduate
    },
    {
      path: '/contacts',
      component: Contacts
    },
    {
      path: '/myproperty',
      component: MyProperty
    },
    {
      path: '/activitylist',
      component: ActivityList
    },
    {
      path: '/systeminfo',
      component: SystemInfo
    },
    {
      path: '/invoice',
      component: Invoice,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/invoiceservice',
      component: InvoiceService
    },
    {
      path: '/shenqintuikuan',
      component: ShenQinTuiKuan
    },
    {
      path: '/aftersalesstatus',
      component: aftersalesStatus
    },
    {
      path: '/shenqinghuanhuo',
      component: ShenQingHuanHuo
    },
    {
      path: '/logistics',
      component: Logistics
    }
  ]
})


// 路由切换动画配置
router.beforeEach((to, from, next) => {
  sessionStorage.setItem("frompath",from.path);
  store.state.popupIsShow = false;
  store.state.shareIsShow = false;
  if(store.state.isBack) {
    store.state.transitionName = "slide-right";
  }else {
    store.state.transitionName = "slide-left";
  }
  store.state.isBack = false;
  // 登录拦截
  if(to.meta.isLogin) {
		if(!localStorage.getItem("zzz")) {
      Confirm({
        title: '提示',
        mes: '请先登录',
        opts: [
          {
            txt: '马上登录',
            color: true,
            callback: () => {
              next({path: "login?back=1"})
            }
          },
          {
            txt: '稍后登录',
            color: false,
            callback: () => {
              next(false);
            }
          }
        ]
      });
		} else {
			next(true);
		}
	}else {
		next(true);
	}  
})

export default router;