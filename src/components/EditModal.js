import React, { useEffect, useState } from 'react';
import ReactTimeAgo from 'react-time-ago';
import moment from 'moment';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import AvatarGroup from '@mui/material/AvatarGroup';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DialogContent from '@mui/material/DialogContent';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';

import Check from '@mui/icons-material/Check';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SpeakerNotesOffIcon from '@mui/icons-material/SpeakerNotesOff';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import Diversity3Icon from '@mui/icons-material/Diversity3';

import useTableContext from '../hooks/useTable';
import useConfig from '../hooks/useConfig';

import ImageModal from './ImageModal';
import UploadModal from './UploadModal';

import ModalSelect from '../pages/Main/TableContent/CellType/ModalSelectCell';
import MultiModalSelect from '../pages/Main/TableContent/CellType/MultiModalSelect';
import SimpleString from '../pages/Main/TableContent/CellType/SimpleString';
import LongText from '../pages/Main/TableContent/CellType/LongText';
import LinkField from '../pages/Main/TableContent/CellType/LinkField';
import DateCell from '../pages/Main/TableContent/CellType/DateCell';
// import $ from 'jquery';

import Axios, { duplicateRow, downloadFile, getLog, updateLog, updateRow } from '../utilis/request';

import { uploadUrl, typeLabel } from '../config/constant';
import Icons from './Icons';
import CheckBoxCell from '../pages/Main/TableContent/CellType/CheckBoxCell';
import LogDate from '../pages/Main/TableContent/CellType/LogDate';
import LogUser from '../pages/Main/TableContent/CellType/LogUser';
import { getImg } from '../utilis/util';

