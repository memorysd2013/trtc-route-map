import { reactive, computed, watch, onMounted } from "vue";
import { FACEBOOK_APP_ID } from '../static/config'

export function useFacebookLogin() {
  const facebookState = reactive({
    user: {},
    isLogin: computed(() => !!facebookState.user.id)
  })

  watch(
    () => facebookState.isLogin.value,
    () => {
      console.log('facebook login status change')
    }
  )

  onMounted(() => {
    window.onload = function () {
      FB.init({
        appId: FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v13.0'
      });
      checkLoginfacebookState();
    };
  })

  function checkLoginfacebookState() {
    FB.getLoginStatus(function (response) {
      if (response.status === 'connected') {
        FB.api('/me', { 'fields': 'id,name,email,picture' }, function (res) {
          facebookState.user = {
            id: res.id,
            name: res.name,
            image: res.picture.data.url,
            email: res?.email || '',
          }
        });
      } else {
        facebookState.user = {}
      }
    });
  }

  // 判斷當前登入狀態 執行登入 or 登出
  function facebookCore() {
    facebookState.isLogin
      ? facebookLogout()
      : facebookLogin()
  }

  function facebookLogin() {
    FB.login(function (response) {
      checkLoginfacebookState();
    })
  }

  function facebookLogout() {
    FB.api("/me/permissions", "DELETE", function (response) {
      if (response.success) {
        FB.logout();
        facebookState.user = {};
      }
    })
  }

  return {
    facebookState,
    facebookCore
  }
}