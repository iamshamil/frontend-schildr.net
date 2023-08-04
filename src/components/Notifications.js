import { useState, useMemo } from 'react';

import moment from 'moment';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

import { updateNotification } from '../utilis/request';
import useTableContext from '../hooks/useTable';
import useConfig from '../hooks/useConfig';

const Notifications = () => {
    const { user } = useConfig();
    const { notifications, setNotifications, body } = useTableContext();


    const [anchorNotifi, setAnchorNotifi] = useState(null);
    const [readState, setReadState] = useState('unread');
    const openNotifi = Boolean(anchorNotifi);

    const showNotifi = (e) => {
        setAnchorNotifi(e.currentTarget)
    }

    const hideNotifi = () => {
        setAnchorNotifi(null)
    }

    const updateRead = (e) => {
        let idx = notifications.findIndex((o) => o._id === e._id);
        let t = { data: notifications };
        let id = t.data[idx]._id;
        if (readState === 'unread') {
            t.data[idx].sign[user._id] = true;
        } else {
            t.data[idx].sign[user._id] = false;
        }
        updateNotification({ id, user: user._id, type: readState === 'unread' ? 'read' : 'unread' });
        setNotifications([...t.data]);
    }

    const getFileNames = (data) => {
        let str = '';
        for (let item of data) {
            str += item.originalname + ', ';
        }
        return str.slice(0, -2);
    }

    const getSelectItem = (data) => {
        let str = '';
        for (let item of data) {
            str += item.label + ', ';
        }
        return str.slice(0, -2);
    }

    const allRead = () => {
        let readItems = notifications.map((one) => {
            one.sign[user._id] = true;
            return one;
        });
        setNotifications(readItems);
        let ids = showNotifiData.map((e) => e._id);
        updateNotification({ id: ids, user: user._id, type: 'all' });
    }

    const showNotifiData = useMemo(() => {
        if (readState === 'unread') {
            return notifications.filter((e) => !e.sign[user._id]).sort((a, b) => (new Date(b.createdAt) - new Date(a.createdAt)));
        } else {
            return notifications.filter((e) => e.sign[user._id]).sort((a, b) => (new Date(b.createdAt) - new Date(a.createdAt)));
        }
    }, [notifications, readState, user._id]);

    return (
        <>
            <IconButton onClick={showNotifi}>
                <Badge badgeContent={notifications.filter((e) => !e.sign[user._id]).length} max={99} sx={{ '& .MuiBadge-badge': { bgcolor: '#2e2f32', color: '#fff', fontSize: 9, width: 16, height: 16, minWidth: 12 } }}>
                    <CircleNotificationsIcon sx={{ color: '#fff', height: 30, width: 30 }} />
                </Badge>
            </IconButton>
            <Popover
                anchorEl={anchorNotifi}
                open={openNotifi}
                onClose={hideNotifi}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: '45px',
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
            >
                <Box sx={{ py: 1, width: 360 }}>
                    <Stack sx={{ pb: 1, px: 3 }}>
                        <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ py: 2, width: '100%' }}>
                            <Typography>Notifications</Typography>
                            <Stack direction='row' alignItems='center' spacing={.5}>
                                <Button onClick={() => setReadState('unread')} variant='contained' sx={{ textTransform: 'capitalize', color: '#4d4d4d', fontSize: 13, bgcolor: readState === 'unread' ? '#0000000d' : '#ffffff', py: .5, '&:hover': { bgcolor: '#0000000d' } }}>Unread</Button>
                                <Button onClick={() => setReadState('read')} variant='contained' sx={{ textTransform: 'capitalize', color: '#4d4d4d', fontSize: 13, bgcolor: readState === 'read' ? '#0000000d' : '#ffffff', py: .5, '&:hover': { bgcolor: '#0000000d' } }}>Read</Button>
                            </Stack>
                        </Stack>
                        <Divider />
                        {
                            readState === 'unread' ?
                                <Stack direction='row' sx={{ justifyContent: 'flex-end', my: 1 }}>
                                    <Button disabled={!showNotifiData.length} onClick={() => allRead()} variant='contained' startIcon={<CheckCircleOutlineIcon sx={{ fontSize: '16px !important' }} />} sx={{ textTransform: 'capitalize', color: '#4d4d4d', fontSize: 13, bgcolor: '#ffffff', py: .5, '&:hover': { bgcolor: '#0000000d' } }}>Mark all as read</Button>
                                </Stack> : null
                        }
                    </Stack>
                    <Stack sx={{ maxHeight: '70vh', overflow: 'auto' }}>
                        {
                            showNotifiData.length ? showNotifiData.map((item, idx) => (
                                <MenuItem key={idx} sx={{ display: 'flex', alignItems: 'flex-start', py: 1, mb: .5, cursor: 'pointer' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                                        {
                                            readState === 'unread' ?
                                                <Box sx={{ width: 4, height: 4, bgcolor: '#2d7ff9', borderRadius: 5, mr: 1 }} />
                                                : null
                                        }
                                        <Avatar sx={{ borderWidth: '0px !important', color: '#fff', width: 18, height: 18, fontSize: 9 }} alt={item.creator.firstName} src="/static/images/avatar/1.jpg" >{item.creator.firstName[0]}</Avatar>
                                    </Box>
                                    <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ width: '100%' }}>
                                        {
                                            (() => {
                                                let index = body.findIndex(e => e._id === item.rowId);
                                                if (item.dataType === 'string' || item.dataType === 'select') {
                                                    return (
                                                        <Box>
                                                            <Typography sx={{ fontSize: 13, whiteSpace: 'break-spaces' }}><b>{item.creator.firstName} {item.creator.lastName}</b>{` changed ${item.cellName} to '${item.new}'`}</Typography>
                                                            <Typography sx={{ fontSize: 10, opacity: .75 }}> {moment(item.updatedAt).format('MMMM D, h:mm A')}</Typography>
                                                        </Box>
                                                    )
                                                } else if (item.dataType === 'date') {
                                                    return (
                                                        <Box>
                                                            <Typography sx={{ fontSize: 13, whiteSpace: 'break-spaces' }}><b>{item.creator.firstName} {item.creator.lastName}</b>{` changed ${item.cellName} to '${item.new ? moment(item.new).format('MMMM D, yyyy') : ''}'`}</Typography>
                                                            <Typography sx={{ fontSize: 10, opacity: .75 }}> {moment(item.updatedAt).format('MMMM D, h:mm A')}</Typography>
                                                        </Box>
                                                    )
                                                } else if (item.dataType === 'attached') {
                                                    return (
                                                        <Box>
                                                            <Typography sx={{ fontSize: 13, whiteSpace: 'break-spaces' }}><b>{item.creator.firstName} {item.creator.lastName}</b>{` ${item.history.status === 'add' ? "added" : "removed"} data to ${item.cellName} cell of row ${index + 1}: `} <b>{`${getFileNames(item.history.data)}`}</b></Typography>
                                                            <Typography sx={{ fontSize: 10, opacity: .75 }}> {moment(item.updatedAt).format('MMMM D, h:mm A')}</Typography>
                                                        </Box>
                                                    )
                                                } else if (item.dataType === 'multiSelect') {
                                                    return (
                                                        <Box>
                                                            <Typography sx={{ fontSize: 13, whiteSpace: 'break-spaces' }}><b>{item.creator.firstName} {item.creator.lastName}</b>{` changed ${item.cellName} to ${getSelectItem(item.history)}.`}</Typography>
                                                            <Typography sx={{ fontSize: 10, opacity: .75 }}> {moment(item.updatedAt).format('MMMM D, h:mm A')}</Typography>
                                                        </Box>
                                                    )
                                                } else if (item.dataType === 'checkBox') {

                                                    return (
                                                        <Box>
                                                            <Typography sx={{ fontSize: 13, whiteSpace: 'break-spaces' }}><b>{item.creator.firstName} {item.creator.lastName}</b>{` ${item.new === 'true' ? "checked" : "unchecked"} ${item.cellName} cell of row ${index + 1}.`}</Typography>
                                                            <Typography sx={{ fontSize: 10, opacity: .75 }}> {moment(item.updatedAt).format('MMMM D, h:mm A')}</Typography>
                                                        </Box>
                                                    )
                                                }
                                            })()
                                        }
                                        <IconButton onClick={() => updateRead(item)}>
                                            {
                                                readState === 'unread' ?
                                                    <RadioButtonUncheckedIcon sx={{ fontSize: '16px !important' }} /> :
                                                    <CheckCircleOutlineIcon sx={{ fontSize: '16px !important' }} />
                                            }
                                        </IconButton>
                                    </Stack>
                                </MenuItem>
                            )) :
                                <Stack alignItems='center' justifyContent='center' sx={{ mb: 2 }}>
                                    <Box component='img' src={require('../assets/img/notifications_empty_state.png')} alt='emputy' sx={{ width: 94, height: 79 }} />
                                    <Typography sx={{ fontSize: 13, opacity: .5 }}>{`No ${readState} notifications`}</Typography>
                                </Stack>
                        }
                    </Stack>
                </Box>
            </Popover >
        </>
    )
}

export default Notifications;