import Cookies from 'js-cookie';

const tokenExpires = new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000);

export default {
    setToken(token) {
        return Cookies.set("token", token, { expires: tokenExpires });
    },
    getToken() {
        return Cookies.get("token");
    },
    removeToken() {
        Cookies.remove("token");
    },
}