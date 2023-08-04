import { useContext, useState } from 'react';

import { MuiColorInput } from 'mui-color-input'
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

import CloseIcon from '@mui/icons-material/Close';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { TableContext } from '../contexts/table';
import { updateUser, setPassword, createUser, deleteUser } from '../utilis/request';
import { ConfigContext } from '../contexts/config';

import { roles } from '../config/constant';
import { getColor } from '../utilis/util';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const UserManagement = () => {
    const { users, setUsers, userListModal, setUserListModal } = useContext(TableContext);
    const { user, setUser } = useContext(ConfigContext);
    const [userModal, setUserModal] = useState(false);
    const [register, setRegister] = useState(false);

    const [select, setSelect] = useState("");
    const [checked, setChecked] = useState(false);
    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        department: '',
        position: '',
        password: '',
        confirm: '',
        passError: '',
        color: '',
        error: '',
        role: "",
        skills: "",
        description: '',
        errorArray: []
    });
    const { firstName, lastName, email, department, position, role, error, password, color, confirm, passError, errorArray, description, skills } = values;

    const handleValues = (data) => {
        setValues({ ...values, ...data })
    }

    const handleRegisterModal = () => {
        handleValues({ firstName: '', lastName: '', email: '', department: '', position: '', role: "", password: '', error: '', color: '', description: '' })
        setRegister(true)
    }

    const cancelCreate = () => {
        handleValues({ firstName: '', lastName: '', email: '', department: '', position: '', role: "", password: '', error: '', color: '', description: '' })
        setRegister(false)
    }

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        handleValues({ role: value });
    };


    const createAccount = async () => {
        handleValues({ errorArray: [] })
        if (!firstName) {
            handleValues({ error: 'Please input first name' })
            return
        } else if (!lastName) {
            handleValues({ error: 'Please input last name' })
            return
        } else if (!email) {
            handleValues({ error: 'Please input email' })
            return
            // } else if (!department) {
            //     handleValues({ error: 'Please input department' })
            //     return
            // } else if (!position) {
            //     handleValues({ error: 'Please input position' })
            //     return
        } else if (!role) {
            handleValues({ error: 'Please input role' })
            return
        } else if (!password) {
            handleValues({ error: 'Please input password' })
            return
        } else {
            handleValues({ error: '' })
        }
        let rdata = await createUser({ id: select, data: { firstName, lastName, email, role, password, color, description } });
        if (rdata.status) {
            setUsers([...users, rdata.data]);
            handleValues({ firstName: '', lastName: '', email: '', department: '', position: '', role: "", password: '', error: '', color: '', description: '' })
            setRegister(false)
        } else {
            if (rdata.message) {
                handleValues({ errorArray: rdata.data })
            }
        }
    }

    const deleteAccount = async (id) => {
        let rdata = await deleteUser(id);
        if (rdata.status) {
            handleValues({ firstName: '', lastName: '', email: '', department: '', position: '', role: "", password: '', error: '', color: '', description: '' })
            closeModal(false);
            const idx = users.findIndex(e => e._id === id);
            if (idx > -1) {
                let temp = users;
                temp.splice(idx, 1);
                setUsers([...temp]);
            }
        } else {
            handleValues({ error: rdata.message })
        }
    }


    const handleClose = () => {
        setUserListModal(false);
    }

    const closeRegister = () => {
        setRegister(false);
    }


    const closeModal = () => {
        setUserModal(false);
    }

    const update = async () => {
        if (!firstName) {
            handleValues({ error: 'Please input first name' })
            return
        } else if (!lastName) {
            handleValues({ error: 'Please input last name' })
            return
        } else if (!email) {
            handleValues({ error: 'Please input email' })
            return
        } else if (!role) {
            handleValues({ error: 'Please input role' })
            return
        } else {
            handleValues({ error: '' })
        }
        let rdata = await updateUser({ id: select, data: { firstName, lastName, email, role, color, description } });
        if (rdata.status) {
            closeModal(false);
            if (email === user.email) {
                setUser({ ...user, firstName, lastName, email, department, position, role, color, description });
            }
            setSelect('');
            let idx = users.findIndex((e) => e._id === select);
            if (idx > -1) {
                let temp = users[idx];
                temp = { ...temp, firstName, lastName, department, position, role, email, color, description };
                let tempUser = users;
                tempUser[idx] = temp;
                setUsers([...tempUser]);
            }
        } else {
            handleValues({ error: rdata.message })
        }
    }

    const updatePassword = async () => {
        if (!password) {
            handleValues({ passError: 'Please input password' })
            return
        } else if (!confirm || password !== confirm) {
            handleValues({ passError: 'Please input correct password in confirm field' });
            return;
        } else {
            handleValues({ passError: '' })
        }
        let rdata = await setPassword({ id: select, password });
        if (rdata.status) {
            setSelect('');
            handleValues({ password: '', confirm: '' })
        } else {
            handleValues({ passError: rdata.message })
        }
    }

    const openModal = (id) => {
        let i = users.findIndex((e) => e._id === id);
        setSelect(users[i]._id);
        setValues({ ...values, firstName: users[i].firstName, lastName: users[i].lastName, email: users[i].email, department: users[i].department, position: users[i].position, role: users[i].role, color: users[i].color, description: users[i].description, skills: users[i].skills })
        setUserModal(true);
    }

    return (
        <>
            <Dialog open={userListModal} maxWidth="lg" sx={{ '& .MuiDialog-paper': { height: "calc(100% - 100px)", border: '2px solid #c4c7cd', borderRadius: 1.5, maxWidth: '964px', width: '100%' } }}>
                <DialogTitle >
                    <Stack direction='row' alignItems='center' justifyContent='space-between'>
                        <Typography variant='h4' sx={{ fontSize: 20, fontWeight: 500 }}>Users Management</Typography>
                        <Stack direction='row' alignItems='center' justifyContent='space-between'>
                            <Button variant='contained' color='info' size='small' onClick={handleRegisterModal} startIcon={<PersonAddIcon sx={{ fontSize: 15 }} />} sx={{ mr: 2, textTransform: 'capitalize' }} >Create Account</Button>
                            <IconButton onClick={handleClose}><CloseIcon sx={{ fontSize: 15 }} /></IconButton>
                        </Stack>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ p: 1, fontSize: 13 }}></TableCell>
                                <TableCell sx={{ p: 1, fontSize: 13 }}>First Name</TableCell>
                                <TableCell sx={{ p: 1, fontSize: 13 }}>Last Name</TableCell>
                                <TableCell sx={{ p: 1, fontSize: 13 }}>Email</TableCell>
                                <TableCell sx={{ p: 1, fontSize: 13 }}>Role</TableCell>
                                <TableCell sx={{ p: 1, fontSize: 13 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((row, i) => (
                                <TableRow
                                    key={i}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell sx={{ p: 1, fontSize: 13 }}>
                                        <Avatar sx={{ bgcolor: row.color ? row.color : '#999', textTransform: 'uppercase', width: 24, height: 24, fontSize: 12, color: getColor(row.color) }}>{row.firstName ? row.firstName[0] : 'C'}</Avatar>
                                    </TableCell>
                                    <TableCell sx={{ p: 1, fontSize: 13 }} component="th" scope="row">
                                        {row.firstName}
                                    </TableCell>
                                    <TableCell sx={{ p: 1, fontSize: 13 }}>{row.lastName}</TableCell>
                                    <TableCell sx={{ p: 1, fontSize: 13 }}>{row.email}</TableCell>
                                    <TableCell sx={{ p: 1, fontSize: 13 }}>{row.role}</TableCell>
                                    <TableCell sx={{ p: 1, fontSize: 13 }}>
                                        <Stack direction='row' spacing={1}>
                                            <IconButton sx={{ width: 26, height: 26, }} onClick={() => openModal(row._id)}><BorderColorIcon sx={{ fontSize: 16 }} /></IconButton>
                                            <IconButton sx={{ width: 26, height: 26, }} onClick={() => deleteAccount(row._id)}><DeleteIcon sx={{ fontSize: 16 }} /></IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DialogContent>
            </Dialog>
            <Dialog
                open={userModal}
                maxWidth="sm"
                sx={{ '& .MuiDialog-paper': { width: '100%' } }}
            >
                <DialogTitle sx={{ borderBottom: '1px solid #bdbdbd' }}>
                    <Stack direction='row' alignItems='center' justifyContent='space-between'>
                        <Typography>Edit User Information</Typography>
                        <Stack direction='row' alignItems='center'>
                            <Button variant='contained' color='error' size='small' onClick={() => deleteAccount(select)} startIcon={<DeleteIcon sx={{ fontSize: 15 }} />} sx={{ mr: 2, textTransform: 'capitalize' }} >Delete Account</Button>
                            <IconButton onClick={closeModal} ><CloseIcon sx={{ fontSize: 15 }} /></IconButton>
                        </Stack>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ p: 2 }}>
                        <Stack direction='row' alignItems='center' justifyContent='space-between' spacing={2}>
                            <TextField value={firstName} onChange={(e) => handleValues({ firstName: e.target.value })} sx={{ '& input': { fontSize: 15, p: 1.5 }, width: '50%' }} label="First Name" />
                            <TextField value={lastName} onChange={(e) => handleValues({ lastName: e.target.value })} sx={{ '& input': { fontSize: 15, p: 1.5 }, width: '50%' }} label="Last Name" />
                        </Stack>
                        <Stack direction='row' alignItems='center' justifyContent='space-between' spacing={2}>
                            <TextField value={email} onChange={(e) => handleValues({ email: e.target.value })} sx={{ '& input': { fontSize: 15, p: 1.5 }, width: '50%' }} label="Email" />
                            <MuiColorInput value={color ? color : '#fff'} onChange={(e) => handleValues({ color: e })} sx={{ '& input': { p: 1.5 }, width: '50%' }} label="Color" />
                        </Stack>
                        <Stack>
                            <FormControl sx={{ width: '100%' }}>
                                <InputLabel>Role</InputLabel>
                                <Select
                                    value={role}
                                    onChange={handleChange}
                                    input={<OutlinedInput label="Role" sx={{ '& .MuiSelect-select': { width: '100%', p: 1.5 }, width: '100%' }} />}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                                                width: 250,
                                            },
                                        }
                                    }
                                    }
                                >
                                    {roles.map((name) => (
                                        <MenuItem key={name} value={name} >
                                            <ListItemText primary={name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>
                        {
                            skills && role === "Developer" &&
                            <Stack>
                                <TextField label="Skill" value={skills} readonly />
                            </Stack>
                        }
                        <Stack>
                            <TextField value={description} onChange={(e) => handleValues({ description: e.target.value })} sx={{ '& input': { fontSize: 15, p: 1.5 } }} label="Description" multiline rows={4} />
                        </Stack>
                        {
                            error ?
                                <Stack>
                                    <Typography sx={{ color: '#fff', bgcolor: theme => theme.palette.error.main, borderRadius: 1, p: 1 }}>{error}</Typography>
                                </Stack> : null
                        }
                        <Stack>
                            <Button variant='contained' onClick={update}>Update</Button>
                        </Stack>
                        <Divider sx={{ height: 2 }} />
                        <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ pl: 1 }} >
                            <Typography sx={{ fontSize: 13 }}>Password setting</Typography>
                            <IconButton onClick={() => setChecked(!checked)}>
                                {
                                    checked ?
                                        <KeyboardArrowDownIcon /> :
                                        <KeyboardArrowUpIcon />
                                }
                            </IconButton>
                        </Stack>
                        <Collapse in={checked}>
                            <Stack spacing={1.5}>
                                <Stack>
                                    <TextField type='password' value={password} onChange={(e) => handleValues({ password: e.target.value })} sx={{ '& input': { fontSize: 15, p: 1.5 } }} label="New Password" />
                                </Stack>
                                <Stack>
                                    <TextField type='password' value={confirm} onChange={(e) => handleValues({ confirm: e.target.value })} sx={{ '& input': { fontSize: 15, p: 1.5 } }} label="Confirm" />
                                </Stack>
                                {
                                    passError ?
                                        <Stack>
                                            <Typography sx={{ color: '#fff', bgcolor: theme => theme.palette.error.main, borderRadius: 1, p: 1 }}>{passError}</Typography>
                                        </Stack> : null
                                }
                                <Stack>
                                    <Button variant='contained' onClick={updatePassword}>Change Password</Button>
                                </Stack>
                            </Stack>
                        </Collapse>
                    </Stack>
                </DialogContent>
            </Dialog>
            <Dialog
                open={register}
                maxWidth="sm"
                sx={{ '& .MuiDialog-paper': { width: '100%' } }}
            >
                <DialogTitle sx={{ borderBottom: '1px solid #bdbdbd' }}>
                    <Stack direction='row' alignItems='center' justifyContent='space-between'>
                        <Typography>Create Account</Typography>
                        <Stack direction='row' alignItems='center'>
                            <IconButton onClick={closeRegister} ><CloseIcon sx={{ fontSize: 15 }} /></IconButton>
                        </Stack>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={1.5} sx={{ p: 2 }}>
                        <Stack direction='row' alignItems='center' justifyContent='space-between' spacing={2}>
                            <TextField value={firstName} onChange={(e) => handleValues({ firstName: e.target.value })} sx={{ '& input': { fontSize: 15, p: 1.5 }, width: '50%' }} label="First Name" />
                            <TextField value={lastName} onChange={(e) => handleValues({ lastName: e.target.value })} sx={{ '& input': { fontSize: 15, p: 1.5 }, width: '50%' }} label="Last Name" />
                        </Stack>
                        {/* <Stack direction='row' alignItems='center' justifyContent='space-between' spacing={2}>
                            <TextField value={position} onChange={(e) => handleValues({ position: e.target.value })} sx={{ '& input': { fontSize: 15, p: 1.5 }, width: '50%' }} label="Position" />
                            <TextField value={department} onChange={(e) => handleValues({ department: e.target.value })} sx={{ '& input': { fontSize: 15, p: 1.5 }, width: '50%' }} label="Department" />
                        </Stack> */}
                        <Stack direction='row' alignItems='center' justifyContent='space-between' spacing={2}>
                            <TextField value={email} onChange={(e) => handleValues({ email: e.target.value })} sx={{ '& input': { fontSize: 15, p: 1.5 }, width: '50%' }} label="Email" />
                            <MuiColorInput value={color ? color : '#fff'} onChange={(e) => handleValues({ color: e })} sx={{ '& input': { fontSize: 15, p: 1.5 }, width: '50%' }} label="Color" />
                        </Stack>
                        <Stack direction='row' alignItems='center' justifyContent='space-between' spacing={2}>
                            <TextField type='password' value={password} onChange={(e) => handleValues({ password: e.target.value })} sx={{ '& input': { fontSize: 15, p: 1.5 }, width: '50%' }} label="New Password" />
                            <FormControl sx={{ width: '50%' }}>
                                <InputLabel>Role</InputLabel>
                                <Select
                                    value={role}
                                    onChange={handleChange}
                                    input={<OutlinedInput label="Role" sx={{ '& .MuiSelect-select': { width: '100%', p: 1.5, fontSize: 15, }, width: '100%' }} />}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                                                width: 250,
                                            },
                                        }
                                    }
                                    }
                                >
                                    {roles.map((name) => (
                                        <MenuItem
                                            key={name}
                                            value={name}
                                        >
                                            <ListItemText primary={name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>
                        <Stack>
                            <TextField value={description} onChange={(e) => handleValues({ description: e.target.value })} sx={{ '& input': { fontSize: 15, p: 1.5 } }} label="Description" multiline rows={4} />
                        </Stack>
                        {
                            error ?
                                <Stack>
                                    <Typography sx={{ color: '#fff', bgcolor: theme => theme.palette.error.main, borderRadius: 1, p: 1 }}>{error}</Typography>
                                </Stack>
                                : null
                        }
                        {
                            errorArray.length ?
                                <Stack spacing={.5}>
                                    {
                                        errorArray.map((e, i) => (
                                            <Stack key={i}>
                                                <Typography sx={{ color: '#fff', bgcolor: theme => theme.palette.error.main, borderRadius: 1, p: 1 }}>{e.msg}</Typography>
                                            </Stack>
                                        ))
                                    }
                                </Stack>
                                : null
                        }
                        <Stack direction='row' alignItems='center' spacing={1} justifyContent='flex-end'>
                            <Button variant='outlined' color='error' onClick={cancelCreate} sx={{ textTransform: 'capitalize' }}>Cancel</Button>
                            <Button variant='contained' onClick={createAccount} sx={{ textTransform: 'capitalize' }}>Create</Button>
                        </Stack>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default UserManagement;
