import axios from "axios";
import { baseUrl, uploadUrl } from "../config/constant";
import { getSession, removeSession, setSession } from "../utilis/auth";

const getUrl = () => {
    let path = window.location.pathname;
    switch (path.split("/")[1]) {
        case "main":
            return 'table'
        case "price":
        case "api":
            return 'price'
        default:
            return "table"
    }
}

const Axios = async (method, url, data = {}) => {
    url = baseUrl + url
    return new Promise(async function (resolve, reject) {
        const options = {
            method,
            url,
            data,
            headers: {
                "Content-Type": "application/json",
                "timeout": 10000
            }
        };

        if (getSession()) {
            options.headers["authorization"] = `Bearer ${getSession()}`;
        }

        axios(options).then((rdata) => {
            if (rdata.status === 200 && rdata.data) {
                if (!rdata.data.status && rdata.data.logout === true) {
                    removeSession();
                    window.location.assign("/auth/login")
                } else {
                    if (rdata.data.newToken) {
                        setSession(rdata.data.newToken)
                    }
                    resolve(rdata.data)
                }

            } else {
                resolve({ status: false, data: "connect error" })
            }
        }).catch(error => {
            if (error.response) {
                if (error.response.status === 400) {
                    resolve(error.response.data)
                }
                return { status: false, error: "error" }
            }
        })
    })
}

export default Axios;

export const fileAxios = async (url, data, setProgress) => {
    url = baseUrl + url
    return new Promise(async function (resolve, reject) {
        const options = {
            method: 'POST',
            url,
            data,
            headers: {
                "authorization": `Bearer ${getSession()}`,
                "Content-Type": 'multipart/form-data',
                "timeout": 10000
            },
            onUploadProgress: (udata) => {
                setProgress(Math.round((100 * udata.loaded) / udata.total))
            },
        };
        axios(options).then((rdata) => {
            if (rdata.status === 200 && rdata.data) {
                resolve(rdata.data)
            } else {
                resolve({ status: 0, message: "connect error" })
            }
        }).catch(error => {
            if (error.response) {
                if (error.response.status === 400 || error.response.status === 401) {
                    resolve(error.response.data)
                }
                return { status: false, error: "error" }
            }
        })
    })
}

export const downloadFile = async (data) => {
    axios.get(`${uploadUrl}${data.filename}`, { responseType: 'blob' }).then(res => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(new Blob([res.data]));
        link.setAttribute("download", data.originalname);
        link.click();
    })
}

// auth start
export const sessionCheck = async () => {
    return await Axios('POST', 'auth/session-check', { token: getSession() })
}

export const login = async (values) => {
    return await Axios('POST', 'auth/login', values)
}

export const register = async (values) => {
    return await Axios('POST', 'auth/register', values)
}
// auth end


// usermanagement start
export const getUsers = async () => {
    return await Axios('POST', 'auth/get-users',)
}

export const createUser = async (data) => {
    return await Axios('POST', 'auth/register', { ...data.data, id: data.id })
}

export const deleteUser = async (data) => {
    return await Axios('POST', 'auth/delete-user', { id: data })
}

export const updateUser = async (data) => {
    return await Axios('POST', 'auth/update-user', { data })
}

export const setPassword = async (data) => {
    return await Axios('POST', 'auth/update-password', { data });
}

export const changePassword = async (data) => {
    return await Axios('POST', 'auth/change-password', { data });
}

export const createExperience = async (data) => {
    return await Axios('POST', 'auth/create-experience', { ...data });
}

export const updateExperience = async (data) => {
    return await Axios('POST', 'auth/update-experience', { ...data });
}

export const deleteExperience = async (id) => {
    return await Axios('POST', 'auth/delete-experience', { id });
}

export const getExperience = async (owner) => {
    return await Axios('POST', 'auth/get-experience', { owner });
}

export const createEducation = async (data) => {
    return await Axios('POST', 'auth/create-education', { ...data });
}

export const updateEducation = async (data) => {
    return await Axios('POST', 'auth/update-education', { ...data });
}

export const deleteEducation = async (id) => {
    return await Axios('POST', 'auth/delete-education', { id });
}

export const getEducation = async (owner) => {
    return await Axios('POST', 'auth/get-education', { owner });
}

export const createCertification = async (data) => {
    return await fileAxios('auth/create-certification', data, () => false);
}

export const updateCertification = async (data) => {
    return await fileAxios('auth/update-certification', data, () => false);
}

export const deleteCertification = async (id) => {
    return await Axios('POST', 'auth/delete-certification', { id });
}

export const getCertification = async (owner) => {
    return await Axios('POST', 'auth/get-certification', { owner });
}
// usermanagement end

// certification start
export const createOurCert = async (data) => {
    return await Axios('POST', 'auth/create-OurCert', data);
}

export const getOurCert = async (id) => {
    return await Axios('POST', 'auth/get-OurCert', { id });
}

