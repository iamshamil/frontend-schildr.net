// const url = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_SERVER : process.env.REACT_APP_LOCAL;
const url = process.env.REACT_APP_SERVER;

export const token = 'oawo';
export const domain = url;
export const baseUrl = url + '/api/';
export const uploadUrl = url + '/attached/';
export const avatarUrl = url + '/avatar/';
export const certificationUrl = url + '/certification/';
export const processStatusWidth = 230;
export const addButtonWidth = 100;
export const allCheckWidth = 146;
export const checkWidth = 130;
export const scrollWidth = 16;
export const typeLabel = [{ label: 'All activity', type: '' }, { label: 'Comments', type: 'comment' }, { label: 'Workflow history', type: 'workflow' }]
export const dataType = [
    {
        type: 'text',
        typeName: 'Single line text',
        typeOrder: 0,
    },
    {
        type: 'longText',
        typeName: 'Long text',
        typeOrder: 1,
    },
    {
        type: 'attached',
        typeName: 'Attachment',
        typeOrder: 2,
    },
    {
        type: 'checkBox',
        typeName: 'Checkbox',
        typeOrder: 3,
    },
    {
        type: 'multiSelect',
        typeName: 'multiple select',
        typeOrder: 4,
    },
    {
        type: 'select',
        typeName: 'Single select',
        typeOrder: 5,
    },
    {
        type: 'date',
        typeName: 'Date',
        typeOrder: 6,
    },
    {
        type: 'link',
        typeName: 'Url',
        typeOrder: 7,
    },
    {
        type: 'createdAt',
        typeName: 'Created time',
        typeOrder: 8,
    },
    {
        type: 'updatedAt',
        typeName: 'Last modified time',
        typeOrder: 9,
    },
    {
        type: 'createdBy',
        typeName: 'Created by',
        typeOrder: 10,
    },
    {
        type: 'updatedBy',
        typeName: 'Last modified by',
        typeOrder: 11,
    },
    // {
    //     type: 'button',
    //     typeName: 'Button',
    //     typeOrder: 12,
    // },
];
export const fileTypes = ['svg', 'vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'vnd.openxmlformats-officedocument.wordprocessingml.document', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt', 'rtf', 'html', 'zip', 'mp3', 'wma', 'mpg', 'flv', 'avi', 'jpg', 'jpeg', 'png', 'gif', 'dxf', 'psd', 'dwg', 'mp4', 'webm', 'ogg']
export const imgTypes = ['jpg', 'jpeg', 'png', 'gif', 'svg']
export const videoTypes = ['mp4', 'webm', 'ogg']
export const docModuleTypes = ['bmp', 'doc', 'docx', 'htm', 'html', 'xlsx', 'xls', 'txt', 'tiff', 'pptx', 'ppt', 'vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'vnd.openxmlformats-officedocument.wordprocessingml.document',]
export const roles = [
    "Admin",
    "Portfolio manager",
    "Project manager",
    "Business Analyst",
    "Project member",
    "Client"
];
