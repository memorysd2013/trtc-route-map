import { reactive, computed, watch, onMounted } from "vue";
import { GOOGLE_CLIENT_ID } from '../static/config'
import { parseJwt } from '../service/utils'

/**
 * google initialize
 * https://developers.google.com/identity/gsi/web/reference/js-reference
 */
export function useGoogleLogin() {
  const googleState = reactive({
    user: {},
    isLogin: computed(() => !!googleState.user.sub)
  })

  watch(
    () => googleState.isLogin.value,
    () => {
      console.log('google login status change')
    }
  )

  onMounted(() => {
    window.onGoogleLibraryLoad = function () {
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse
      });

      google.accounts.id.renderButton(
        document.getElementById('googleLoginButton'),
        {
          width: '250px'
        }
      );

      google.accounts.id.prompt();
    };
  })

  function googleSignout() {
    if (googleState.user.sub) {
      google.accounts.id.revoke(googleState.user.sub, done => {
        if (done.successful) {
          googleState.user = {};
          google.accounts.id.disableAutoSelect();
        }
      });
    }
  }

  function handleCredentialResponse(res) {
    if (res.credential) {
      googleState.user = parseJwt(res.credential)
    }
  }

  return {
    googleState,
    googleSignout,
  }
}