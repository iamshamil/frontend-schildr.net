import Doc from '../assets/img/file/doc.jfif';
import Docx from '../assets/img/file/docx.png';
import Pdf from '../assets/img/file/pdf.png';
import Xlsx from '../assets/img/file/xlsx.png';
import Dxf from '../assets/img/file/dxf.jpg';
import Psd from '../assets/img/file/psd.png';
import Dwg from '../assets/img/file/dwg.png';
import Video from '../assets/img/file/Video.png';
import notSupport from "../assets/img/attachment_preview_not_supported.png"

export const getRGB = (color) => {
    let r = color.substring(1, 3);
    let g = color.substring(3, 5);
    let b = color.substring(5, 7);

    return {
        R: parseInt(r, 16),
        G: parseInt(g, 16),
        B: parseInt(b, 16)
    };
}

export const getColor = (bgColor) => {
    let nThreshold = 105;
    let components = getRGB(bgColor ? bgColor : '#ffffff');
    let bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);
    return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";
}

export const makeHeaderData = (me, hId, user, data) => {
    let header = []
    let allowed = me.allowed && me.allowed[hId] ? me.allowed[hId] : [];
    let showList = user.showList && user.showList[hId] ? user.showList[hId] : [];
    let editable = user.editable && user.editable[hId] ? user.editable[hId] : [];

    if (data) {
        header = data.map((e, i) => {
            if (me && me.role === 'Admin') {
                e.allowed = true;
                e.editable = true;
            } else {
                e.allowed = allowed[i] ?? false;
            }
            if (!e.order) e.order = i;
            return e;
        });

        if (showList) {
            for (let item of showList) {
                let idx = header.findIndex((e) => e.id === Object.keys(item)[0])
                if (idx > - 1) {
                    header[idx].hide = item[Object.keys(item)[0]]
                }
            }
        }

        if (editable && me.role !== 'Admin') {
            for (let item of editable) {
                let idx = header.findIndex((e) => e.id === item)
                if (idx > - 1) {
                    header[idx].editable = true
                } else {
                    header[idx].editable = false
                }
            }
        }
    }

    return header
}

export const getImg = (file) => {
    let type = file.originalname.split('.').pop();
    switch (type) {
        case 'vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        case 'xls':
        case 'xlsx':
        case 'csv':
        case 'rtf':
            return Xlsx;
        case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'docx':
            return Docx;
        case 'doc':
            return Doc;
        case 'pdf':
            return Pdf;
        case 'dxf':
            return Dxf;
        case 'psd':
            return Psd;
        case 'dwg':
            return Dwg;
        case 'webm':
        case 'mp4':
        case 'ogg':
        case 'mp3':
        case 'wma':
        case 'mpg':
        case 'avi':
        case 'move':
            return Video;
        default:
            return notSupport;
    }
}