import { useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemIcon from '@mui/material/ListItemIcon';
import DialogContent from '@mui/material/DialogContent';

import Logout from '@mui/icons-material/Logout';
import GroupIcon from '@mui/icons-material/Group';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

import { changePassword } from '../utilis/request';
import { removeSession } from '../utilis/auth';

import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import Notifications from './Notifications';
import useConfig from '../hooks/useConfig';
import useTableContext from '../hooks/useTable';
import { getColor } from '../utilis/util';
import { avatarUrl } from '../config/constant';

import logo from "../assets/img/logo/dark-logo.png"

const Header = () => {
    const param = useParams();
    const [oModal, setOModal] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [values, setValues] = useState({
        original: '',
        password: '',
        confirm: '',
        check: false,
        error: ''
    });

    const { user } = useConfig();
    const { isAdmin, project } = useTableContext()

    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logout = () => {
        localStorage.clear();
        removeSession();
        setAnchorEl(null);
        window.location.reload()
    }

    const openModal = () => {
        setAnchorEl(null);
        setOModal(true);
    }

    const closeModal = () => {
        setOModal(false)
    }

    const handleValue = (data) => { setValues({ ...values, ...data }) }

    const change = async () => {
        handleValue({ check: true, error: "" })
        if (values.original && values.password && values.confirm && values.password === values.confirm) {
            let data = await changePassword({ email: user.email, original: values.original, password: values.password });
            if (data.status) {
                setOModal(false)
                handleValue({ origin: "", password: "", confirm: "", check: false, error: "" })
            } else {
                handleValue({ error: data.message })
            }
        }
    }

    if (user) {
        return (
            <Box sx={{ width: '100%', position: 'absolute', top: 0, letf: 0, right: 0 }}>
                <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ height: 56, px: 2 }}>
                    <Stack direction='row' alignItems='center'>
                        <Stack direction='row' alignItems='center'>
                            <Link component={RouterLink} to='/' sx={{ display: 'flex' }}>
                                {
                                    param.projectId ?
                                        <Stack direction="row" alignItems="center">
                                            <ArrowCircleLeftIcon sx={{ color: "#fff", mr: 1 }} />
                                            <Typography sx={{ color: getColor(user.color), fontSize: 20 }}>{project.name}</Typography>
                                        </Stack> :
                                        <Box component="img" src={logo} alt="logo" sx={{ height: 30 }} />
                                }
                            </Link>
                        </Stack>
                    </Stack>
                    <Stack direction='row' alignItems='center' sx={{ position: "relative" }}>
                        <Box sx={{ mr: 4 }}>
                            <Notifications />
                        </Box>
                        <Box sx={{ position: "absolute", right: 0, zIndex: 99 }}>
                            <Avatar onClick={handleMenu} src={user.avatar ? `${avatarUrl}${user.avatar}` : ""} sx={{ textTransform: 'uppercase', bgcolor: '#fff', width: 28, height: 28, border: '1px solid white', color: '#000', mixBlendMode: 'lighten', }}>{user.firstName ? user.firstName[0] : 'C'}</Avatar>
                            <Menu
                                anchorEl={anchorEl}
                                id="account-menu"
                                open={open}
                                onClose={handleClose}
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1.5,
                                        '& .MuiAvatar-root': {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                        },
                                        '&:before': {
                                            content: '""',
                                            display: 'block',
                                            position: 'absolute',
                                            top: 0,
                                            right: 14,
                                            width: 10,
                                            height: 10,
                                            bgcolor: 'background.paper',
                                            transform: 'translateY(-50%) rotate(45deg)',
                                            zIndex: 0,
                                        },
                                    },
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <MenuItem sx={{ pl: 2.5, pr: 1.5, fontSize: 13, color: '#2e2f32', justifyContent: 'space-between' }}>
                                    <Typography variant='span'>
                                        {user.firstName ? `${user.firstName} ${user.lastName}` : ''}
                                    </Typography>
                                    {
                                        user.role ?
                                            <Typography sx={{ fontSize: 11, textTransform: 'capitalize', ml: 5, bgcolor: (theme) => theme.palette.background.default, color: '#fff', borderRadius: 5, px: 1 }}>
                                                {user.role}
                                            </Typography> : null
                                    }
                                </MenuItem>
                                {
                                    isAdmin &&
                                    <MenuItem sx={{ px: 2.5, fontSize: 13, color: '#2e2f32' }} onClick={() => setAnchorEl(null)} component={RouterLink} to="/users">
                                        <ListItemIcon>
                                            <GroupIcon sx={{ fontSize: 16 }} />
                                        </ListItemIcon>
                                        User Management
                                    </MenuItem>
                                }
                                {
                                    isAdmin &&
                                    <MenuItem sx={{ px: 2.5, fontSize: 13, color: '#2e2f32' }} onClick={() => setAnchorEl(null)} component={RouterLink} to="/invoices">
                                        <ListItemIcon>
                                            <ReceiptLongIcon sx={{ fontSize: 16 }} />
                                        </ListItemIcon>
                                        Invoices
                                    </MenuItem>
                                }
                                <MenuItem sx={{ px: 2.5, fontSize: 13, color: '#2e2f32' }} onClick={() => setAnchorEl(null)} component={RouterLink} to="/profile">
                                    <ListItemIcon>
                                        <AccountBoxIcon sx={{ fontSize: 16 }} />
                                    </ListItemIcon>
                                    Profile
                                </MenuItem>
                                <MenuItem sx={{ px: 2.5, fontSize: 13, color: '#2e2f32' }} onClick={openModal}>
                                    <ListItemIcon>
                                        <VpnKeyIcon sx={{ fontSize: 16 }} />
                                    </ListItemIcon>
                                    Change Password
                                </MenuItem>
                                <MenuItem sx={{ px: 2.5, fontSize: 13, color: '#2e2f32' }} onClick={logout}>
                                    <ListItemIcon>
                                        <Logout sx={{ fontSize: 16 }} />
                                    </ListItemIcon>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Stack>
                </Stack>

                <Dialog
                    open={oModal}
                    onClose={closeModal}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Change Password
                    </DialogTitle>
                    <DialogContent>
                        <Stack spacing={1}>
                            <TextField required type="password" value={values.original} error={values.check && !values.original} onChange={(e) => handleValue({ original: e.target.value })} placeholder='Original Password' sx={{ width: 500 }} />
                            <TextField required type="password" value={values.password} error={values.check && !values.password} onChange={(e) => handleValue({ password: e.target.value })} placeholder='New Password' />
                            <TextField required type="password" value={values.confirm} error={(values.check && !values.confirm) || (values.check && values.password !== values.confirm)} onChange={(e) => handleValue({ confirm: e.target.value })} placeholder='Confirm Confirm Password' />
                            {
                                values.error ?
                                    <Box sx={{ my: 1, bgcolor: '#ff4c4c', borderRadius: 1, p: 1 }} >
                                        <Typography variant='h7' sx={{ color: '#fff' }}>{values.error}</Typography>
                                    </Box>
                                    : null
                            }
                        </Stack>
                        <Stack direction='row' justifyContent='flex-end' sx={{ pt: 2 }}>
                            <Button variant='contained' color='error' onClick={closeModal} sx={{ mr: 1 }}>Cancel</Button>
                            <Button variant='contained' color='info' onClick={change} autoFocus>
                                Change
                            </Button>
                        </Stack>
                    </DialogContent>
                </Dialog>
            </Box >
        )
    } else {
        return null;
    }
}

export default Header;