export const updateOurCert = async (data) => {
    return await Axios('POST', 'auth/update-OurCert', data);
}

export const deleteOurCert = async (id) => {
    return await Axios('POST', 'auth/delete-OurCert', { id });
}

export const getDatabyCID = async (id) => {
    return await Axios('POST', 'auth/get-OurCertbyId', { id });
}

export const getOurCertbyOwner = async (id) => {
    return await Axios('POST', 'auth/get-OurCertbyOwner', { id });
}
// certification end

// Table start
export const getFirstData = async (data) => {
    return await Axios('POST', `${getUrl()}/get`, data);
}

export const getInviteData = async (id) => {
    return await Axios('POST', `invite/getInvite`, { id });
}

export const updateBody = async (data) => {
    Axios('POST', `${getUrl()}/updateRow`, { data }).then((rdata) => {
        if (!rdata.status) alert('server error!')
        return rdata;
    })
}

export const addColumn = async (data) => {
    return await Axios('POST', `${getUrl()}/addColumn`, data)
}

export const removeColumn = (data) => {
    Axios('POST', `${getUrl()}/removeColumn`, data).then((rdata) => {
        if (!rdata.status) {
            alert('server error')
        }
    })
}

export const updateHeader = (data) => {
    Axios('POST', `${getUrl()}/updateHeader`, { data }).then((rdata) => {
        if (!rdata.status) alert('server error!')
    })
}


export const updateRow = async (param) => {
    return await Axios('POST', `${getUrl()}/updateRow`, param);
}

export const updateLog = async (param) => {
    return await Axios('POST', `${getUrl()}/updateLog`, { data: param });
}

export const approveAction = async (id, status) => {
    return await Axios('POST', `${getUrl()}/approve`, { id, status });
}

export const getLog = async (data) => {
    return await Axios('POST', `${getUrl()}/getLog`, data);
}

export const updateNotification = async (param) => {
    return await Axios('POST', `${getUrl()}/updateNotification'`, param);
}

export const deleteSelected = async (ids) => {
    return await Axios('POST', `${getUrl()}/deleteSelected`, { data: ids });
}

export const updateAllowed = async (data) => {
    return await Axios('POST', `${getUrl()}/updateAllowed`, data);
}

export const updateOrder = async (data) => {
    return await Axios('POST', `${getUrl()}/updateOrder`, data);
}

export const duplicateRow = async (id, userId) => {
    return await Axios('POST', `${getUrl()}/duplicateRow`, { id, userId });
}

export const updateShowList = async (id, data) => {
    return await Axios('POST', 'auth/update-showList', { userId: id, data });
}

export const updateEditable = async (id, data) => {
    return await Axios('POST', 'auth/update-editable', { userId: id, data });
}

export const updateProcess = async (id, data, actor, action, creator) => {
    return await Axios('POST', `${getUrl()}/updateProcess`, { id, data, actor, action, creator });
}

export const addTableRow = async (data, hId, creator) => {
    return await Axios('POST', `${getUrl()}/addRow`, { data, hId, creator });
}

export const createTab = async (data) => {
    return await Axios('POST', `${getUrl()}/crateTab`, data);
}

export const changeTab = async (id) => {
    return await Axios('POST', `${getUrl()}/changeTab`, { id });
}

export const updateTab = async (id, name) => {
    return await Axios('POST', `${getUrl()}/updateTab`, { id, name });
}

export const deleteTab = async (currentId, nextId) => {
    return await Axios('POST', `${getUrl()}/deleteTab`, { currentId, nextId });
}

export const updateHeaderOrder = async (data) => {
    return await Axios('POST', `${getUrl()}/updateHeaderOrder`, data);
}

export const transferTable = async (data) => {
    return await Axios('POST', `${getUrl()}/transferTable`, data);
}

export const createInviteLink = async (tableId, userId) => {
    return await Axios('POST', `${getUrl()}/createInviteLink`, { tableId, userId });
}

// Project mamangement
export const createProject = async (data) => {
    return await Axios('POST', `project/create`, data);
}

export const updateProject = async (data) => {
    return await Axios('POST', `project/update`, data);
}

export const deleteProject = async (id) => {
    return await Axios('POST', `project/delete`, { id });
}

export const getProjects = async (userId) => {
    return await Axios('POST', `project/get`, { userId });
}

export const getClient = async () => {
    return await Axios('POST', `auth/getClient`, {});
}

export const createInvoice = async (data) => {
    return await Axios('POST', `invoice/create`, data);
}

export const getInvoice = async (data) => {
    return await Axios('POST', `invoice/get`, data);
}

export const updateInvoice = async (data) => {
    return await Axios('POST', `invoice/update`, data);
}

export const deleteInvoice = async (id) => {
    return await Axios('POST', `invoice/delete`, { id });
}

export const getInvoiceById = async (id) => {
    return await Axios('POST', `invoice/get-id`, { id });
}

