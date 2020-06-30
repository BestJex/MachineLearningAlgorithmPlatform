import Cookies from 'js-cookie'

const inThreeDays = new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000)

export default {
  setToken(token) {
    return Cookies.set("token", token, { expires: inThreeDays })
  },

  getToken() {
    return Cookies.get("token");
  },

  removeToken() {
    Cookies.remove("token")
  }
} 