const EditModal = (props) => {
    const { y, open, handleClose, changeItem, group } = props;
    const { user } = useConfig();
    const { header, body, changeBody, users, isAdmin, hId } = useTableContext();

    const [idx, setIdx] = useState(0);
    const [data, setData] = useState([]);
    const [isDel, setIsDel] = useState(false);
    const [commant, setCommant] = useState("");
    const [imgData, setImgData] = useState([]);
    const [fullImg, setFullImg] = useState(false);
    const [showChat, setShowChat] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [follower, setFollower] = useState([]);
    const [imgIndex, setImgIndex] = useState(0);
    const [uploadOpen, setUploadOpen] = useState(false);
    const [activeType, setactiveType] = useState(1);
    const [anchor, setAnchor] = useState(null);
    const [whiteList, setWhiteList] = useState([]);
    const [uSearch, setUSearch] = useState("");
    const openWl = Boolean(anchor);


    const drop = Boolean(anchorEl);

    const handleImgModal = () => setFullImg(false);

    const openFullImg = (y, x, i) => {
        setImgData(body[y].row[x].data);
        setImgIndex(i);
        setFullImg(true);
    }

    const openUpload = (i) => {
        setIdx(i);
        setUploadOpen(true);
    }

    const uploadClose = () => {
        setUploadOpen(false);
    }

    const closePop = (params) => {
        setAnchor(null)
    }

    const inputMessage = (e) => {
        setCommant(e.target.value);
        if (e.target.value === "@") {
            setAnchor(e.currentTarget);
        }
    }

    const rmeoveItem = (i) => {
        let temp = whiteList;
        temp.splice(i, 1);
        setWhiteList([...temp]);
    }


    const deleteRow = async () => {
        setIsDel(true);
        let t = { data: body };
        Axios('POST', 'table/deleteRow', { data: t.data[y] }).then((rdata) => {
            if (!rdata.status) alert('server error!')
        });
        t.data.splice(y, 1);
        changeBody(t.data);
        handleClose();
    }

    const handleDownload = (item) => {
        downloadFile(item);
    }

    const removeFile = async (item, i, j) => {
        let t = { data: body };
        let rowId = t.data[y]._id;
        let removeData = t.data[y].row[i].data[j];
        t.data[y].row[i].data.splice(j, 1);
        if (t.data[y].updater?._id !== user._id) {
            let temp = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                color: user.color
            }
            t.data[y].updater = temp;
        }
        t.data[y].updatedAt = new Date();
        changeBody(t.data);
        let rdata = await updateRow({ data: t.data[y], updater: user._id });
        if (rdata.status) {
            let log = {
                type: 'activity',
                rowId,
                history: { status: 'remove', data: [removeData] },
                dataType: 'attached',
                sign: { [user._id]: true },
                creator: user,
                cellName: header[i].name,
                cellId: data.id,
                columnId: header[i].id
            }
            updateLog(log);
            setData([...data, { ...log, updatedAt: new Date() }])
        } else {
            alert('server error!');
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && commant) {
            let t = { data: body };

            let log = {
                type: 'comment',
                rowId: t.data[y]._id,
                new: commant,
                dataType: 'string',
                columnId: 'chat',
                sign: { [user._id]: true },
                creator: user,
                whiteList: whiteList.length ? [...whiteList.map((e) => e._id), user._id] : []
            }
            updateLog(log);
            setData([...data, { ...log, updatedAt: new Date() }]);
            setCommant("");
            if (t.data[y].chat) {
                t.data[y].chat += 1;
            } else {
                t.data[y].chat = 1;
            }
            changeBody(t.data);
            setWhiteList([]);
        }
    }

    const searchKeyDown = (event) => {
        if (event.key === 'Enter') {
            let partner = users.filter((e) => {
                let str = e.firstName + " " + e.lastName;
                return str.search(uSearch) !== -1;
            });
            if (partner.length) {
                let flag = whiteList.findIndex((e) => e._id === partner[0]._id);
                if (flag === -1) {
                    setWhiteList([...whiteList, partner[0]]);
                }
                setCommant(commant.slice(0, -1));
            }
            setAnchor(null)
            setUSearch("")
        }
    }

    const selectPartner = (user) => {
        let flag = whiteList.findIndex((e) => e._id === user._id);
        if (flag === -1) {
            setWhiteList([...whiteList, user]);
        }
        setAnchor(null)
        setUSearch("")
        setCommant(commant.slice(0, -1));
    }


    const handleCommentType = (e) => {
        if (e) {
            setAnchorEl(e.currentTarget)
        } else {
            setAnchorEl(null)
        }
    }

    const switchCommentType = (params) => {
        setactiveType(params);
        document.getElementsByClassName('commentBoxWrap')[0].scroll({ top: document.getElementsByClassName('commentBox')[0].clientHeight, behavior: 'smooth' });
        setAnchorEl(null);
    }

    const closeAction = () => {
        handleClose();
    }

    const copyRow = async () => {
        let rdata = await duplicateRow(body[y]._id, user._id);
        if (rdata.status) {
            let t = { data: body };
            t.data.sort((a, b) => a.order - b.order);
            for (let i = body[y].order + 1; i < t.data.length; i++) {
                t.data[i].order++;
            }
            rdata.data.creator = user;
            rdata.data.updater = user;
            rdata.data.updatedAt = new Date();
            rdata.data.createdAt = new Date();
            t.data.splice(body[y].order + 1, 0, rdata.data);
            changeBody([...t.data]);
            changeItem(true);
        } else {
            alert('Server error!')
        }
    }

    /* eslint-disable */
    const getData = async (rowId) => {
        let allowIds = []
        if (user.allowIds && user.allowIds[hId]) {
            allowIds = user.allowIds[hId];
        }
        let logData = await getLog({ rowId, allowIds });
        if (logData.status) {
            setData(logData.data);

            let data = {}
            for (let item of logData.data) {
                data[item.creator._id] = true;
            }

            let followers = users.filter((e) => {
                let idx = Object.keys(data).findIndex((one) => one === e._id);
                return (idx > -1)
            })
            for (let i = 0; i < Object.keys(data).length; i++) {

            }
            setFollower(followers)
        }
    }

    useEffect(() => {
        if (open) {
            setIsDel(false);
            getData(body[y]._id);
        }
    }, [open, y]);

    useEffect(() => {
        if (data.length && document.getElementsByClassName('commentBoxWrap')[0] && document.getElementsByClassName('commentBox')[0].lastChild) {
            document.getElementsByClassName('commentBoxWrap')[0].scroll({ top: document.getElementsByClassName('commentBox')[0].clientHeight + document.getElementsByClassName('commentBox')[0].lastChild.clientHeight, behavior: 'smooth' });
        }
    }, [data]);
    /* eslint-enable */

    return (
        <>
            <Dialog
                open={open}
                maxWidth="lg"
                onClose={closeAction}
                sx={{ '& .MuiDialog-paper': { height: "calc(100% - 64px)", width: '100%' } }}
            >
                <DialogTitle sx={{ borderBottom: '1px solid #bdbdbd' }}>
                    <Stack direction='row' alignItems='center' justifyContent='space-between'>
                        <Stack direction='row' alignItems='center'>
                            <IconButton onClick={() => changeItem(false)} disabled={y === 0}><ExpandLessIcon sx={{ fontSize: 16 }} /></IconButton>
                            <IconButton onClick={() => changeItem(true)} disabled={y === body.length - 1}><ExpandMoreIcon sx={{ fontSize: 16 }} /></IconButton>
                        </Stack>
                        <Stack direction='row' alignItems='center'>
                            {
                                (user.role !== "Developer") &&
                                <IconButton onClick={() => deleteRow()} ><DeleteIcon sx={{ fontSize: 15 }} /></IconButton>
                            }
                            <IconButton onClick={() => copyRow()} ><ContentCopyIcon sx={{ fontSize: 15 }} /></IconButton>
                            <IconButton onClick={() => setShowChat(!showChat)} >
                                {
                                    showChat ?
                                        <SpeakerNotesOffIcon sx={{ fontSize: 15 }} /> :
                                        <ChatBubbleIcon sx={{ fontSize: 15 }} />
                                }
                            </IconButton>
                            <Box sx={{ width: '1px', height: 15, bgcolor: 'gray', mx: 2 }} />
                            <IconButton onClick={handleClose}><CloseIcon sx={{ fontSize: 15 }} /></IconButton>
                        </Stack>
                    </Stack>
                </DialogTitle>
                <DialogContent sx={{ p: 0 }}>
                    <Grid container sx={{ height: '100%' }}>
                        <Grid item md={showChat ? 8 : 12} sx={{ height: '100%', overflow: 'auto', borderRight: '1px solid #bdbdbd', p: 6, pt: 4 }}>
                            <Grid container spacing={2} sx={{ maxWidth: '640px', m: 'auto' }}>
                                {
                                    body[y]?.row.map((data, i) => (
                                        <React.Fragment key={i}>
                                            {
                                                header[i].allowed ?
                                                    <>
                                                        <Grid item md={3} sm={12} sx={{ order: header[i].order * 2 }}>
                                                            <Stack direction='row' alignItems='center' sx={{ opacity: .75 }}>
                                                                <Icons type={header[i].type} editable={header[i].editable} />
                                                                <Typography sx={{ opacity: .75, ml: .5, fontSize: 13, color: header[i].editable ? '#16cd92' : '#333333' }}>{header[i].name}</Typography>
                                                            </Stack>
                                                        </Grid>
                                                        <Grid item md={9} sm={12} sx={{ order: header[i].order * 2 + 1 }}>
                                                            {
                                                                (() => {
                                                                    switch (header[i].type) {
                                                                        case 'text':
                                                                        case 'email':
                                                                            return (
                                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }} >
                                                                                    <SimpleString group={group} data={data} status={open} position={[y, i]} onModal={true} isDel={isDel} />
                                                                                </Box>
                                                                            );
                                                                        case 'checkBox':
                                                                            return (
                                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }} >
                                                                                    <CheckBoxCell group={group} data={data} status={open} position={[y, i]} onModal={true} isDel={isDel} />
                                                                                </Box>
                                                                            );
                                                                        case 'link':
                                                                            return (
                                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }} >
                                                                                    <LinkField group={group} data={data} status={open} position={[y, i]} onModal={true} isDel={isDel} />
                                                                                </Box>
                                                                            );
                                                                        case 'longText':
                                                                            return (
                                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }} >
                                                                                    <LongText group={group} data={data} status={open} position={[y, i]} onModal={true} isDel={isDel} />
                                                                                </Box>
                                                                            );
                                                                        case 'select':
                                                                            return (
                                                                                <ModalSelect group={group} data={data} status={false} height={38} position={[y, i]} />
                                                                            );
                                                                        case 'multiSelect':
                                                                            return (
                                                                                <MultiModalSelect group={group} data={data} status={false} height={38} position={[y, i]} />
                                                                            );
                                                                        case 'date':
                                                                            return (
                                                                                <Box sx={{ display: 'flex', px: 1, justifyContent: 'space-between', alignItems: 'center', borderRadius: 1, border: '1px solid #0000003b', cursor: 'pointer', width: '100%', height: 38, '&:hover': { borderColor: '#000' }, '&:focus': { borderColor: '#1976d2', borderWidth: 2 } }} >
                                                                                    <DateCell group={group} data={data} position={[y, i]} />
                                                                                </Box>
                                                                            );
                                                                        case 'createdAt':
                                                                            return (
                                                                                <Box sx={{ display: 'flex', px: 1, justifyContent: 'space-between', alignItems: 'center', borderRadius: 1, border: '1px solid #0000003b', cursor: 'pointer', width: '100%', height: 38, '&:hover': { borderColor: '#000' }, '&:focus': { borderColor: '#1976d2', borderWidth: 2 } }} >
                                                                                    <LogDate data={{ data: body[y].createdAt }} onModal={true} />
                                                                                </Box>
                                                                            );
                                                                        case 'updatedAt':
                                                                            return (
                                                                                <Box sx={{ display: 'flex', px: 1, justifyContent: 'space-between', alignItems: 'center', borderRadius: 1, border: '1px solid #0000003b', cursor: 'pointer', width: '100%', height: 38, '&:hover': { borderColor: '#000' }, '&:focus': { borderColor: '#1976d2', borderWidth: 2 } }} >
                                                                                    <LogDate data={{ data: (body[y].updater ? body[y].updatedAt : null) }} onModal={true} />
                                                                                </Box>
                                                                            );
                                                                        case 'createdBy':
                                                                            return (
                                                                                <Box sx={{ display: 'flex', px: 1, justifyContent: 'space-between', alignItems: 'center', borderRadius: 1, border: '1px solid #0000003b', cursor: 'pointer', width: '100%', height: 38, '&:hover': { borderColor: '#000' }, '&:focus': { borderColor: '#1976d2', borderWidth: 2 } }} >
                                                                                    <LogUser data={{ data: body[y].creator }} onModal={true} />
                                                                                </Box>
                                                                            );
                                                                        case 'updatedBy':
                                                                            return (
                                                                                <Box sx={{ display: 'flex', px: 1, justifyContent: 'space-between', alignItems: 'center', borderRadius: 1, border: '1px solid #0000003b', cursor: 'pointer', width: '100%', height: 38, '&:hover': { borderColor: '#000' }, '&:focus': { borderColor: '#1976d2', borderWidth: 2 } }} >
                                                                                    <LogUser data={{ data: body[y].updater }} onModal={true} />
                                                                                </Box>
                                                                            );
                                                                        case 'attached':
                                                                            if (!data.data) data.data = []
                                                                            return (
                                                                                <>
                                                                                    <Box sx={{ width: '100%', mb: 2 }} >
                                                                                        <Button
                                                                                            disabled={(group !== 'active') || (!header[i].editable)}
                                                                                            variant='outlined'
                                                                                            sx={{ color: '#333333', fontSize: 11, textTransform: 'capitalize', py: .5, px: 1 }}
                                                                                            startIcon={<AttachFileIcon sx={{ fontSize: '15px !important' }} />}
                                                                                            onClick={() => openUpload(i)}
                                                                                        >Attach file</Button>
                                                                                    </Box>
                                                                                    <Grid container spacing={2}>
                                                                                        {
                                                                                            data.data.map((src, j) => (
                                                                                                <Grid item md={6} key={j} >
                                                                                                    <Box sx={{ height: 250, cursor: 'pointer', bgcolor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #00000052', overflow: 'hidden', borderRadius: 2, mb: 2 }}>
                                                                                                        <Box
                                                                                                            alt='img'
                                                                                                            component='img'
                                                                                                            src={src.mimetype.startsWith('image') ? `${uploadUrl}${src.filename}` : getImg(src)}
                                                                                                            sx={{ height: src.mimetype.startsWith('image') ? 'auto' : 100, maxWidth: '100%', maxHeight: '100%' }}
                                                                                                            onClick={() => openFullImg(y, i, j)}
                                                                                                        />
                                                                                                    </Box>
                                                                                                    <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ position: 'relative' }}>
                                                                                                        <Typography sx={{ fontSize: 13, width: 'calc(100% - 60px)', textOverflow: 'ellipsis', overflow: 'hidden' }}>{src.originalname} </Typography>
                                                                                                        <Stack direction='row' sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: '#fff' }}>
                                                                                                            <IconButton sx={{ p: 0, mr: 1 }} onClick={() => handleDownload(src)} >
                                                                                                                <ArrowCircleDownIcon />
                                                                                                            </IconButton>
                                                                                                            <IconButton sx={{ p: 0 }} onClick={() => removeFile(src, i, j)}>
                                                                                                                <DeleteIcon />
                                                                                                            </IconButton>
                                                                                                        </Stack>
                                                                                                    </Stack>
                                                                                                </Grid>
                                                                                            ))
                                                                                        }
                                                                                    </Grid>
                                                                                </>
                                                                            )
                                                                        default:
                                                                            return (<TextField size="small" sx={{ width: '100%', }} multiline />);
                                                                    }
                                                                })()
                                                            }
                                                        </Grid>
                                                    </> : null
                                            }
                                        </React.Fragment>
                                    ))
                                }
                            </Grid>
                        </Grid>
                        <Grid item md={4} sx={{ height: '100%', display: showChat ? 'block' : 'none' }}>
                            <Stack sx={{ height: '100%', pb: 2 }} justifyContent='space-between'>
                                <Stack sx={{ p: 2, borderBottom: '1px solid #bdbdbd', }} justifyContent='flex-start' alignItems='flex-start'>
                                    <Stack>
                                        <Button
                                            size='small'
                                            endIcon={<ArrowDropDownIcon sx={{ fontSize: 16 }} />}
                                            onClick={handleCommentType}
                                            sx={{
                                                px: 1,
                                                fontSize: 13,
                                                color: '#4d4d4d',
                                                textTransform: 'capitalize',
                                                '&:hover': { bgcolor: '#0000000d' }
                                            }}>
                                            {typeLabel[activeType].label}
                                        </Button>
                                        {
                                            isAdmin ?
                                                <Menu
                                                    anchorEl={anchorEl}
                                                    open={drop}
                                                    onClose={() => handleCommentType(null)}
                                                    MenuListProps={{
                                                        'aria-labelledby': 'basic-button',
                                                    }}
                                                >
                                                    {
                                                        typeLabel.map((item, idx) => {
                                                            if (idx === activeType) {
                                                                return (
                                                                    <MenuItem onClick={() => switchCommentType(idx)} key={idx}>
                                                                        <ListItemIcon>
                                                                            <Check sx={{ fontSize: 15 }} />
                                                                        </ListItemIcon>
                                                                        {item.label}
                                                                    </MenuItem>
                                                                )
                                                            } else {
                                                                return (
                                                                    <MenuItem onClick={() => switchCommentType(idx)} key={idx}>
                                                                        <ListItemText inset>{item.label}</ListItemText>
                                                                    </MenuItem>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </Menu>
                                                : null
                                        }
                                    </Stack>
                                    <Stack direction='row'>
                                        {
                                            follower.length ?
                                                <Stack direction='row' alignItems='center'>
                                                    <AvatarGroup max={20} sx={{ '& .MuiAvatarGroup-avatar': { borderWidth: '0px !important', color: '#fff', width: 20, height: 20, fontSize: 9, textTransform: 'uppercase' } }}>
                                                        {
                                                            follower.map((one, i) => (
                                                                <Avatar key={i} sx={{ borderWidth: '0px !important', color: '#fff', width: 20, height: 20, fontSize: 9, bgcolor: one.color ? one.color : '#bdbdbd', textTransform: 'uppercase' }} alt={one.firstName} src="/static/images/avatar/1.jpg" />
                                                            ))
                                                        }
                                                    </AvatarGroup>
                                                    <Typography sx={{ ml: .5, fontSize: 11, opacity: .75 }}>{`${follower.length > 1 ? 'are' : 'is'} following this.`}</Typography>
                                                </Stack> : null
                                        }
                                    </Stack>
                                </Stack>
                                <Box className='commentBoxWrap' sx={{ px: 2, height: '100%', overflow: 'auto' }}>
                                    <Box className='commentBox'>
                                        {
                                            data.filter((e) => {
                                                if (!typeLabel[activeType].type) {
                                                    return true;
                                                } else if (e.type === typeLabel[activeType].type) {
                                                    return true;
                                                } else {
                                                    return false;
                                                }
                                            }).map((item, idx) => {
                                                if (item.type === 'activity' || item.type === 'workflow') {
                                                    return (
                                                        <Box sx={{ py: 1 }} key={idx}>
                                                            <Stack direction='row'>
                                                                {
                                                                    (() => {
                                                                        let writer = users.filter((e) => e._id === item.creator._id)[0];
                                                                        return (
                                                                            <Avatar sx={{ bgcolor: writer.color ? writer.color : '#999', textTransform: 'uppercase', color: 'white', mr: 1, width: 24, height: 24, fontSize: 12 }} alt="Trevor Henderson" src="/static/images/avatar/5.jpg">{item.creator.firstName[0]}</Avatar>
                                                                        )
                                                                    })()
                                                                }
                                                                <Box sx={{ width: '100%' }}>
                                                                    <Stack sx={{ fontSize: 12, mb: .1 }} direction='row' alignItems='center' justifyContent='space-between'>
                                                                        <Typography sx={{ fontSize: 12 }}>{item.creator.email === user.email ? 'You' : `${item.creator.firstName} ${item.creator.lastName}`}</Typography>
                                                                        <ReactTimeAgo date={new Date(item.updatedAt)} locale="en-US" />
                                                                    </Stack>
                                                                    <Stack sx={{ bgcolor: '#f2f2f2', width: '100%', borderRadius: 1, fontSize: 13, py: 1, px: 1 }} >
                                                                        <Typography sx={item.type === 'workflow' ? { fontSize: 12, fontWeight: 600 } : { fontSize: 9 }}>
                                                                            {(() => {
                                                                                if (item.type === 'workflow') {
                                                                                    let durationDate = ''
                                                                                    let flowData = data.filter((e) => (e.type === 'workflow')).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).filter((e) => new Date(e.createdAt) < new Date(item.createdAt))
                                                                                    let before = flowData.pop();
                                                                                    if (before) {
                                                                                        let endDate = new Date(before.createdAt);
                                                                                        let startDate = new Date(item.createdAt);
                                                                                        let diff = startDate.getTime() - endDate.getTime();
                                                                                        const day = (Math.floor(diff / (1000 * 3600 * 24)));
                                                                                        const mod = diff % (1000 * 3600 * 24);
                                                                                        const hour = (Math.floor(mod / (1000 * 3600)));
                                                                                        const mod1 = mod % (1000 * 3600);
                                                                                        const minute = (Math.floor(mod1 / (1000 * 60)));
                                                                                        const mod2 = mod1 % (1000 * 60);
                                                                                        const second = (Math.floor(mod2 / 1000));

                                                                                        if (day) {
                                                                                            durationDate += day;
                                                                                            day > 1 ? durationDate += ' days ' : durationDate += ' day ';
                                                                                        }
                                                                                        if (hour) {
                                                                                            durationDate += hour;
                                                                                            hour > 1 ? durationDate += ' hours ' : durationDate += ' hour ';
                                                                                        }
                                                                                        if (minute) {
                                                                                            durationDate += minute;
                                                                                            minute > 1 ? durationDate += ' minutes ' : durationDate += ' minute ';
                                                                                        }
                                                                                        if (second && !durationDate) {
                                                                                            durationDate += second;
                                                                                            second > 1 ? durationDate += ' seconds ' : durationDate += ' second ';
                                                                                        }
                                                                                    }
                                                                                    if (durationDate) {
                                                                                        return item.cellName + ' - ' + durationDate
                                                                                    } else {
                                                                                        return item.cellName
                                                                                    }
                                                                                } else {
                                                                                    return item.cellName
                                                                                }
                                                                            })()}
                                                                        </Typography>
                                                                        <Box sx={{ display: 'flex', mt: .5 }}>
                                                                            {
                                                                                (() => {
                                                                                    if (item.dataType === 'string') {
                                                                                        return (
                                                                                            <>
                                                                                                <Typography component='span' sx={{ fontSize: 13, bgcolor: '#ffdce5', textDecoration: item.type === 'workflow' ? '' : 'line-through', mr: .2 }}>
                                                                                                    {item.old}
                                                                                                </Typography>
                                                                                                <Typography component='span' sx={{ fontSize: 13, bgcolor: '#d1f7c4' }}>
                                                                                                    {item.new}
                                                                                                </Typography>
                                                                                            </>
                                                                                        )
                                                                                    } else if (item.dataType === 'date') {
                                                                                        return (
                                                                                            <>
                                                                                                <Typography component='span' sx={{ fontSize: 13, bgcolor: '#ffdce5', textDecoration: 'line-through', mr: .2 }}>
                                                                                                    {item.old ? moment(item.old).format('MMMM D, yyyy') : ''}
                                                                                                </Typography>
                                                                                                <Typography component='span' sx={{ fontSize: 13, bgcolor: '#d1f7c4' }}>
                                                                                                    {item.new ? moment(item.new).format('MMMM D, yyyy') : ''}
                                                                                                </Typography>
                                                                                            </>
                                                                                        )
                                                                                    } else if (item.dataType === 'checkBox') {
                                                                                        return (
                                                                                            <>
                                                                                                <Typography component='span' sx={{ display: 'flex', alignItems: 'center', fontSize: 13, bgcolor: item.new === 'true' ? '#d1f7c4' : '#ffdce5', textDecoration: 'line-through', mr: .2 }}>
                                                                                                    <CheckIcon sx={{ color: 'rgb(32, 201, 51)' }} />
                                                                                                </Typography>
                                                                                            </>
                                                                                        )
                                                                                    } else if (item.dataType === 'select') {
                                                                                        return (
                                                                                            <>
                                                                                                <Box sx={{ border: '1px solid #93e088', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 5, mr: .2 }}>
                                                                                                    <Typography component='span' sx={{ fontSize: 13, border: '1px solid #fff', borderRadius: 5, px: 1, color: '#fff', bgcolor: item.color }}>
                                                                                                        {item.new}
                                                                                                    </Typography>
                                                                                                </Box>
                                                                                                {
                                                                                                    item.old ?
                                                                                                        <Box sx={{ border: '1px solid #ff9eb7', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                                                                                                            <Typography component='span' sx={{ fontSize: 13, border: '1px solid #fff', borderRadius: 5, px: 1, color: '#fff', bgcolor: item.oldColor, textDecoration: 'line-through', }}>
                                                                                                                {item.old}
                                                                                                            </Typography>
                                                                                                        </Box> : null
                                                                                                }
                                                                                            </>
                                                                                        )
                                                                                    } else if (item.dataType === 'multiSelect') {
                                                                                        return (
                                                                                            <>
                                                                                                {
                                                                                                    item.history.map((one, i) => {
                                                                                                        if (one.status === 'add') {
                                                                                                            return (<Box key={i} sx={{ border: '1px solid #93e088', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 5, mr: .2 }}>
                                                                                                                <Typography component='span' sx={{ fontSize: 13, border: '1px solid #fff', borderRadius: 5, px: 1, color: '#fff', bgcolor: one.color }}>
                                                                                                                    {one.label}
                                                                                                                </Typography>
                                                                                                            </Box>)
                                                                                                        } else if (one.status === 'remove') {
                                                                                                            return (
                                                                                                                <Box key={i} sx={{ border: '1px solid #ff9eb7', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                                                                                                                    <Typography component='span' sx={{ fontSize: 13, border: '1px solid #fff', borderRadius: 5, px: 1, color: '#fff', bgcolor: one.color, textDecoration: 'line-through', }}>
                                                                                                                        {one.label}
                                                                                                                    </Typography>
                                                                                                                </Box>
                                                                                                            )
                                                                                                        } else {
                                                                                                            return (
                                                                                                                <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                                                                                                                    <Typography component='span' sx={{ fontSize: 13, border: '1px solid #fff', borderRadius: 5, px: 1, color: '#fff', bgcolor: one.color, }}>
                                                                                                                        {one.label}
                                                                                                                    </Typography>
                                                                                                                </Box>

                                                                                                            )
                                                                                                        }
                                                                                                    })
                                                                                                }
                                                                                            </>
                                                                                        )
                                                                                    } else if (item.dataType === 'attached') {
                                                                                        return (
                                                                                            <Stack direction='row' spacing={.5}>
                                                                                                {
                                                                                                    item.history.data.map((src, jdx) => (
                                                                                                        <Box key={jdx} sx={{ overflow: 'hidden', width: 48, height: 48, border: item.history.status === 'add' ? '2px solid #93e088' : '2px solid #ff9eb7', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: .5 }}>
                                                                                                            <Box component='img' src={src.mimetype.startsWith('image') ? `${uploadUrl}${src.filename}` : getImg(src)} sx={{ width: 48, height: 48, maxHeight: 48 }} />
                                                                                                        </Box>
                                                                                                    ))
                                                                                                }
                                                                                            </Stack>
                                                                                        )
                                                                                    } else {
                                                                                        return (
                                                                                            <>
                                                                                                <Typography component='span' sx={{ fontSize: 13, bgcolor: '#ffdce5', textDecoration: 'line-through', mr: .2 }}>
                                                                                                    {item.old}
                                                                                                </Typography>
                                                                                                <Typography component='span' sx={{ fontSize: 13, bgcolor: '#d1f7c4' }}>
                                                                                                    {item.new}
                                                                                                </Typography>
                                                                                            </>
                                                                                        )
                                                                                    }
                                                                                })()
                                                                            }
                                                                        </Box>
                                                                    </Stack>
                                                                </Box>
                                                            </Stack>
                                                        </Box>
                                                    )
                                                } else {
                                                    let flag = -1;
                                                    if (item.whiteList && item.whiteList.length) {
                                                        flag = item.whiteList.findIndex(e => e === user._id);
                                                        if (flag === -1) return null;
                                                    }
                                                    return (
                                                        <Box sx={{ py: 1 }} key={idx}>
                                                            <Stack direction='row'>
                                                                {
                                                                    (() => {
                                                                        let writer = users.filter((e) => e._id === item.creator._id)[0];
                                                                        return (
                                                                            <Avatar sx={{ bgcolor: writer.color ? writer.color : '#999', textTransform: 'uppercase', color: 'white', mr: 1, width: 24, height: 24, fontSize: 12 }} alt="Trevor Henderson" src="/static/images/avatar/5.jpg">{item.creator.firstName[0]}</Avatar>
                                                                        )
                                                                    })()
                                                                }
                                                                <Box sx={{ width: '100%' }} >
                                                                    <Stack sx={{ fontSize: 12, mb: .1 }} direction='row' alignItems='center' justifyContent='space-between'>
                                                                        <Typography sx={{ fontSize: 12 }}>{item.creator.email === user.email ? 'You' : `${item.creator.firstName} ${item.creator.lastName}`}</Typography>
                                                                        <ReactTimeAgo date={new Date(item.updatedAt)} locale="en-US" />
                                                                    </Stack>
                                                                    <Box>
                                                                        <Box sx={{ display: 'inline-block', position: 'relative', bgcolor: '#2d7ff9', borderRadius: 2, color: "#fff", fontSize: 13, py: .5, px: 1, pr: 5 }} >
                                                                            {item.new}
                                                                            {
                                                                                flag !== -1 &&
                                                                                <Tooltip title={`${item.creator.firstName} ${item.creator.lastName}`}>
                                                                                    <Diversity3Icon sx={{ position: 'absolute', right: 4, bottom: 2, fontSize: 16 }} />
                                                                                </Tooltip>
                                                                            }
                                                                        </Box>
                                                                    </Box>
                                                                </Box>
                                                            </Stack>
                                                        </Box>
                                                    )
                                                }
                                            })
                                        }
                                    </Box>
                                </Box>
                                <Box>
                                    <Stack sx={{ px: 1, flexWrap: "wrap" }} direction="row" >
                                        {
                                            whiteList.map((user, i) => (
                                                <Stack key={i} direction="row" sx={{ display: "inline-flex", mb: 1, mr: 1 }} onClick={() => rmeoveItem(i)} >
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, border: '1px solid #eee', borderRadius: 50, color: '#fff', bgcolor: user && user.color ? user.color : '#999', zIndex: 2, }}>{user?.firstName[0]}</Box>
                                                    <Typography component='span' sx={{ bgcolor: '#eee', cursor: 'pointer', overflow: 'hidden', maxWidth: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13, color: '#111111', pr: 1, pl: 2.5, lineHeight: 1.4, borderRadius: 4, ml: -2 }}>
                                                        {user.firstName} {user.lastName}
                                                    </Typography>
                                                </Stack>
                                            ))
                                        }
                                    </Stack>
                                    <Stack direction='row' alignItems='center' sx={{ p: 2, pb: 0, borderTop: '1px solid #bdbdbd' }}>
                                        <Avatar sx={{ bgcolor: (theme) => theme.palette.background.default, color: '#fff', width: 24, height: 24, textTransform: 'uppercase' }} alt="Trevor Henderson" src="/static/images/avatar/5.jpg" >{user.firstName[0]}</Avatar>
                                        <TextField id='message-handle' sx={{ ml: 1, width: '100%', '& input': { px: 1, py: 1 } }} onKeyDown={handleKeyDown} value={commant} onChange={(e) => inputMessage(e)} />
                                    </Stack>
                                    <Popover
                                        anchorEl={anchor}
                                        open={openWl}
                                        onClose={closePop}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: "left",
                                        }}
                                        transformOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                        sx={{ '& .MuiPopover-paper': { boxShadow: '0 0 0 2px #00000040', maxHeight: "80vh" } }}
                                    >
                                        <Box sx={{ py: 1, px: 1, width: 200 }}>
                                            <Stack spacing={1}>
                                                <TextField sx={{ ml: 1, '& input': { px: 1, py: 1, fontSize: 12 } }} onKeyDown={searchKeyDown} value={uSearch} onChange={(e) => setUSearch(e.target.value)} autoFocus />
                                                {
                                                    users.filter((e) => {
                                                        let str = e.firstName + " " + e.lastName;
                                                        return str.search(uSearch) !== -1;
                                                    }).map((user, i) => (
                                                        <Button sx={{ justifyContent: 'flex-start' }} key={i} onClick={() => selectPartner(user)}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, border: '1px solid #eee', borderRadius: 50, color: '#fff', bgcolor: user && user.color ? user.color : '#999', zIndex: 2, }}>{user?.firstName[0]}</Box>
                                                            <Typography component='span' sx={{ bgcolor: '#eee', userSelect: 'none', overflow: 'hidden', maxWidth: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13, color: '#111111', cursor: 'default', pr: 1, pl: 2.5, lineHeight: 1.4, borderRadius: 4, ml: -2 }}>
                                                                {user.firstName} {user.lastName}
                                                            </Typography>
                                                        </Button >
                                                    ))
                                                }
                                            </Stack>
                                        </Box >
                                    </Popover >
                                </Box>
                            </Stack>
                        </Grid>
                    </Grid>
                </DialogContent >
            </Dialog >
            <ImageModal open={fullImg} close={handleImgModal} data={imgData} index={imgIndex} />
            <UploadModal open={uploadOpen} close={uploadClose} position={[y, idx]} />
        </>
    )
}

export default EditModal;