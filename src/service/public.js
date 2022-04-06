/**
 * GOOGLE
 *  - note: google sdk 執行的速度會慢很多
 */
export let googleInst = null;

export function initGoogleInst() {
  googleInst = window.gapi.auth2.getAuthInstance();
}

/**
 * App.vue 初始化完畢時 google sdk 可能還沒回來
 */
export async function getGoogleUser() {
  let googleUser = googleInst.currentUser.get()?.getBasicProfile();

  return new Promise(async (resolve, reject) => {
    if (googleUser) {
      let user = {
        id: googleUser.getId(),
        name: googleUser.getName(),
        image: googleUser.getImageUrl(),
        email: googleUser.getEmail(),
      }
      resolve(user);
    } else {
      reject(null);
    };
  });
}

export async function googleLogin() {
  return new Promise(async (resolve, reject) => {
    await googleInst.signIn();
    resolve();
  })
}

export function googleLogout() {
  return new Promise((resolve, reject) => {
    googleInst.disconnect();
    googleInst.signOut();
    resolve();
  })
}

/**
 * FACEBOOK
 */
export function getFacebookUser() {
  return new Promise((resolve, reject) => {
    FB.getLoginStatus(function (response) {
      if (response.status === "connected") {
        FB.api('/me', { 'fields': 'id,name,email,picture' }, function (res) {
          resolve({
            id: res.id,
            name: res.name,
            image: res.picture.data.url,
            email: res?.email || '',
          });
        })
      } else {
        reject(null);
      }
    });
  });
}

export function facebookLogin() {
  return new Promise((resolve, reject) => {
    FB.login(function (response) {
      response.status === "connected"
        ? resolve()
        : reject()
    })
  })
}

export function facebookLogout() {
  return new Promise((resolve, reject) => {
    FB.api("/me/permissions", "DELETE", function (response) {
      FB.logout();
      resolve();
    })
  })
}