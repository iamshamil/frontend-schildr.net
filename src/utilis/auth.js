import { token } from '../config/constant';
import { sessionCheck } from './request';

export const checkAccessToken = async () => {
    let user = null;
    let get_sess = getSession()
    if (get_sess) {
        let udata = await sessionCheck()
        if (udata.status) {
            user = udata.data;
        } else {
            removeSession();
        }
    }
    return user;
}


export const setSession = (string) => {
    localStorage.setItem(token, string)
    return true
}

export const getSession = () => {
    const session = sessioninfor()
    if (session) {
        return session
    } else {
        return false
    }
}

export const sessioninfor = () => {
    const auth = localStorage.getItem(token)
    return auth
}

export const removeSession = () => {
    localStorage.removeItem(token)
    return true
}